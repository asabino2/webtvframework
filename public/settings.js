(function () {
  'use strict';

  const form = document.getElementById('settings-form');
  const statusEl = document.getElementById('settings-status');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      title: 'Configuracoes Gerais',
      pageTitle: 'Configuracoes Gerais',
      subtitle: 'Defina nome do canal e URLs base do stream/EPG.',
      languageLabel: 'Idioma',
      channelNameLabel: 'Nome do canal',
      channelNameHelp: 'Se vazio, usa a variavel de ambiente CHANNEL_NAME.',
      faviconLabel: 'URL do favicon e icone do canal',
      faviconHelp: 'Se vazio, usa a variavel de ambiente FAVICON_URL.',
      streamLabel: 'URL do stream original (M3U8)',
      epgLabel: 'URL do EPG original (XMLTV)',
      streamHelp: 'Se vazio, usa a variavel de ambiente M3U8_URL.',
      epgHelp: 'Se vazio, o EPG fica desativado na tela inicial.',
      save: 'Salvar configuracoes',
      saveSuccess: 'Configuracoes salvas. Reiniciando a aplicacao...',
      saveError: 'Nao foi possivel salvar as configuracoes.',
      loadError: 'Nao foi possivel carregar as configuracoes.',
    },
    en: {
      title: 'General Settings',
      pageTitle: 'General Settings',
      subtitle: 'Set channel name and source stream/EPG URLs.',
      languageLabel: 'Language',
      channelNameLabel: 'Channel name',
      channelNameHelp: 'If empty, uses environment variable CHANNEL_NAME.',
      faviconLabel: 'Favicon and channel icon URL',
      faviconHelp: 'If empty, uses environment variable FAVICON_URL.',
      streamLabel: 'Original stream URL (M3U8)',
      epgLabel: 'Original EPG URL (XMLTV)',
      streamHelp: 'If empty, uses environment variable M3U8_URL.',
      epgHelp: 'If empty, EPG is disabled on the home page.',
      save: 'Save settings',
      saveSuccess: 'Settings saved. Restarting application...',
      saveError: 'Could not save settings.',
      loadError: 'Could not load settings.',
    },
    es: {
      title: 'Configuración General',
      pageTitle: 'Configuración General',
      subtitle: 'Establecer nombre del canal y URLs de stream/EPG de origen.',
      languageLabel: 'Idioma',
      channelNameLabel: 'Nombre del canal',
      channelNameHelp: 'Si está vacío, utiliza la variable de entorno CHANNEL_NAME.',
      faviconLabel: 'URL del favicon e icono del canal',
      faviconHelp: 'Si está vacío, utiliza la variable de entorno FAVICON_URL.',
      streamLabel: 'URL del stream original (M3U8)',
      epgLabel: 'URL del EPG original (XMLTV)',
      streamHelp: 'Si está vacío, utiliza la variable de entorno M3U8_URL.',
      epgHelp: 'Si está vacío, EPG se desactiva en la página de inicio.',
      save: 'Guardar configuración',
      saveSuccess: 'Configuración guardada. Reiniciando aplicación...',
      saveError: 'No se pudo guardar la configuración.',
      loadError: 'No se pudo cargar la configuración.',
    },
    ru: {
      title: 'Общие настройки',
      pageTitle: 'Общие настройки',
      subtitle: 'Установите имя канала и URL-адреса исходного потока/EPG.',
      languageLabel: 'Язык',
      channelNameLabel: 'Имя канала',
      channelNameHelp: 'Если пусто, использует переменную окружения CHANNEL_NAME.',
      faviconLabel: 'URL favicon и значка канала',
      faviconHelp: 'Если пусто, использует переменную окружения FAVICON_URL.',
      streamLabel: 'URL исходного потока (M3U8)',
      epgLabel: 'URL исходного EPG (XMLTV)',
      streamHelp: 'Если пусто, использует переменную окружения M3U8_URL.',
      epgHelp: 'Если пусто, EPG отключен на главной странице.',
      save: 'Сохранить настройки',
      saveSuccess: 'Настройки сохранены. Перезагрузка приложения...',
      saveError: 'Не удалось сохранить настройки.',
      loadError: 'Не удалось загрузить настройки.',
    },
    zh: {
      title: '常规设置',
      pageTitle: '常规设置',
      subtitle: '设置频道名称和源流/EPG URL。',
      languageLabel: '语言',
      channelNameLabel: '频道名称',
      channelNameHelp: '如果为空，则使用环境变量 CHANNEL_NAME。',
      faviconLabel: '频道favicon和图标URL',
      faviconHelp: '如果为空，则使用环境变量 FAVICON_URL。',
      streamLabel: '原始流URL (M3U8)',
      epgLabel: '原始EPG URL (XMLTV)',
      streamHelp: '如果为空，则使用环境变量 M3U8_URL。',
      epgHelp: '如果为空，主页上禁用EPG。',
      save: '保存设置',
      saveSuccess: '设置已保存。重新启动应用程序...',
      saveError: '无法保存设置。',
      loadError: '无法加载设置。',
    },
    pl: {
      title: 'Ustawienia ogólne',
      pageTitle: 'Ustawienia ogólne',
      subtitle: 'Ustaw nazwę kanału i adresy URL strumienia/EPG źródła.',
      languageLabel: 'Język',
      channelNameLabel: 'Nazwa kanału',
      channelNameHelp: 'Jeśli puste, używa zmienną środowiskową CHANNEL_NAME.',
      faviconLabel: 'Adres URL favicon i ikony kanału',
      faviconHelp: 'Jeśli puste, używa zmienną środowiskową FAVICON_URL.',
      streamLabel: 'Adres URL strumienia źródłowego (M3U8)',
      epgLabel: 'Adres URL EPG źródłowego (XMLTV)',
      streamHelp: 'Jeśli puste, używa zmienną środowiskową M3U8_URL.',
      epgHelp: 'Jeśli puste, EPG jest wyłączony na stronie głównej.',
      save: 'Zapisz ustawienia',
      saveSuccess: 'Ustawienia zapisane. Ponowne uruchomienie aplikacji...',
      saveError: 'Nie można zapisać ustawień.',
      loadError: 'Nie można załadować ustawień.',
    },
    it: {
      title: 'Impostazioni generali',
      pageTitle: 'Impostazioni generali',
      subtitle: 'Imposta il nome del canale e gli URL del flusso/EPG di origine.',
      languageLabel: 'Lingua',
      channelNameLabel: 'Nome del canale',
      channelNameHelp: 'Se vuoto, utilizza la variabile di ambiente CHANNEL_NAME.',
      faviconLabel: 'URL favicon e icona del canale',
      faviconHelp: 'Se vuoto, utilizza la variabile di ambiente FAVICON_URL.',
      streamLabel: 'URL flusso originale (M3U8)',
      epgLabel: 'URL EPG originale (XMLTV)',
      streamHelp: 'Se vuoto, utilizza la variabile di ambiente M3U8_URL.',
      epgHelp: 'Se vuoto, EPG è disabilitato sulla pagina iniziale.',
      save: 'Salva impostazioni',
      saveSuccess: 'Impostazioni salvate. Riavvio dell\'applicazione...',
      saveError: 'Impossibile salvare le impostazioni.',
      loadError: 'Impossibile caricare le impostazioni.',
    },
    de: {
      title: 'Allgemeine Einstellungen',
      pageTitle: 'Allgemeine Einstellungen',
      subtitle: 'Kanalnamen und Quellstream-/EPG-URLs festlegen.',
      languageLabel: 'Sprache',
      channelNameLabel: 'Kanalname',
      channelNameHelp: 'Wenn leer, verwendet die Umgebungsvariable CHANNEL_NAME.',
      faviconLabel: 'Favicon- und Kanalsymbol-URL',
      faviconHelp: 'Wenn leer, verwendet die Umgebungsvariable FAVICON_URL.',
      streamLabel: 'URL des ursprünglichen Streams (M3U8)',
      epgLabel: 'URL des ursprünglichen EPG (XMLTV)',
      streamHelp: 'Wenn leer, verwendet die Umgebungsvariable M3U8_URL.',
      epgHelp: 'Wenn leer, ist EPG auf der Startseite deaktiviert.',
      save: 'Einstellungen speichern',
      saveSuccess: 'Einstellungen gespeichert. Anwendung wird neu gestartet...',
      saveError: 'Einstellungen konnten nicht gespeichert werden.',
      loadError: 'Einstellungen konnten nicht geladen werden.',
    }
  };

  function getLang() {
    const lang = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(lang) ? lang : 'pt';
  }

  let currentLang = getLang();

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyStaticTranslations() {
    const langMap = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      ru: 'ru-RU',
      zh: 'zh-CN',
      pl: 'pl-PL',
      it: 'it-IT',
      de: 'de-DE'
    };
    document.documentElement.lang = langMap[currentLang] || 'pt-BR';
    document.title = `${t('pageTitle')} - Webtv framework`;

    setText('settings-title', t('title'));
    setText('settings-subtitle', t('subtitle'));
    setText('label-language', t('languageLabel'));
    setText('label-channel-name', t('channelNameLabel'));
    setText('channel-name-help', t('channelNameHelp'));
    setText('label-favicon-url', t('faviconLabel'));
    setText('favicon-help', t('faviconHelp'));
    setText('label-stream-url', t('streamLabel'));
    setText('label-epg-url', t('epgLabel'));
    setText('stream-help', t('streamHelp'));
    setText('epg-help', t('epgHelp'));
    setText('btn-save-settings', t('save'));
  }

  function showStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.className = `status-message ${kind}`;
    statusEl.style.display = 'block';
  }

  async function loadSettings() {
    const response = await fetch('/api/admin/general-settings');
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || t('loadError'));
    }

    form.channelName.value = payload.channelName || '';
    form.faviconUrl.value = payload.faviconUrl || '';
    form.streamUrl.value = payload.streamUrl || '';
    form.epgUrl.value = payload.epgUrl || '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusEl.style.display = 'none';

    const payload = {
      channelName: form.channelName.value,
      faviconUrl: form.faviconUrl.value,
      streamUrl: form.streamUrl.value,
      epgUrl: form.epgUrl.value,
    };

    const response = await fetch('/api/admin/general-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showStatus(data.error || t('saveError'), 'error');
      return;
    }

    showStatus(t('saveSuccess'), 'success');
  });

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = currentLang;
    languageSelect.addEventListener('change', () => {
      const newLang = languageSelect.value;
      const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
      if (validLangs.includes(newLang)) {
        currentLang = newLang;
        window.localStorage.setItem(LANG_KEY, currentLang);
        applyStaticTranslations();
      }
    });
  }

  applyStaticTranslations();
  loadSettings().catch((error) => {
    console.error('[SETTINGS] Falha ao carregar configuracoes:', error);
    showStatus(error.message || t('loadError'), 'error');
  });
})();