(function () {
  'use strict';

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      loadingEpg: 'Carregando...',
      updateUnavailable: 'Atualizacao indisponivel',
      scheduleUnavailable: 'Sem informacao de programacao',
      coverMissing: 'Sem imagem de capa',
      noSchedule: 'Sem programacao disponivel',
      timeUnavailable: 'Horario indisponivel',
      untitled: 'Sem titulo',
      currentProgramTitle: 'Programa atual',
      nextProgramTitle: 'Proximo programa',
      epgButtonLabel: 'Grade de programacao',
      epgUnavailable: 'EPG indisponivel',
      seeFullGuide: 'Ver grade completa',
      currentAudienceTitle: 'Audiencia atual',
      totalAudienceTitle: 'Audiencia total',
      waitingUpdate: 'Aguardando atualizacao...',
      shareTransmission: 'Compartilhar transmissao',
      copyLink: 'Copiar link',
      linkCopied: 'Copiado!',
      copyFailed: 'Falha ao copiar',
      noWidgetsEnabled: 'Nenhum widget habilitado no embed.',
      loadingProgramData: 'Carregando...',
      epgCloseButton: 'Fechar',
      epgTitle: '📋 Grade de Programacao',
      epgNoData: 'Nenhum programa disponivel.',
      close: 'Fechar',
      mute: 'Mudo',
      fullscreen: 'Tela Cheia',
      cast: 'Enviar para Google Cast',
      playPause: 'Play / Pause',
      volume: 'Volume',
      updatedAt: 'Atualizado as',
      nextProgramNotAvailable: 'Sem proximo programa',
      loadingEpg: 'Carregando...',
      noProgrammingAvailable: 'Nenhuma programacao disponivel.',
      untitled: 'Sem titulo',
      synopsisUnavailable: 'Sinopse indisponivel.',
      streamUnavailable: 'Transmissao indisponivel no momento.',
      streamError: 'Erro ao carregar o stream.',
      hlsNotSupported: 'Navegador sem suporte HLS.',
      couldNotLoadSchedule: 'Nao foi possivel carregar a grade de programacao.',
      channel: 'Canal'
    },
    en: {
      loadingEpg: 'Loading...',
      updateUnavailable: 'Update unavailable',
      scheduleUnavailable: 'No schedule information available',
      coverMissing: 'No cover image',
      noSchedule: 'No programming available.',
      timeUnavailable: 'Time unavailable',
      untitled: 'Untitled',
      currentProgramTitle: 'Current program',
      nextProgramTitle: 'Next program',
      epgButtonLabel: 'Program guide',
      epgUnavailable: 'EPG unavailable',
      seeFullGuide: 'See full guide',
      currentAudienceTitle: 'Current audience',
      totalAudienceTitle: 'Total audience',
      waitingUpdate: 'Waiting for update...',
      shareTransmission: 'Share broadcast',
      copyLink: 'Copy link',
      linkCopied: 'Copied!',
      copyFailed: 'Copy failed',
      noWidgetsEnabled: 'No widgets enabled in embed.',
      loadingProgramData: 'Loading...',
      epgCloseButton: 'Close',
      epgTitle: '📋 Program Guide',
      epgNoData: 'No programs available.',
      close: 'Close',
      mute: 'Mute',
      fullscreen: 'Fullscreen',
      cast: 'Cast to Google Cast',
      playPause: 'Play / Pause',
      volume: 'Volume',
      updatedAt: 'Updated at',
      nextProgramNotAvailable: 'No next program',
      loadingEpg: 'Loading...',
      noProgrammingAvailable: 'No programming available.',
      untitled: 'Untitled',
      synopsisUnavailable: 'Synopsis unavailable.',
      streamUnavailable: 'Broadcast unavailable at the moment.',
      streamError: 'Error loading the stream.',
      hlsNotSupported: 'Browser does not support HLS.',
      couldNotLoadSchedule: 'Could not load the program schedule.',
      channel: 'Channel'
    },
    es: {
      loadingEpg: 'Cargando...',
      updateUnavailable: 'Actualización no disponible',
      scheduleUnavailable: 'Sin información de programación disponible',
      coverMissing: 'Sin imagen de portada',
      noSchedule: 'Sin programación disponible.',
      timeUnavailable: 'Hora no disponible',
      untitled: 'Sin título',
      currentProgramTitle: 'Programa actual',
      nextProgramTitle: 'Próximo programa',
      epgButtonLabel: 'Guía de programas',
      epgUnavailable: 'EPG no disponible',
      seeFullGuide: 'Ver guía completa',
      currentAudienceTitle: 'Audiencia actual',
      totalAudienceTitle: 'Audiencia total',
      waitingUpdate: 'Esperando actualización...',
      shareTransmission: 'Compartir transmisión',
      copyLink: 'Copiar enlace',
      linkCopied: '¡Copiado!',
      copyFailed: 'Error al copiar',
      noWidgetsEnabled: 'Sin widgets habilitados en embed.',
      loadingProgramData: 'Cargando...',
      epgCloseButton: 'Cerrar',
      epgTitle: '📋 Guía de Programas',
      epgNoData: 'Sin programas disponibles.',
      close: 'Cerrar',
      mute: 'Silenciar',
      fullscreen: 'Pantalla Completa',
      cast: 'Enviar a Google Cast',
      playPause: 'Reproducir / Pausar',
      volume: 'Volumen',
      updatedAt: 'Actualizado a las',
      nextProgramNotAvailable: 'Sin próximo programa',
      loadingEpg: 'Cargando...',
      noProgrammingAvailable: 'Sin programación disponible.',
      untitled: 'Sin título',
      synopsisUnavailable: 'Sinopsis no disponible.',
      streamUnavailable: 'Transmisión no disponible en este momento.',
      streamError: 'Error al cargar la transmisión.',
      hlsNotSupported: 'Navegador sin soporte HLS.',
      couldNotLoadSchedule: 'No se pudo cargar la guía de programas.',
      channel: 'Canal'
    },
    ru: {
      loadingEpg: 'Загрузка...',
      updateUnavailable: 'Обновление недоступно',
      scheduleUnavailable: 'Информация о расписании недоступна',
      coverMissing: 'Нет изображения обложки',
      noSchedule: 'Программирование недоступно.',
      timeUnavailable: 'Время недоступно',
      untitled: 'Без названия',
      currentProgramTitle: 'Текущая программа',
      nextProgramTitle: 'Следующая программа',
      epgButtonLabel: 'Программа',
      epgUnavailable: 'EPG недоступен',
      seeFullGuide: 'Полная программа',
      currentAudienceTitle: 'Текущая аудитория',
      totalAudienceTitle: 'Общая аудитория',
      waitingUpdate: 'Ожидание обновления...',
      shareTransmission: 'Поделиться трансляцией',
      copyLink: 'Скопировать ссылку',
      linkCopied: 'Скопировано!',
      copyFailed: 'Ошибка копирования',
      noWidgetsEnabled: 'Нет включенных виджетов в embed.',
      loadingProgramData: 'Загрузка...',
      epgCloseButton: 'Закрыть',
      epgTitle: '📋 Программа',
      epgNoData: 'Нет доступных программ.',
      close: 'Закрыть',
      mute: 'Без звука',
      fullscreen: 'Полный экран',
      cast: 'Отправить на Google Cast',
      playPause: 'Воспроизведение / Пауза',
      volume: 'Громкость',
      updatedAt: 'Обновлено в',
      nextProgramNotAvailable: 'Нет следующей программы',
      loadingEpg: 'Загрузка...',
      noProgrammingAvailable: 'Программирование недоступно.',
      untitled: 'Без названия',
      synopsisUnavailable: 'Описание недоступно.',
      streamUnavailable: 'Трансляция недоступна в данный момент.',
      streamError: 'Ошибка при загрузке потока.',
      hlsNotSupported: 'Браузер не поддерживает HLS.',
      couldNotLoadSchedule: 'Не удалось загрузить программу.',
      channel: 'Канал'
    },
    zh: {
      loadingEpg: '加载中...',
      updateUnavailable: '更新不可用',
      scheduleUnavailable: '无可用的时间表信息',
      coverMissing: '无封面图片',
      noSchedule: '没有可用的节目。',
      timeUnavailable: '时间不可用',
      untitled: '无标题',
      currentProgramTitle: '当前节目',
      nextProgramTitle: '下一个节目',
      epgButtonLabel: '节目指南',
      epgUnavailable: 'EPG不可用',
      seeFullGuide: '查看完整指南',
      currentAudienceTitle: '当前观众',
      totalAudienceTitle: '总观众',
      waitingUpdate: '等待更新...',
      shareTransmission: '分享直播',
      copyLink: '复制链接',
      linkCopied: '已复制！',
      copyFailed: '复制失败',
      noWidgetsEnabled: '未在embed中启用任何小部件。',
      loadingProgramData: '加载中...',
      epgCloseButton: '关闭',
      epgTitle: '📋 节目指南',
      epgNoData: '无可用节目。',
      close: '关闭',
      mute: '静音',
      fullscreen: '全屏',
      cast: '投射到Google Cast',
      playPause: '播放 / 暂停',
      volume: '音量',
      updatedAt: '更新于',
      nextProgramNotAvailable: '没有下一个节目',
      loadingEpg: '加载中...',
      noProgrammingAvailable: '没有可用节目。',
      untitled: '无标题',
      synopsisUnavailable: '摘要不可用。',
      streamUnavailable: '直播暂时不可用。',
      streamError: '加载流错误。',
      hlsNotSupported: '浏览器不支持HLS。',
      couldNotLoadSchedule: '无法加载节目指南。',
      channel: '频道'
    },
    pl: {
      loadingEpg: 'Ładowanie...',
      updateUnavailable: 'Aktualizacja niedostępna',
      scheduleUnavailable: 'Brak dostępnych informacji o harmonogramie',
      coverMissing: 'Brak obrazu okładki',
      noSchedule: 'Brak dostępnego programowania.',
      timeUnavailable: 'Czas niedostępny',
      untitled: 'Bez tytułu',
      currentProgramTitle: 'Bieżący program',
      nextProgramTitle: 'Następny program',
      epgButtonLabel: 'Przewodnik programu',
      epgUnavailable: 'EPG niedostępny',
      seeFullGuide: 'Zobacz pełny przewodnik',
      currentAudienceTitle: 'Bieżąca widownia',
      totalAudienceTitle: 'Całkowita widownia',
      waitingUpdate: 'Oczekiwanie na aktualizację...',
      shareTransmission: 'Udostępnij transmisję',
      copyLink: 'Skopiuj link',
      linkCopied: 'Skopiowano!',
      copyFailed: 'Błąd kopiowania',
      noWidgetsEnabled: 'Brak włączonych widgetów w embed.',
      loadingProgramData: 'Ładowanie...',
      epgCloseButton: 'Zamknij',
      epgTitle: '📋 Przewodnik Programu',
      epgNoData: 'Brak dostępnych programów.',
      close: 'Zamknij',
      mute: 'Wycisz',
      fullscreen: 'Pełny ekran',
      cast: 'Wyślij do Google Cast',
      playPause: 'Odtwórz / Pauza',
      volume: 'Głośność',
      updatedAt: 'Zaktualizowane o',
      nextProgramNotAvailable: 'Brak następnego programu',
      loadingEpg: 'Ładowanie...',
      noProgrammingAvailable: 'Brak dostępnego programowania.',
      untitled: 'Bez tytułu',
      synopsisUnavailable: 'Streszczenie niedostępne.',
      streamUnavailable: 'Transmisja niedostępna w tej chwili.',
      streamError: 'Błąd podczas ładowania strumienia.',
      hlsNotSupported: 'Przeglądarka nie obsługuje HLS.',
      couldNotLoadSchedule: 'Nie można załadować harmonogramu programu.',
      channel: 'Kanał'
    },
    it: {
      loadingEpg: 'Caricamento...',
      updateUnavailable: 'Aggiornamento non disponibile',
      scheduleUnavailable: 'Nessuna informazione sulla programmazione disponibile',
      coverMissing: 'Nessuna immagine di copertina',
      noSchedule: 'Nessuna programmazione disponibile.',
      timeUnavailable: 'Ora non disponibile',
      untitled: 'Senza titolo',
      currentProgramTitle: 'Programma attuale',
      nextProgramTitle: 'Prossimo programma',
      epgButtonLabel: 'Guida programmi',
      epgUnavailable: 'EPG non disponibile',
      seeFullGuide: 'Vedi guida completa',
      currentAudienceTitle: 'Pubblico attuale',
      totalAudienceTitle: 'Pubblico totale',
      waitingUpdate: 'In attesa di aggiornamento...',
      shareTransmission: 'Condividi trasmissione',
      copyLink: 'Copia link',
      linkCopied: 'Copiato!',
      copyFailed: 'Copia non riuscita',
      noWidgetsEnabled: 'Nessun widget abilitato in embed.',
      loadingProgramData: 'Caricamento...',
      epgCloseButton: 'Chiudi',
      epgTitle: '📋 Guida Programmi',
      epgNoData: 'Nessun programma disponibile.',
      close: 'Chiudi',
      mute: 'Muto',
      fullscreen: 'Schermo Intero',
      cast: 'Trasmetti a Google Cast',
      playPause: 'Riproduci / Pausa',
      volume: 'Volume',
      updatedAt: 'Aggiornato alle',
      nextProgramNotAvailable: 'Nessun prossimo programma',
      loadingEpg: 'Caricamento...',
      noProgrammingAvailable: 'Nessuna programmazione disponibile.',
      untitled: 'Senza titolo',
      synopsisUnavailable: 'Trama non disponibile.',
      streamUnavailable: 'Trasmissione non disponibile al momento.',
      streamError: 'Errore durante il caricamento del flusso.',
      hlsNotSupported: 'Il browser non supporta HLS.',
      couldNotLoadSchedule: 'Impossibile caricare la guida ai programmi.',
      channel: 'Canale'
    },
    de: {
      loadingEpg: 'Wird geladen...',
      updateUnavailable: 'Aktualisierung nicht verfügbar',
      scheduleUnavailable: 'Keine Terminplaninformationen verfügbar',
      coverMissing: 'Kein Titelbild vorhanden',
      noSchedule: 'Keine Programmierung verfügbar.',
      timeUnavailable: 'Zeit nicht verfügbar',
      untitled: 'Ohne Titel',
      currentProgramTitle: 'Aktuelles Programm',
      nextProgramTitle: 'Nächstes Programm',
      epgButtonLabel: 'Programmführer',
      epgUnavailable: 'EPG nicht verfügbar',
      seeFullGuide: 'Vollständigen Führer anzeigen',
      currentAudienceTitle: 'Aktuelles Publikum',
      totalAudienceTitle: 'Gesamtpublikum',
      waitingUpdate: 'Auf Aktualisierung warten...',
      shareTransmission: 'Übertragung teilen',
      copyLink: 'Link kopieren',
      linkCopied: 'Kopiert!',
      copyFailed: 'Kopieren fehlgeschlagen',
      noWidgetsEnabled: 'Keine Widgets in embed aktiviert.',
      loadingProgramData: 'Wird geladen...',
      epgCloseButton: 'Schließen',
      epgTitle: '📋 Programmführer',
      epgNoData: 'Keine Programme verfügbar.',
      close: 'Schließen',
      mute: 'Stumm',
      fullscreen: 'Vollbild',
      cast: 'An Google Cast senden',
      playPause: 'Abspielen / Pause',
      volume: 'Lautstärke',
      updatedAt: 'Aktualisiert am',
      nextProgramNotAvailable: 'Kein nächstes Programm',
      loadingEpg: 'Wird geladen...',
      noProgrammingAvailable: 'Keine Programmierung verfügbar.',
      untitled: 'Ohne Titel',
      synopsisUnavailable: 'Zusammenfassung nicht verfügbar.',
      streamUnavailable: 'Übertragung ist im Moment nicht verfügbar.',
      streamError: 'Fehler beim Laden des Streams.',
      hlsNotSupported: 'Browser unterstützt HLS nicht.',
      couldNotLoadSchedule: 'Programmführer konnte nicht geladen werden.',
      channel: 'Kanal'
    }
  };

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

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

  const video = document.getElementById('video');
  const playerWrapper = document.getElementById('player-wrapper');
  const loading = document.getElementById('player-loading');
  const errorBox = document.getElementById('player-error');
  const errorMsg = document.getElementById('error-msg');
  const btnPlay = document.getElementById('btn-play');
  const btnMute = document.getElementById('btn-mute');
  const volRange = document.getElementById('volume-range');
  const btnCast = document.getElementById('btn-cast');
  const btnFS = document.getElementById('btn-fullscreen');
  const altProgramNotice = document.getElementById('alt-program-notice-embed');
  const widgetsContainer = document.getElementById('embed-widgets');
  const epgOverlay = document.getElementById('embed-epg-overlay');
  const epgBody = document.getElementById('embed-epg-body');
  const epgClose = document.getElementById('embed-epg-close');
  const epgDetail = document.getElementById('embed-epg-detail');

  const WIDGET_IDS = ['epgButton', 'currentProgram', 'nextProgram', 'currentAudience', 'totalAudience', 'shareOptions'];
  const DEFAULT_EMBED_CUSTOMIZATION = {
    order: [...WIDGET_IDS],
    enabled: {
      epgButton: true,
      currentProgram: true,
      nextProgram: true,
      currentAudience: true,
      totalAudience: false,
      shareOptions: true,
    },
  };

  let hls = null;
  let analyticsSessionId = null;
  let heartbeatTimer = null;
  let streamStatePollTimer = null;
  let streamStateChannel = null;
  let streamStateVersion = 0;
  let alternativeProgrammingMessage = '';
  let widgetPollers = [];
  let epgEnabled = true;
  let embedCustomization = { ...DEFAULT_EMBED_CUSTOMIZATION };
  let customizationSignature = '';
  let epgGridData = [];

  async function loadPublicConfig() {
    try {
      const response = await fetch('/api/public-config', { cache: 'no-store' });
      return await response.json();
    } catch (_) {
      return null;
    }
  }

  function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
  }

  function showError(show, msg = '') {
    errorBox.style.display = show ? 'flex' : 'none';
    if (msg) errorMsg.textContent = msg;
  }

  function updateAlternativeProgrammingNotice() {
    if (!altProgramNotice) return;
    if (alternativeProgrammingMessage) {
      altProgramNotice.textContent = alternativeProgrammingMessage;
      altProgramNotice.style.display = 'block';
      return;
    }

    altProgramNotice.textContent = '';
    altProgramNotice.style.display = 'none';
  }

  function sanitizeEmbedCustomization(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const incomingOrder = Array.isArray(source.order) ? source.order : [];
    const uniqueOrder = incomingOrder
      .map((id) => String(id || '').trim())
      .filter((id, index, list) => WIDGET_IDS.includes(id) && list.indexOf(id) === index);

    const order = [
      ...uniqueOrder,
      ...WIDGET_IDS.filter((id) => !uniqueOrder.includes(id)),
    ];

    const sourceEnabled = source.enabled && typeof source.enabled === 'object' ? source.enabled : {};
    const enabled = {};
    WIDGET_IDS.forEach((id) => {
      enabled[id] = sourceEnabled[id] !== false;
    });

    return { order, enabled };
  }

  function applyRuntimeConfig(data) {
    if (!data || typeof data !== 'object') {
      return;
    }

    epgEnabled = Boolean(data?.epgEnabled);
    alternativeProgrammingMessage = data?.alternativeProgrammingActive
      ? String(data.alternativeProgrammingMessage || '').trim()
      : '';
    updateAlternativeProgrammingNotice();
    const nextCustomization = sanitizeEmbedCustomization(data?.embedCustomization || DEFAULT_EMBED_CUSTOMIZATION);
    const nextSignature = JSON.stringify({ epgEnabled, nextCustomization });

    if (nextSignature === customizationSignature) {
      return;
    }

    customizationSignature = nextSignature;
    embedCustomization = nextCustomization;
    renderWidgets();
    restartWidgetPolling();
    refreshWidgetsNow();
  }

  function isWidgetEnabled(id) {
    return embedCustomization.enabled?.[id] !== false;
  }

  function fmtTime(iso) {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
  }

  function fmtUpdatedAt(iso) {
    if (!iso) return t('updateUnavailable');
    return `${t('updatedAt')} ${new Date(iso).toLocaleTimeString(locale(), {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`;
  }

  function getSharePayload() {
    const shareUrl = new URL('/', window.location.origin).toString();
    const shareText = t('shareTransmission');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    return {
      shareUrl,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    };
  }

  function renderWidgets() {
    const enabledOrder = embedCustomization.order.filter((id) => isWidgetEnabled(id));

    if (!enabledOrder.length) {
      widgetsContainer.innerHTML = `<div class="widget-card">${t('noWidgetsEnabled')}</div>`;
      return;
    }

    const cards = enabledOrder.map((id) => {
      if (id === 'epgButton') {
        return `<div class="widget-card"><div class="widget-title">${t('epgButtonLabel')}</div><button class="widget-btn" id="widget-open-epg" ${epgEnabled ? '' : 'disabled'}>${epgEnabled ? t('seeFullGuide') : t('epgUnavailable')}</button></div>`;
      }

      if (id === 'currentProgram') {
        return `<div class="widget-card"><div class="widget-title">${t('currentProgramTitle')}</div><div class="widget-value" id="widget-current-title">${t('loadingProgramData')}</div><div class="widget-meta" id="widget-current-time"></div><div class="widget-meta" id="widget-current-category"></div></div>`;
      }

      if (id === 'nextProgram') {
        return `<div class="widget-card"><div class="widget-title">${t('nextProgramTitle')}</div><div class="widget-value" id="widget-next-title">${t('loadingProgramData')}</div><div class="widget-meta" id="widget-next-time"></div><div class="widget-meta" id="widget-next-category"></div></div>`;
      }

      if (id === 'currentAudience') {
        return `<div class="widget-card"><div class="widget-title">${t('currentAudienceTitle')}</div><div class="widget-value" id="widget-live-viewers">0</div><div class="widget-meta" id="widget-live-updated">${t('waitingUpdate')}</div></div>`;
      }

      if (id === 'totalAudience') {
        return `<div class="widget-card"><div class="widget-title">${t('totalAudienceTitle')}</div><div class="widget-value" id="widget-total-views">0</div><div class="widget-meta" id="widget-total-updated">${t('waitingUpdate')}</div></div>`;
      }

      if (id === 'shareOptions') {
        const payload = getSharePayload();
        return `<div class="widget-card"><div class="widget-title">${t('shareTransmission')}</div><div class="widget-share-actions"><a class="widget-share-btn" href="${payload.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a class="widget-share-btn" href="${payload.facebook}" target="_blank" rel="noopener">Facebook</a><a class="widget-share-btn" href="${payload.x}" target="_blank" rel="noopener">X</a><a class="widget-share-btn" href="${payload.telegram}" target="_blank" rel="noopener">Telegram</a><button class="widget-share-btn" id="widget-copy-share" type="button">${t('copyLink')}</button></div></div>`;
      }

      return '';
    }).join('');

    widgetsContainer.innerHTML = cards;

    const openEpgButton = document.getElementById('widget-open-epg');
    if (openEpgButton && epgEnabled) {
      openEpgButton.addEventListener('click', openEpgModal);
    }

    const copyButton = document.getElementById('widget-copy-share');
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const payload = getSharePayload();
        try {
          await navigator.clipboard.writeText(payload.shareUrl);
          copyButton.textContent = t('linkCopied');
          setTimeout(() => {
            copyButton.textContent = t('copyLink');
          }, 1200);
        } catch (_) {
          copyButton.textContent = t('copyFailed');
          setTimeout(() => {
            copyButton.textContent = t('copyLink');
          }, 1200);
        }
      });
    }
  }

  function clearWidgetPolling() {
    widgetPollers.forEach((timerId) => clearInterval(timerId));
    widgetPollers = [];
  }

  function restartWidgetPolling() {
    clearWidgetPolling();

    if (isWidgetEnabled('currentProgram') || isWidgetEnabled('nextProgram')) {
      widgetPollers.push(window.setInterval(updateEpgWidgets, 60_000));
    }
    if (isWidgetEnabled('currentAudience')) {
      widgetPollers.push(window.setInterval(fetchLiveAudience, 10_000));
    }
    if (isWidgetEnabled('totalAudience')) {
      widgetPollers.push(window.setInterval(fetchAudienceSummary, 30_000));
    }
  }

  function refreshWidgetsNow() {
    if (isWidgetEnabled('currentProgram') || isWidgetEnabled('nextProgram')) {
      updateEpgWidgets();
    }
    if (isWidgetEnabled('currentAudience')) {
      fetchLiveAudience();
    }
    if (isWidgetEnabled('totalAudience')) {
      fetchAudienceSummary();
    }
  }

  function esc(str) {
    return decodeHtml(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function decodeHtml(str) {
    if (!str) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = String(str);
    return textarea.value;
  }

  function updateLiveAudienceCard(viewers, updatedAt) {
    const count = document.getElementById('widget-live-viewers');
    const updated = document.getElementById('widget-live-updated');
    if (!count || !updated) return;

    count.textContent = String(viewers || 0);
    updated.textContent = fmtUpdatedAt(updatedAt || new Date().toISOString());
  }

  function updateTotalAudienceCard(totalViews, updatedAt) {
    const total = document.getElementById('widget-total-views');
    const updated = document.getElementById('widget-total-updated');
    if (!total || !updated) return;

    total.textContent = String(totalViews);
    updated.textContent = fmtUpdatedAt(updatedAt || new Date().toISOString());
  }

  function updateEpgCards(entry) {
    const currentTitle = document.getElementById('widget-current-title');
    const currentTime = document.getElementById('widget-current-time');
    const currentCategory = document.getElementById('widget-current-category');
    const nextTitle = document.getElementById('widget-next-title');
    const nextTime = document.getElementById('widget-next-time');
    const nextCategory = document.getElementById('widget-next-category');

    if (currentTitle) {
      currentTitle.textContent = decodeHtml(entry?.current?.title || t('noSchedule'));
    }
    if (currentTime) {
      if (entry?.current?.start && entry?.current?.stop) {
        currentTime.textContent = `${fmtTime(entry.current.start)} - ${fmtTime(entry.current.stop)}`;
      } else {
        currentTime.textContent = '';
      }
    }
    if (currentCategory) {
      currentCategory.textContent = decodeHtml(entry?.current?.category || '');
    }

    if (nextTitle) {
      nextTitle.textContent = decodeHtml(entry?.next?.title || t('nextProgramNotAvailable'));
    }
    if (nextTime) {
      if (entry?.next?.start && entry?.next?.stop) {
        nextTime.textContent = `${fmtTime(entry.next.start)} - ${fmtTime(entry.next.stop)}`;
      } else {
        nextTime.textContent = '';
      }
    }
    if (nextCategory) {
      nextCategory.textContent = decodeHtml(entry?.next?.category || '');
    }
  }

  async function updateEpgWidgets() {
    try {
      const response = await fetch('/api/epg/now', { cache: 'no-store' });
      const data = await response.json();
      const entry = Array.isArray(data) ? data[0] : null;
      updateEpgCards(entry);
    } catch (_) {
      updateEpgCards(null);
    }
  }

  async function fetchLiveAudience() {
    try {
      const response = await fetch('/api/analytics/live', { cache: 'no-store' });
      const data = await response.json();
      updateLiveAudienceCard(data?.viewers || 0, data?.updatedAt);
    } catch (_) {
      // sem acao
    }
  }

  async function fetchAudienceSummary() {
    try {
      const response = await fetch('/api/analytics/public-summary', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const totalVisits = Number(data?.totalVisits ?? data?.totalViews);
      if (Number.isFinite(totalVisits) && totalVisits >= 0) {
        updateTotalAudienceCard(totalVisits, data?.updatedAt);
      }
      if (typeof data?.currentViewers === 'number') {
        updateLiveAudienceCard(data.currentViewers, data.updatedAt);
      }
    } catch (_) {
      // sem acao
    }
  }

  function openEpgModal() {
    epgOverlay.style.display = 'flex';
    epgDetail.style.display = 'none';
    epgDetail.innerHTML = '';
    loadEpgGrid();
  }

  function closeEpgModal() {
    epgOverlay.style.display = 'none';
  }

  async function loadEpgGrid() {
    epgBody.textContent = 'Carregando...';

    try {
      const response = await fetch('/api/epg/grid', { cache: 'no-store' });
      const grid = await response.json();
      epgGridData = Array.isArray(grid) ? grid : [];

      if (!epgGridData.length) {
        epgBody.innerHTML = '<p>Nenhuma programacao disponivel.</p>';
        return;
      }

      let html = '';
      epgGridData.forEach((channelBlock, channelIndex) => {
        const channelName = esc(channelBlock?.channel?.name || channelBlock?.channel?.id || 'Canal');
        html += `<div class="widget-card"><div class="widget-title">${channelName}</div><div class="embed-epg-list">`;

        const items = Array.isArray(channelBlock.programmes) ? channelBlock.programmes.slice(0, 80) : [];
        items.forEach((programme, programIndex) => {
          const title = esc(programme?.title || 'Sem titulo');
          const desc = esc(programme?.desc || '');
          const time = `${fmtTime(programme?.start)} - ${fmtTime(programme?.stop)}`;
          html += `<button type="button" class="embed-epg-item-btn" data-channel-index="${channelIndex}" data-program-index="${programIndex}"><div class="embed-epg-item"><div class="embed-epg-time">${esc(time)}</div><div class="embed-epg-name">${title}</div>${desc ? `<div class="widget-meta">${desc}</div>` : ''}</div></button>`;
        });

        html += '</div></div>';
      });

      epgBody.innerHTML = html;
    } catch (_) {
      epgBody.innerHTML = '<p>Nao foi possivel carregar a grade de programacao.</p>';
    }
  }

  function showProgrammeDetail(channelIndex, programIndex) {
    const channelBlock = epgGridData[channelIndex];
    const programme = channelBlock?.programmes?.[programIndex];
    if (!programme) return;

    const channelName = decodeHtml(channelBlock?.channel?.name || channelBlock?.channel?.id || 'Canal');
    const title = decodeHtml(programme.title || 'Sem titulo');
    const category = decodeHtml(programme.category || '');
    const desc = decodeHtml(programme.desc || 'Sinopse indisponivel.');
    const time = `${fmtTime(programme.start)} - ${fmtTime(programme.stop)}`;

    epgDetail.innerHTML = `
      <h3 class="embed-epg-detail-title">${esc(title)}</h3>
      <div class="embed-epg-detail-time">${esc(time)} • ${esc(channelName)}${category ? ` • ${esc(category)}` : ''}</div>
      <div class="embed-epg-detail-desc">${esc(desc)}</div>
    `;
    epgDetail.style.display = 'block';
  }

  epgClose.addEventListener('click', closeEpgModal);
  epgBody.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest('.embed-epg-item-btn');
    if (!trigger) return;

    const channelIndex = Number(trigger.getAttribute('data-channel-index'));
    const programIndex = Number(trigger.getAttribute('data-program-index'));
    if (!Number.isInteger(channelIndex) || !Number.isInteger(programIndex)) return;
    showProgrammeDetail(channelIndex, programIndex);
  });
  epgOverlay.addEventListener('click', (event) => {
    if (event.target === epgOverlay) {
      closeEpgModal();
    }
  });

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

      return 'Transmissao indisponivel no momento.';
    } catch (_) {
      return null;
    }
  }

  async function initPlayer() {
    if (hls) {
      hls.destroy();
      hls = null;
    }

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
      hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        showLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          showLoading(false);
          showError(true, 'Erro ao carregar o stream.');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => showLoading(false), { once: true });
      video.play().catch(() => {});
    } else {
      showLoading(false);
      showError(true, 'Navegador sem suporte HLS.');
    }
  }

  btnPlay.addEventListener('click', () => {
    if (video.paused) video.play();
    else video.pause();
  });

  btnMute.addEventListener('click', () => {
    video.muted = !video.muted;
    btnMute.textContent = video.muted ? '🔇' : '🔊';
  });

  volRange.addEventListener('input', () => {
    video.volume = Number(volRange.value);
    video.muted = video.volume === 0;
    btnMute.textContent = video.muted ? '🔇' : '🔊';
  });

  btnFS.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  window.__onGCastApiAvailable = function onGCastApiAvailable(isAvailable) {
    if (!isAvailable || !window.cast?.framework || !window.chrome?.cast) return;

    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    btnCast.style.display = 'inline-flex';
  };

  btnCast.addEventListener('click', async () => {
    if (!window.cast?.framework || !window.chrome?.cast) return;
    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

    try {
      const context = cast.framework.CastContext.getInstance();
      let session = context.getCurrentSession();
      if (!session) {
        await context.requestSession();
        session = context.getCurrentSession();
      }
      if (!session) return;

      const mediaInfo = new chrome.cast.media.MediaInfo(
        new URL('/stream/playlist.m3u8', window.location.origin).toString(),
        'application/x-mpegURL'
      );
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      await session.loadMedia(request);
    } catch (_) {
      // sem ação
    }
  });

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
      updateLiveAudienceCard(data.viewers || 0, new Date().toISOString());
      heartbeatTimer = window.setInterval(sendHeartbeat, data.pingIntervalMs || 20000);
    } catch (_) {
      // sem ação
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
      const data = await response.json().catch(() => ({}));
      if (typeof data?.viewers === 'number') {
        updateLiveAudienceCard(data.viewers, new Date().toISOString());
      } else {
        fetchLiveAudience();
      }
    } catch (_) {
      // sem ação
    }
  }

  function endAnalyticsSession() {
    if (!analyticsSessionId) return;
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (streamStatePollTimer) {
      clearInterval(streamStatePollTimer);
      streamStatePollTimer = null;
    }
    clearWidgetPolling();
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
    if (document.visibilityState === 'hidden') endAnalyticsSession();
  });

  async function pollStreamState() {
    const data = await loadPublicConfig();
    applyRuntimeConfig(data);
    const nextVersion = Number(data?.streamStateVersion) || 0;
    if (!nextVersion) return;

    if (streamStateVersion && nextVersion !== streamStateVersion) {
      streamStateVersion = nextVersion;
      initPlayer();
      return;
    }

    streamStateVersion = nextVersion;
  }

  async function checkEmbedAccess() {
    try {
      const response = await fetch('/api/access-check?target=embed', { cache: 'no-store' });
      if (!response.ok) return false;
      const data = await response.json();
      if (data?.alternativeProgrammingActive) {
        alternativeProgrammingMessage = String(data.alternativeProgrammingMessage || '').trim();
        updateAlternativeProgrammingNotice();
      }
      if (data && data.blocked) {
        alternativeProgrammingMessage = '';
        updateAlternativeProgrammingNotice();
        showLoading(false);
        showError(true, data.message || 'Canal bloqueado para a sua regiao.');
        return true;
      }
    } catch (_) {
      // Se a verificação falhar, permite acesso normalmente
    }
    return false;
  }

  checkEmbedAccess().then((isBlocked) => {
    if (!isBlocked) {
      initPlayer();
    }
  });
  startAnalyticsSession();
  loadPublicConfig().then((data) => {
    streamStateVersion = Number(data?.streamStateVersion) || 0;
    applyRuntimeConfig(data);
  }).catch(() => {
    renderWidgets();
    restartWidgetPolling();
    refreshWidgetsNow();
  });
  if ('BroadcastChannel' in window) {
    streamStateChannel = new BroadcastChannel('webtv-stream-state');
    streamStateChannel.addEventListener('message', () => {
      pollStreamState();
    });
  }
  streamStatePollTimer = window.setInterval(pollStreamState, 2000);
})();