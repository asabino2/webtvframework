(function () {
  'use strict';

  const LANG_KEY = 'webtv_lang';
  const form = document.getElementById('search-form');
  const searchStatus = document.getElementById('search-status');
  const searchVisits = document.getElementById('search-visits');
  const clearButton = document.getElementById('search-clear');
  const visitorDetailOverlay = document.getElementById('visitor-detail-overlay');
  const visitorDetailClose = document.getElementById('visitor-detail-close');
  const visitorDetailBody = document.getElementById('visitor-detail-body');

  let recentVisitsBySession = new Map();

  const i18n = {
    pt: {
      title: 'Pesquisa de acessos',
      kicker: 'Painel interno',
      mainTitle: 'Pesquisa de acessos',
      subtitle: 'Filtre os acessos por periodo, localizacao e dispositivo mantendo o mesmo detalhamento da lista de visitas recentes.',
      filtersTitle: 'Filtros',
      back: 'Voltar para estatisticas',
      fromDate: 'Data inicial',
      toDate: 'Data final',
      country: 'Pais',
      state: 'Estado',
      city: 'Cidade',
      device: 'Tipo de dispositivo',
      os: 'Sistema operacional',
      browser: 'Navegador/App',
      search: 'Buscar acessos',
      clear: 'Limpar filtros',
      resultsTitle: 'Resultado da pesquisa',
      loading: 'Carregando...',
      searching: 'Pesquisando...',
      statusFound: 'Encontrados {total} acessos. Exibindo {returned} registros.',
      statusNoResult: 'Nenhum acesso encontrado com os filtros informados.',
      emptyVisits: 'Nenhuma visita registrada.',
      directAccess: 'Direto',
      visitDetails: 'Detalhes',
      thWhen: 'Quando',
      thBrowser: 'Navegador/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Localizacao',
      thAccess: 'Acesso',
      thReferrer: 'Referrer',
      thWatchTime: 'Tempo assistido',
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
      visitorVpn: 'VPN',
      visitorProgram: 'Atracao assistida',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'Em andamento',
      visitorUnknown: 'Desconhecido',
      visitorVpnOff: 'Nao',
      visitorVpnOn: 'Sim',
      visitorVpnOnUnknown: 'Sim (Nao identificado)',
      accessHome: 'Pagina inicial',
      accessEmbed: 'Embed',
      accessHls: 'Stream HLS'
    },
    en: {
      title: 'Access search',
      kicker: 'Internal panel',
      mainTitle: 'Access search',
      subtitle: 'Filter accesses by period, location and device with the same detail level as recent visits.',
      filtersTitle: 'Filters',
      back: 'Back to statistics',
      fromDate: 'Start date',
      toDate: 'End date',
      country: 'Country',
      state: 'State',
      city: 'City',
      device: 'Device type',
      os: 'Operating system',
      browser: 'Browser/App',
      search: 'Search accesses',
      clear: 'Clear filters',
      resultsTitle: 'Search results',
      loading: 'Loading...',
      searching: 'Searching...',
      statusFound: '{total} accesses found. Showing {returned} records.',
      statusNoResult: 'No accesses found for the selected filters.',
      emptyVisits: 'No visits recorded.',
      directAccess: 'Direct',
      visitDetails: 'Details',
      thWhen: 'When',
      thBrowser: 'Browser/App',
      thSystem: 'System',
      thDevice: 'Device',
      thLocation: 'Location',
      thAccess: 'Access',
      thReferrer: 'Referrer',
      thWatchTime: 'Watch time',
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
      visitorVpn: 'VPN',
      visitorProgram: 'Watched program',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'In progress',
      visitorUnknown: 'Unknown',
      visitorVpnOff: 'No',
      visitorVpnOn: 'Yes',
      visitorVpnOnUnknown: 'Yes (Unknown provider)',
      accessHome: 'Home page',
      accessEmbed: 'Embed',
      accessHls: 'HLS stream'
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

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';

    setText('search-kicker', t('kicker'));
    setText('search-main-title', t('mainTitle'));
    setText('search-subtitle', t('subtitle'));
    setText('search-filters-title', t('filtersTitle'));
    setText('search-back-link', t('back'));
    setText('label-from-date', t('fromDate'));
    setText('label-to-date', t('toDate'));
    setText('label-country', t('country'));
    setText('label-state', t('state'));
    setText('label-city', t('city'));
    setText('label-device', t('device'));
    setText('label-os', t('os'));
    setText('label-browser', t('browser'));
    setText('search-submit', t('search'));
    setText('search-clear', t('clear'));
    setText('search-results-title', t('resultsTitle'));

    setText('th-when', t('thWhen'));
    setText('th-browser', t('thBrowser'));
    setText('th-system', t('thSystem'));
    setText('th-device-col', t('thDevice'));
    setText('th-location', t('thLocation'));
    setText('th-access', t('thAccess'));
    setText('th-referrer', t('thReferrer'));
    setText('th-watch-time', t('thWatchTime'));

    setText('visitor-detail-kicker', t('visitorKicker'));
    setText('visitor-detail-title', t('visitorTitle'));

    if (searchStatus && !searchStatus.textContent) {
      searchStatus.textContent = t('loading');
    }
  }

  async function applyChannelName() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      const channelName = String(data?.channelName || 'Webtv framework');
      document.title = `${channelName} — ${t('title')}`;
    } catch (_) {
      document.title = `Webtv framework — ${t('title')}`;
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
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

  function getVpnLabel(visit) {
    if (!visit?.vpnDetected) return t('visitorVpnOff');
    const provider = String(visit.vpnProvider || '').trim();
    if (!provider) return t('visitorVpnOnUnknown');
    return `${t('visitorVpnOn')} (${provider})`;
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
      [t('visitorVpn'), getVpnLabel(visit)],
      [t('visitorProgram'), visit.currentProgram || t('visitorUnknown')],
      [t('visitorUserAgent'), visit.userAgent || t('visitorUnknown')]
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

  function renderVisits(items) {
    if (!items || !items.length) {
      searchVisits.innerHTML = `<tr><td colspan="9" class="empty-state">${t('emptyVisits')}</td></tr>`;
      recentVisitsBySession = new Map();
      return;
    }

    recentVisitsBySession = new Map((items || []).map((item) => [String(item.sessionId || ''), item]));

    searchVisits.innerHTML = items.map((item) => `
      <tr>
        <td>${new Date(item.visitedAt).toLocaleString(locale())}</td>
        <td>${escapeHtml(item.ip)}</td>
        <td>${escapeHtml(item.browser)}</td>
        <td>${escapeHtml(item.operatingSystem)}</td>
        <td>${escapeHtml(item.device)}</td>
        <td>${escapeHtml(`${item.city}, ${item.state}, ${item.country}`)}</td>
        <td>${escapeHtml(getAccessLabel(item.accessType))}</td>
        <td>${escapeHtml(item.referrer || t('directAccess'))}</td>
        <td class="watch-time-cell">
          <span>${fmtWatchTime(item.watchTimeSecs)}</span>
          <button class="visit-info-btn" type="button" data-session-id="${escapeAttr(item.sessionId)}" aria-label="${escapeAttr(t('visitDetails'))}" title="${escapeAttr(t('visitDetails'))}">i</button>
        </td>
      </tr>
    `).join('');

    searchVisits.querySelectorAll('.visit-info-btn').forEach((button) => {
      button.addEventListener('click', () => {
        openVisitorDetail(button.dataset.sessionId);
      });
    });
  }

  function updateStatus(totalMatched, returned) {
    if (!searchStatus) return;
    if (!totalMatched) {
      searchStatus.textContent = t('statusNoResult');
      return;
    }
    searchStatus.textContent = t('statusFound')
      .replace('{total}', String(totalMatched))
      .replace('{returned}', String(returned));
  }

  function getFiltersFromForm() {
    const fd = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of fd.entries()) {
      const normalized = String(value || '').trim();
      if (normalized) {
        params.set(key, normalized);
      }
    }

    params.set('limit', '500');
    return params;
  }

  function formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function applyDefaultDateRange() {
    if (!form) return;
    const fromInput = form.querySelector('input[name="fromDate"]');
    const toInput = form.querySelector('input[name="toDate"]');
    if (!fromInput || !toInput) return;

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 3);

    fromInput.value = formatDateInputValue(start);
    toInput.value = formatDateInputValue(now);
  }

  async function loadSearch() {
    if (searchStatus) {
      searchStatus.textContent = t('searching');
    }

    const params = getFiltersFromForm();
    const response = await fetch(`/api/analytics/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar acessos filtrados.');
    }

    const data = await response.json();
    renderVisits(data.visits || []);
    updateStatus(Number(data.totalMatched || 0), Number(data.returned || 0));
  }

  applyStaticTranslations();
  applyChannelName();
  closeVisitorDetail();
  applyDefaultDateRange();

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      loadSearch().catch((error) => {
        if (searchStatus) {
          searchStatus.textContent = error?.message || 'Erro ao carregar os acessos.';
        }
      });
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      form.reset();
      loadSearch().catch((error) => {
        if (searchStatus) {
          searchStatus.textContent = error?.message || 'Erro ao carregar os acessos.';
        }
      });
    });
  }

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

  loadSearch().catch((error) => {
    if (searchStatus) {
      searchStatus.textContent = error?.message || 'Erro ao carregar os acessos.';
    }
  });
})();
