(function () {
  'use strict';

  const currentViewers = document.getElementById('metric-current-viewers');
  const totalVisits = document.getElementById('metric-total-visits');
  const visits24h = document.getElementById('metric-last-24h');
  const uniqueIps = document.getElementById('metric-unique-ips');
  const updatedAt = document.getElementById('metric-updated');
  const hourlyChart = document.getElementById('hourly-chart');
  const recentVisits = document.getElementById('recent-visits');
  const topBrowsers = document.getElementById('top-browsers');
  const topOs = document.getElementById('top-os');
  const topCountries = document.getElementById('top-countries');
  const topCities = document.getElementById('top-cities');
  const topReferrers = document.getElementById('top-referrers');
  const topIsps = document.getElementById('top-isps');
  const visitorDetailOverlay = document.getElementById('visitor-detail-overlay');
  const visitorDetailClose = document.getElementById('visitor-detail-close');
  const visitorDetailBody = document.getElementById('visitor-detail-body');
  const PIE_COLORS = ['#f4b338', '#38d9a9', '#4dabf7', '#b197fc', '#ff8787', '#ffa94d', '#94d82d', '#66d9e8'];
  let recentVisitsBySession = new Map();

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      titleStats: 'Estatisticas',
      kicker: 'Painel interno',
      mainTitle: 'Estatisticas da transmissao',
      subtitle: 'Visao em tempo real da audiencia, distribuicao de acessos e visitas recentes.',
      metricCurrent: 'Assistindo agora',
      metricTotal: 'Visitas totais',
      metric24h: 'Visitas nas ultimas 24h',
      metricIps: 'IPs unicos nas ultimas 24h',
      footTotal: 'Desde o inicio do log',
      foot24h: 'Janela movel',
      footIps: 'Dispositivos / origens',
      panelHourly: 'Entradas por hora',
      panelHourlySub: 'Ultimas 24 horas',
      panelBrowsers: 'Navegadores',
      panelTopAccess: 'Top acessos',
      panelOs: 'Sistemas operacionais',
      panelCountries: 'Paises',
      panelOrigin: 'Origem dos acessos',
      panelCities: 'Cidades',
      panelIsps: 'ISPs',
      panelRecent: 'Visitas recentes',
      panelRecentSub: 'Ultimos 25 acessos',
      thWhen: 'Quando',
      thBrowser: 'Navegador',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Localizacao',
      thReferrer: 'Referrer',
      panelReferrers: 'Referrer',
      panelReferrersSub: 'Sites de origem',
      directAccess: 'Direto',
      totalLabel: 'Total',
      emptyData: 'Ainda sem dados suficientes.',
      emptyVisits: 'Nenhuma visita registrada.',
      updatedAt: 'Atualizado as',
      updating: 'Atualizando...',
      thWatchTime: 'Tempo assistido',
      visitDetails: 'Detalhes',
      visitorKicker: 'Detalhes da visita',
      visitorTitle: 'Informacoes do visitante',
      visitorIp: 'IP',
      visitorDates: 'Inicio / fim / duracao',
      visitorBrowser: 'Navegador',
      visitorSystem: 'Sistema operacional',
      visitorDevice: 'Dispositivo',
      visitorLocation: 'Localizacao',
      visitorIsp: 'ISP',
      visitorReferrer: 'Referrer',
      visitorAccess: 'Acesso',
      visitorProgram: 'Atracao assistida',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'Em andamento',
      visitorUnknown: 'Desconhecido',
      accessHome: 'Pagina inicial',
      accessEmbed: 'Embed',
      accessHls: 'Stream HLS',
      panelTopPrograms: 'Programas mais vistos',
      panelTopProgramsSub: 'Top 5 atrações',
      thProgRank: '#',
      thProgTitle: 'Programa',
      thProgViews: 'Visualizações',
      thProgWatchTime: 'Tempo total',
      noPrograms: 'Ainda sem dados de programas.'
    },
    en: {
      titleStats: 'Statistics',
      kicker: 'Internal panel',
      mainTitle: 'Broadcast statistics',
      subtitle: 'Real-time audience view, access distribution, and recent visits.',
      metricCurrent: 'Watching now',
      metricTotal: 'Total visits',
      metric24h: 'Visits in last 24h',
      metricIps: 'Unique IPs in last 24h',
      footTotal: 'Since logging started',
      foot24h: 'Rolling window',
      footIps: 'Devices / origins',
      panelHourly: 'Visits by hour',
      panelHourlySub: 'Last 24 hours',
      panelBrowsers: 'Browsers',
      panelTopAccess: 'Top access',
      panelOs: 'Operating systems',
      panelCountries: 'Countries',
      panelOrigin: 'Access origin',
      panelCities: 'Cities',
      panelIsps: 'ISPs',
      panelRecent: 'Recent visits',
      panelRecentSub: 'Latest 25 accesses',
      thWhen: 'When',
      thBrowser: 'Browser',
      thSystem: 'System',
      thDevice: 'Device',
      thLocation: 'Location',
      thReferrer: 'Referrer',
      panelReferrers: 'Referrer',
      panelReferrersSub: 'Source sites',
      directAccess: 'Direct',
      totalLabel: 'Total',
      emptyData: 'Not enough data yet.',
      emptyVisits: 'No visits recorded.',
      updatedAt: 'Updated at',
      updating: 'Updating...',
      thWatchTime: 'Watch time',
      visitDetails: 'Details',
      visitorKicker: 'Visit details',
      visitorTitle: 'Visitor information',
      visitorIp: 'IP',
      visitorDates: 'Start / end / duration',
      visitorBrowser: 'Browser',
      visitorSystem: 'Operating system',
      visitorDevice: 'Device',
      visitorLocation: 'Location',
      visitorIsp: 'ISP',
      visitorReferrer: 'Referrer',
      visitorAccess: 'Access',
      visitorProgram: 'Watched program',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'In progress',
      visitorUnknown: 'Unknown',
      accessHome: 'Home page',
      accessEmbed: 'Embed',
      accessHls: 'HLS stream',
      panelTopPrograms: 'Most watched programs',
      panelTopProgramsSub: 'Top 5 titles',
      thProgRank: '#',
      thProgTitle: 'Program',
      thProgViews: 'Views',
      thProgWatchTime: 'Total watch time',
      noPrograms: 'No program data yet.'
    }
  };

  function getLang() {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
  }

  let currentLang = getLang();

  function locale() {
    return currentLang === 'en' ? 'en-US' : 'pt-BR';
  }

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('stats-kicker', t('kicker'));
    setText('stats-main-title', t('mainTitle'));
    setText('stats-subtitle', t('subtitle'));
    setText('metric-label-current', t('metricCurrent'));
    setText('metric-label-total', t('metricTotal'));
    setText('metric-label-24h', t('metric24h'));
    setText('metric-label-ips', t('metricIps'));
    setText('metric-foot-total', t('footTotal'));
    setText('metric-foot-24h', t('foot24h'));
    setText('metric-foot-ips', t('footIps'));
    setText('panel-hourly-title', t('panelHourly'));
    setText('panel-hourly-subtitle', t('panelHourlySub'));
    setText('panel-browsers-title', t('panelBrowsers'));
    setText('panel-browsers-subtitle', t('panelTopAccess'));
    setText('panel-os-title', t('panelOs'));
    setText('panel-os-subtitle', t('panelTopAccess'));
    setText('panel-countries-title', t('panelCountries'));
    setText('panel-countries-subtitle', t('panelOrigin'));
    setText('panel-cities-title', t('panelCities'));
    setText('panel-cities-subtitle', t('panelOrigin'));
    setText('panel-isps-title', t('panelIsps'));
    setText('panel-isps-subtitle', t('panelOrigin'));
    setText('panel-referrers-title', t('panelReferrers'));
    setText('panel-referrers-subtitle', t('panelReferrersSub'));
    setText('panel-recent-title', t('panelRecent'));
    setText('panel-recent-subtitle', t('panelRecentSub'));
    setText('th-when', t('thWhen'));
    setText('th-browser', t('thBrowser'));
    setText('th-system', t('thSystem'));
    setText('th-device', t('thDevice'));
    setText('th-location', t('thLocation'));
    setText('th-referrer', t('thReferrer'));
    setText('th-watch-time', t('thWatchTime'));
    setText('visitor-detail-kicker', t('visitorKicker'));
    setText('visitor-detail-title', t('visitorTitle'));
    setText('panel-top-programs-title', t('panelTopPrograms'));
    setText('panel-top-programs-subtitle', t('panelTopProgramsSub'));
    setText('th-prog-rank', t('thProgRank'));
    setText('th-prog-title', t('thProgTitle'));
    setText('th-prog-views', t('thProgViews'));
    setText('th-prog-watch-time', t('thProgWatchTime'));

    if (updatedAt && !updatedAt.textContent) {
      updatedAt.textContent = t('updating');
    }
  }

  async function applyChannelName() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      const channelName = String(data?.channelName || 'Webtv framework');
      document.title = `${channelName} — ${t('titleStats')}`;
    } catch (_) {
      document.title = `Webtv framework — ${t('titleStats')}`;
    }
  }

  function renderPieChart(container, items) {
    if (!items || !items.length) {
      container.innerHTML = `<p class="empty-state">${t('emptyData')}</p>`;
      return;
    }

    const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);
    if (!total) {
      container.innerHTML = `<p class="empty-state">${t('emptyData')}</p>`;
      return;
    }

    let cursor = 0;
    const slices = [];
    const legendRows = items.map((item, index) => {
      const value = Number(item.value || 0);
      const percentage = (value / total) * 100;
      const color = PIE_COLORS[index % PIE_COLORS.length];
      const start = cursor;
      const end = cursor + percentage;

      slices.push(`${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
      cursor = end;

      return `
        <div class="pie-legend-row">
          <span class="pie-legend-dot" style="background:${color}"></span>
          <span class="pie-legend-label">${escapeHtml(item.label)}</span>
          <span class="pie-legend-value">${value} (${percentage.toFixed(1)}%)</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="pie-layout">
        <div class="pie-chart" style="background: conic-gradient(${slices.join(', ')});">
          <div class="pie-hole">
            <small>${t('totalLabel')}</small>
            <strong>${total}</strong>
          </div>
        </div>
        <div class="pie-legend">
          ${legendRows}
        </div>
      </div>
    `;
  }

  function renderHourlyChart(series) {
    const max = Math.max(...(series.values || [0]), 1);

    hourlyChart.innerHTML = (series.labels || []).map((label, index) => {
      const value = series.values[index] || 0;
      const height = Math.max(8, (value / max) * 180);

      return `
        <div class="bar-item" title="${escapeHtml(label)}: ${value}">
          <div class="bar-value" style="height:${height}px"></div>
          <div class="bar-label">${escapeHtml(label)}</div>
        </div>
      `;
    }).join('');
  }

  function fmtWatchTime(secs) {
    const s = Number(secs);
    if (!s || s < 0) return '—';
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m < 60) return rem ? `${m}m ${rem}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM ? `${h}h ${remM}m` : `${h}h`;
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function fmtDateTime(iso) {
    if (!iso) return t('visitorUnknown');
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return t('visitorUnknown');
    return dt.toLocaleString(locale());
  }

  function getAccessLabel(accessType) {
    if (accessType === 'embed') return t('accessEmbed');
    if (accessType === 'hls_stream') return t('accessHls');
    return t('accessHome');
  }

  function closeVisitorDetail() {
    if (!visitorDetailOverlay) return;
    visitorDetailOverlay.hidden = true;
    visitorDetailOverlay.style.display = 'none';
    visitorDetailOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function openVisitorDetail(sessionId) {
    const visit = recentVisitsBySession.get(String(sessionId || ''));
    if (!visit || !visitorDetailOverlay || !visitorDetailBody) return;

    const start = fmtDateTime(visit.startedAt || visit.visitedAt);
    const end = visit.endedAt ? fmtDateTime(visit.endedAt) : t('visitorNotFinished');
    const duration = fmtWatchTime(visit.watchTimeSecs);
    const neighborhood = visit.neighborhood || t('visitorUnknown');
    const city = visit.city || t('visitorUnknown');
    const state = visit.state || t('visitorUnknown');
    const country = visit.country || t('visitorUnknown');
    const fullLocation = `${neighborhood}, ${city}, ${state}, ${country}`;

    const rows = [
      [t('visitorIp'), visit.ip || t('visitorUnknown')],
      [t('visitorDates'), `${start} / ${end} / ${duration}`],
      [t('visitorBrowser'), visit.browser || t('visitorUnknown')],
      [t('visitorSystem'), visit.operatingSystem || t('visitorUnknown')],
      [t('visitorDevice'), visit.device || t('visitorUnknown')],
      [t('visitorLocation'), fullLocation],
      [t('visitorIsp'), visit.isp || t('visitorUnknown')],
      [t('visitorReferrer'), visit.referrer || t('directAccess')],
      [t('visitorAccess'), getAccessLabel(visit.accessType)],
      [t('visitorProgram'), visit.currentProgram || t('visitorUnknown')],
      [t('visitorUserAgent'), visit.userAgent || t('visitorUnknown')],
    ];

    visitorDetailBody.innerHTML = rows.map(([label, value]) => `
      <div class="visitor-row">
        <span class="visitor-label">${escapeHtml(label)}</span>
        <span class="visitor-value">${escapeHtml(value)}</span>
      </div>
    `).join('');

    visitorDetailOverlay.hidden = false;
    visitorDetailOverlay.style.display = 'flex';
    visitorDetailOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function renderRecentVisits(items) {
    if (!items || !items.length) {
      recentVisits.innerHTML = `<tr><td colspan="8" class="empty-state">${t('emptyVisits')}</td></tr>`;
      recentVisitsBySession = new Map();
      return;
    }

    recentVisitsBySession = new Map((items || []).map((item) => [String(item.sessionId || ''), item]));

    recentVisits.innerHTML = items.map(item => `
      <tr>
        <td>${new Date(item.visitedAt).toLocaleString(locale())}</td>
        <td>${escapeHtml(item.ip)}</td>
        <td>${escapeHtml(item.browser)}</td>
        <td>${escapeHtml(item.operatingSystem)}</td>
        <td>${escapeHtml(item.device)}</td>
        <td>${escapeHtml(`${item.city}, ${item.state}, ${item.country}`)}</td>
        <td>${escapeHtml(item.referrer || t('directAccess'))}</td>
        <td class="watch-time-cell">
          <span>${fmtWatchTime(item.watchTimeSecs)}</span>
          <button class="visit-info-btn" type="button" data-session-id="${escapeAttr(item.sessionId)}" aria-label="${escapeAttr(t('visitDetails'))}" title="${escapeAttr(t('visitDetails'))}">i</button>
        </td>
      </tr>
    `).join('');

    recentVisits.querySelectorAll('.visit-info-btn').forEach((button) => {
      button.addEventListener('click', () => {
        openVisitorDetail(button.dataset.sessionId);
      });
    });
  }

  function renderTopPrograms(items) {
    const tbody = document.getElementById('top-programs-body');
    if (!tbody) return;
    if (!items || !items.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="empty-state">${t('noPrograms')}</td></tr>`;
      return;
    }
    tbody.innerHTML = items.map((item, index) => `
      <tr>
        <td class="prog-rank">${index + 1}</td>
        <td>${escapeHtml(item.title)}</td>
        <td>${item.views}</td>
        <td class="watch-time-cell">${fmtWatchTime(item.totalWatchSecs)}</td>
      </tr>
    `).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadSummary() {
    const response = await fetch('/api/analytics/summary');
    const data = await response.json();

    currentViewers.textContent = data.currentViewers;
    totalVisits.textContent = data.totalVisits;
    visits24h.textContent = data.visitsLast24Hours;
    uniqueIps.textContent = data.uniqueIpsLast24Hours;
    updatedAt.textContent = `${t('updatedAt')} ${new Date().toLocaleTimeString(locale())}`;

    renderHourlyChart(data.hourlyVisits || { labels: [], values: [] });
    renderPieChart(topBrowsers, data.topBrowsers);
    renderPieChart(topOs, data.topOperatingSystems);
    renderPieChart(topCountries, data.topCountries);
    renderPieChart(topCities, data.topCities);
    renderPieChart(topIsps, data.topIsps);
    renderPieChart(topReferrers, data.topReferrers);
    renderRecentVisits(data.recentVisits);
    renderTopPrograms(data.topPrograms || []);
  }

  applyStaticTranslations();
  applyChannelName();
  closeVisitorDetail();
  if (visitorDetailClose) {
    visitorDetailClose.addEventListener('click', closeVisitorDetail);
  }
  if (visitorDetailOverlay) {
    visitorDetailOverlay.addEventListener('click', (event) => {
      if (event.target === visitorDetailOverlay) {
        closeVisitorDetail();
      }
    });
  }
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeVisitorDetail();
    }
  });
  loadSummary().catch(console.error);
  setInterval(() => loadSummary().catch(console.error), 10000);
})();