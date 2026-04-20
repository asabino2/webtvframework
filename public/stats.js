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
      emptyData: 'Ainda sem dados suficientes.',
      emptyVisits: 'Nenhuma visita registrada.',
      updatedAt: 'Atualizado as',
      updating: 'Atualizando...'
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
      emptyData: 'Not enough data yet.',
      emptyVisits: 'No visits recorded.',
      updatedAt: 'Updated at',
      updating: 'Updating...'
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
    setText('panel-recent-title', t('panelRecent'));
    setText('panel-recent-subtitle', t('panelRecentSub'));
    setText('th-when', t('thWhen'));
    setText('th-browser', t('thBrowser'));
    setText('th-system', t('thSystem'));
    setText('th-device', t('thDevice'));
    setText('th-location', t('thLocation'));

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

  function renderPills(container, items) {
    if (!items || !items.length) {
      container.innerHTML = `<p class="empty-state">${t('emptyData')}</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="pill">
        <b>${escapeHtml(item.label)}</b>
        <span>${item.value}</span>
      </div>
    `).join('');
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

  function renderRecentVisits(items) {
    if (!items || !items.length) {
      recentVisits.innerHTML = `<tr><td colspan="6" class="empty-state">${t('emptyVisits')}</td></tr>`;
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
    renderPills(topBrowsers, data.topBrowsers);
    renderPills(topOs, data.topOperatingSystems);
    renderPills(topCountries, data.topCountries);
    renderPills(topCities, data.topCities);
    renderRecentVisits(data.recentVisits);
  }

  applyStaticTranslations();
  applyChannelName();
  loadSummary().catch(console.error);
  setInterval(() => loadSummary().catch(console.error), 10000);
})();