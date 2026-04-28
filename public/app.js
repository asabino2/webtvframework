/* ── app.js — Webtv framework ────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Elementos ────────────────────────────────────────────────────────────
  const video         = document.getElementById('video');
  const playerWrapper = document.getElementById('player-wrapper');
  const loading       = document.getElementById('player-loading');
  const errorBox      = document.getElementById('player-error');
  const errorMsg      = document.getElementById('error-msg');
  const btnPlay       = document.getElementById('btn-play');
  const iconPlay      = document.getElementById('icon-play');
  const iconPause     = document.getElementById('icon-pause');
  const btnMute       = document.getElementById('btn-mute');
  const iconVol       = document.getElementById('icon-vol');
  const iconMuted     = document.getElementById('icon-muted');
  const volRange      = document.getElementById('volume-range');
  const btnFS         = document.getElementById('btn-fullscreen');
  const iconFS        = document.getElementById('icon-fs');
  const iconExitFS    = document.getElementById('icon-exit-fs');
  const btnRetry      = document.getElementById('btn-retry');
  const btnCast       = document.getElementById('btn-cast');
  const logoChannelName = document.getElementById('logo-channel-name');
  const logoIconImg = document.getElementById('logo-icon-img');
  const logoIconFallback = document.getElementById('logo-icon-fallback');
  const appVersionLine = document.getElementById('app-version-line');
  const appAuthorLine = document.getElementById('app-author-line');
  const shareSection = document.getElementById('share-section');
  const shareTitle = document.getElementById('share-title');
  const shareWhatsapp = document.getElementById('share-whatsapp');
  const shareFacebook = document.getElementById('share-facebook');
  const shareX = document.getElementById('share-x');
  const shareTelegram = document.getElementById('share-telegram');
  const shareCopyLink = document.getElementById('share-copy-link');
  const shareWhatsappLabel = shareWhatsapp?.querySelector('.share-btn-label');
  const shareFacebookLabel = shareFacebook?.querySelector('.share-btn-label');
  const shareXLabel = shareX?.querySelector('.share-btn-label');
  const shareTelegramLabel = shareTelegram?.querySelector('.share-btn-label');
  const shareCopyLinkLabel = shareCopyLink?.querySelector('.share-btn-label');

  const btnEpg        = document.getElementById('btn-epg');
  const epgOverlay    = document.getElementById('epg-overlay');
  const epgClose      = document.getElementById('epg-close');
  const epgGridBody   = document.getElementById('epg-grid-body');
  const epgDetailOverlay = document.getElementById('epg-detail-overlay');
  const epgDetailClose   = document.getElementById('epg-detail-close');
  const epgDetailCover   = document.getElementById('epg-detail-cover');
  const epgDetailCoverEmpty = document.getElementById('epg-detail-cover-empty');
  const epgDetailTime    = document.getElementById('epg-detail-time');
  const epgDetailTitle   = document.getElementById('epg-detail-title');
  const epgDetailSubtitle = document.getElementById('epg-detail-subtitle');
  const epgDetailCategory = document.getElementById('epg-detail-category');
  const epgDetailDesc    = document.getElementById('epg-detail-desc');
  const epgDetailExtra   = document.getElementById('epg-detail-extra');

  const currentTitle  = document.getElementById('current-title');
  const currentTime   = document.getElementById('current-time');
  const currentDesc   = document.getElementById('current-desc');
  const currentCat    = document.getElementById('current-cat');
  const progressFill  = document.getElementById('progress-fill');
  const nextTitle     = document.getElementById('next-title');
  const nextTime      = document.getElementById('next-time');
  const nextDesc      = document.getElementById('next-desc');
  const nextCat       = document.getElementById('next-cat');
  const viewerCount   = document.getElementById('viewer-count');
  const viewerUpdated = document.getElementById('viewer-updated-at');
  const epgSidebar = document.getElementById('epg-sidebar');
  const programNowCard = document.getElementById('program-now-card');
  const programNextCard = document.getElementById('program-next-card');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      live: 'AO VIVO',
      languageLabel: 'Idioma',
      epgButton: 'Grade de Programacao',
      loadingBroadcast: 'Carregando transmissao...',
      streamUnavailable: 'Sinal indisponivel no momento.',
      retry: 'Tentar novamente',
      now: 'Agora',
      next: 'A seguir',
      realtimeAudience: 'Audiencia em tempo real',
      viewersNow: 'pessoas assistindo agora',
      waitingUpdate: 'Aguardando atualizacao...',
      createdBy: 'Criado por Alexander Sabino em 2026',
      epgTitle: '📋 Grade de Programacao',
      loadingEpg: 'Carregando grade...',
      close: 'Fechar',
      coverMissing: 'Sem imagem de capa',
      synopsis: 'Sinopse',
      titleLive: 'Ao Vivo',
      mute: 'Mudo',
      fullscreen: 'Tela Cheia',
      cast: 'Enviar para Google Cast',
      playPause: 'Play / Pause',
      volume: 'Volume',
      updatedAt: 'Atualizado as',
      updateUnavailable: 'Atualizacao indisponivel',
      scheduleUnavailable: 'Sem informacao de programacao',
      epgLoadError: 'Nao foi possivel carregar o EPG',
      epgLoadingGrid: 'Carregando grade de programacao...',
      epgGridLoadError: 'Nao foi possivel carregar a grade.',
      noSchedule: 'Nenhuma programacao disponivel.',
      nowTag: 'AO VIVO',
      timeUnavailable: 'Horario indisponivel',
      untitled: 'Sem titulo',
      synopsisUnavailable: 'Sinopse nao disponivel para esta atracao.',
      actors: 'Atores',
      direction: 'Direcao',
      presentation: 'Apresentacao',
      production: 'Producao',
      writing: 'Roteiro',
      country: 'Pais',
      language: 'Idioma',
      originalLanguage: 'Idioma original',
      date: 'Data',
      episode: 'Episodio',
      rating: 'Classificacao',
      castLocalhostAlert: 'Para usar o Google Cast, acesse o site pelo IP da maquina na rede local, nao por localhost.',
      castFailAlert: 'Nao foi possivel iniciar o Google Cast nesta tentativa.',
      streamLoadError: 'Erro ao carregar o stream. Verifique se o servidor de origem esta ativo.',
      streamNativeError: 'Nao foi possivel reproduzir o stream.',
      hlsUnsupported: 'Seu navegador nao suporta reproducao HLS.',
      liveSubtitleFallback: 'Transmissao ao vivo',
      streamNoticeFallback: 'Transmissao indisponivel no momento.',
      shareTitle: 'Compartilhar transmissao',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Copiar link',
      shareCopySuccess: 'Link copiado!',
      shareCopyError: 'Nao foi possivel copiar o link.',
      shareInvite: 'Confira',
      shareInviteSuffix: 'na transmissao ao vivo!'
    },
    en: {
      live: 'LIVE',
      languageLabel: 'Language',
      epgButton: 'Program Guide',
      loadingBroadcast: 'Loading broadcast...',
      streamUnavailable: 'Signal unavailable at the moment.',
      retry: 'Try again',
      now: 'Now',
      next: 'Up next',
      realtimeAudience: 'Real-time audience',
      viewersNow: 'people watching now',
      waitingUpdate: 'Waiting for update...',
      createdBy: 'Created by Alexander Sabino in 2026',
      epgTitle: '📋 Program Guide',
      loadingEpg: 'Loading guide...',
      close: 'Close',
      coverMissing: 'No cover image',
      synopsis: 'Synopsis',
      titleLive: 'Live',
      mute: 'Mute',
      fullscreen: 'Fullscreen',
      cast: 'Cast to Google Cast',
      playPause: 'Play / Pause',
      volume: 'Volume',
      updatedAt: 'Updated at',
      updateUnavailable: 'Update unavailable',
      scheduleUnavailable: 'No schedule information available',
      epgLoadError: 'Could not load the EPG',
      epgLoadingGrid: 'Loading program guide...',
      epgGridLoadError: 'Could not load the guide.',
      noSchedule: 'No programming available.',
      nowTag: 'LIVE',
      timeUnavailable: 'Time unavailable',
      untitled: 'Untitled',
      synopsisUnavailable: 'Synopsis not available for this title.',
      actors: 'Actors',
      direction: 'Direction',
      presentation: 'Presentation',
      production: 'Production',
      writing: 'Writing',
      country: 'Country',
      language: 'Language',
      originalLanguage: 'Original language',
      date: 'Date',
      episode: 'Episode',
      rating: 'Rating',
      castLocalhostAlert: 'To use Google Cast, open the site using your machine IP on local network, not localhost.',
      castFailAlert: 'Could not start Google Cast this time.',
      streamLoadError: 'Error loading stream. Check if the source server is active.',
      streamNativeError: 'Could not play the stream.',
      hlsUnsupported: 'Your browser does not support HLS playback.',
      liveSubtitleFallback: 'Live broadcast',
      streamNoticeFallback: 'Broadcast unavailable at the moment.',
      shareTitle: 'Share broadcast',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Copy link',
      shareCopySuccess: 'Link copied!',
      shareCopyError: 'Could not copy the link.',
      shareInvite: 'Check out',
      shareInviteSuffix: 'live on air!'
    },
    es: {
      live: 'EN DIRECTO',
      languageLabel: 'Idioma',
      epgButton: 'Guía de Programas',
      loadingBroadcast: 'Cargando transmisión...',
      streamUnavailable: 'Señal no disponible en este momento.',
      retry: 'Intentar de nuevo',
      now: 'Ahora',
      next: 'A continuación',
      realtimeAudience: 'Audiencia en tiempo real',
      viewersNow: 'personas viendo ahora',
      waitingUpdate: 'Esperando actualización...',
      createdBy: 'Creado por Alexander Sabino en 2026',
      epgTitle: '📋 Guía de Programas',
      loadingEpg: 'Cargando guía...',
      close: 'Cerrar',
      coverMissing: 'Sin imagen de portada',
      synopsis: 'Sinopsis',
      titleLive: 'En Directo',
      mute: 'Silenciar',
      fullscreen: 'Pantalla Completa',
      cast: 'Enviar a Google Cast',
      playPause: 'Reproducir / Pausar',
      volume: 'Volumen',
      updatedAt: 'Actualizado a las',
      updateUnavailable: 'Actualización no disponible',
      scheduleUnavailable: 'Sin información de programación disponible',
      epgLoadError: 'No se pudo cargar el EPG',
      epgLoadingGrid: 'Cargando guía de programas...',
      epgGridLoadError: 'No se pudo cargar la guía.',
      noSchedule: 'Sin programación disponible.',
      nowTag: 'EN DIRECTO',
      timeUnavailable: 'Hora no disponible',
      untitled: 'Sin título',
      synopsisUnavailable: 'Sinopsis no disponible para este título.',
      actors: 'Actores',
      direction: 'Dirección',
      presentation: 'Presentación',
      production: 'Producción',
      writing: 'Guion',
      country: 'País',
      language: 'Idioma',
      originalLanguage: 'Idioma original',
      date: 'Fecha',
      episode: 'Episodio',
      rating: 'Clasificación',
      castLocalhostAlert: 'Para usar Google Cast, accede al sitio usando la IP de tu máquina en la red local, no localhost.',
      castFailAlert: 'No se pudo iniciar Google Cast en este intento.',
      streamLoadError: 'Error cargando el stream. Verifica que el servidor de origen esté activo.',
      streamNativeError: 'No se pudo reproducir el stream.',
      hlsUnsupported: 'Tu navegador no soporta reproducción HLS.',
      liveSubtitleFallback: 'Transmisión en directo',
      streamNoticeFallback: 'Transmisión no disponible en este momento.',
      shareTitle: 'Compartir transmisión',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Copiar enlace',
      shareCopySuccess: '¡Enlace copiado!',
      shareCopyError: 'No se pudo copiar el enlace.',
      shareInvite: 'Mira',
      shareInviteSuffix: '¡en directo!'
    },
    ru: {
      live: 'ЭФИР',
      languageLabel: 'Язык',
      epgButton: 'Программа',
      loadingBroadcast: 'Загрузка трансляции...',
      streamUnavailable: 'Сигнал недоступен.',
      retry: 'Попробовать снова',
      now: 'Сейчас',
      next: 'Далее',
      realtimeAudience: 'Аудитория в реальном времени',
      viewersNow: 'человек смотрят сейчас',
      waitingUpdate: 'Ожидание обновления...',
      createdBy: 'Создано Alexander Sabino в 2026',
      epgTitle: '📋 Программа',
      loadingEpg: 'Загрузка программы...',
      close: 'Закрыть',
      coverMissing: 'Нет изображения обложки',
      synopsis: 'Синопсис',
      titleLive: 'В прямом эфире',
      mute: 'Без звука',
      fullscreen: 'Полный экран',
      cast: 'Отправить на Google Cast',
      playPause: 'Воспроизведение / Пауза',
      volume: 'Громкость',
      updatedAt: 'Обновлено в',
      updateUnavailable: 'Обновление недоступно',
      scheduleUnavailable: 'Информация о расписании недоступна',
      epgLoadError: 'Не удалось загрузить EPG',
      epgLoadingGrid: 'Загрузка программы...',
      epgGridLoadError: 'Не удалось загрузить программу.',
      noSchedule: 'Программирование недоступно.',
      nowTag: 'В ЭФИРЕ',
      timeUnavailable: 'Время недоступно',
      untitled: 'Без названия',
      synopsisUnavailable: 'Синопсис недоступен для этого заголовка.',
      actors: 'Актеры',
      direction: 'Режиссура',
      presentation: 'Презентация',
      production: 'Производство',
      writing: 'Сценарий',
      country: 'Страна',
      language: 'Язык',
      originalLanguage: 'Оригинальный язык',
      date: 'Дата',
      episode: 'Эпизод',
      rating: 'Рейтинг',
      castLocalhostAlert: 'Чтобы использовать Google Cast, откройте сайт, используя IP вашей машины в локальной сети, а не localhost.',
      castFailAlert: 'Не удалось запустить Google Cast на этот раз.',
      streamLoadError: 'Ошибка при загрузке потока. Проверьте, активен ли исходный сервер.',
      streamNativeError: 'Не удалось воспроизвести поток.',
      hlsUnsupported: 'Ваш браузер не поддерживает воспроизведение HLS.',
      liveSubtitleFallback: 'Трансляция в прямом эфире',
      streamNoticeFallback: 'Трансляция недоступна.',
      shareTitle: 'Поделиться трансляцией',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Скопировать ссылку',
      shareCopySuccess: 'Ссылка скопирована!',
      shareCopyError: 'Не удалось скопировать ссылку.',
      shareInvite: 'Смотри',
      shareInviteSuffix: 'в прямом эфире!'
    },
    zh: {
      live: '直播',
      languageLabel: '语言',
      epgButton: '节目指南',
      loadingBroadcast: '加载直播中...',
      streamUnavailable: '信号暂时不可用。',
      retry: '重试',
      now: '现在',
      next: '接下来',
      realtimeAudience: '实时观众',
      viewersNow: '人正在观看',
      waitingUpdate: '等待更新...',
      createdBy: '由Alexander Sabino于2026年创建',
      epgTitle: '📋 节目指南',
      loadingEpg: '加载指南中...',
      close: '关闭',
      coverMissing: '没有封面图片',
      synopsis: '简介',
      titleLive: '直播',
      mute: '静音',
      fullscreen: '全屏',
      cast: '投射到Google Cast',
      playPause: '播放 / 暂停',
      volume: '音量',
      updatedAt: '更新于',
      updateUnavailable: '更新不可用',
      scheduleUnavailable: '没有可用的时间表信息',
      epgLoadError: '无法加载EPG',
      epgLoadingGrid: '加载节目指南中...',
      epgGridLoadError: '无法加载指南。',
      noSchedule: '没有可用的节目。',
      nowTag: '直播中',
      timeUnavailable: '时间不可用',
      untitled: '无标题',
      synopsisUnavailable: '此标题无简介。',
      actors: '演员',
      direction: '导演',
      presentation: '呈现',
      production: '制作',
      writing: '编剧',
      country: '国家',
      language: '语言',
      originalLanguage: '原始语言',
      date: '日期',
      episode: '集数',
      rating: '评分',
      castLocalhostAlert: '要使用Google Cast，请使用本地网络上计算机的IP访问该网站，而不是localhost。',
      castFailAlert: '这次无法启动Google Cast。',
      streamLoadError: '加载流时出错。检查源服务器是否处于活动状态。',
      streamNativeError: '无法播放流。',
      hlsUnsupported: '您的浏览器不支持HLS播放。',
      liveSubtitleFallback: '直播转播',
      streamNoticeFallback: '直播暂时不可用。',
      shareTitle: '分享直播',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: '复制链接',
      shareCopySuccess: '链接已复制！',
      shareCopyError: '无法复制链接。',
      shareInvite: '看看',
      shareInviteSuffix: '的直播！'
    },
    pl: {
      live: 'NA ŻYWO',
      languageLabel: 'Język',
      epgButton: 'Przewodnik Programu',
      loadingBroadcast: 'Ładowanie transmisji...',
      streamUnavailable: 'Sygnał niedostępny w tej chwili.',
      retry: 'Spróbuj ponownie',
      now: 'Teraz',
      next: 'Następnie',
      realtimeAudience: 'Widzowie w czasie rzeczywistym',
      viewersNow: 'osób ogląda teraz',
      waitingUpdate: 'Oczekiwanie na aktualizację...',
      createdBy: 'Utworzono przez Alexander Sabino w 2026',
      epgTitle: '📋 Przewodnik Programu',
      loadingEpg: 'Ładowanie przewodnika...',
      close: 'Zamknij',
      coverMissing: 'Brak obrazu okładki',
      synopsis: 'Streszczenie',
      titleLive: 'Na żywo',
      mute: 'Wycisz',
      fullscreen: 'Pełny ekran',
      cast: 'Wyślij do Google Cast',
      playPause: 'Odtwórz / Pauza',
      volume: 'Głośność',
      updatedAt: 'Zaktualizowano o',
      updateUnavailable: 'Aktualizacja niedostępna',
      scheduleUnavailable: 'Brak dostępnych informacji o harmonogramie',
      epgLoadError: 'Nie można załadować EPG',
      epgLoadingGrid: 'Ładowanie przewodnika programu...',
      epgGridLoadError: 'Nie można załadować przewodnika.',
      noSchedule: 'Brak dostępnego programowania.',
      nowTag: 'NA ŻYWO',
      timeUnavailable: 'Czas niedostępny',
      untitled: 'Bez tytułu',
      synopsisUnavailable: 'Streszczenie niedostępne dla tego tytułu.',
      actors: 'Aktorzy',
      direction: 'Reżyseria',
      presentation: 'Prezentacja',
      production: 'Produkcja',
      writing: 'Scenariusz',
      country: 'Kraj',
      language: 'Język',
      originalLanguage: 'Język oryginalny',
      date: 'Data',
      episode: 'Odcinek',
      rating: 'Ocena',
      castLocalhostAlert: 'Aby używać Google Cast, otwórz witrynę za pomocą adresu IP swojego urządzenia w sieci lokalnej, a nie localhost.',
      castFailAlert: 'Nie można uruchomić Google Cast tym razem.',
      streamLoadError: 'Błąd podczas ładowania strumienia. Sprawdź, czy serwer źródłowy jest aktywny.',
      streamNativeError: 'Nie można odtworzyć strumienia.',
      hlsUnsupported: 'Twoja przeglądarka nie obsługuje odtwarzania HLS.',
      liveSubtitleFallback: 'Transmisja na żywo',
      streamNoticeFallback: 'Transmisja niedostępna w tej chwili.',
      shareTitle: 'Udostępnij transmisję',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Skopiuj link',
      shareCopySuccess: 'Link skopiowany!',
      shareCopyError: 'Nie można skopiować linku.',
      shareInvite: 'Sprawdź',
      shareInviteSuffix: 'na żywo!'
    },
    it: {
      live: 'IN DIRETTA',
      languageLabel: 'Lingua',
      epgButton: 'Guida Programmi',
      loadingBroadcast: 'Caricamento trasmissione...',
      streamUnavailable: 'Segnale non disponibile al momento.',
      retry: 'Riprova',
      now: 'Ora',
      next: 'Prossimo',
      realtimeAudience: 'Pubblico in tempo reale',
      viewersNow: 'persone stanno guardando ora',
      waitingUpdate: 'In attesa di aggiornamento...',
      createdBy: 'Creato da Alexander Sabino nel 2026',
      epgTitle: '📋 Guida Programmi',
      loadingEpg: 'Caricamento guida...',
      close: 'Chiudi',
      coverMissing: 'Nessuna immagine di copertina',
      synopsis: 'Trama',
      titleLive: 'In Diretta',
      mute: 'Muto',
      fullscreen: 'Schermo Intero',
      cast: 'Trasmetti a Google Cast',
      playPause: 'Riproduci / Pausa',
      volume: 'Volume',
      updatedAt: 'Aggiornato alle',
      updateUnavailable: 'Aggiornamento non disponibile',
      scheduleUnavailable: 'Nessuna informazione sulla programmazione disponibile',
      epgLoadError: 'Impossibile caricare l\'EPG',
      epgLoadingGrid: 'Caricamento guida programmi...',
      epgGridLoadError: 'Impossibile caricare la guida.',
      noSchedule: 'Nessuna programmazione disponibile.',
      nowTag: 'IN DIRETTA',
      timeUnavailable: 'Ora non disponibile',
      untitled: 'Senza titolo',
      synopsisUnavailable: 'Trama non disponibile per questo titolo.',
      actors: 'Attori',
      direction: 'Regia',
      presentation: 'Presentazione',
      production: 'Produzione',
      writing: 'Sceneggiatura',
      country: 'Paese',
      language: 'Lingua',
      originalLanguage: 'Lingua originale',
      date: 'Data',
      episode: 'Episodio',
      rating: 'Valutazione',
      castLocalhostAlert: 'Per utilizzare Google Cast, accedi al sito utilizzando l\'IP della tua macchina sulla rete locale, non localhost.',
      castFailAlert: 'Impossibile avviare Google Cast questa volta.',
      streamLoadError: 'Errore durante il caricamento dello stream. Verifica che il server di origine sia attivo.',
      streamNativeError: 'Impossibile riprodurre lo stream.',
      hlsUnsupported: 'Il tuo browser non supporta la riproduzione HLS.',
      liveSubtitleFallback: 'Trasmissione in diretta',
      streamNoticeFallback: 'Trasmissione non disponibile al momento.',
      shareTitle: 'Condividi trasmissione',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Copia link',
      shareCopySuccess: 'Link copiato!',
      shareCopyError: 'Impossibile copiare il link.',
      shareInvite: 'Guarda',
      shareInviteSuffix: 'in diretta!'
    },
    de: {
      live: 'LIVE',
      languageLabel: 'Sprache',
      epgButton: 'Programmführer',
      loadingBroadcast: 'Übertragung wird geladen...',
      streamUnavailable: 'Signal momentan nicht verfügbar.',
      retry: 'Erneut versuchen',
      now: 'Jetzt',
      next: 'Nächstes',
      realtimeAudience: 'Echtzeit-Zuschauer',
      viewersNow: 'Menschen schauen jetzt',
      waitingUpdate: 'Auf Aktualisierung warten...',
      createdBy: 'Erstellt von Alexander Sabino im Jahr 2026',
      epgTitle: '📋 Programmführer',
      loadingEpg: 'Führung wird geladen...',
      close: 'Schließen',
      coverMissing: 'Kein Titelbild vorhanden',
      synopsis: 'Zusammenfassung',
      titleLive: 'Live',
      mute: 'Stumm',
      fullscreen: 'Vollbild',
      cast: 'An Google Cast senden',
      playPause: 'Abspielen / Pause',
      volume: 'Lautstärke',
      updatedAt: 'Aktualisiert um',
      updateUnavailable: 'Aktualisierung nicht verfügbar',
      scheduleUnavailable: 'Keine Terminplaninformationen verfügbar',
      epgLoadError: 'EPG konnte nicht geladen werden',
      epgLoadingGrid: 'Programmführer wird geladen...',
      epgGridLoadError: 'Führung konnte nicht geladen werden.',
      noSchedule: 'Keine Programmierung verfügbar.',
      nowTag: 'LIVE',
      timeUnavailable: 'Zeit nicht verfügbar',
      untitled: 'Ohne Titel',
      synopsisUnavailable: 'Zusammenfassung für diesen Titel nicht verfügbar.',
      actors: 'Schauspieler',
      direction: 'Regie',
      presentation: 'Präsentation',
      production: 'Produktion',
      writing: 'Drehbuch',
      country: 'Land',
      language: 'Sprache',
      originalLanguage: 'Originalsprache',
      date: 'Datum',
      episode: 'Episode',
      rating: 'Bewertung',
      castLocalhostAlert: 'Um Google Cast zu verwenden, greifen Sie auf die Website mit der IP-Adresse Ihres Computers im lokalen Netzwerk zu, nicht auf localhost.',
      castFailAlert: 'Google Cast konnte diesmal nicht gestartet werden.',
      streamLoadError: 'Fehler beim Laden des Streams. Überprüfen Sie, ob der Quellserver aktiv ist.',
      streamNativeError: 'Stream konnte nicht wiedergegeben werden.',
      hlsUnsupported: 'Ihr Browser unterstützt die HLS-Wiedergabe nicht.',
      liveSubtitleFallback: 'Liveübertragung',
      streamNoticeFallback: 'Übertragung momentan nicht verfügbar.',
      shareTitle: 'Übertragung teilen',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareX: 'X',
      shareTelegram: 'Telegram',
      shareCopy: 'Link kopieren',
      shareCopySuccess: 'Link kopiert!',
      shareCopyError: 'Link konnte nicht kopiert werden.',
      shareInvite: 'Schau dir an',
      shareInviteSuffix: 'live an!'
    }
  };

  function getCurrentLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getCurrentLang();

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

  // ── HLS Player ──────────────────────────────────────────────────────────
  let hls = null;
  let analyticsSessionId = null;
  let heartbeatTimer = null;
  let liveTimer = null;
  let streamStatePollTimer = null;
  let epgSidebarTimer = null;
  let streamStateChannel = null;
  let channelName = 'Webtv framework';
  let appVersion = '0.0.2';
  let faviconUrl = '/webtvframework.ico';
  let streamStateVersion = 0;
  let epgEnabled = true;
  let homeCustomization = null;
  let castApiAvailable = false;
  const isTvDevice = detectTvDevice();

  function detectTvDevice() {
    const source = `${navigator.userAgent || ''} ${navigator.vendor || ''} ${(navigator.userAgentData?.platform || '')}`.toLowerCase();
    return /(smart-tv|smarttv|hbbtv|netcast|viera|bravia|webos|web0s|tizen|googletv|google tv|android tv|aft|fire tv|roku|appletv|tv box|tvbrowser)/.test(source);
  }

  function setDisplay(element, value) {
    if (!element) return;
    element.style.display = value;
  }

  function isFullscreenEnabled() {
    return homeCustomization?.playerControls?.fullscreen !== false;
  }

  function isMuteEnabled() {
    return homeCustomization?.playerControls?.mute !== false;
  }

  function isVolumeEnabled() {
    return homeCustomization?.playerControls?.volume !== false;
  }

  function isCastEnabled() {
    return homeCustomization?.playerControls?.googleCast !== false;
  }

  function isShareEnabled() {
    return homeCustomization?.playerControls?.shareButtons !== false;
  }

  function updateCastButtonVisibility() {
    if (!btnCast) return;
    setDisplay(btnCast, (isCastEnabled() && castApiAvailable) ? 'flex' : 'none');
  }

  function buildShareUrl() {
    return new URL('/', window.location.origin).toString();
  }

  function buildShareMessage() {
    return `${t('shareInvite')} ${channelName} ${t('shareInviteSuffix')}`;
  }

  function buildSharePostText() {
    return `${buildShareMessage()}\n${buildShareUrl()}`;
  }

  function setOrCreateMeta(selector, attributes) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  function updateSocialMeta() {
    const shareUrl = buildShareUrl();
    const absoluteFaviconUrl = faviconUrl ? new URL(faviconUrl, window.location.origin).toString() : new URL('/webtvframework.ico', window.location.origin).toString();
    const socialTitle = `${channelName} - ${t('titleLive')}`;
    const socialDescription = buildShareMessage();

    document.title = socialTitle;
    setOrCreateMeta('meta[name="description"]', { name: 'description', content: socialDescription });
    setOrCreateMeta('meta[property="og:title"]', { property: 'og:title', content: socialTitle });
    setOrCreateMeta('meta[property="og:description"]', { property: 'og:description', content: socialDescription });
    setOrCreateMeta('meta[property="og:url"]', { property: 'og:url', content: shareUrl });
    setOrCreateMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteFaviconUrl });
    setOrCreateMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: channelName });
    setOrCreateMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: socialTitle });
    setOrCreateMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: socialDescription });
    setOrCreateMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteFaviconUrl });
  }

  function updateShareLinks() {
    const shareUrl = buildShareUrl();
    const shareText = buildShareMessage();
    const sharePostText = buildSharePostText();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    if (shareWhatsapp) shareWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(sharePostText)}`;
    if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    if (shareX) shareX.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    if (shareTelegram) shareTelegram.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    updateSocialMeta();
  }

  function updateShareVisibility() {
    if (!shareSection) return;
    setDisplay(shareSection, isShareEnabled() ? 'block' : 'none');
  }

  function isVisible(element) {
    if (!element) return false;
    return element.offsetParent !== null && getComputedStyle(element).visibility !== 'hidden';
  }

  function getRemoteButtons() {
    return [btnPlay, btnMute, btnFS, btnCast].filter((button) => {
      if (!button || button.disabled || !isVisible(button)) return false;
      if (button === btnMute && !isMuteEnabled()) return false;
      if (button === btnFS && !isFullscreenEnabled()) return false;
      if (button === btnCast && (!isCastEnabled() || !castApiAvailable)) return false;
      return true;
    });
  }

  function focusPlayerForTv(force = false) {
    if (!isTvDevice || !playerWrapper) return;

    const active = document.activeElement;
    const canReplaceFocus = !active || active === document.body || active === document.documentElement;

    if (force || canReplaceFocus) {
      playerWrapper.focus({ preventScroll: true });
    }
  }

  function focusRemoteButton(direction) {
    const buttons = getRemoteButtons();
    if (!buttons.length) {
      focusPlayerForTv(true);
      return;
    }

    const activeIndex = buttons.indexOf(document.activeElement);
    if (activeIndex === -1) {
      buttons[direction > 0 ? 0 : buttons.length - 1].focus({ preventScroll: true });
      return;
    }

    const nextIndex = (activeIndex + direction + buttons.length) % buttons.length;
    buttons[nextIndex].focus({ preventScroll: true });
  }

  function adjustVolume(step) {
    if (!isVolumeEnabled()) return;
    const nextVolume = Math.max(0, Math.min(1, Number(video.volume || 0) + step));
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    if (volRange) {
      volRange.value = String(nextVolume.toFixed(2));
    }
    updateMuteIcon();
  }

  function togglePlayback() {
    if (video.paused) {
      video.play().catch(() => {});
      return;
    }
    video.pause();
  }

  function canHandleRemoteKey(target) {
    if (!target) return true;
    const tagName = target.tagName;
    return tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT' && !target.isContentEditable;
  }

  function normalizeRemoteKey(event) {
    const key = String(event.key || '').toLowerCase();
    const code = Number(event.keyCode || event.which || 0);

    if (key === 'mediaplaypause' || code === 179) return 'playpause';
    if (key === 'mediaplay' || code === 415) return 'play';
    if (key === 'mediapause' || code === 19) return 'pause';
    if (key === 'mediastop' || code === 413) return 'stop';
    if (key === 'audiovolumeup' || key === 'volumeup' || code === 447) return 'volumeup';
    if (key === 'audiovolumedown' || key === 'volumedown' || code === 448) return 'volumedown';
    if (key === 'audiovolumemute' || key === 'volumemute' || code === 449) return 'mute';
    if (key === 'arrowleft' || code === 37) return 'left';
    if (key === 'arrowright' || code === 39) return 'right';
    if (key === 'arrowup' || code === 38) return 'up';
    if (key === 'arrowdown' || code === 40) return 'down';
    if (key === 'enter' || key === 'ok' || code === 13) return 'select';
    if (key === 'backspace' || key === 'browserback' || key === 'goback' || key === 'escape' || code === 27 || code === 461 || code === 10009) return 'back';
    if (key === 'f' || code === 70) return 'fullscreen';
    return null;
  }

  function handleRemoteKey(event) {
    const command = normalizeRemoteKey(event);
    if (!command) return;
    if (!isTvDevice && !['playpause', 'play', 'pause', 'stop', 'volumeup', 'volumedown', 'mute'].includes(command)) {
      return;
    }
    if (!canHandleRemoteKey(event.target)) return;

    if (isProgrammeDetailOpen()) {
      if (command === 'back' || command === 'select') {
        event.preventDefault();
        closeProgrammeDetail();
      }
      return;
    }

    if (epgOverlay.classList.contains('open')) {
      if (command === 'back') {
        event.preventDefault();
        closeEpgModal();
        focusPlayerForTv(true);
      }
      return;
    }

    switch (command) {
      case 'playpause':
      case 'select':
        event.preventDefault();
        if (document.activeElement && document.activeElement !== playerWrapper && typeof document.activeElement.click === 'function') {
          document.activeElement.click();
        } else {
          togglePlayback();
        }
        break;
      case 'play':
        event.preventDefault();
        video.play().catch(() => {});
        break;
      case 'pause':
      case 'stop':
        event.preventDefault();
        video.pause();
        break;
      case 'mute':
        event.preventDefault();
        if (isMuteEnabled()) {
          video.muted = !video.muted;
          updateMuteIcon();
        }
        break;
      case 'volumeup':
        event.preventDefault();
        adjustVolume(0.05);
        break;
      case 'volumedown':
        event.preventDefault();
        adjustVolume(-0.05);
        break;
      case 'left':
        if (!isTvDevice) break;
        event.preventDefault();
        focusRemoteButton(-1);
        break;
      case 'right':
        if (!isTvDevice) break;
        event.preventDefault();
        focusRemoteButton(1);
        break;
      case 'up':
        if (!isTvDevice) break;
        event.preventDefault();
        adjustVolume(0.05);
        break;
      case 'down':
        if (!isTvDevice) break;
        event.preventDefault();
        adjustVolume(-0.05);
        break;
      case 'fullscreen':
        if (!isTvDevice) break;
        event.preventDefault();
        toggleFullscreen();
        break;
      case 'back':
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        focusPlayerForTv(true);
        break;
      default:
        break;
    }
  }

  function updatePlayerControlsVisibility() {
    setDisplay(btnMute, isMuteEnabled() ? 'flex' : 'none');
    setDisplay(volRange, isVolumeEnabled() ? 'block' : 'none');
    setDisplay(btnFS, isFullscreenEnabled() ? 'flex' : 'none');
    updateCastButtonVisibility();
    updateShareVisibility();
  }

  function applyHomeCustomization(config) {
    if (!config) return;
    homeCustomization = config;

    const colors = config.colors || {};
    const rootStyle = document.documentElement.style;

    if (colors.bg) rootStyle.setProperty('--bg', colors.bg);
    if (colors.surface) {
      rootStyle.setProperty('--surface', colors.surface);
      rootStyle.setProperty('--surface2', colors.surface);
    }
    if (colors.border) rootStyle.setProperty('--border', colors.border);
    if (colors.accent) {
      rootStyle.setProperty('--accent', colors.accent);
      rootStyle.setProperty('--accent2', colors.accent);
    }
    if (colors.text) rootStyle.setProperty('--text', colors.text);
    if (config.fontFamily) rootStyle.setProperty('--font-family-base', config.fontFamily);

    const bgImageUrl = String(config.backgroundImageUrl || '').trim();
    if (bgImageUrl) {
      rootStyle.setProperty('--bg-image-url', `url('${bgImageUrl}')`);
    } else {
      rootStyle.removeProperty('--bg-image-url');
    }

    updatePlayerControlsVisibility();
  }

  function applyBrandIcon(url) {
    if (!logoIconImg || !logoIconFallback) return;

    if (!url) {
      setDisplay(logoIconImg, 'none');
      setDisplay(logoIconFallback, 'inline-flex');
      logoIconImg.removeAttribute('src');
      return;
    }

    logoIconImg.src = url;
    logoIconImg.onerror = function onLogoIconError() {
      setDisplay(logoIconImg, 'none');
      setDisplay(logoIconFallback, 'inline-flex');
    };
    setDisplay(logoIconImg, 'inline-flex');
    setDisplay(logoIconFallback, 'none');
  }

  function applyEpgVisibility() {
    setDisplay(btnEpg, epgEnabled ? 'flex' : 'none');
    setDisplay(programNowCard, epgEnabled ? 'block' : 'none');
    setDisplay(programNextCard, epgEnabled ? 'block' : 'none');

    if (epgSidebar) {
      const hasAudienceCard = Boolean(viewerCount && viewerUpdated);
      setDisplay(epgSidebar, (epgEnabled || hasAudienceCard) ? 'flex' : 'none');
    }

    if (!epgEnabled) {
      closeEpgModal();
    }
  }

  function applyFavicon(url) {
    if (!url) return;

    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = url;
  }

  function updateDocumentTitle() {
    document.title = `${channelName} — ${t('titleLive')}`;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';

    const byId = (id) => document.getElementById(id);
    const setText = (id, value) => {
      const el = byId(id);
      if (el) el.textContent = value;
    };

    setText('live-badge-text', t('live'));
    setText('btn-epg-text', t('epgButton'));
    setText('player-loading-text', t('loadingBroadcast'));
    setText('error-msg', t('streamUnavailable'));
    setText('btn-retry', t('retry'));
    setText('label-now', t('now'));
    setText('label-next', t('next'));
    setText('label-audience', t('realtimeAudience'));
    setText('audience-caption', t('viewersNow'));
    setText('viewer-updated-at', t('waitingUpdate'));
    setText('app-author-line', t('createdBy'));
    setText('epg-modal-title', t('epgTitle'));
    setText('epg-loading-text', t('loadingEpg'));
    setText('epg-detail-cover-empty', t('coverMissing'));
    setText('epg-synopsis-title', t('synopsis'));

    if (appVersionLine) {
      appVersionLine.textContent = `Webtv Framework - ${currentLang === 'en' ? 'Version' : 'Versao'} ${appVersion}`;
    }

    if (shareTitle) shareTitle.textContent = t('shareTitle');
    if (shareWhatsappLabel) shareWhatsappLabel.textContent = t('shareWhatsapp');
    if (shareFacebookLabel) shareFacebookLabel.textContent = t('shareFacebook');
    if (shareXLabel) shareXLabel.textContent = t('shareX');
    if (shareTelegramLabel) shareTelegramLabel.textContent = t('shareTelegram');
    if (shareCopyLinkLabel) shareCopyLinkLabel.textContent = t('shareCopy');

    const detailClose = byId('epg-detail-close');
    if (detailClose) detailClose.title = t('close');

    if (btnPlay) btnPlay.title = t('playPause');
    if (btnMute) btnMute.title = t('mute');
    if (volRange) volRange.title = t('volume');
    if (btnFS) btnFS.title = t('fullscreen');
    if (btnCast) btnCast.title = t('cast');

    updateDocumentTitle();
    updateShareLinks();
    updateShareVisibility();
  }

  async function loadPublicConfig(options = {}) {
    try {
      const response = await fetch('/api/public-config', { cache: options.noCache ? 'no-store' : 'default' });
      const data = await response.json();
      if (data?.channelName) {
        channelName = String(data.channelName);
      }
      if (data?.version) {
        appVersion = String(data.version);
      }
      if (data?.faviconUrl) {
        faviconUrl = String(data.faviconUrl);
      }
      epgEnabled = Boolean(data?.epgEnabled);
      if (data?.homeCustomization) {
        applyHomeCustomization(data.homeCustomization);
      }

      updateDocumentTitle();
      if (logoChannelName) {
        logoChannelName.textContent = channelName;
      }
      if (appVersionLine) {
        appVersionLine.textContent = `Webtv Framework - ${currentLang === 'en' ? 'Version' : 'Versao'} ${appVersion}`;
      }
      applyFavicon(faviconUrl);
      applyBrandIcon(faviconUrl);
      applyEpgVisibility();
      updateShareLinks();

      return data;
    } catch (_) {
      // Mantém fallback local quando configuração não estiver disponível.
    }

    return null;
  }

  async function pollStreamState() {
    try {
      const previousVersion = streamStateVersion;
      const previousEpgEnabled = epgEnabled;
      const data = await loadPublicConfig({ noCache: true });
      if (!data?.streamStateVersion) {
        return;
      }

      if (previousEpgEnabled !== epgEnabled) {
        restartEpgPolling();
      }

      const nextVersion = Number(data.streamStateVersion) || 0;
      if (previousVersion && nextVersion !== previousVersion) {
        streamStateVersion = nextVersion;
        initPlayer();
        updateSidebarEpg();
        return;
      }

      streamStateVersion = nextVersion;
    } catch (_) {
      // Ignora falhas transitórias de polling.
    }
  }

  async function readStreamNotice() {
    try {
      const response = await fetch('/stream/playlist.m3u8', { cache: 'no-store' });
      if (!response.ok) return null;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/vnd.apple.mpegurl')) return null;

      const playlist = await response.text();
      if (!playlist.includes('/stream/notice.ts')) return null;

      const daterangeMatch = playlist.match(/X-TVSABINOS-MESSAGE="([^"]+)"/);
      if (daterangeMatch?.[1]) return daterangeMatch[1];

      const extinfMatch = playlist.match(/#EXTINF:[^,]*,(.*)/);
      if (extinfMatch?.[1]) return extinfMatch[1].trim();

      return t('streamNoticeFallback');
    } catch (_) {
      return null;
    }
  }

  async function startPlayback() {
    try {
      await video.play();
    } catch (_) {
      // Fallback para política de autoplay: tenta novamente em modo mudo.
      video.muted = true;
      updateMuteIcon();
      video.play().catch(() => {});
    }
  }

  async function initPlayer() {
    if (hls) { hls.destroy(); hls = null; }

    // Tenta iniciar com áudio; o fallback para mudo ocorre apenas se autoplay for bloqueado.
    video.muted = false;
    updateMuteIcon();

    showLoading(true);
    showError(false);

    const src = '/stream/playlist.m3u8';

    const notice = await readStreamNotice();
    if (notice) {
      showLoading(false);
      showError(true, notice);
      video.pause();
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        showLoading(false);
        startPlayback();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          showLoading(false);
          showError(true, t('streamLoadError'));
          console.error('[HLS] Erro fatal:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = src;
      video.addEventListener('loadedmetadata', () => showLoading(false), { once: true });
      video.addEventListener('error', () => {
        showLoading(false);
        showError(true, t('streamNativeError'));
      }, { once: true });
      startPlayback();
    } else {
      showLoading(false);
      showError(true, t('hlsUnsupported'));
    }
  }

  function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
  }

  function showError(show, msg = '') {
    errorBox.style.display  = show ? 'flex' : 'none';
    if (msg) errorMsg.textContent = msg;
  }

  // ── Controles do Player ──────────────────────────────────────────────────
  btnPlay.addEventListener('click', () => {
    togglePlayback();
  });

  video.addEventListener('play', () => {
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
  });

  video.addEventListener('pause', () => {
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
  });

  btnMute.addEventListener('click', () => {
    if (!isMuteEnabled()) return;
    video.muted = !video.muted;
    updateMuteIcon();
  });

  volRange.addEventListener('input', () => {
    if (!isVolumeEnabled()) return;
    video.volume = parseFloat(volRange.value);
    video.muted  = video.volume === 0;
    updateMuteIcon();
  });

  function updateMuteIcon() {
    iconVol.style.display   = video.muted ? 'none'  : 'block';
    iconMuted.style.display = video.muted ? 'block' : 'none';
  }

  btnFS.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    const isFS = !!document.fullscreenElement;
    iconFS.style.display     = isFS ? 'none'  : 'block';
    iconExitFS.style.display = isFS ? 'block' : 'none';
  });

  function toggleFullscreen() {
    if (!isFullscreenEnabled()) {
      return;
    }

    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().catch(err => {
        console.warn('[FS]', err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Duplo clique para fullscreen
  video.addEventListener('dblclick', () => {
    if (!isFullscreenEnabled()) return;
    toggleFullscreen();
  });

  btnRetry.addEventListener('click', initPlayer);
  document.addEventListener('keydown', handleRemoteKey);

  if (shareCopyLink) {
    shareCopyLink.addEventListener('click', async () => {
      const shareUrl = buildShareUrl();
      try {
        await navigator.clipboard.writeText(shareUrl);
        window.alert(t('shareCopySuccess'));
      } catch (_) {
        window.alert(t('shareCopyError'));
      }
    });
  }

  // ── Google Cast ─────────────────────────────────────────────────────────
  window.__onGCastApiAvailable = function onGCastApiAvailable(isAvailable) {
    if (!isAvailable || !window.cast?.framework || !window.chrome?.cast) {
      return;
    }

    castApiAvailable = true;

    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    updateCastButtonVisibility();
  };

  btnCast.addEventListener('click', async () => {
    if (!isCastEnabled()) {
      return;
    }

    if (!window.cast?.framework || !window.chrome?.cast) {
      return;
    }

    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      window.alert(t('castLocalhostAlert'));
      return;
    }

    try {
      const context = cast.framework.CastContext.getInstance();
      let session = context.getCurrentSession();

      if (!session) {
        await context.requestSession();
        session = context.getCurrentSession();
      }

      if (!session) {
        return;
      }

      const mediaInfo = new chrome.cast.media.MediaInfo(
        new URL('/stream/playlist.m3u8', window.location.origin).toString(),
        'application/x-mpegURL'
      );
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;

      const metadata = new chrome.cast.media.GenericMediaMetadata();
      metadata.title = `${channelName} ${t('titleLive')}`;
      metadata.subtitle = currentTitle.textContent || t('liveSubtitleFallback');
      mediaInfo.metadata = metadata;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      request.currentTime = 0;

      await session.loadMedia(request);
    } catch (err) {
      console.error('[CAST] Falha ao iniciar transmissão:', err);
      window.alert(t('castFailAlert'));
    }
  });

  // ── EPG: Sidebar (agora / próximo) ───────────────────────────────────────
  function fmtTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
  }

  function updateSidebarEpg() {
    if (!epgEnabled) {
      return;
    }

    fetch('/api/epg/now')
      .then(r => r.json())
      .then(data => {
        if (!data || !data.length) {
          currentTitle.textContent = t('scheduleUnavailable');
          return;
        }

        // Tenta encontrar o canal "TV Sabinos" — fallback para o primeiro
        const entry = data[0];
        const curr  = entry.current;
        const next  = entry.next;

        // Agora
        currentTitle.textContent = decodeHtml(curr?.title) || '—';
        if (curr?.start && curr?.stop) {
          currentTime.textContent = `${fmtTime(curr.start)} — ${fmtTime(curr.stop)}`;
          const total   = new Date(curr.stop) - new Date(curr.start);
          const elapsed = Date.now() - new Date(curr.start);
          const pct     = Math.max(0, Math.min(100, (elapsed / total) * 100));
          progressFill.style.width = `${pct}%`;
        }
        currentDesc.textContent = decodeHtml(curr?.desc) || '';
        currentCat.textContent  = decodeHtml(curr?.category) || '';
        currentCat.style.display = curr?.category ? 'inline-block' : 'none';

        // Próximo
        nextTitle.textContent = decodeHtml(next?.title) || '—';
        if (next?.start && next?.stop) {
          nextTime.textContent = `${fmtTime(next.start)} — ${fmtTime(next.stop)}`;
        } else {
          nextTime.textContent = '';
        }
        nextDesc.textContent = decodeHtml(next?.desc) || '';
        nextCat.textContent  = decodeHtml(next?.category) || '';
        nextCat.style.display = next?.category ? 'inline-block' : 'none';
      })
      .catch(() => {
        currentTitle.textContent = t('epgLoadError');
      });
  }

  function restartEpgPolling() {
    if (epgSidebarTimer) {
      clearInterval(epgSidebarTimer);
      epgSidebarTimer = null;
    }

    if (!epgEnabled) {
      return;
    }

    updateSidebarEpg();
    epgSidebarTimer = setInterval(updateSidebarEpg, 60_000);
  }

  // ── Analytics / audiência ───────────────────────────────────────────────
  function fmtUpdatedAt(iso) {
    if (!iso) return t('updateUnavailable');
    return `${t('updatedAt')} ${new Date(iso).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  }

  function updateViewerCard(viewers, updatedAt = new Date().toISOString()) {
    viewerCount.textContent = String(viewers || 0);
    viewerUpdated.textContent = fmtUpdatedAt(updatedAt);
  }

  async function startAnalyticsSession() {
    try {
      const response = await fetch('/api/analytics/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      const data = await response.json();
      analyticsSessionId = data.sessionId;
      updateViewerCard(data.viewers);

      heartbeatTimer = window.setInterval(sendHeartbeat, data.pingIntervalMs || 20000);
      liveTimer = window.setInterval(fetchLiveViewers, 10000);
    } catch (err) {
      console.error('[ANALYTICS] Falha ao iniciar sessão:', err);
    }
  }

  async function sendHeartbeat() {
    if (!analyticsSessionId) return;

    try {
      const response = await fetch('/api/analytics/session/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: analyticsSessionId }),
      });
      const data = await response.json();
      updateViewerCard(data.viewers);
    } catch (err) {
      console.error('[ANALYTICS] Falha no heartbeat:', err);
    }
  }

  async function fetchLiveViewers() {
    try {
      const response = await fetch('/api/analytics/live');
      const data = await response.json();
      updateViewerCard(data.viewers, data.updatedAt);
    } catch (err) {
      console.error('[ANALYTICS] Falha ao buscar audiência:', err);
    }
  }

  function endAnalyticsSession() {
    if (!analyticsSessionId) return;

    if (streamStatePollTimer) {
      clearInterval(streamStatePollTimer);
      streamStatePollTimer = null;
    }
    if (epgSidebarTimer) {
      clearInterval(epgSidebarTimer);
      epgSidebarTimer = null;
    }
    if (streamStateChannel) {
      streamStateChannel.close();
      streamStateChannel = null;
    }

    const payload = JSON.stringify({ sessionId: analyticsSessionId });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/session/end', blob);
    }
  }

  window.addEventListener('beforeunload', endAnalyticsSession);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      endAnalyticsSession();
    }
  });

  // ── Modal Grade EPG ──────────────────────────────────────────────────────
  let epgLoaded = false;
  let epgGridData = [];

  btnEpg.addEventListener('click', openEpgModal);
  epgClose.addEventListener('click', closeEpgModal);
  epgOverlay.addEventListener('click', e => {
    if (e.target === epgOverlay) closeEpgModal();
  });
  epgGridBody.addEventListener('click', onEpgProgrammeClick);
  epgDetailClose.addEventListener('click', closeProgrammeDetail);
  epgDetailOverlay.addEventListener('click', e => {
    if (e.target === epgDetailOverlay) closeProgrammeDetail();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (isProgrammeDetailOpen()) {
      closeProgrammeDetail();
      return;
    }
    closeEpgModal();
  });

  function openEpgModal() {
    if (!epgEnabled) return;
    epgOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!epgLoaded) loadEpgGrid();
  }

  function closeEpgModal() {
    epgOverlay.classList.remove('open');
    closeProgrammeDetail();
    document.body.style.overflow = '';
  }

  function loadEpgGrid() {
    epgGridBody.innerHTML = `
      <div class="epg-loading">
        <div class="spinner"></div>
        <p>${t('epgLoadingGrid')}</p>
      </div>`;

    fetch('/api/epg/grid')
      .then(r => r.json())
      .then(grid => {
        epgGridData = Array.isArray(grid) ? grid : [];
        renderEpgGrid(epgGridData);
      })
      .catch(() => {
        epgGridBody.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center">${t('epgGridLoadError')}</p>`;
      });
  }

  function renderEpgGrid(grid) {
    if (!grid || !grid.length) {
      epgGridBody.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center">${t('noSchedule')}</p>`;
      return;
    }

    const now = new Date();
    let html = '';

    for (const [channelIndex, block] of grid.entries()) {
      html += `<div class="epg-channel-block">`;
      if (grid.length > 1) {
        html += `<div class="epg-channel-name">${esc(block.channel?.name || block.channel?.id)}</div>`;
      }

      html += `<div class="epg-programme-list">`;

      let lastDate = '';

      for (const [programmeIndex, prog] of block.programmes.entries()) {
        const start   = prog.start ? new Date(prog.start) : null;
        const stop    = prog.stop  ? new Date(prog.stop)  : null;
        const isCurr  = start && stop && start <= now && stop > now;

        // Separador de data
        if (start) {
          const dateLabel = start.toLocaleDateString(locale(), { weekday: 'long', day: '2-digit', month: 'long' });
          if (dateLabel !== lastDate) {
            html += `<div class="epg-date-separator">${esc(dateLabel)}</div>`;
            lastDate = dateLabel;
          }
        }

        const timeStr = start ? start.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' }) : '—';

        html += `<button class="epg-programme-btn" type="button" data-channel-index="${channelIndex}" data-programme-index="${programmeIndex}"><div class="epg-programme${isCurr ? ' is-current' : ''}">
          <div class="epg-prog-time">${timeStr}</div>
          <div class="epg-prog-info">
            <div class="epg-prog-title">${esc(prog.title)}</div>
            ${prog.desc ? `<div class="epg-prog-desc">${esc(prog.desc)}</div>` : ''}
          </div>
          ${isCurr ? `<div class="epg-now-tag">${esc(t('nowTag'))}</div>` : ''}
        </div></button>`;
      }

      html += `</div></div>`;
    }

    epgGridBody.innerHTML = html;
    epgLoaded = true;

    // Rola até o programa atual
    const curr = epgGridBody.querySelector('.is-current');
    if (curr) {
      setTimeout(() => curr.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }

  function onEpgProgrammeClick(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('.epg-programme-btn');
    if (!button) return;

    const channelIndex = Number(button.dataset.channelIndex);
    const programmeIndex = Number(button.dataset.programmeIndex);
    const block = epgGridData[channelIndex];
    const programme = block?.programmes?.[programmeIndex];
    if (!programme) return;

    openProgrammeDetail(programme, block.channel);
  }

  function isProgrammeDetailOpen() {
    return epgDetailOverlay.style.display === 'flex';
  }

  function closeProgrammeDetail() {
    epgDetailOverlay.style.display = 'none';
  }

  function addDetailItem(label, value) {
    if (!value) return '';
    return `<div class="epg-detail-item"><span class="epg-detail-label">${esc(label)}</span><div class="epg-detail-value">${esc(value)}</div></div>`;
  }

  function fmtDetailDate(startIso, stopIso) {
    const start = startIso ? new Date(startIso) : null;
    const stop = stopIso ? new Date(stopIso) : null;
    if (!start) return t('timeUnavailable');

    const day = start.toLocaleDateString(locale(), { weekday: 'long', day: '2-digit', month: 'long' });
    if (!stop) return `${day} • ${fmtTime(startIso)}`;
    return `${day} • ${fmtTime(startIso)} — ${fmtTime(stopIso)}`;
  }

  function openProgrammeDetail(programme, channel) {
    epgDetailTime.textContent = `${fmtDetailDate(programme.start, programme.stop)}${channel?.name ? ` • ${decodeHtml(channel.name)}` : ''}`;
    epgDetailTitle.textContent = decodeHtml(programme.title || t('untitled'));

    if (programme.subTitle) {
      epgDetailSubtitle.style.display = 'block';
      epgDetailSubtitle.textContent = decodeHtml(programme.subTitle);
    } else {
      epgDetailSubtitle.style.display = 'none';
      epgDetailSubtitle.textContent = '';
    }

    if (programme.category) {
      epgDetailCategory.style.display = 'inline-block';
      epgDetailCategory.textContent = decodeHtml(programme.category);
    } else {
      epgDetailCategory.style.display = 'none';
      epgDetailCategory.textContent = '';
    }

    epgDetailDesc.textContent = decodeHtml(programme.desc || t('synopsisUnavailable'));

    if (programme.icon) {
      epgDetailCover.style.display = 'block';
      epgDetailCover.src = programme.icon;
      epgDetailCover.onerror = () => {
        epgDetailCover.style.display = 'none';
        epgDetailCover.removeAttribute('src');
        epgDetailCoverEmpty.style.display = 'flex';
      };
      epgDetailCoverEmpty.style.display = 'none';
    } else {
      epgDetailCover.style.display = 'none';
      epgDetailCover.removeAttribute('src');
      epgDetailCover.onerror = null;
      epgDetailCoverEmpty.style.display = 'flex';
    }

    const actors = Array.isArray(programme.actors) ? programme.actors.join(', ') : '';
    const directors = Array.isArray(programme.directors) ? programme.directors.join(', ') : '';
    const presenters = Array.isArray(programme.presenters) ? programme.presenters.join(', ') : '';
    const producers = Array.isArray(programme.producers) ? programme.producers.join(', ') : '';
    const writers = Array.isArray(programme.writers) ? programme.writers.join(', ') : '';
    const countries = Array.isArray(programme.countries) ? programme.countries.join(', ') : '';

    epgDetailExtra.innerHTML = [
      addDetailItem(t('actors'), actors),
      addDetailItem(t('direction'), directors),
      addDetailItem(t('presentation'), presenters),
      addDetailItem(t('production'), producers),
      addDetailItem(t('writing'), writers),
      addDetailItem(t('country'), countries),
      addDetailItem(t('language'), programme.language),
      addDetailItem(t('originalLanguage'), programme.originalLanguage),
      addDetailItem(t('date'), programme.date),
      addDetailItem(t('episode'), programme.episodeNum),
      addDetailItem(t('rating'), programme.rating),
    ].filter(Boolean).join('');

    epgDetailOverlay.style.display = 'flex';
  }

  // Decodifica entidades HTML (ex: &#233; → é) usando o DOM
  function decodeHtml(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = String(str);
    return txt.value;
  }

  function esc(str) {
    if (!str) return '';
    // Primeiro decodifica entidades, depois protege contra XSS
    return decodeHtml(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Inicializa ────────────────────────────────────────────────────────────
  applyStaticTranslations();

  async function checkSiteAccess() {
    try {
      const response = await fetch('/api/access-check?target=site', { cache: 'no-store' });
      if (!response.ok) return false;
      const data = await response.json();
      if (data && data.blocked) {
        showLoading(false);
        showError(true, data.message || 'Canal bloqueado para a sua regiao.');
        return true;
      }
    } catch (_) {
      // Se a verificação falhar, permite acesso normalmente
    }
    return false;
  }

  loadPublicConfig().then((data) => {
    streamStateVersion = Number(data?.streamStateVersion) || 0;
  }).catch(() => {}).finally(async () => {
    applyStaticTranslations();
    const isBlocked = await checkSiteAccess();
    if (!isBlocked) {
      initPlayer();
    }
    focusPlayerForTv();
    restartEpgPolling();
    startAnalyticsSession();
    if ('BroadcastChannel' in window) {
      streamStateChannel = new BroadcastChannel('webtv-stream-state');
      streamStateChannel.addEventListener('message', () => {
        pollStreamState();
      });
    }
    streamStatePollTimer = window.setInterval(pollStreamState, 2000);
  });

})();
