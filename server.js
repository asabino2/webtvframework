const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const sqlite3 = require('sqlite3').verbose();
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const VISITS_DB_FILE = path.join(DATA_DIR, 'visits.db');
const BLOCKS_FILE = path.join(DATA_DIR, 'region-blocks.json');
const GENERAL_SETTINGS_FILE = path.join(DATA_DIR, 'general-settings.json');
const VIEWER_TTL_MS = 45 * 1000;
const SESSION_PING_MS = 20 * 1000;
const DIRECT_STREAM_TTL_MS = 70 * 1000;
const GEO_PROFILE_TTL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_CHANNEL_NAME = process.env.CHANNEL_NAME || 'Webtv framework';
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
const DEFAULT_EPG_URL = process.env.EPG_URL || '';
const DEFAULT_FAVICON_URL = process.env.FAVICON_URL || '/favicon-default.svg';
const STREAM_CHANNEL_ID = process.env.STREAM_CHANNEL_ID || null;
const HOME_THEME_PRESETS = {
  default: {
    colors: {
      bg: '#0d0f14',
      surface: '#161b24',
      border: '#2a3347',
      accent: '#e8a020',
      text: '#e8ecf0',
    },
    fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
  },
  sunset: {
    colors: {
      bg: '#1f1020',
      surface: '#2d1a2e',
      border: '#5c344f',
      accent: '#ff9f1c',
      text: '#f8edf4',
    },
    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
  },
  ocean: {
    colors: {
      bg: '#081b2a',
      surface: '#0f2a40',
      border: '#28506b',
      accent: '#40c4ff',
      text: '#e7f6ff',
    },
    fontFamily: 'Tahoma, Segoe UI, sans-serif',
  },
};
const HOME_ALLOWED_FONTS = [
  'Segoe UI, system-ui, -apple-system, sans-serif',
  'Trebuchet MS, Verdana, sans-serif',
  'Tahoma, Segoe UI, sans-serif',
  'Georgia, Times New Roman, serif',
  'Courier New, monospace',
];
const DEFAULT_HOME_CUSTOMIZATION = {
  theme: 'default',
  colors: { ...HOME_THEME_PRESETS.default.colors },
  fontFamily: HOME_THEME_PRESETS.default.fontFamily,
  playerControls: {
    googleCast: true,
    fullscreen: true,
    volume: true,
    mute: true,
    shareButtons: true,
  },
  faviconUrl: '',
  backgroundImageUrl: '',
};
const EMBED_WIDGET_IDS = [
  'epgButton',
  'currentProgram',
  'nextProgram',
  'currentAudience',
  'totalAudience',
  'shareOptions',
];
const DEFAULT_EMBED_CUSTOMIZATION = {
  order: [...EMBED_WIDGET_IDS],
  enabled: {
    epgButton: true,
    currentProgram: true,
    nextProgram: true,
    currentAudience: true,
    totalAudience: false,
    shareOptions: true,
  },
};

// Cache do EPG para evitar requisições repetidas
let epgXmlCache = null;
let epgXmlCacheTime = 0;
let epgParsedCache = null;
let epgParsedCacheTime = 0;
const EPG_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
let noticeSegmentBuffer = null;
const activeSessions = new Map();
const directStreamSessions = new Map();
const geoProfileCache = new Map();
let visitsDb = null;
let streamStateVersion = 1;

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

function openVisitsDatabase(filePath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filePath, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(db);
    });
  });
}

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!visitsDb) {
      reject(new Error('Banco de visitas não inicializado.'));
      return;
    }

    visitsDb.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!visitsDb) {
      reject(new Error('Banco de visitas não inicializado.'));
      return;
    }

    visitsDb.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row || null);
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!visitsDb) {
      reject(new Error('Banco de visitas não inicializado.'));
      return;
    }

    visitsDb.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(Array.isArray(rows) ? rows : []);
    });
  });
}

function classifyAccessType(page) {
  const normalizedPage = String(page || '').toLowerCase();
  if (normalizedPage.includes('/embed')) return 'embed';
  if (normalizedPage.includes('.m3u8') || normalizedPage.includes('/stream')) return 'hls_stream';
  return 'home';
}

function normalizeVisitForStorage(entry) {
  const sessionId = String(entry?.sessionId || crypto.randomUUID());
  const startedAt = String(entry?.startedAt || entry?.visitedAt || new Date().toISOString());
  const endedAt = entry?.endedAt ? String(entry.endedAt) : null;
  const watchTimeSecs = Math.max(0, Number(entry?.watchTimeSecs || 0));
  const browserName = String(entry?.browserName || entry?.browser || 'Desconhecido').trim() || 'Desconhecido';
  const browserVersion = String(entry?.browserVersion || '').trim();
  const operatingSystemName = String(entry?.operatingSystemName || entry?.operatingSystem || 'Desconhecido').trim() || 'Desconhecido';
  const operatingSystemVersion = String(entry?.operatingSystemVersion || '').trim();
  const page = String(entry?.page || '/').trim() || '/';
  const accessType = String(entry?.accessType || classifyAccessType(page)).trim() || 'home';
  const vpnDetected = entry?.vpnDetected === true || entry?.vpnDetected === 1 || entry?.vpnDetected === '1' || entry?.isVpn === true;
  const vpnProviderRaw = String(entry?.vpnProvider || entry?.vpnName || '').trim();
  const vpnProvider = vpnDetected ? (vpnProviderRaw || 'Não identificado') : null;

  return {
    sessionId,
    startedAt,
    endedAt,
    watchTimeSecs,
    ip: String(entry?.ip || '0.0.0.0').trim() || '0.0.0.0',
    page,
    accessType,
    vpnDetected,
    vpnProvider,
    referrer: String(entry?.referrer || '').trim(),
    currentProgram: entry?.currentProgram ? String(entry.currentProgram).trim() : null,
    browserName,
    browserVersion,
    operatingSystemName,
    operatingSystemVersion,
    device: String(entry?.device || 'Desconhecido').trim() || 'Desconhecido',
    country: String(entry?.country || 'Desconhecido').trim() || 'Desconhecido',
    state: String(entry?.state || 'Desconhecido').trim() || 'Desconhecido',
    city: String(entry?.city || 'Desconhecido').trim() || 'Desconhecido',
    neighborhood: String(entry?.neighborhood || 'Desconhecido').trim() || 'Desconhecido',
    isp: String(entry?.isp || 'Desconhecido').trim() || 'Desconhecido',
    userAgent: String(entry?.userAgent || '').trim(),
  };
}

function mapVisitRowToApi(row) {
  const browser = [row.browser_name, row.browser_version].filter(Boolean).join(' ').trim() || 'Desconhecido';
  const operatingSystem = [row.operating_system_name, row.operating_system_version]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Desconhecido';

  return {
    sessionId: row.session_id,
    visitedAt: row.started_at,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    watchTimeSecs: Number(row.watch_time_secs || 0),
    ip: row.ip,
    page: row.page,
    accessType: row.access_type,
    vpnDetected: Boolean(row.vpn_detected),
    vpnProvider: row.vpn_provider || null,
    referrer: row.referrer,
    currentProgram: row.current_program,
    browser,
    browserName: row.browser_name,
    browserVersion: row.browser_version,
    operatingSystem,
    operatingSystemName: row.operating_system_name,
    operatingSystemVersion: row.operating_system_version,
    device: row.device,
    country: row.country,
    state: row.state,
    city: row.city,
    neighborhood: row.neighborhood,
    isp: row.isp,
    userAgent: row.user_agent,
  };
}

async function upsertVisit(entry) {
  const visit = normalizeVisitForStorage(entry);
  await runSql(
    `INSERT INTO visits (
      session_id, started_at, ended_at, watch_time_secs, ip, page, access_type, vpn_detected, vpn_provider, referrer, current_program,
      browser_name, browser_version, operating_system_name, operating_system_version, device,
      country, state, city, neighborhood, isp, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      started_at = excluded.started_at,
      ended_at = excluded.ended_at,
      watch_time_secs = excluded.watch_time_secs,
      ip = excluded.ip,
      page = excluded.page,
      access_type = excluded.access_type,
      vpn_detected = excluded.vpn_detected,
      vpn_provider = excluded.vpn_provider,
      referrer = excluded.referrer,
      current_program = excluded.current_program,
      browser_name = excluded.browser_name,
      browser_version = excluded.browser_version,
      operating_system_name = excluded.operating_system_name,
      operating_system_version = excluded.operating_system_version,
      device = excluded.device,
      country = excluded.country,
      state = excluded.state,
      city = excluded.city,
      neighborhood = excluded.neighborhood,
      isp = excluded.isp,
      user_agent = excluded.user_agent`,
    [
      visit.sessionId,
      visit.startedAt,
      visit.endedAt,
      visit.watchTimeSecs,
      visit.ip,
      visit.page,
      visit.accessType,
      visit.vpnDetected ? 1 : 0,
      visit.vpnProvider,
      visit.referrer,
      visit.currentProgram,
      visit.browserName,
      visit.browserVersion,
      visit.operatingSystemName,
      visit.operatingSystemVersion,
      visit.device,
      visit.country,
      visit.state,
      visit.city,
      visit.neighborhood,
      visit.isp,
      visit.userAgent,
    ]
  );
}

async function initializeVisitsDatabase() {
  ensureDataStore();
  visitsDb = await openVisitsDatabase(VISITS_DB_FILE);

  await runSql('PRAGMA journal_mode = WAL');
  await runSql(`CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    watch_time_secs INTEGER NOT NULL DEFAULT 0,
    ip TEXT NOT NULL,
    page TEXT NOT NULL,
    access_type TEXT NOT NULL,
    vpn_detected INTEGER NOT NULL DEFAULT 0,
    vpn_provider TEXT,
    referrer TEXT,
    current_program TEXT,
    browser_name TEXT,
    browser_version TEXT,
    operating_system_name TEXT,
    operating_system_version TEXT,
    device TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    neighborhood TEXT,
    isp TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  await runSql('CREATE INDEX IF NOT EXISTS idx_visits_started_at ON visits(started_at)');
  await runSql('CREATE INDEX IF NOT EXISTS idx_visits_ip ON visits(ip)');
  await runSql('CREATE INDEX IF NOT EXISTS idx_visits_access_type ON visits(access_type)');

  const visitsColumns = await allSql('PRAGMA table_info(visits)');
  const hasVpnDetected = visitsColumns.some((column) => column.name === 'vpn_detected');
  const hasVpnProvider = visitsColumns.some((column) => column.name === 'vpn_provider');

  if (!hasVpnDetected) {
    await runSql('ALTER TABLE visits ADD COLUMN vpn_detected INTEGER NOT NULL DEFAULT 0');
  }

  if (!hasVpnProvider) {
    await runSql('ALTER TABLE visits ADD COLUMN vpn_provider TEXT');
  }

  if (fs.existsSync(VISITS_FILE)) {
    let legacyVisits = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
      if (Array.isArray(parsed)) {
        legacyVisits = parsed;
      }
    } catch {
      legacyVisits = [];
    }

    if (legacyVisits.length) {
      for (const entry of legacyVisits) {
        // Mantém dados legados e completa os novos campos com fallback padrão.
        await upsertVisit(entry);
      }
    }

    await fs.promises.writeFile(VISITS_FILE, '[]', 'utf8');
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

function sanitizeChannelName(value) {
  return String(value || '').trim();
}

function sanitizeHexColor(value, fallback) {
  const str = String(value || '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(str)) {
    return str.toLowerCase();
  }
  return fallback;
}

function sanitizeTheme(theme) {
  const str = String(theme || '').trim().toLowerCase();
  return HOME_THEME_PRESETS[str] ? str : 'default';
}

function sanitizeFontFamily(fontFamily, fallback) {
  const str = String(fontFamily || '').trim();
  return HOME_ALLOWED_FONTS.includes(str) ? str : fallback;
}

function sanitizeHomeCustomization(value, fallback = DEFAULT_HOME_CUSTOMIZATION) {
  const source = value && typeof value === 'object' ? value : {};
  const theme = sanitizeTheme(source.theme || fallback.theme);
  const preset = HOME_THEME_PRESETS[theme] || HOME_THEME_PRESETS.default;
  const baseColors = {
    ...preset.colors,
    ...(fallback.colors || {}),
  };
  const colorsSource = source.colors && typeof source.colors === 'object' ? source.colors : {};

  return {
    theme,
    colors: {
      bg: sanitizeHexColor(colorsSource.bg, baseColors.bg),
      surface: sanitizeHexColor(colorsSource.surface, baseColors.surface),
      border: sanitizeHexColor(colorsSource.border, baseColors.border),
      accent: sanitizeHexColor(colorsSource.accent, baseColors.accent),
      text: sanitizeHexColor(colorsSource.text, baseColors.text),
    },
    fontFamily: sanitizeFontFamily(source.fontFamily, fallback.fontFamily || preset.fontFamily),
    playerControls: {
      googleCast: source.playerControls?.googleCast !== false,
      fullscreen: source.playerControls?.fullscreen !== false,
      volume: source.playerControls?.volume !== false,
      mute: source.playerControls?.mute !== false,
      shareButtons: source.playerControls?.shareButtons !== false,
    },
    faviconUrl: sanitizeOptionalUrl(source.faviconUrl),
    backgroundImageUrl: sanitizeOptionalUrl(source.backgroundImageUrl),
  };
}

function sanitizeEmbedCustomization(value, fallback = DEFAULT_EMBED_CUSTOMIZATION) {
  const source = value && typeof value === 'object' ? value : {};
  const fallbackOrder = Array.isArray(fallback?.order) ? fallback.order : DEFAULT_EMBED_CUSTOMIZATION.order;
  const incomingOrder = Array.isArray(source.order) ? source.order : [];
  const ordered = incomingOrder
    .map((item) => String(item || '').trim())
    .filter((item, index, list) => EMBED_WIDGET_IDS.includes(item) && list.indexOf(item) === index);
  const order = [
    ...ordered,
    ...fallbackOrder.filter((id) => !ordered.includes(id)),
    ...EMBED_WIDGET_IDS.filter((id) => !ordered.includes(id) && !fallbackOrder.includes(id)),
  ];

  const fallbackEnabled = fallback?.enabled && typeof fallback.enabled === 'object'
    ? fallback.enabled
    : DEFAULT_EMBED_CUSTOMIZATION.enabled;
  const enabledSource = source.enabled && typeof source.enabled === 'object' ? source.enabled : {};
  const enabled = {};

  EMBED_WIDGET_IDS.forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(enabledSource, id)) {
      enabled[id] = enabledSource[id] !== false;
      return;
    }
    enabled[id] = fallbackEnabled[id] !== false;
  });

  return {
    order,
    enabled,
  };
}

function readGeneralSettings() {
  ensureDataStore();
  try {
    const raw = JSON.parse(fs.readFileSync(GENERAL_SETTINGS_FILE, 'utf8'));
    const savedFavicon = sanitizeOptionalUrl(raw?.faviconUrl || raw?.homeCustomization?.faviconUrl || '');
    const fallbackHome = {
      ...DEFAULT_HOME_CUSTOMIZATION,
      faviconUrl: savedFavicon,
    };

    return {
      channelName: sanitizeChannelName(raw?.channelName),
      streamUrl: sanitizeOptionalUrl(raw?.streamUrl),
      epgUrl: sanitizeOptionalUrl(raw?.epgUrl),
      faviconUrl: savedFavicon,
      homeCustomization: sanitizeHomeCustomization(raw?.homeCustomization, fallbackHome),
      embedCustomization: sanitizeEmbedCustomization(raw?.embedCustomization),
    };
  } catch {
    return {
      channelName: '',
      streamUrl: '',
      epgUrl: '',
      faviconUrl: '',
      homeCustomization: { ...DEFAULT_HOME_CUSTOMIZATION },
      embedCustomization: sanitizeEmbedCustomization(),
    };
  }
}

async function writeGeneralSettings(settings) {
  ensureDataStore();
  const existing = readGeneralSettings();
  const nextFaviconUrl = sanitizeOptionalUrl(settings?.faviconUrl);
  const nextHomeCustomization = sanitizeHomeCustomization(
    settings?.homeCustomization,
    {
      ...existing.homeCustomization,
      faviconUrl: nextFaviconUrl || existing.faviconUrl || existing.homeCustomization?.faviconUrl,
    }
  );

  const payload = {
    channelName: sanitizeChannelName(settings?.channelName),
    streamUrl: sanitizeOptionalUrl(settings?.streamUrl),
    epgUrl: sanitizeOptionalUrl(settings?.epgUrl),
    faviconUrl: nextFaviconUrl,
    homeCustomization: {
      ...nextHomeCustomization,
      faviconUrl: nextFaviconUrl,
    },
    embedCustomization: sanitizeEmbedCustomization(settings?.embedCustomization, existing.embedCustomization),
  };

  await fs.promises.writeFile(GENERAL_SETTINGS_FILE, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

function getGeneralRuntimeConfig() {
  const settings = readGeneralSettings();
  const effectiveFaviconUrl = settings.faviconUrl || settings.homeCustomization?.faviconUrl || sanitizeOptionalUrl(DEFAULT_FAVICON_URL);
  const fallbackHome = {
    ...settings.homeCustomization,
    faviconUrl: effectiveFaviconUrl,
  };

  return {
    channelName: settings.channelName || DEFAULT_CHANNEL_NAME,
    streamUrl: settings.streamUrl || DEFAULT_M3U8_URL,
    epgUrl: settings.epgUrl || DEFAULT_EPG_URL,
    faviconUrl: effectiveFaviconUrl,
    homeCustomization: sanitizeHomeCustomization(fallbackHome, settings.homeCustomization),
    embedCustomization: sanitizeEmbedCustomization(settings.embedCustomization),
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toAbsoluteUrl(input, fallbackBaseUrl) {
  try {
    return new URL(String(input || ''), fallbackBaseUrl).toString();
  } catch {
    return fallbackBaseUrl;
  }
}

function renderPublicIndexHtml(req) {
  const runtimeConfig = getGeneralRuntimeConfig();
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const socialUrl = toAbsoluteUrl('/', baseUrl);
  const faviconUrl = toAbsoluteUrl(runtimeConfig.faviconUrl || '/favicon-default.svg', baseUrl);
  const socialTitle = `${runtimeConfig.channelName} - Ao Vivo`;
  const socialDescription = `Confira ${runtimeConfig.channelName} na transmissao ao vivo!`;
  const template = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

  return template
    .replace(/{{SOCIAL_TITLE}}/g, escapeHtml(socialTitle))
    .replace(/{{SOCIAL_DESCRIPTION}}/g, escapeHtml(socialDescription))
    .replace(/{{SOCIAL_URL}}/g, escapeHtml(socialUrl))
    .replace(/{{SOCIAL_IMAGE}}/g, escapeHtml(faviconUrl))
    .replace(/{{CHANNEL_NAME}}/g, escapeHtml(runtimeConfig.channelName))
    .replace(/{{FAVICON_URL}}/g, escapeHtml(faviconUrl));
}

function bumpStreamStateVersion() {
  streamStateVersion += 1;
  return streamStateVersion;
}

async function readVisits() {
  const rows = await allSql('SELECT * FROM visits ORDER BY started_at ASC');
  return rows.map(mapVisitRowToApi);
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

async function persistVisit(entry) {
  try {
    await upsertVisit(entry);
  } catch (err) {
    console.error('[ANALYTICS] Erro ao gravar visitas no SQLite:', err.message);
  }
}

async function updateVisit(sessionId, fields) {
  try {
    const row = await getSql('SELECT * FROM visits WHERE session_id = ?', [sessionId]);
    if (!row) return;

    const existing = mapVisitRowToApi(row);
    const merged = {
      ...existing,
      ...fields,
      sessionId,
      startedAt: existing.startedAt,
      visitedAt: existing.visitedAt,
    };
    await upsertVisit(merged);
  } catch (err) {
    console.error('[ANALYTICS] Erro ao atualizar visita no SQLite:', err.message);
  }
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

function getLocationFromGeoLite(ip) {
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

async function getLocationProfile(ip) {
  if (isPrivateIp(ip)) {
    return {
      country: 'Rede local',
      state: 'Rede interna',
      city: 'Rede interna',
      neighborhood: 'Rede interna',
      isp: 'Rede interna',
      vpnDetected: false,
      vpnProvider: null,
    };
  }

  const cached = geoProfileCache.get(ip);
  const now = Date.now();
  if (cached && now - cached.savedAt < GEO_PROFILE_TTL_MS) {
    return cached.value;
  }

  const fallback = getLocationFromGeoLite(ip);
  const fallbackProfile = {
    country: fallback.country,
    state: fallback.region,
    city: fallback.city,
    neighborhood: 'Desconhecido',
    isp: 'Desconhecido',
    vpnDetected: false,
    vpnProvider: null,
  };

  try {
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,district,isp,org,as,proxy,hosting,mobile`;
    const response = await axios.get(url, { timeout: 2500 });
    const data = response.data || {};

    if (data.status !== 'success') {
      geoProfileCache.set(ip, { value: fallbackProfile, savedAt: now });
      return fallbackProfile;
    }

    const vpnDetected = Boolean(data.proxy || data.hosting);
    const vpnProvider = vpnDetected
      ? String(data.org || data.as || data.isp || '').trim() || 'Não identificado'
      : null;

    const profile = {
      country: String(data.country || fallbackProfile.country || 'Desconhecido'),
      state: String(data.regionName || fallbackProfile.state || 'Desconhecido'),
      city: String(data.city || fallbackProfile.city || 'Desconhecido'),
      neighborhood: String(data.district || 'Desconhecido'),
      isp: String(data.isp || 'Desconhecido'),
      vpnDetected,
      vpnProvider,
    };
    geoProfileCache.set(ip, { value: profile, savedAt: now });
    return profile;
  } catch {
    geoProfileCache.set(ip, { value: fallbackProfile, savedAt: now });
    return fallbackProfile;
  }
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

function detectHlsApplication(userAgent) {
  const source = String(userAgent || '').trim();
  if (!source) {
    return null;
  }

  const signatures = [
    { name: 'VLC', pattern: /\bVLC\/(\S+)/i },
    { name: 'FFmpeg', pattern: /\bLavf\/(\S+)/i },
    { name: 'Kodi', pattern: /\bKodi\/(\S+)/i },
    { name: 'TiviMate', pattern: /\bTiviMate\/(\S+)/i },
    { name: 'OTT Navigator', pattern: /\bOTT\s*Navigator\/(\S+)/i },
    { name: 'IPTV Smarters', pattern: /\bIPTV\s*Smarters(?:\s*Pro)?\/(\S+)/i },
    { name: 'XCIPTV', pattern: /\bXCIPTV\/(\S+)/i },
    { name: 'Perfect Player', pattern: /\bPerfect\s*Player\/(\S+)/i },
    { name: 'ProgTV', pattern: /\bProgTV\/(\S+)/i },
    { name: 'ExoPlayer', pattern: /\bExoPlayerLib\/(\S+)/i },
    { name: 'AppleCoreMedia', pattern: /\bAppleCoreMedia\/(\S+)/i },
    { name: 'okhttp', pattern: /\bokhttp\/(\S+)/i },
    { name: 'Lavf', pattern: /\bLavf\/(\S+)/i },
  ];

  for (const signature of signatures) {
    const match = source.match(signature.pattern);
    if (match) {
      return {
        name: signature.name,
        version: String(match[1] || '').trim(),
      };
    }
  }

  if (/smart[- ]?stv|smart[- ]?tv|hbbtv|webos|tizen|googletv|android\s*tv|fire\s*tv|roku|appletv/i.test(source)) {
    return { name: 'Smart TV App', version: '' };
  }

  return null;
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

function getPreferredChannelId(channels, programmes) {
  if (STREAM_CHANNEL_ID) {
    return STREAM_CHANNEL_ID;
  }

  const normalizedChannelName = normalizeText(getGeneralRuntimeConfig().channelName || DEFAULT_CHANNEL_NAME);
  const matchingChannel = (channels || []).find((channel) => {
    const channelName = normalizeText(channel?.name);
    return channelName && normalizedChannelName && (
      channelName.includes(normalizedChannelName) || normalizedChannelName.includes(channelName)
    );
  });

  if (matchingChannel?.id) {
    return matchingChannel.id;
  }

  const activeChannelIds = Array.from(new Set(
    (programmes || [])
      .filter((programme) => programme?.channelId)
      .map((programme) => programme.channelId)
  ));

  if (activeChannelIds.length === 1) {
    return activeChannelIds[0];
  }

  return null;
}

function getCurrentProgrammeForStream(channels, programmes) {
  const now = new Date();
  const current = programmes.filter(p => p.start <= now && p.stop > now);
  if (!current.length) return null;

  const preferredChannelId = getPreferredChannelId(channels, current);
  if (preferredChannelId) {
    return current.find(p => p.channelId === preferredChannelId) || null;
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
  let channels = [];
  let programmes = [];

  try {
    const epg = await fetchEpg();
    channels = epg.channels;
    programmes = epg.programmes;
  } catch {
    return null;
  }

  const current = getCurrentProgrammeForStream(channels, programmes);
  if (!current) return null;

  const location = getLocationFromGeoLite(getClientIp(req));
  const blocks = readRegionBlocks().filter(block => block.active !== false);

  const matchedBlock = blocks.find(block => isProgrammeBlocked(current, block, location));
  if (!matchedBlock) return null;

  const reason = String(matchedBlock.reason || '').trim() || 'não informado';
  const message = `Programa bloqueado para a sua região, motivo: ${reason}`;

  return { message, programme: current, block: matchedBlock, location };
}

function getCurrentProgramTitle() {
  try {
    if (!epgParsedCache) return null;
    const { channels, programmes } = epgParsedCache;
    const current = getCurrentProgrammeForStream(channels, programmes);
    return current?.title || null;
  } catch {
    return null;
  }
}

async function buildVisitEntry(req, sessionId, overrides = {}) {
  const userAgent = String(req.headers['user-agent'] || '');
  const parser = new UAParser(userAgent);
  const parsedUa = parser.getResult();
  const ip = getClientIp(req);
  const location = await getLocationProfile(ip);
  const page = String(overrides.page || req.body?.page || req.path || '/').trim() || '/';
  const accessType = String(overrides.accessType || classifyAccessType(page));
  const rawReferrer = String(overrides.referrer || req.body?.referrer || req.headers.referer || '').trim();
  const detectedHlsApp = accessType === 'hls_stream' ? detectHlsApplication(userAgent) : null;
  const browserName = detectedHlsApp?.name || parsedUa.browser?.name || 'Desconhecido';
  const browserVersion = detectedHlsApp?.version || parsedUa.browser?.version || '';
  const operatingSystemName = parsedUa.os?.name || 'Desconhecido';
  const operatingSystemVersion = parsedUa.os?.version || '';
  let referrer = '';

  if (rawReferrer) {
    try {
      referrer = new URL(rawReferrer).origin;
    } catch {
      referrer = rawReferrer;
    }
  }

  return {
    sessionId,
    visitedAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    endedAt: null,
    watchTimeSecs: Number(overrides.watchTimeSecs || 0),
    ip,
    operatingSystem: [operatingSystemName, operatingSystemVersion].filter(Boolean).join(' ').trim() || 'Desconhecido',
    operatingSystemName,
    operatingSystemVersion,
    device: getDeviceLabel(parsedUa),
    browser: [browserName, browserVersion].filter(Boolean).join(' ').trim() || 'Desconhecido',
    browserName,
    browserVersion,
    country: location.country,
    state: location.state,
    city: location.city,
    neighborhood: location.neighborhood,
    isp: location.isp,
    vpnDetected: Boolean(location.vpnDetected),
    vpnProvider: location.vpnProvider || null,
    page,
    accessType,
    referrer,
    currentProgram: getCurrentProgramTitle() || null,
    userAgent,
  };
}

function shouldTrackDirectStreamVisit(req) {
  const rawReferrer = String(req.headers.referer || '').trim();
  if (!rawReferrer) {
    return true;
  }

  try {
    const refUrl = new URL(rawReferrer);
    const reqHost = String(req.get('host') || '').trim().toLowerCase();
    const refHost = String(refUrl.host || '').trim().toLowerCase();

    // Requisição iniciada por uma página desta própria aplicação (home/embed).
    if (reqHost && refHost && reqHost === refHost) {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

async function trackDirectStreamVisit(req) {
  if (!shouldTrackDirectStreamVisit(req)) {
    return;
  }

  const ip = getClientIp(req);
  const userAgent = String(req.headers['user-agent'] || '');
  const key = `${ip}|${userAgent}`;
  const now = Date.now();
  const current = directStreamSessions.get(key);

  if (current && now - current.lastSeenAt <= DIRECT_STREAM_TTL_MS) {
    const watchTimeSecs = Math.max(0, Math.round((now - current.startedAt) / 1000));
    directStreamSessions.set(key, {
      ...current,
      lastSeenAt: now,
    });
    await updateVisit(current.sessionId, {
      endedAt: new Date(now).toISOString(),
      watchTimeSecs,
      accessType: 'hls_stream',
      page: '/stream/playlist.m3u8',
    });
    return;
  }

  const sessionId = crypto.randomUUID();
  const visit = await buildVisitEntry(req, sessionId, {
    page: '/stream/playlist.m3u8',
    accessType: 'hls_stream',
    referrer: req.headers.referer || '',
  });

  directStreamSessions.set(key, {
    sessionId,
    startedAt: now,
    lastSeenAt: now,
  });
  await persistVisit(visit);
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

  for (const [key, session] of directStreamSessions.entries()) {
    if (now - session.lastSeenAt > DIRECT_STREAM_TTL_MS) {
      directStreamSessions.delete(key);
      const watchTimeSecs = Math.max(0, Math.round((session.lastSeenAt - session.startedAt) / 1000));
      updateVisit(session.sessionId, {
        endedAt: new Date(session.lastSeenAt).toISOString(),
        watchTimeSecs,
        accessType: 'hls_stream',
        page: '/stream/playlist.m3u8',
      }).catch((error) => {
        console.error('[ANALYTICS] Erro ao fechar sessão HLS expirada:', error.message);
      });
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

function buildTopPrograms(visits, limit = 5) {
  const map = new Map();
  for (const v of visits) {
    const title = v.currentProgram;
    if (!title) continue;
    const entry = map.get(title) || { views: 0, totalWatchSecs: 0 };
    entry.views += 1;
    entry.totalWatchSecs += Number(v.watchTimeSecs || 0);
    map.set(title, entry);
  }
  return Array.from(map.entries())
    .map(([title, stats]) => ({ title, ...stats }))
    .sort((a, b) => b.totalWatchSecs - a.totalWatchSecs || b.views - a.views)
    .slice(0, limit);
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
  if (!epgUrl) {
    throw new Error('EPG_URL_NOT_CONFIGURED');
  }

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

setInterval(cleanupExpiredSessions, SESSION_PING_MS);

// ── Rotas: Proxy HLS ─────────────────────────────────────────────────────────

// Proxy para o playlist .m3u8 — reescreve URLs internas para passar pelo nosso servidor
app.get('/stream/playlist.m3u8', async (req, res) => {
  try {
    trackDirectStreamVisit(req).catch((error) => {
      console.error('[ANALYTICS] Erro ao registrar visita HLS:', error.message);
    });

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
    if (err.message === 'EPG_URL_NOT_CONFIGURED') {
      return res.status(404).json({ error: 'URL de EPG nao configurada.' });
    }
    console.error('[EPG] Erro ao buscar XMLTV:', err.message);
    res.status(502).json({ error: 'Não foi possível acessar o XMLTV.' });
  }
});

app.get('/api/public-config', (req, res) => {
  const runtimeConfig = getGeneralRuntimeConfig();
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    channelName: runtimeConfig.channelName,
    version: getLocalAppVersion(),
    faviconUrl: runtimeConfig.faviconUrl,
    epgEnabled: Boolean(runtimeConfig.epgUrl),
    homeCustomization: runtimeConfig.homeCustomization,
    embedCustomization: runtimeConfig.embedCustomization,
    streamStateVersion,
  });
});

app.get('/api/admin/auth/status', (req, res) => {
  const runtimeConfig = getGeneralRuntimeConfig();
  res.json({
    enabled: Boolean(ADMIN_PASSWORD),
    authenticated: isAdminAuthenticated(req),
    channelName: runtimeConfig.channelName,
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
    channelName: saved.channelName,
    streamUrl: saved.streamUrl,
    epgUrl: saved.epgUrl,
    faviconUrl: saved.faviconUrl,
    effectiveChannelName: runtime.channelName,
    effectiveStreamUrl: runtime.streamUrl,
    effectiveEpgUrl: runtime.epgUrl,
    effectiveFaviconUrl: runtime.faviconUrl,
  });
});

app.get('/api/admin/home-customization', requireAdminAuth, (req, res) => {
  const saved = readGeneralSettings();
  const runtime = getGeneralRuntimeConfig();

  res.json({
    themePresets: Object.keys(HOME_THEME_PRESETS).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      colors: HOME_THEME_PRESETS[key].colors,
      fontFamily: HOME_THEME_PRESETS[key].fontFamily,
    })),
    allowedFonts: HOME_ALLOWED_FONTS,
    saved: saved.homeCustomization,
    effective: runtime.homeCustomization,
  });
});

app.get('/api/admin/embed-customization', requireAdminAuth, (req, res) => {
  const saved = readGeneralSettings();
  const runtime = getGeneralRuntimeConfig();

  res.json({
    widgets: EMBED_WIDGET_IDS,
    saved: saved.embedCustomization,
    effective: runtime.embedCustomization,
  });
});

app.post('/api/admin/general-settings', requireAdminAuth, async (req, res) => {
  const payload = {
    channelName: req.body?.channelName,
    streamUrl: req.body?.streamUrl,
    epgUrl: req.body?.epgUrl,
    faviconUrl: req.body?.faviconUrl,
    homeCustomization: readGeneralSettings().homeCustomization,
    embedCustomization: readGeneralSettings().embedCustomization,
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
    bumpStreamStateVersion();

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

app.post('/api/admin/home-customization', requireAdminAuth, async (req, res) => {
  const rawHomeCustomization = req.body?.homeCustomization;
  const currentSettings = readGeneralSettings();
  const nextHomeCustomization = sanitizeHomeCustomization(rawHomeCustomization, currentSettings.homeCustomization);

  try {
    const saved = await writeGeneralSettings({
      channelName: currentSettings.channelName,
      streamUrl: currentSettings.streamUrl,
      epgUrl: currentSettings.epgUrl,
      faviconUrl: currentSettings.faviconUrl,
      homeCustomization: nextHomeCustomization,
      embedCustomization: currentSettings.embedCustomization,
    });

    bumpStreamStateVersion();

    const responsePayload = {
      message: 'Personalizacao salva com sucesso. O aplicativo sera reiniciado.',
      restartScheduled: true,
      homeCustomization: saved.homeCustomization,
    };

    res.json(responsePayload);

    setTimeout(() => {
      process.exit(0);
    }, 1500);
  } catch (error) {
    console.error('[ADMIN] Erro ao salvar personalizacao da home:', error.message);
    res.status(500).json({ error: 'Nao foi possivel salvar a personalizacao da home.' });
  }
});

app.post('/api/admin/embed-customization', requireAdminAuth, async (req, res) => {
  const currentSettings = readGeneralSettings();
  const nextEmbedCustomization = sanitizeEmbedCustomization(req.body?.embedCustomization, currentSettings.embedCustomization);

  try {
    const saved = await writeGeneralSettings({
      channelName: currentSettings.channelName,
      streamUrl: currentSettings.streamUrl,
      epgUrl: currentSettings.epgUrl,
      faviconUrl: currentSettings.faviconUrl,
      homeCustomization: currentSettings.homeCustomization,
      embedCustomization: nextEmbedCustomization,
    });

    bumpStreamStateVersion();

    res.json({
      message: 'Configuracao do embed salva com sucesso.',
      embedCustomization: saved.embedCustomization,
    });
  } catch (error) {
    console.error('[ADMIN] Erro ao salvar configuracao do embed:', error.message);
    res.status(500).json({ error: 'Nao foi possivel salvar a configuracao do embed.' });
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
  const visit = await buildVisitEntry(req, sessionId);

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
  if (sessionId && activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId);
    const watchTimeSecs = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
    activeSessions.delete(sessionId);
    updateVisit(sessionId, {
      endedAt: new Date().toISOString(),
      watchTimeSecs,
    }).catch((error) => {
      console.error('[ANALYTICS] Erro ao fechar sessão:', error.message);
    });
  } else if (sessionId) {
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

app.get('/api/analytics/public-summary', async (req, res) => {
  const visits = await readVisits();
  const totalVisits = visits.length;
  res.json({
    totalVisits,
    totalViews: totalVisits,
    currentViewers: getCurrentViewerCount(),
    updatedAt: new Date().toISOString(),
  });
});

app.get('/api/analytics/summary', requireAdminAuth, async (req, res) => {
  const visits = await readVisits();
  const now = Date.now();
  const last24Hours = visits.filter(item => now - new Date(item.visitedAt).getTime() <= 24 * 60 * 60 * 1000);
  const recentVisits = visits.slice(-25).reverse();
  const uniqueIps24h = new Set(last24Hours.map(item => item.ip)).size;

  const topReferrers = summarizeCounts(
    last24Hours.map((item) => ({
      ...item,
      referrerLabel: String(item.referrer || 'Direto').trim() || 'Direto',
    })),
    'referrerLabel'
  );

  res.json({
    currentViewers: getCurrentViewerCount(),
    totalVisits: visits.length,
    visitsLast24Hours: last24Hours.length,
    uniqueIpsLast24Hours: uniqueIps24h,
    topBrowsers: summarizeCounts(
      last24Hours.map((item) => ({
        ...item,
        browserLabel: String(item.browserName || item.browser || 'Desconhecido').trim() || 'Desconhecido',
      })),
      'browserLabel'
    ),
    topOperatingSystems: summarizeCounts(last24Hours, 'operatingSystem'),
    topCountries: summarizeCounts(last24Hours, 'country'),
    topCities: summarizeCounts(last24Hours, 'city'),
    topIsps: summarizeCounts(last24Hours, 'isp'),
    topReferrers,
    hourlyVisits: buildHourlySeries(last24Hours),
    recentVisits,
    topPrograms: buildTopPrograms(visits),
  });
});

// Retorna canal + programa atual + próximo programa
app.get('/api/epg/now', async (req, res) => {
  try {
    const { channels, programmes } = await fetchEpg();
    const requestedChannelId = req.query.channelId; // opcional: filtrar por canal específico
    const preferredChannelId = requestedChannelId || getPreferredChannelId(channels, programmes);

    const now = new Date();

    const current = programmes.filter(p =>
      (!preferredChannelId || p.channelId === preferredChannelId) &&
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
    if (err.message === 'EPG_URL_NOT_CONFIGURED') {
      return res.json([]);
    }
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
    if (err.message === 'EPG_URL_NOT_CONFIGURED') {
      return res.json([]);
    }
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
    if (err.message === 'EPG_URL_NOT_CONFIGURED') {
      return res.json([]);
    }
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
  bumpStreamStateVersion();
  res.status(201).json(block);
});

app.delete('/api/blocks/:id', requireAdminAuth, async (req, res) => {
  const blocks = readRegionBlocks();
  const nextBlocks = blocks.filter(block => block.id !== req.params.id);

  if (nextBlocks.length === blocks.length) {
    return res.status(404).json({ error: 'Bloqueio não encontrado.' });
  }

  await writeRegionBlocks(nextBlocks);
  bumpStreamStateVersion();
  res.status(204).end();
});

// ── Servir frontend estático ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

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

app.get('/personalizacao', requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'personalization.html'));
});

app.get('/embed-opcao', requireAdminPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'embed-options.html'));
});

app.get('/embed', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'embed.html'));
});

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderPublicIndexHtml(req));
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await initializeVisitsDatabase();

    app.listen(PORT, () => {
      console.log(`\n🟢  ${getGeneralRuntimeConfig().channelName} rodando em http://localhost:${PORT}\n`);
      console.log(`   Stream proxy : http://localhost:${PORT}/stream/playlist.m3u8`);
      console.log(`   XMLTV proxy  : http://localhost:${PORT}/epg/xmltv.xml`);
      console.log(`   Admin        : http://localhost:${PORT}/admin`);
      console.log(`   Bloqueios    : http://localhost:${PORT}/bloqueios`);
      console.log(`   EPG agora    : http://localhost:${PORT}/api/epg/now`);
      console.log(`   Grade EPG    : http://localhost:${PORT}/api/epg/grid`);
      console.log(`   Estatísticas : http://localhost:${PORT}/estatisticas\n`);
    });
  } catch (error) {
    console.error('[STARTUP] Erro ao inicializar base de visitas:', error.message);
    process.exit(1);
  }
}

startServer();
