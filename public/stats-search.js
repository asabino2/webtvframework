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
    },
    es: {
      title: 'Búsqueda de accesos',
      kicker: 'Panel interno',
      mainTitle: 'Búsqueda de accesos',
      subtitle: 'Filtra los accesos por período, ubicación y dispositivo con el mismo nivel de detalle que las visitas recientes.',
      filtersTitle: 'Filtros',
      back: 'Volver a estadísticas',
      fromDate: 'Fecha inicial',
      toDate: 'Fecha final',
      country: 'País',
      state: 'Estado',
      city: 'Ciudad',
      device: 'Tipo de dispositivo',
      os: 'Sistema operativo',
      browser: 'Navegador/App',
      search: 'Buscar accesos',
      clear: 'Limpiar filtros',
      resultsTitle: 'Resultados de búsqueda',
      loading: 'Cargando...',
      searching: 'Buscando...',
      statusFound: '{total} accesos encontrados. Mostrando {returned} registros.',
      statusNoResult: 'No se encontraron accesos para los filtros seleccionados.',
      emptyVisits: 'Sin visitas registradas.',
      directAccess: 'Directo',
      visitDetails: 'Detalles',
      thWhen: 'Cuándo',
      thBrowser: 'Navegador/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Ubicación',
      thAccess: 'Acceso',
      thReferrer: 'Referrer',
      thWatchTime: 'Tiempo de visualización',
      visitorKicker: 'Detalles de la visita',
      visitorTitle: 'Información del visitante',
      visitorIp: 'IP',
      visitorDates: 'Inicio / fin / duración',
      visitorBrowser: 'Navegador',
      visitorSystem: 'Sistema operativo',
      visitorDevice: 'Dispositivo',
      visitorLocation: 'Ubicación',
      visitorIsp: 'ISP',
      visitorReferrer: 'Referrer',
      visitorAccess: 'Acceso',
      visitorVpn: 'VPN',
      visitorProgram: 'Programa visto',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'En progreso',
      visitorUnknown: 'Desconocido',
      visitorVpnOff: 'No',
      visitorVpnOn: 'Sí',
      visitorVpnOnUnknown: 'Sí (Proveedor desconocido)',
      accessHome: 'Página de inicio',
      accessEmbed: 'Embed',
      accessHls: 'Stream HLS'
    },
    ru: {
      title: 'Поиск доступов',
      kicker: 'Внутренняя панель',
      mainTitle: 'Поиск доступов',
      subtitle: 'Фильтруйте доступы по периоду, местоположению и устройству с тем же уровнем детализации, что и недавние посещения.',
      filtersTitle: 'Фильтры',
      back: 'Вернуться к статистике',
      fromDate: 'Дата начала',
      toDate: 'Дата окончания',
      country: 'Страна',
      state: 'Штат',
      city: 'Город',
      device: 'Тип устройства',
      os: 'Операционная система',
      browser: 'Браузер/App',
      search: 'Поиск доступов',
      clear: 'Очистить фильтры',
      resultsTitle: 'Результаты поиска',
      loading: 'Загрузка...',
      searching: 'Поиск...',
      statusFound: 'Найдено {total} доступов. Отображается {returned} записей.',
      statusNoResult: 'Не найдено доступов по выбранным фильтрам.',
      emptyVisits: 'Нет записанных посещений.',
      directAccess: 'Прямой',
      visitDetails: 'Подробности',
      thWhen: 'Когда',
      thBrowser: 'Браузер/App',
      thSystem: 'Система',
      thDevice: 'Устройство',
      thLocation: 'Местоположение',
      thAccess: 'Доступ',
      thReferrer: 'Referrer',
      thWatchTime: 'Время просмотра',
      visitorKicker: 'Сведения о посещении',
      visitorTitle: 'Информация о посетителе',
      visitorIp: 'IP',
      visitorDates: 'Начало / конец / продолжительность',
      visitorBrowser: 'Браузер',
      visitorSystem: 'Операционная система',
      visitorDevice: 'Устройство',
      visitorLocation: 'Местоположение',
      visitorIsp: 'ISP',
      visitorReferrer: 'Referrer',
      visitorAccess: 'Доступ',
      visitorVpn: 'VPN',
      visitorProgram: 'Просмотренная программа',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'В процессе',
      visitorUnknown: 'Неизвестно',
      visitorVpnOff: 'Нет',
      visitorVpnOn: 'Да',
      visitorVpnOnUnknown: 'Да (Неизвестный провайдер)',
      accessHome: 'Главная страница',
      accessEmbed: 'Embed',
      accessHls: 'HLS поток'
    },
    zh: {
      title: '访问搜索',
      kicker: '内部面板',
      mainTitle: '访问搜索',
      subtitle: '按时期、位置和设备过滤访问，具有与最近访问相同的详细程度。',
      filtersTitle: '过滤器',
      back: '返回统计数据',
      fromDate: '开始日期',
      toDate: '结束日期',
      country: '国家',
      state: '状态',
      city: '城市',
      device: '设备类型',
      os: '操作系统',
      browser: '浏览器/应用',
      search: '搜索访问',
      clear: '清除过滤器',
      resultsTitle: '搜索结果',
      loading: '加载中...',
      searching: '搜索中...',
      statusFound: '找到{total}个访问。显示{returned}条记录。',
      statusNoResult: '未找到与所选过滤器匹配的访问。',
      emptyVisits: '没有记录的访问。',
      directAccess: '直接',
      visitDetails: '详情',
      thWhen: '何时',
      thBrowser: '浏览器/应用',
      thSystem: '系统',
      thDevice: '设备',
      thLocation: '位置',
      thAccess: '访问',
      thReferrer: '来源',
      thWatchTime: '观看时间',
      visitorKicker: '访问详情',
      visitorTitle: '访客信息',
      visitorIp: 'IP',
      visitorDates: '开始 / 结束 / 持续时间',
      visitorBrowser: '浏览器',
      visitorSystem: '操作系统',
      visitorDevice: '设备',
      visitorLocation: '位置',
      visitorIsp: '互联网服务提供商',
      visitorReferrer: '来源',
      visitorAccess: '访问',
      visitorVpn: 'VPN',
      visitorProgram: '观看的节目',
      visitorUserAgent: '用户代理',
      visitorNotFinished: '进行中',
      visitorUnknown: '未知',
      visitorVpnOff: '否',
      visitorVpnOn: '是',
      visitorVpnOnUnknown: '是（未知提供商）',
      accessHome: '主页',
      accessEmbed: 'Embed',
      accessHls: 'HLS流'
    },
    pl: {
      title: 'Wyszukiwanie dostępów',
      kicker: 'Panel wewnętrzny',
      mainTitle: 'Wyszukiwanie dostępów',
      subtitle: 'Filtruj dostępy według okresu, lokalizacji i urządzenia z takim samym poziomem szczegółowości jak ostatnie wizyty.',
      filtersTitle: 'Filtry',
      back: 'Wróć do statystyki',
      fromDate: 'Data początkowa',
      toDate: 'Data końcowa',
      country: 'Kraj',
      state: 'Województwo',
      city: 'Miasto',
      device: 'Typ urządzenia',
      os: 'System operacyjny',
      browser: 'Przeglądarka/Aplikacja',
      search: 'Wyszukaj dostępy',
      clear: 'Wyczyść filtry',
      resultsTitle: 'Wyniki wyszukiwania',
      loading: 'Ładowanie...',
      searching: 'Wyszukiwanie...',
      statusFound: 'Znaleziono {total} dostępów. Wyświetlanie {returned} rekordów.',
      statusNoResult: 'Nie znaleziono dostępów dla wybranych filtrów.',
      emptyVisits: 'Brak zarejestrowanych wizyt.',
      directAccess: 'Bezpośredni',
      visitDetails: 'Szczegóły',
      thWhen: 'Kiedy',
      thBrowser: 'Przeglądarka/Aplikacja',
      thSystem: 'System',
      thDevice: 'Urządzenie',
      thLocation: 'Lokalizacja',
      thAccess: 'Dostęp',
      thReferrer: 'Źródło',
      thWatchTime: 'Czas oglądania',
      visitorKicker: 'Szczegóły wizyty',
      visitorTitle: 'Informacje o odwiedzającym',
      visitorIp: 'IP',
      visitorDates: 'Początek / koniec / czas trwania',
      visitorBrowser: 'Przeglądarka',
      visitorSystem: 'System operacyjny',
      visitorDevice: 'Urządzenie',
      visitorLocation: 'Lokalizacja',
      visitorIsp: 'Dostawca',
      visitorReferrer: 'Źródło',
      visitorAccess: 'Dostęp',
      visitorVpn: 'VPN',
      visitorProgram: 'Oglądany program',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'W trakcie',
      visitorUnknown: 'Nieznany',
      visitorVpnOff: 'Nie',
      visitorVpnOn: 'Tak',
      visitorVpnOnUnknown: 'Tak (Nieznany dostawca)',
      accessHome: 'Strona główna',
      accessEmbed: 'Embed',
      accessHls: 'Strumień HLS'
    },
    it: {
      title: 'Ricerca accessi',
      kicker: 'Pannello interno',
      mainTitle: 'Ricerca accessi',
      subtitle: 'Filtra gli accessi per periodo, ubicazione e dispositivo con lo stesso livello di dettaglio delle visite recenti.',
      filtersTitle: 'Filtri',
      back: 'Torna alle statistiche',
      fromDate: 'Data iniziale',
      toDate: 'Data finale',
      country: 'Paese',
      state: 'Stato',
      city: 'Città',
      device: 'Tipo di dispositivo',
      os: 'Sistema operativo',
      browser: 'Browser/App',
      search: 'Ricerca accessi',
      clear: 'Cancella filtri',
      resultsTitle: 'Risultati della ricerca',
      loading: 'Caricamento...',
      searching: 'Ricerca in corso...',
      statusFound: '{total} accessi trovati. Visualizzazione di {returned} record.',
      statusNoResult: 'Nessun accesso trovato per i filtri selezionati.',
      emptyVisits: 'Nessuna visita registrata.',
      directAccess: 'Diretto',
      visitDetails: 'Dettagli',
      thWhen: 'Quando',
      thBrowser: 'Browser/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Posizione',
      thAccess: 'Accesso',
      thReferrer: 'Provenienza',
      thWatchTime: 'Tempo di visualizzazione',
      visitorKicker: 'Dettagli della visita',
      visitorTitle: 'Informazioni del visitatore',
      visitorIp: 'IP',
      visitorDates: 'Inizio / fine / durata',
      visitorBrowser: 'Browser',
      visitorSystem: 'Sistema operativo',
      visitorDevice: 'Dispositivo',
      visitorLocation: 'Posizione',
      visitorIsp: 'ISP',
      visitorReferrer: 'Provenienza',
      visitorAccess: 'Accesso',
      visitorVpn: 'VPN',
      visitorProgram: 'Programma visualizzato',
      visitorUserAgent: 'User-agent',
      visitorNotFinished: 'In corso',
      visitorUnknown: 'Sconosciuto',
      visitorVpnOff: 'No',
      visitorVpnOn: 'Sì',
      visitorVpnOnUnknown: 'Sì (Provider sconosciuto)',
      accessHome: 'Pagina iniziale',
      accessEmbed: 'Embed',
      accessHls: 'Flusso HLS'
    },
    de: {
      title: 'Zugriffsssuche',
      kicker: 'Internes Panel',
      mainTitle: 'Zugriffsssuche',
      subtitle: 'Filtern Sie Zugriffe nach Zeitraum, Ort und Gerät mit dem gleichen Detaillierungsgrad wie aktuelle Besuche.',
      filtersTitle: 'Filter',
      back: 'Zurück zu Statistiken',
      fromDate: 'Startdatum',
      toDate: 'Enddatum',
      country: 'Land',
      state: 'Bundesland',
      city: 'Stadt',
      device: 'Gerätetyp',
      os: 'Betriebssystem',
      browser: 'Browser/App',
      search: 'Zugriffe durchsuchen',
      clear: 'Filter löschen',
      resultsTitle: 'Suchergebnisse',
      loading: 'Wird geladen...',
      searching: 'Wird durchsucht...',
      statusFound: '{total} Zugriffe gefunden. {returned} Datensätze werden angezeigt.',
      statusNoResult: 'Keine Zugriffe für die ausgewählten Filter gefunden.',
      emptyVisits: 'Keine registrierten Besuche.',
      directAccess: 'Direkt',
      visitDetails: 'Details',
      thWhen: 'Wann',
      thBrowser: 'Browser/App',
      thSystem: 'System',
      thDevice: 'Gerät',
      thLocation: 'Ort',
      thAccess: 'Zugriff',
      thReferrer: 'Quelle',
      thWatchTime: 'Ansichtsdauer',
      visitorKicker: 'Besuchsdetails',
      visitorTitle: 'Besucherinformation',
      visitorIp: 'IP',
      visitorDates: 'Anfang / Ende / Dauer',
      visitorBrowser: 'Browser',
      visitorSystem: 'Betriebssystem',
      visitorDevice: 'Gerät',
      visitorLocation: 'Ort',
      visitorIsp: 'ISP',
      visitorReferrer: 'Quelle',
      visitorAccess: 'Zugriff',
      visitorVpn: 'VPN',
      visitorProgram: 'Angesehenes Programm',
      visitorUserAgent: 'User-Agent',
      visitorNotFinished: 'In Bearbeitung',
      visitorUnknown: 'Unbekannt',
      visitorVpnOff: 'Nein',
      visitorVpnOn: 'Ja',
      visitorVpnOnUnknown: 'Ja (Unbekannter Anbieter)',
      accessHome: 'Startseite',
      accessEmbed: 'Embed',
      accessHls: 'HLS-Stream'
    }
  };

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();

  function locale() {
    const localeMap = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'pl': 'pl-PL',
      'it': 'it-IT',
      'de': 'de-DE'
    };
    return localeMap[currentLang] || 'pt-BR';
  }

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyStaticTranslations() {
    const localeMap = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'pl': 'pl-PL',
      'it': 'it-IT',
      'de': 'de-DE'
    };
    document.documentElement.lang = localeMap[currentLang] || 'pt-BR';

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
