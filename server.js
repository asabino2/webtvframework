const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const BLOCKS_FILE = path.join(DATA_DIR, 'region-blocks.json');
const GENERAL_SETTINGS_FILE = path.join(DATA_DIR, 'general-settings.json');
const VIEWER_TTL_MS = 45 * 1000;
const SESSION_PING_MS = 20 * 1000;
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'Webtv framework';
const ADMIN_PASSWORD = String(process.env.PASSWORD || process.env.password || '').trim();
const ADMIN_COOKIE_NAME = 'tvs_admin_auth';
const ADMIN_COOKIE_TTL_MS = 12 * 60 * 60 * 1000;
const NOTICE_SEGMENT_FILE = path.join(__dirname, 'notice-segment.base64');
const NOTICE_SEGMENT_DURATION_SECONDS = 6.021;
const NOTICE_PLAYLIST_TARGET_DURATION = 7;
const ADMIN_COOKIE_VALUE = ADMIN_PASSWORD
  ? crypto.createHash('sha256').update(`tvsabinos:${ADMIN_PASSWORD}`).digest('hex')
  : '';
const GITHUB_REPO_OWNER = process.env.APP_REPO_OWNER || 'asabino2';
const GITHUB_REPO_NAME = process.env.APP_REPO_NAME || 'webtvframework';
const GITHUB_REPO_REF = process.env.APP_REPO_REF || 'main';
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}.git`;
const GITHUB_RAW_PACKAGE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_REPO_REF}/package.json`;
const AUTO_RESTART_ON_UPDATE = process.env.AUTO_RESTART_ON_UPDATE !== 'false';
const execFileAsync = promisify(execFile);
let updatePromise = null;

// ── Configurações da fonte local ────────────────────────────────────────────
const UPSTREAM_BASE = process.env.UPSTREAM_BASE || 'http://192.168.1.186:8409';
const DEFAULT_M3U8_URL = process.env.M3U8_URL || `${UPSTREAM_BASE}/iptv/channel/2.m3u8?mode=segmenter`;
const DEFAULT_EPG_URL = process.env.EPG_URL || `${UPSTREAM_BASE}/iptv/xmltv.xml`;
const DEFAULT_FAVICON_URL = process.env.FAVICON_URL || '';
const STREAM_CHANNEL_ID = process.env.STREAM_CHANNEL_ID || null;

// Cache do EPG para evitar requisições repetidas
let epgXmlCache = null;
let epgXmlCacheTime = 0;
let epgParsedCache = null;
let epgParsedCacheTime = 0;
const EPG_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
let noticeSegmentBuffer = null;
const activeSessions = new Map();
let writeQueue = Promise.resolve();

app.set('trust proxy', true);
app.use(express.json({ limit: '256kb' }));

// ── Utilitários ─────────────────────────────────────────────────────────────

function ensureDataStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(VISITS_FILE)) {
    fs.writeFileSync(VISITS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(BLOCKS_FILE)) {
    fs.writeFileSync(BLOCKS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(GENERAL_SETTINGS_FILE)) {
    fs.writeFileSync(GENERAL_SETTINGS_FILE, '{}', 'utf8');
  }
}

function sanitizeOptionalUrl(value) {
  const str = String(value || '').trim();
  if (!str) return '';

  try {
    const url = new URL(str);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '';
    }
    return url.toString();
  } catch {
    return '';
  }
}

function readGeneralSettings() {
  ensureDataStore();
  try {
    const raw = JSON.parse(fs.readFileSync(GENERAL_SETTINGS_FILE, 'utf8'));
    return {
      streamUrl: sanitizeOptionalUrl(raw?.streamUrl),
      epgUrl: sanitizeOptionalUrl(raw?.epgUrl),
      faviconUrl: sanitizeOptionalUrl(raw?.faviconUrl),
    };
  } catch {
    return {
      streamUrl: '',
      epgUrl: '',
      faviconUrl: '',
    };
  }
}

async function writeGeneralSettings(settings) {
  ensureDataStore();
  const payload = {
    streamUrl: sanitizeOptionalUrl(settings?.streamUrl),
    epgUrl: sanitizeOptionalUrl(settings?.epgUrl),
    faviconUrl: sanitizeOptionalUrl(settings?.faviconUrl),
  };

  await fs.promises.writeFile(GENERAL_SETTINGS_FILE, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

function getGeneralRuntimeConfig() {
  const settings = readGeneralSettings();
  return {
    streamUrl: settings.streamUrl || DEFAULT_M3U8_URL,
    epgUrl: settings.epgUrl || DEFAULT_EPG_URL,
    faviconUrl: settings.faviconUrl || DEFAULT_FAVICON_URL,
  };
}

function readVisits() {
  ensureDataStore();
  try {
    return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function readRegionBlocks() {
  ensureDataStore();
  try {
    const blocks = JSON.parse(fs.readFileSync(BLOCKS_FILE, 'utf8'));
    return Array.isArray(blocks) ? blocks : [];
  } catch {
    return [];
  }
}

async function writeRegionBlocks(blocks) {
  ensureDataStore();
  await fs.promises.writeFile(BLOCKS_FILE, JSON.stringify(blocks, null, 2), 'utf8');
}

function persistVisit(entry) {
  writeQueue = writeQueue.then(async () => {
    const visits = readVisits();
    visits.push(entry);
    await fs.promises.writeFile(VISITS_FILE, JSON.stringify(visits, null, 2), 'utf8');
  }).catch(err => {
    console.error('[ANALYTICS] Erro ao gravar visitas:', err.message);
  });

  return writeQueue;
}

function normalizeIp(ip) {
  if (!ip) return '0.0.0.0';
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return normalizeIp(forwarded.split(',')[0].trim());
  }
  return normalizeIp(req.ip || req.socket?.remoteAddress || '0.0.0.0');
}

function isPrivateIp(ip) {
  return (
    ip === '127.0.0.1' ||
    ip === '0.0.0.0' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function getLocationFromIp(ip) {
  if (isPrivateIp(ip)) {
    return {
      country: 'Rede local',
      region: 'Rede interna',
      city: 'Rede interna',
    };
  }

  const lookup = geoip.lookup(ip);
  return {
    country: lookup?.country || 'Desconhecido',
    region: lookup?.region || 'Desconhecido',
    city: lookup?.city || 'Desconhecido',
  };
}

function getDeviceLabel(parsedUa) {
  if (parsedUa.device?.type) {
    return [parsedUa.device.vendor, parsedUa.device.model, parsedUa.device.type]
      .filter(Boolean)
      .join(' ');
  }

  if (parsedUa.os?.name && /android|ios/i.test(parsedUa.os.name)) {
    return 'Mobile';
  }

  return 'Desktop';
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizeCsvOrArray(value) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : String(value).split(',');
  return items
    .map(item => normalizeText(item))
    .filter(Boolean);
}

function getLocalAppVersion() {
  try {
    const filePath = path.join(__dirname, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return String(pkg.version || '0.0.0');
  } catch {
    return '0.0.0';
  }
}

function parseSemver(version) {
  const normalized = String(version || '').trim();
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareSemver(a, b) {
  const partsA = parseSemver(a);
  const partsB = parseSemver(b);

  for (let index = 0; index < 3; index += 1) {
    if (partsA[index] > partsB[index]) return 1;
    if (partsA[index] < partsB[index]) return -1;
  }

  return 0;
}

async function getRemotePackageInfo() {
  const response = await axios.get(GITHUB_RAW_PACKAGE_URL, { timeout: 10000, responseType: 'json' });
  const pkg = response.data || {};
  return {
    name: String(pkg.name || GITHUB_REPO_NAME),
    version: String(pkg.version || '0.0.0'),
  };
}

async function runAppCommand(command, args) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: __dirname,
      timeout: 120000,
    });

    return {
      stdout: String(stdout || '').trim(),
      stderr: String(stderr || '').trim(),
    };
  } catch (error) {
    const output = String(error?.stderr || error?.stdout || error?.message || '').trim();
    throw new Error(output || `Falha ao executar ${command} ${args.join(' ')}`);
  }
}

async function ensureGitOrigin() {
  const gitFolder = path.join(__dirname, '.git');
  if (!fs.existsSync(gitFolder)) {
    throw new Error('Este ambiente não possui metadados Git para atualização automática.');
  }

  let remoteUrl = '';
  try {
    const remote = await runAppCommand('git', ['remote', 'get-url', 'origin']);
    remoteUrl = remote.stdout;
  } catch {
    remoteUrl = '';
  }

  if (!remoteUrl) {
    await runAppCommand('git', ['remote', 'add', 'origin', GITHUB_REPO_URL]);
    return;
  }

  if (!remoteUrl.includes(`${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`)) {
    await runAppCommand('git', ['remote', 'set-url', 'origin', GITHUB_REPO_URL]);
  }
}

async function getUpdateStatus() {
  const localVersion = getLocalAppVersion();
  const remoteInfo = await getRemotePackageInfo();
  const hasUpdate = compareSemver(remoteInfo.version, localVersion) > 0;

  return {
    currentVersion: localVersion,
    latestVersion: remoteInfo.version,
    packageName: remoteInfo.name,
    hasUpdate,
    branch: GITHUB_REPO_REF,
    repository: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
  };
}

async function updateApplicationFromGitHub() {
  const previousVersion = getLocalAppVersion();

  await ensureGitOrigin();
  await runAppCommand('git', ['fetch', 'origin', GITHUB_REPO_REF]);
  await runAppCommand('git', ['pull', '--ff-only', 'origin', GITHUB_REPO_REF]);
  await runAppCommand('npm', ['ci', '--omit=dev']);

  const currentVersion = getLocalAppVersion();

  return {
    previousVersion,
    currentVersion,
    updated: compareSemver(currentVersion, previousVersion) >= 0,
  };
}

function getCurrentProgrammeForStream(programmes) {
  const now = new Date();
  const current = programmes.filter(p => p.start <= now && p.stop > now);
  if (!current.length) return null;

  if (STREAM_CHANNEL_ID) {
    return current.find(p => p.channelId === STREAM_CHANNEL_ID) || null;
  }

  return current.sort((a, b) => a.start - b.start)[0] || null;
}

function matchesRegion(block, location) {
  const country = normalizeText(location.country);
  const state = normalizeText(location.region);
  const city = normalizeText(location.city);

  if (Array.isArray(block.countries) && block.countries.length && !block.countries.includes(country)) {
    return false;
  }

  if (Array.isArray(block.states) && block.states.length && !block.states.includes(state)) {
    return false;
  }

  if (Array.isArray(block.cities) && block.cities.length && !block.cities.includes(city)) {
    return false;
  }

  return true;
}

function isProgrammeBlocked(programme, block, location) {
  const title = normalizeText(programme?.title);
  const attraction = normalizeText(block?.attraction);
  if (!title || !attraction) return false;
  if (!title.includes(attraction)) return false;

  return matchesRegion(block, location);
}

async function getGeoBlockForRequest(req) {
  const { programmes } = await fetchEpg();
  const current = getCurrentProgrammeForStream(programmes);
  if (!current) return null;

  const location = getLocationFromIp(getClientIp(req));
  const blocks = readRegionBlocks().filter(block => block.active !== false);

  const matchedBlock = blocks.find(block => isProgrammeBlocked(current, block, location));
  if (!matchedBlock) return null;

  const reason = String(matchedBlock.reason || '').trim() || 'não informado';
  const message = `Programa bloqueado para a sua região, motivo: ${reason}`;

  return { message, programme: current, block: matchedBlock, location };
}

function buildVisitEntry(req, sessionId) {
  const parser = new UAParser(req.headers['user-agent'] || '');
  const parsedUa = parser.getResult();
  const ip = getClientIp(req);
  const location = getLocationFromIp(ip);

  return {
    sessionId,
    visitedAt: new Date().toISOString(),
    ip,
    operatingSystem: parsedUa.os?.name || 'Desconhecido',
    device: getDeviceLabel(parsedUa),
    browser: parsedUa.browser?.name || 'Desconhecido',
    country: location.country,
    state: location.region,
    city: location.city,
    page: req.body?.page || '/',
  };
}

function parseCookies(req) {
  const raw = String(req.headers.cookie || '');
  if (!raw) return {};

  return raw.split(';').reduce((acc, pair) => {
    const index = pair.indexOf('=');
    if (index <= 0) return acc;
    const key = pair.slice(0, index).trim();
    const value = decodeURIComponent(pair.slice(index + 1).trim());
    if (key) acc[key] = value;
    return acc;
  }, {});
}

function isAdminAuthenticated(req) {
  if (!ADMIN_PASSWORD) return true;

  const cookies = parseCookies(req);
  const token = String(cookies[ADMIN_COOKIE_NAME] || '');
  if (!token || !ADMIN_COOKIE_VALUE) return false;

  const expected = Buffer.from(ADMIN_COOKIE_VALUE);
  const received = Buffer.from(token);
  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

function requireAdminAuth(req, res, next) {
  if (isAdminAuthenticated(req)) {
    return next();
  }

  return res.status(401).json({ error: 'Acesso não autorizado.' });
}

function requireAdminPage(req, res, next) {
  if (isAdminAuthenticated(req)) {
    return next();
  }

  return res.redirect('/admin');
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastSeenAt > VIEWER_TTL_MS) {
      activeSessions.delete(sessionId);
    }
  }
}

function getCurrentViewerCount() {
  cleanupExpiredSessions();
  return activeSessions.size;
}

function sanitizeM3uMessage(message) {
  return String(message || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/,/g, ' - ')
    .replace(/"/g, "'")
    .trim();
}

function buildNoticePlaylist(message) {
  const now = new Date().toISOString();
  const text = sanitizeM3uMessage(message);

  // Playlist HLS de aviso para clientes IPTV que consomem diretamente o m3u8.
  return [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    '#EXT-X-PLAYLIST-TYPE:VOD',
    '#EXT-X-INDEPENDENT-SEGMENTS',
    `#EXT-X-TARGETDURATION:${NOTICE_PLAYLIST_TARGET_DURATION}`,
    '#EXT-X-MEDIA-SEQUENCE:0',
    `#EXT-X-DATERANGE:ID="notice-${Date.now()}",CLASS="tvsabinos.notice",START-DATE="${now}",DURATION=${NOTICE_SEGMENT_DURATION_SECONDS.toFixed(3)},X-TVSABINOS-MESSAGE="${text}"`,
    `#EXTINF:${NOTICE_SEGMENT_DURATION_SECONDS.toFixed(3)},${text}`,
    '/stream/notice.ts',
    '#EXT-X-ENDLIST',
  ].join('\n');
}

function getNoticeSegmentBuffer() {
  if (noticeSegmentBuffer) {
    return noticeSegmentBuffer;
  }

  try {
    const encoded = fs.readFileSync(NOTICE_SEGMENT_FILE, 'utf8').replace(/\s+/g, '');
    const decoded = Buffer.from(encoded, 'base64');
    if (!decoded.length) {
      throw new Error('Segmento de aviso vazio.');
    }

    noticeSegmentBuffer = decoded;
    return noticeSegmentBuffer;
  } catch (error) {
    console.error('[STREAM] Erro ao carregar segmento de aviso:', error.message);

    // Fallback mínimo para manter a resposta do endpoint, mesmo sem o asset em disco.
    const nullPacket = Buffer.from([0x47, 0x1f, 0xff, 0x10, ...new Array(184).fill(0xff)]);
    noticeSegmentBuffer = Buffer.concat(new Array(32).fill(nullPacket));
    return noticeSegmentBuffer;
  }
}

function sendNoticeAsPlaylist(res, message) {
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(buildNoticePlaylist(message));
}

function summarizeCounts(items, key, limit = 6) {
  const counts = new Map();
  for (const item of items) {
    const label = item[key] || 'Desconhecido';
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function buildHourlySeries(items) {
  const now = new Date();
  const labels = [];
  const values = [];

  for (let offset = 23; offset >= 0; offset -= 1) {
    const slot = new Date(now.getTime() - offset * 60 * 60 * 1000);
    const label = slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const start = new Date(slot);
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const count = items.filter(item => {
      const date = new Date(item.visitedAt);
      return date >= start && date < end;
    }).length;
    labels.push(label);
    values.push(count);
  }

  return { labels, values };
}

function parseXmltvDate(str) {
  // Formato: 20260418120000 +0000  ou  20260418120000 +0300
  if (!str) return null;
  const m = str.trim().match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\s*([+-]\d{4})?/);
  if (!m) return null;
  const [, yr, mo, dy, hh, mm, ss, tz = '+0000'] = m;
  const sign  = tz[0] === '-' ? -1 : 1;
  const tzH   = parseInt(tz.slice(1, 3), 10);
  const tzM   = parseInt(tz.slice(3, 5), 10);
  const offsetMs = sign * (tzH * 60 + tzM) * 60 * 1000;
  const utcMs = Date.UTC(yr, mo - 1, dy, hh, mm, ss);
  return new Date(utcMs - offsetMs);
}

function pickXmlText(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return pickXmlText(value[0]);
  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'];
    return '';
  }
  return String(value);
}

function pickXmlTextList(value) {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map(item => pickXmlText(item).trim())
    .filter(Boolean);
}

function pickCreditsList(credits, key) {
  if (!credits || typeof credits !== 'object') return [];
  return pickXmlTextList(credits[key]);
}

async function fetchEpgXml() {
  const now = Date.now();
  if (epgXmlCache && now - epgXmlCacheTime < EPG_CACHE_TTL) return epgXmlCache;

  const { epgUrl } = getGeneralRuntimeConfig();
  const response = await axios.get(epgUrl, { responseType: 'text', timeout: 10000 });
  epgXmlCache = response.data;
  epgXmlCacheTime = now;
  epgParsedCache = null;
  epgParsedCacheTime = 0;

  return epgXmlCache;
}

async function fetchEpg() {
  const now = Date.now();
  if (epgParsedCache && now - epgParsedCacheTime < EPG_CACHE_TTL) return epgParsedCache;

  const xml = await fetchEpgXml();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const result = parser.parse(xml);
  const tv = result.tv;

  // Normaliza canais
  const rawChannels = Array.isArray(tv.channel) ? tv.channel : [tv.channel];
  const channels = rawChannels.map(c => ({
    id: c['@_id'],
    name: Array.isArray(c['display-name'])
      ? c['display-name'][0]['#text'] || c['display-name'][0]
      : c['display-name']['#text'] || c['display-name'],
    icon: c.icon ? c.icon['@_src'] : null,
  }));

  // Normaliza programas
  const rawProgs = Array.isArray(tv.programme) ? tv.programme : [tv.programme || []];
  const programmes = rawProgs.filter(Boolean).map(p => ({
    channelId: p['@_channel'],
    start: parseXmltvDate(p['@_start']),
    stop:  parseXmltvDate(p['@_stop']),
    title: pickXmlText(p.title),
    subTitle: pickXmlText(p['sub-title']),
    desc: pickXmlText(p.desc),
    category: pickXmlText(p.category),
    icon: p.icon?.['@_src'] || null,
    actors: pickCreditsList(p.credits, 'actor'),
    directors: pickCreditsList(p.credits, 'director'),
    presenters: pickCreditsList(p.credits, 'presenter'),
    producers: pickCreditsList(p.credits, 'producer'),
    writers: pickCreditsList(p.credits, 'writer'),
    date: pickXmlText(p.date),
    countries: pickXmlTextList(p.country),
    language: pickXmlText(p.language),
    originalLanguage: pickXmlText(p['orig-language']),
    episodeNum: pickXmlText(p['episode-num']),
    rating: pickXmlText(p.rating?.value || p.rating),
  }));

  epgParsedCache = { channels, programmes };
  epgParsedCacheTime = Date.now();
  return epgParsedCache;
}

ensureDataStore();
setInterval(cleanupExpiredSessions, SESSION_PING_MS);

// ── Rotas: Proxy HLS ─────────────────────────────────────────────────────────

// Proxy para o playlist .m3u8 — reescreve URLs internas para passar pelo nosso servidor
app.get('/stream/playlist.m3u8', async (req, res) => {
  try {
    const geoBlock = await getGeoBlockForRequest(req);
    if (geoBlock) {
      sendNoticeAsPlaylist(res, geoBlock.message);
      return;
    }

    const { streamUrl } = getGeneralRuntimeConfig();
    const upstream = await axios.get(streamUrl, { responseType: 'text', timeout: 10000 });
    let content = upstream.data;

    // Reescreve linhas que são segmentos .ts ou sub-playlists .m3u8
    content = content.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;

      let absoluteUrl;
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        absoluteUrl = trimmed;
      } else if (trimmed.startsWith('/')) {
        absoluteUrl = `${UPSTREAM_BASE}${trimmed}`;
      } else {
        // URL relativa — resolve a partir do diretório do m3u8
        const base = streamUrl.split('?')[0].replace(/\/[^/]+$/, '/');
        absoluteUrl = base + trimmed;
      }

      if (trimmed.includes('.m3u8')) {
        return `/stream/sub.m3u8?url=${encodeURIComponent(absoluteUrl)}`;
      }
      return `/stream/seg?url=${encodeURIComponent(absoluteUrl)}`;
    }).join('\n');

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(content);
  } catch (err) {
    console.error('[STREAM] Erro ao buscar playlist:', err.message);
    sendNoticeAsPlaylist(res, 'Esse stream está offline, tente novamente mais tarde');
  }
});

app.get('/stream/notice.ts', (req, res) => {
  const segment = getNoticeSegmentBuffer();

  res.setHeader('Content-Type', 'video/MP2T');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Length', segment.length);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(segment);
});

// Sub-playlists (caso o stream use master + media playlist)
app.get('/stream/sub.m3u8', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL não informada');
  try {
    const upstream = await axios.get(url, { responseType: 'text', timeout: 10000 });
    let content = upstream.data;

    const baseDir = url.split('?')[0].replace(/\/[^/]+$/, '/');
    content = content.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;
      let absUrl;
      if (trimmed.startsWith('http')) {
        absUrl = trimmed;
      } else if (trimmed.startsWith('/')) {
        absUrl = `${UPSTREAM_BASE}${trimmed}`;
      } else {
        absUrl = baseDir + trimmed;
      }
      return `/stream/seg?url=${encodeURIComponent(absUrl)}`;
    }).join('\n');

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(content);
  } catch (err) {
    console.error('[STREAM] Erro ao buscar sub-playlist:', err.message);
    res.status(502).json({ error: 'Erro ao buscar sub-playlist.' });
  }
});

// Proxy de segmentos .ts
app.get('/stream/seg', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL não informada');
  try {
    const upstream = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    res.setHeader('Content-Type', 'video/MP2T');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(upstream.data));
  } catch (err) {
    console.error('[STREAM] Erro ao buscar segmento:', err.message);
    res.status(502).send('Erro ao buscar segmento.');
  }
});

// ── Rotas: EPG API ────────────────────────────────────────────────────────────

app.get('/epg/xmltv.xml', async (req, res) => {
  try {
    const xml = await fetchEpgXml();

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(xml);
  } catch (err) {
    console.error('[EPG] Erro ao buscar XMLTV:', err.message);
    res.status(502).json({ error: 'Não foi possível acessar o XMLTV.' });
  }
});

app.get('/api/public-config', (req, res) => {
  const runtimeConfig = getGeneralRuntimeConfig();
  res.json({
    channelName: CHANNEL_NAME,
    version: getLocalAppVersion(),
    faviconUrl: runtimeConfig.faviconUrl,
  });
});

app.get('/api/admin/auth/status', (req, res) => {
  res.json({
    enabled: Boolean(ADMIN_PASSWORD),
    authenticated: isAdminAuthenticated(req),
    channelName: CHANNEL_NAME,
    version: getLocalAppVersion(),
  });
});

app.get('/api/admin/update/check', requireAdminAuth, async (req, res) => {
  try {
    const status = await getUpdateStatus();
    res.json(status);
  } catch (error) {
    console.error('[ADMIN] Erro ao verificar atualização:', error.message);
    res.status(502).json({ error: 'Não foi possível verificar atualizações no GitHub.' });
  }
});

app.post('/api/admin/update/apply', requireAdminAuth, async (req, res) => {
  try {
    if (!updatePromise) {
      updatePromise = (async () => {
        const status = await getUpdateStatus();
        if (!status.hasUpdate) {
          return {
            updated: false,
            currentVersion: status.currentVersion,
            latestVersion: status.latestVersion,
            message: 'O aplicativo já está atualizado.',
          };
        }

        const updateResult = await updateApplicationFromGitHub();
        return {
          updated: true,
          previousVersion: updateResult.previousVersion,
          currentVersion: updateResult.currentVersion,
          latestVersion: status.latestVersion,
          message: 'Atualização concluída com sucesso.',
        };
      })();
    }

    const result = await updatePromise;
    updatePromise = null;

    res.json({
      ...result,
      restartScheduled: Boolean(result.updated && AUTO_RESTART_ON_UPDATE),
    });

    if (result.updated && AUTO_RESTART_ON_UPDATE) {
      setTimeout(() => {
        process.exit(0);
      }, 1500);
    }
  } catch (error) {
    updatePromise = null;
    console.error('[ADMIN] Erro ao aplicar atualização:', error.message);
    res.status(500).json({ error: 'Não foi possível aplicar a atualização automática.' });
  }
});

app.get('/api/admin/general-settings', requireAdminAuth, (req, res) => {
  const saved = readGeneralSettings();
  const runtime = getGeneralRuntimeConfig();

  res.json({
    streamUrl: saved.streamUrl,
    epgUrl: saved.epgUrl,
    faviconUrl: saved.faviconUrl,
    effectiveStreamUrl: runtime.streamUrl,
    effectiveEpgUrl: runtime.epgUrl,
    effectiveFaviconUrl: runtime.faviconUrl,
  });
});

app.post('/api/admin/general-settings', requireAdminAuth, async (req, res) => {
  const payload = {
    streamUrl: req.body?.streamUrl,
    epgUrl: req.body?.epgUrl,
    faviconUrl: req.body?.faviconUrl,
  };

  const invalidField = ['streamUrl', 'epgUrl', 'faviconUrl'].find((field) => {
    const value = String(payload[field] || '').trim();
    return value && !sanitizeOptionalUrl(value);
  });

  if (invalidField) {
    return res.status(400).json({ error: `Campo ${invalidField} invalido. Use URL http(s) valida.` });
  }

  try {
    const saved = await writeGeneralSettings(payload);

    epgXmlCache = null;
    epgXmlCacheTime = 0;
    epgParsedCache = null;
    epgParsedCacheTime = 0;

    const responsePayload = {
      message: 'Configuracoes salvas com sucesso. O aplicativo sera reiniciado.',
      restartScheduled: true,
      settings: saved,
    };

    res.json(responsePayload);

    setTimeout(() => {
      process.exit(0);
    }, 1500);
  } catch (error) {
    console.error('[ADMIN] Erro ao salvar configuracoes gerais:', error.message);
    res.status(500).json({ error: 'Nao foi possivel salvar as configuracoes gerais.' });
  }
});

app.post('/api/admin/auth/login', (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.json({ enabled: false, authenticated: true });
  }

  const password = String(req.body?.password || '');
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha inválida.' });
  }

  res.cookie(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ADMIN_COOKIE_TTL_MS,
    path: '/',
  });

  return res.json({ enabled: true, authenticated: true });
});

app.post('/api/admin/auth/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
  res.status(204).end();
});

app.post('/api/analytics/session/start', async (req, res) => {
  const sessionId = crypto.randomUUID();
  const visit = buildVisitEntry(req, sessionId);

  activeSessions.set(sessionId, {
    startedAt: Date.now(),
    lastSeenAt: Date.now(),
    ip: visit.ip,
  });

  await persistVisit(visit);

  res.json({
    sessionId,
    viewers: getCurrentViewerCount(),
    pingIntervalMs: SESSION_PING_MS,
  });
});

app.post('/api/analytics/session/ping', (req, res) => {
  const sessionId = req.body?.sessionId;
  if (sessionId && activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId);
    session.lastSeenAt = Date.now();
    activeSessions.set(sessionId, session);
  }

  res.json({ viewers: getCurrentViewerCount() });
});

app.post('/api/analytics/session/end', (req, res) => {
  const sessionId = req.body?.sessionId;
  if (sessionId) {
    activeSessions.delete(sessionId);
  }

  res.status(204).end();
});

app.get('/api/analytics/live', (req, res) => {
  res.json({
    viewers: getCurrentViewerCount(),
    updatedAt: new Date().toISOString(),
  });
});

app.get('/api/analytics/summary', requireAdminAuth, (req, res) => {
  const visits = readVisits();
  const now = Date.now();
  const last24Hours = visits.filter(item => now - new Date(item.visitedAt).getTime() <= 24 * 60 * 60 * 1000);
  const recentVisits = visits.slice(-25).reverse();
  const uniqueIps24h = new Set(last24Hours.map(item => item.ip)).size;

  res.json({
    currentViewers: getCurrentViewerCount(),
    totalVisits: visits.length,
    visitsLast24Hours: last24Hours.length,
    uniqueIpsLast24Hours: uniqueIps24h,
    topBrowsers: summarizeCounts(last24Hours, 'browser'),
    topOperatingSystems: summarizeCounts(last24Hours, 'operatingSystem'),
    topCountries: summarizeCounts(last24Hours, 'country'),
    topCities: summarizeCounts(last24Hours, 'city'),
    hourlyVisits: buildHourlySeries(last24Hours),
    recentVisits,
  });
});

// Retorna canal + programa atual + próximo programa
app.get('/api/epg/now', async (req, res) => {
  try {
    const { channels, programmes } = await fetchEpg();
    const channelId = req.query.channelId; // opcional: filtrar por canal específico

    const now = new Date();

    const current = programmes.filter(p =>
      (!channelId || p.channelId === channelId) &&
      p.start <= now && p.stop > now
    );

    const next = current.map(curr => {
      const upcoming = programmes.filter(p =>
        p.channelId === curr.channelId && p.start >= curr.stop
      ).sort((a, b) => a.start - b.start);
      return {
        channel: channels.find(c => c.id === curr.channelId) || { id: curr.channelId, name: curr.channelId },
        current: { ...curr, start: curr.start?.toISOString(), stop: curr.stop?.toISOString() },
        next: upcoming[0] ? {
          ...upcoming[0],
          start: upcoming[0].start?.toISOString(),
          stop:  upcoming[0].stop?.toISOString(),
        } : null,
      };
    });

    res.json(next);
  } catch (err) {
    console.error('[EPG] Erro:', err.message);
    res.status(502).json({ error: 'Não foi possível buscar o EPG.' });
  }
});

// Retorna a grade EPG completa (próximas 24h)
app.get('/api/epg/grid', async (req, res) => {
  try {
    const { channels, programmes } = await fetchEpg();
    const channelId = req.query.channelId;

    const now    = new Date();
    const cutoff = new Date(now.getTime() - 30 * 60 * 1000);   // 30 min atrás
    const end    = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h

    const filtered = programmes.filter(p =>
      (!channelId || p.channelId === channelId) &&
      p.stop > cutoff && p.start < end
    ).sort((a, b) => a.start - b.start);

    const grid = channels
      .filter(c => !channelId || c.id === channelId)
      .map(channel => ({
        channel,
        programmes: filtered
          .filter(p => p.channelId === channel.id)
          .map(p => ({
            ...p,
            start: p.start?.toISOString(),
            stop:  p.stop?.toISOString(),
          })),
      }))
      .filter(c => c.programmes.length > 0);

    res.json(grid);
  } catch (err) {
    console.error('[EPG] Erro ao montar grade:', err.message);
    res.status(502).json({ error: 'Não foi possível montar a grade EPG.' });
  }
});

// Retorna lista de canais
app.get('/api/epg/channels', async (req, res) => {
  try {
    const { channels } = await fetchEpg();
    res.json(channels);
  } catch (err) {
    res.status(502).json({ error: 'Erro ao buscar canais.' });
  }
});

// ── Rotas: Bloqueio regional ────────────────────────────────────────────────

app.get('/api/blocks', requireAdminAuth, (req, res) => {
  res.json(readRegionBlocks());
});

app.post('/api/blocks', requireAdminAuth, async (req, res) => {
  const attraction = String(req.body?.attraction || '').trim();
  if (!attraction) {
    return res.status(400).json({ error: 'O campo attraction é obrigatório.' });
  }

  const block = {
    id: crypto.randomUUID(),
    attraction,
    countries: normalizeCsvOrArray(req.body?.countries),
    states: normalizeCsvOrArray(req.body?.states),
    cities: normalizeCsvOrArray(req.body?.cities),
    reason: String(req.body?.reason || '').trim(),
    active: req.body?.active !== false,
    createdAt: new Date().toISOString(),
  };

  const blocks = readRegionBlocks();
  blocks.push(block);
  await writeRegionBlocks(blocks);
  res.status(201).json(block);
});

app.delete('/api/blocks/:id', requireAdminAuth, async (req, res) => {
  const blocks = readRegionBlocks();
  const nextBlocks = blocks.filter(block => block.id !== req.params.id);

  if (nextBlocks.length === blocks.length) {
    return res.status(404).json({ error: 'Bloqueio não encontrado.' });
  }

  await writeRegionBlocks(nextBlocks);
  res.status(204).end();
});

// ── Servir frontend estático ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/estatisticas', requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/bloqueios', requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blocks.html'));
});

app.get('/configuracoes-gerais', requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🟢  ${CHANNEL_NAME} rodando em http://localhost:${PORT}\n`);
  console.log(`   Stream proxy : http://localhost:${PORT}/stream/playlist.m3u8`);
  console.log(`   XMLTV proxy  : http://localhost:${PORT}/epg/xmltv.xml`);
  console.log(`   Admin        : http://localhost:${PORT}/admin`);
  console.log(`   Bloqueios    : http://localhost:${PORT}/bloqueios`);
  console.log(`   EPG agora    : http://localhost:${PORT}/api/epg/now`);
  console.log(`   Grade EPG    : http://localhost:${PORT}/api/epg/grid`);
  console.log(`   Estatísticas : http://localhost:${PORT}/estatisticas\n`);
});
