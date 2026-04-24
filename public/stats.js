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
  const PIE_COLORS = ['#f4b338', '#38d9a9', '#4dabf7', '#b197fc', '#ff8787', '#ffa94d', '#94d82d', '#66d9e8'];

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

  function renderRecentVisits(items) {
    if (!items || !items.length) {
      recentVisits.innerHTML = `<tr><td colspan="7" class="empty-state">${t('emptyVisits')}</td></tr>`;
      return;
    }

    recentVisits.innerHTML = items.map(item => `
      <tr>
        <td>${new Date(item.visitedAt).toLocaleString(locale())}</td>
        <td>${escapeHtml(item.ip)}</td>
        <td>${escapeHtml(item.browser)}</td>
        <td>${escapeHtml(item.operatingSystem)}</td>
        <td>${escapeHtml(item.device)}</td>
        <td>${escapeHtml(`${item.city}, ${item.state}, ${item.country}`)}</td>
        <td>${escapeHtml(item.referrer || t('directAccess'))}</td>
        <td class="watch-time-cell">${fmtWatchTime(item.watchTimeSecs)}</td>
      </tr>
    `).join('');
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
    renderPieChart(topReferrers, data.topReferrers);
    renderRecentVisits(data.recentVisits);
    renderTopPrograms(data.topPrograms || []);
  }

  applyStaticTranslations();
  applyChannelName();
  loadSummary().catch(console.error);
  setInterval(() => loadSummary().catch(console.error), 10000);
})();