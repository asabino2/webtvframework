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
      panelBrowsers: 'Navegador/App',
      panelTopAccess: 'Top acessos',
      panelOs: 'Sistemas operacionais',
      panelCountries: 'Paises',
      panelOrigin: 'Origem dos acessos',
      panelCities: 'Cidades',
      panelIsps: 'ISPs',
      panelRecent: 'Visitas recentes',
      panelRecentSub: 'Ultimos 25 acessos',
      searchAccesses: 'Pesquisar acessos',
      thWhen: 'Quando',
      thBrowser: 'Navegador/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Localizacao',
      thAccess: 'Acesso',
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
      panelBrowsers: 'Browser/App',
      panelTopAccess: 'Top access',
      panelOs: 'Operating systems',
      panelCountries: 'Countries',
      panelOrigin: 'Access origin',
      panelCities: 'Cities',
      panelIsps: 'ISPs',
      panelRecent: 'Recent visits',
      panelRecentSub: 'Latest 25 accesses',
      searchAccesses: 'Search accesses',
      thWhen: 'When',
      thBrowser: 'Browser/App',
      thSystem: 'System',
      thDevice: 'Device',
      thLocation: 'Location',
      thAccess: 'Access',
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
      accessHls: 'HLS stream',
      panelTopPrograms: 'Most watched programs',
      panelTopProgramsSub: 'Top 5 titles',
      thProgRank: '#',
      thProgTitle: 'Program',
      thProgViews: 'Views',
      thProgWatchTime: 'Total watch time',
      noPrograms: 'No program data yet.'
    },
    es: {
      titleStats: 'Estadísticas',
      kicker: 'Panel interno',
      mainTitle: 'Estadísticas de transmisión',
      subtitle: 'Vista en tiempo real de la audiencia, distribución de accesos y visitas recientes.',
      metricCurrent: 'Viendo ahora',
      metricTotal: 'Visitas totales',
      metric24h: 'Visitas en últimas 24h',
      metricIps: 'IPs únicos en últimas 24h',
      footTotal: 'Desde que comenzó el registro',
      foot24h: 'Ventana móvil',
      footIps: 'Dispositivos / orígenes',
      panelHourly: 'Accesos por hora',
      panelHourlySub: 'Últimas 24 horas',
      panelBrowsers: 'Navegador/App',
      panelTopAccess: 'Accesos principales',
      panelOs: 'Sistemas operativos',
      panelCountries: 'Países',
      panelOrigin: 'Origen de accesos',
      panelCities: 'Ciudades',
      panelIsps: 'ISPs',
      panelRecent: 'Visitas recientes',
      panelRecentSub: 'Últimos 25 accesos',
      searchAccesses: 'Buscar accesos',
      thWhen: 'Cuándo',
      thBrowser: 'Navegador/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Ubicación',
      thAccess: 'Acceso',
      thReferrer: 'Referrer',
      panelReferrers: 'Referrer',
      panelReferrersSub: 'Sitios de origen',
      directAccess: 'Directo',
      totalLabel: 'Total',
      emptyData: 'Sin datos suficientes aún.',
      emptyVisits: 'Sin visitas registradas.',
      updatedAt: 'Actualizado a las',
      updating: 'Actualizando...',
      thWatchTime: 'Tiempo de visualización',
      visitDetails: 'Detalles',
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
      accessHls: 'Stream HLS',
      panelTopPrograms: 'Programas más vistos',
      panelTopProgramsSub: 'Top 5 títulos',
      thProgRank: '#',
      thProgTitle: 'Programa',
      thProgViews: 'Vistas',
      thProgWatchTime: 'Tiempo total de visualización',
      noPrograms: 'Sin datos de programas aún.'
    },
    ru: {
      titleStats: 'Статистика',
      kicker: 'Внутренняя панель',
      mainTitle: 'Статистика трансляции',
      subtitle: 'Просмотр аудитории в реальном времени, распределение доступа и недавние посещения.',
      metricCurrent: 'Смотрит сейчас',
      metricTotal: 'Всего посещений',
      metric24h: 'Посещений за последние 24 часа',
      metricIps: 'Уникальные IP за последние 24 часа',
      footTotal: 'С начала логирования',
      foot24h: 'Скользящее окно',
      footIps: 'Устройства / источники',
      panelHourly: 'Посещения по часам',
      panelHourlySub: 'Последние 24 часа',
      panelBrowsers: 'Браузер/App',
      panelTopAccess: 'Лучшие доступы',
      panelOs: 'Операционные системы',
      panelCountries: 'Страны',
      panelOrigin: 'Источник доступа',
      panelCities: 'Города',
      panelIsps: 'ISP',
      panelRecent: 'Недавние посещения',
      panelRecentSub: 'Последние 25 доступов',
      searchAccesses: 'Поиск доступов',
      thWhen: 'Когда',
      thBrowser: 'Браузер/App',
      thSystem: 'Система',
      thDevice: 'Устройство',
      thLocation: 'Местоположение',
      thAccess: 'Доступ',
      thReferrer: 'Referrer',
      panelReferrers: 'Referrer',
      panelReferrersSub: 'Исходные сайты',
      directAccess: 'Прямой',
      totalLabel: 'Итого',
      emptyData: 'Недостаточно данных.',
      emptyVisits: 'Нет записанных посещений.',
      updatedAt: 'Обновлено в',
      updating: 'Обновление...',
      thWatchTime: 'Время просмотра',
      visitDetails: 'Подробности',
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
      accessHls: 'HLS поток',
      panelTopPrograms: 'Самые просматриваемые программы',
      panelTopProgramsSub: 'Топ 5 заголовков',
      thProgRank: '#',
      thProgTitle: 'Программа',
      thProgViews: 'Просмотры',
      thProgWatchTime: 'Общее время просмотра',
      noPrograms: 'Нет данных о программах.'
    },
    zh: {
      titleStats: '统计数据',
      kicker: '内部面板',
      mainTitle: '直播统计',
      subtitle: '实时观众视图、访问分布和最近访问。',
      metricCurrent: '正在观看',
      metricTotal: '总访问次数',
      metric24h: '最近24小时的访问次数',
      metricIps: '最近24小时的唯一IP',
      footTotal: '自日志开始以来',
      foot24h: '滚动窗口',
      footIps: '设备 / 来源',
      panelHourly: '按小时访问',
      panelHourlySub: '最近24小时',
      panelBrowsers: '浏览器/应用',
      panelTopAccess: '热门访问',
      panelOs: '操作系统',
      panelCountries: '国家',
      panelOrigin: '访问来源',
      panelCities: '城市',
      panelIsps: '互联网服务提供商',
      panelRecent: '最近访问',
      panelRecentSub: '最新25次访问',
      searchAccesses: '搜索访问',
      thWhen: '何时',
      thBrowser: '浏览器/应用',
      thSystem: '系统',
      thDevice: '设备',
      thLocation: '位置',
      thAccess: '访问',
      thReferrer: '来源',
      panelReferrers: '来源',
      panelReferrersSub: '源网站',
      directAccess: '直接',
      totalLabel: '总计',
      emptyData: '数据不足。',
      emptyVisits: '没有记录的访问。',
      updatedAt: '更新时间',
      updating: '更新中...',
      thWatchTime: '观看时间',
      visitDetails: '详情',
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
      accessHls: 'HLS流',
      panelTopPrograms: '最受欢迎的节目',
      panelTopProgramsSub: '前5名标题',
      thProgRank: '#',
      thProgTitle: '节目',
      thProgViews: '浏览次数',
      thProgWatchTime: '总观看时间',
      noPrograms: '暂无节目数据。'
    },
    pl: {
      titleStats: 'Statystyka',
      kicker: 'Panel wewnętrzny',
      mainTitle: 'Statystyka transmisji',
      subtitle: 'Widok publiczności w czasie rzeczywistym, rozkład dostępu i ostatnie wizyty.',
      metricCurrent: 'Ogląda teraz',
      metricTotal: 'Łączna liczba wizyt',
      metric24h: 'Wizyty w ciągu ostatnich 24 godzin',
      metricIps: 'Unikatowe adresy IP w ciągu ostatnich 24 godzin',
      footTotal: 'Od rozpoczęcia rejestracji',
      foot24h: 'Okno przesuwne',
      footIps: 'Urządzenia / źródła',
      panelHourly: 'Odwiedziny na godzinę',
      panelHourlySub: 'Ostatnie 24 godziny',
      panelBrowsers: 'Przeglądarka/Aplikacja',
      panelTopAccess: 'Najlepsze dostępy',
      panelOs: 'Systemy operacyjne',
      panelCountries: 'Kraje',
      panelOrigin: 'Źródło dostępu',
      panelCities: 'Miasta',
      panelIsps: 'Dostawcy',
      panelRecent: 'Ostatnie wizyty',
      panelRecentSub: 'Ostatnie 25 dostępów',
      searchAccesses: 'Wyszukaj dostępy',
      thWhen: 'Kiedy',
      thBrowser: 'Przeglądarka/Aplikacja',
      thSystem: 'System',
      thDevice: 'Urządzenie',
      thLocation: 'Lokalizacja',
      thAccess: 'Dostęp',
      thReferrer: 'Źródło',
      panelReferrers: 'Źródło',
      panelReferrersSub: 'Strony źródłowe',
      directAccess: 'Bezpośredni',
      totalLabel: 'Razem',
      emptyData: 'Brak wystarczających danych.',
      emptyVisits: 'Brak zarejestrowanych wizyt.',
      updatedAt: 'Zaktualizowane o',
      updating: 'Aktualizowanie...',
      thWatchTime: 'Czas oglądania',
      visitDetails: 'Szczegóły',
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
      accessHls: 'Strumień HLS',
      panelTopPrograms: 'Najczęściej oglądane programy',
      panelTopProgramsSub: 'Top 5 tytułów',
      thProgRank: '#',
      thProgTitle: 'Program',
      thProgViews: 'Wyświetlenia',
      thProgWatchTime: 'Całkowity czas oglądania',
      noPrograms: 'Brak danych o programach.'
    },
    it: {
      titleStats: 'Statistiche',
      kicker: 'Pannello interno',
      mainTitle: 'Statistiche della trasmissione',
      subtitle: 'Visualizzazione del pubblico in tempo reale, distribuzione degli accessi e visite recenti.',
      metricCurrent: 'In visione ora',
      metricTotal: 'Visite totali',
      metric24h: 'Visite nelle ultime 24 ore',
      metricIps: 'IP univoci nelle ultime 24 ore',
      footTotal: 'Da quando ha avuto inizio la registrazione',
      foot24h: 'Finestra mobile',
      footIps: 'Dispositivi / origini',
      panelHourly: 'Visite per ora',
      panelHourlySub: 'Ultime 24 ore',
      panelBrowsers: 'Browser/App',
      panelTopAccess: 'Accessi principali',
      panelOs: 'Sistemi operativi',
      panelCountries: 'Paesi',
      panelOrigin: 'Origine dell\'accesso',
      panelCities: 'Città',
      panelIsps: 'ISP',
      panelRecent: 'Visite recenti',
      panelRecentSub: 'Ultimi 25 accessi',
      searchAccesses: 'Ricerca accessi',
      thWhen: 'Quando',
      thBrowser: 'Browser/App',
      thSystem: 'Sistema',
      thDevice: 'Dispositivo',
      thLocation: 'Posizione',
      thAccess: 'Accesso',
      thReferrer: 'Provenienza',
      panelReferrers: 'Provenienza',
      panelReferrersSub: 'Siti di provenienza',
      directAccess: 'Diretto',
      totalLabel: 'Totale',
      emptyData: 'Dati insufficienti.',
      emptyVisits: 'Nessuna visita registrata.',
      updatedAt: 'Aggiornato alle',
      updating: 'Aggiornamento in corso...',
      thWatchTime: 'Tempo di visualizzazione',
      visitDetails: 'Dettagli',
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
      accessHls: 'Flusso HLS',
      panelTopPrograms: 'Programmi più visti',
      panelTopProgramsSub: 'Top 5 titoli',
      thProgRank: '#',
      thProgTitle: 'Programma',
      thProgViews: 'Visualizzazioni',
      thProgWatchTime: 'Tempo di visualizzazione totale',
      noPrograms: 'Nessun dato del programma.'
    },
    de: {
      titleStats: 'Statistiken',
      kicker: 'Internes Panel',
      mainTitle: 'Übertragungsstatistiken',
      subtitle: 'Echtzeit-Zuschaueransicht, Zugriffssverteilung und aktuelle Besuche.',
      metricCurrent: 'Schaut jetzt',
      metricTotal: 'Gesamtbesuche',
      metric24h: 'Besuche in den letzten 24 Stunden',
      metricIps: 'Eindeutige IPs in den letzten 24 Stunden',
      footTotal: 'Seit Beginn der Anmeldung',
      foot24h: 'Schiebefenster',
      footIps: 'Geräte / Quellen',
      panelHourly: 'Besuche pro Stunde',
      panelHourlySub: 'Letzte 24 Stunden',
      panelBrowsers: 'Browser/App',
      panelTopAccess: 'Top-Zugriffe',
      panelOs: 'Betriebssysteme',
      panelCountries: 'Länder',
      panelOrigin: 'Zugriffsquelle',
      panelCities: 'Städte',
      panelIsps: 'ISP',
      panelRecent: 'Aktuelle Besuche',
      panelRecentSub: 'Letzte 25 Zugriffe',
      searchAccesses: 'Zugriffe durchsuchen',
      thWhen: 'Wann',
      thBrowser: 'Browser/App',
      thSystem: 'System',
      thDevice: 'Gerät',
      thLocation: 'Ort',
      thAccess: 'Zugriff',
      thReferrer: 'Quelle',
      panelReferrers: 'Quelle',
      panelReferrersSub: 'Quellenwebsites',
      directAccess: 'Direkt',
      totalLabel: 'Gesamt',
      emptyData: 'Unzureichende Daten.',
      emptyVisits: 'Keine registrierten Besuche.',
      updatedAt: 'Aktualisiert am',
      updating: 'Wird aktualisiert...',
      thWatchTime: 'Ansichtsdauer',
      visitDetails: 'Details',
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
      accessHls: 'HLS-Stream',
      panelTopPrograms: 'Meistgesehene Programme',
      panelTopProgramsSub: 'Top 5 Titel',
      thProgRank: '#',
      thProgTitle: 'Programm',
      thProgViews: 'Aufrufe',
      thProgWatchTime: 'Gesamtansichtsdauer',
      noPrograms: 'Noch keine Programmdaten.'
    }
  };

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();

  function locale() {
    return currentLang === 'en' ? 'en-US' : 'pt-BR';
  }

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
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
    setText('recent-search-link', t('searchAccesses'));
    setText('th-when', t('thWhen'));
    setText('th-browser', t('thBrowser'));
    setText('th-system', t('thSystem'));
    setText('th-device', t('thDevice'));
    setText('th-location', t('thLocation'));
    setText('th-access', t('thAccess'));
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
      recentVisits.innerHTML = `<tr><td colspan="9" class="empty-state">${t('emptyVisits')}</td></tr>`;
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
        <td>${escapeHtml(getAccessLabel(item.accessType))}</td>
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