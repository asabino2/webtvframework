(function () {
  'use strict';

  const form = document.getElementById('personalization-form');
  const statusEl = document.getElementById('personalization-status');
  const themeSelect = document.getElementById('theme');
  const fontSelect = document.getElementById('font-family');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      title: 'Personalizacao da Home',
      pageTitle: 'Personalizacao da Home',
      subtitle: 'Defina tema, fontes, cores e controles do player da tela inicial.',
      themeLabel: 'Tema pre-definido',
      themeHelp: 'Escolha um tema base e ajuste as cores manualmente se desejar.',
      fontLabel: 'Fonte principal',
      backgroundImageLabel: 'URL da imagem de pano de fundo',
      backgroundImageHelp: 'Se em branco, a cor de fundo selecionada sera utilizada.',
      colorSection: 'Cores da pagina inicial',
      colorBg: 'Cor de fundo',
      colorSurface: 'Cor de cartoes/superficie',
      colorBorder: 'Cor de borda',
      colorAccent: 'Cor de destaque',
      colorText: 'Cor de texto principal',
      controlsSection: 'Controles do player na home',
      googleCast: 'Google Cast',
      fullscreen: 'Tela cheia',
      volume: 'Barra de volume',
      mute: 'Botao mudo',
      shareButtons: 'Compartilhamento abaixo do player',
      save: 'Salvar personalizacao',
      saveSuccess: 'Personalizacao salva. Reiniciando a aplicacao...',
      saveError: 'Nao foi possivel salvar a personalizacao.',
      loadError: 'Nao foi possivel carregar a personalizacao.',
    },
    en: {
      title: 'Home Personalization',
      pageTitle: 'Home Personalization',
      subtitle: 'Set theme, fonts, colors and player controls for the home page.',
      themeLabel: 'Preset theme',
      themeHelp: 'Pick a base theme and manually adjust colors if needed.',
      fontLabel: 'Primary font',
      backgroundImageLabel: 'Background image URL',
      backgroundImageHelp: 'If empty, the selected background color will be used.',
      colorSection: 'Home page colors',
      colorBg: 'Background color',
      colorSurface: 'Card/surface color',
      colorBorder: 'Border color',
      colorAccent: 'Accent color',
      colorText: 'Primary text color',
      controlsSection: 'Player controls on home',
      googleCast: 'Google Cast',
      fullscreen: 'Fullscreen',
      volume: 'Volume bar',
      mute: 'Mute button',
      shareButtons: 'Share options below player',
      save: 'Save personalization',
      saveSuccess: 'Personalization saved. Restarting application...',
      saveError: 'Could not save personalization.',
      loadError: 'Could not load personalization.',
    },
    es: {
      title: 'Personalización de Inicio',
      pageTitle: 'Personalización de Inicio',
      subtitle: 'Establece tema, fuentes, colores y controles del reproductor para la página de inicio.',
      themeLabel: 'Tema preestablecido',
      themeHelp: 'Elige un tema base y ajusta los colores manualmente si es necesario.',
      fontLabel: 'Fuente principal',
      backgroundImageLabel: 'URL de imagen de fondo',
      backgroundImageHelp: 'Si está vacío, se utilizará el color de fondo seleccionado.',
      colorSection: 'Colores de la página de inicio',
      colorBg: 'Color de fondo',
      colorSurface: 'Color de tarjetas/superficie',
      colorBorder: 'Color de borde',
      colorAccent: 'Color de destaque',
      colorText: 'Color de texto principal',
      controlsSection: 'Controles del reproductor en el inicio',
      googleCast: 'Google Cast',
      fullscreen: 'Pantalla completa',
      volume: 'Barra de volumen',
      mute: 'Botón silenciar',
      shareButtons: 'Opciones de compartición debajo del reproductor',
      save: 'Guardar personalización',
      saveSuccess: 'Personalización guardada. Reiniciando la aplicación...',
      saveError: 'No se pudo guardar la personalización.',
      loadError: 'No se pudo cargar la personalización.',
    },
    ru: {
      title: 'Персонализация главной',
      pageTitle: 'Персонализация главной',
      subtitle: 'Установите тему, шрифты, цвета и элементы управления плеером для главной страницы.',
      themeLabel: 'Предустановленная тема',
      themeHelp: 'Выберите базовую тему и при необходимости отрегулируйте цвета вручную.',
      fontLabel: 'Основной шрифт',
      backgroundImageLabel: 'URL фонового изображения',
      backgroundImageHelp: 'Если пусто, будет использован выбранный цвет фона.',
      colorSection: 'Цвета главной страницы',
      colorBg: 'Цвет фона',
      colorSurface: 'Цвет карточек/поверхности',
      colorBorder: 'Цвет бордюра',
      colorAccent: 'Цвет акцента',
      colorText: 'Цвет основного текста',
      controlsSection: 'Элементы управления плеером на главной',
      googleCast: 'Google Cast',
      fullscreen: 'Полный экран',
      volume: 'Полоса громкости',
      mute: 'Кнопка отключения звука',
      shareButtons: 'Опции общего доступа под плеером',
      save: 'Сохранить персонализацию',
      saveSuccess: 'Персонализация сохранена. Перезагрузка приложения...',
      saveError: 'Не удалось сохранить персонализацию.',
      loadError: 'Не удалось загрузить персонализацию.',
    },
    zh: {
      title: '主页个性化',
      pageTitle: '主页个性化',
      subtitle: '为主页设置主题、字体、颜色和播放器控件。',
      themeLabel: '预设主题',
      themeHelp: '选择基础主题，如需要可手动调整颜色。',
      fontLabel: '主要字体',
      backgroundImageLabel: '背景图像URL',
      backgroundImageHelp: '如果为空，将使用选定的背景颜色。',
      colorSection: '主页颜色',
      colorBg: '背景颜色',
      colorSurface: '卡片/表面颜色',
      colorBorder: '边框颜色',
      colorAccent: '强调颜色',
      colorText: '主要文本颜色',
      controlsSection: '主页上的播放器控件',
      googleCast: 'Google Cast',
      fullscreen: '全屏',
      volume: '音量条',
      mute: '静音按钮',
      shareButtons: '播放器下方的分享选项',
      save: '保存个性化设置',
      saveSuccess: '个性化设置已保存。正在重启应用程序...',
      saveError: '无法保存个性化设置。',
      loadError: '无法加载个性化设置。',
    },
    pl: {
      title: 'Personalizacja Głównej',
      pageTitle: 'Personalizacja Głównej',
      subtitle: 'Ustaw motyw, czcionki, kolory i elementy sterowania odtwarzaczem dla strony głównej.',
      themeLabel: 'Wstępnie ustawiony motyw',
      themeHelp: 'Wybierz motyw bazowy i w razie potrzeby dostosuj kolory ręcznie.',
      fontLabel: 'Czcionka główna',
      backgroundImageLabel: 'Adres URL obrazu tła',
      backgroundImageHelp: 'Jeśli puste, zostanie użyty wybrany kolor tła.',
      colorSection: 'Kolory strony głównej',
      colorBg: 'Kolor tła',
      colorSurface: 'Kolor karty/powierzchni',
      colorBorder: 'Kolor obramowania',
      colorAccent: 'Kolor akcentu',
      colorText: 'Kolor tekstu głównego',
      controlsSection: 'Elementy sterowania odtwarzaczem na głównej',
      googleCast: 'Google Cast',
      fullscreen: 'Pełny ekran',
      volume: 'Pasek głośności',
      mute: 'Przycisk wyciszenia',
      shareButtons: 'Opcje udostępniania poniżej odtwarzacza',
      save: 'Zapisz personalizację',
      saveSuccess: 'Personalizacja zapisana. Ponowne uruchomienie aplikacji...',
      saveError: 'Nie można zapisać personalizacji.',
      loadError: 'Nie można załadować personalizacji.',
    },
    it: {
      title: 'Personalizzazione Home',
      pageTitle: 'Personalizzazione Home',
      subtitle: 'Imposta tema, caratteri, colori e controlli del lettore per la pagina iniziale.',
      themeLabel: 'Tema preimpostato',
      themeHelp: 'Scegli un tema di base e regola manualmente i colori se necessario.',
      fontLabel: 'Carattere principale',
      backgroundImageLabel: 'URL immagine di sfondo',
      backgroundImageHelp: 'Se vuoto, verrà utilizzato il colore di sfondo selezionato.',
      colorSection: 'Colori della pagina iniziale',
      colorBg: 'Colore di sfondo',
      colorSurface: 'Colore scheda/superficie',
      colorBorder: 'Colore bordo',
      colorAccent: 'Colore accento',
      colorText: 'Colore testo principale',
      controlsSection: 'Controlli del lettore sulla home',
      googleCast: 'Google Cast',
      fullscreen: 'Schermo intero',
      volume: 'Barra del volume',
      mute: 'Pulsante Disattiva audio',
      shareButtons: 'Opzioni di condivisione sotto il lettore',
      save: 'Salva personalizzazione',
      saveSuccess: 'Personalizzazione salvata. Riavvio dell\'applicazione...',
      saveError: 'Impossibile salvare la personalizzazione.',
      loadError: 'Impossibile caricare la personalizzazione.',
    },
    de: {
      title: 'Startseiten-Personalisierung',
      pageTitle: 'Startseiten-Personalisierung',
      subtitle: 'Legen Sie Thema, Schriftarten, Farben und Player-Steuerelemente für die Startseite fest.',
      themeLabel: 'Voreingestelltes Design',
      themeHelp: 'Wählen Sie ein Basis-Design und passen Sie die Farben bei Bedarf manuell an.',
      fontLabel: 'Primärer Schrifttyp',
      backgroundImageLabel: 'Hintergrundbild-URL',
      backgroundImageHelp: 'Wenn leer, wird die ausgewählte Hintergrundfarbe verwendet.',
      colorSection: 'Farben der Startseite',
      colorBg: 'Hintergrundfarbe',
      colorSurface: 'Karten-/Oberflächenfarbe',
      colorBorder: 'Rahmenfarbe',
      colorAccent: 'Akzentfarbe',
      colorText: 'Primäre Textfarbe',
      controlsSection: 'Player-Steuerelemente auf der Startseite',
      googleCast: 'Google Cast',
      fullscreen: 'Vollbild',
      volume: 'Lautstärkeregler',
      mute: 'Stummschaltungsschaltfläche',
      shareButtons: 'Freigabeoptionen unter dem Player',
      save: 'Personalisierung speichern',
      saveSuccess: 'Personalisierung gespeichert. Anwendung wird neu gestartet...',
      saveError: 'Personalisierung konnte nicht gespeichert werden.',
      loadError: 'Personalisierung konnte nicht geladen werden.',
    }
  };

  let presetByKey = {};

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.className = `status-message ${kind}`;
    statusEl.style.display = 'block';
  }

  function buildPreviewCustomization() {
    return {
      theme: themeSelect.value,
      fontFamily: fontSelect.value,
      backgroundImageUrl: form.backgroundImageUrl.value,
      colors: {
        bg: form.bg.value,
        surface: form.surface.value,
        border: form.border.value,
        accent: form.accent.value,
        text: form.text.value,
      },
    };
  }

  function emitPreviewToAdmin() {
    if (!window.parent || window.parent === window) return;

    window.parent.postMessage({
      type: 'webtv-home-customization-preview',
      homeCustomization: buildPreviewCustomization(),
    }, window.location.origin);
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
    document.title = `${t('pageTitle')} - Webtv framework`;

    setText('personalization-title', t('title'));
    setText('personalization-subtitle', t('subtitle'));
    setText('label-theme', t('themeLabel'));
    setText('theme-help', t('themeHelp'));
    setText('label-font-family', t('fontLabel'));
    setText('label-background-image-url', t('backgroundImageLabel'));
    setText('background-image-help', t('backgroundImageHelp'));
    setText('label-color-section', t('colorSection'));
    setText('label-color-bg', t('colorBg'));
    setText('label-color-surface', t('colorSurface'));
    setText('label-color-border', t('colorBorder'));
    setText('label-color-accent', t('colorAccent'));
    setText('label-color-text', t('colorText'));
    setText('label-player-controls', t('controlsSection'));
    setText('label-control-google-cast', t('googleCast'));
    setText('label-control-fullscreen', t('fullscreen'));
    setText('label-control-volume', t('volume'));
    setText('label-control-mute', t('mute'));
    setText('label-control-share-buttons', t('shareButtons'));
    setText('btn-save-personalization', t('save'));
  }

  function toHexColor(value, fallback) {
    const str = String(value || '').trim();
    return /^#[0-9a-fA-F]{6}$/.test(str) ? str.toLowerCase() : fallback;
  }

  function fillThemeOptions(presets) {
    themeSelect.innerHTML = '';
    presetByKey = {};

    presets.forEach((preset) => {
      presetByKey[preset.key] = preset;
      const option = document.createElement('option');
      option.value = preset.key;
      option.textContent = preset.label;
      themeSelect.appendChild(option);
    });
  }

  function fillFontOptions(fonts) {
    fontSelect.innerHTML = '';
    fonts.forEach((fontFamily) => {
      const option = document.createElement('option');
      option.value = fontFamily;
      option.textContent = fontFamily;
      fontSelect.appendChild(option);
    });
  }

  function applyThemePreset(themeKey) {
    const preset = presetByKey[themeKey];
    if (!preset) return;

    form.bg.value = toHexColor(preset.colors.bg, '#0d0f14');
    form.surface.value = toHexColor(preset.colors.surface, '#161b24');
    form.border.value = toHexColor(preset.colors.border, '#2a3347');
    form.accent.value = toHexColor(preset.colors.accent, '#e8a020');
    form.text.value = toHexColor(preset.colors.text, '#e8ecf0');
    fontSelect.value = preset.fontFamily || fontSelect.value;
    emitPreviewToAdmin();
  }

  function applySavedState(homeCustomization) {
    const customization = homeCustomization || {};

    themeSelect.value = customization.theme || 'default';
    form.backgroundImageUrl.value = customization.backgroundImageUrl || '';

    form.bg.value = toHexColor(customization.colors?.bg, '#0d0f14');
    form.surface.value = toHexColor(customization.colors?.surface, '#161b24');
    form.border.value = toHexColor(customization.colors?.border, '#2a3347');
    form.accent.value = toHexColor(customization.colors?.accent, '#e8a020');
    form.text.value = toHexColor(customization.colors?.text, '#e8ecf0');

    if (customization.fontFamily) {
      fontSelect.value = customization.fontFamily;
    }

    form.googleCast.checked = customization.playerControls?.googleCast !== false;
    form.fullscreen.checked = customization.playerControls?.fullscreen !== false;
    form.volume.checked = customization.playerControls?.volume !== false;
    form.mute.checked = customization.playerControls?.mute !== false;
    form.shareButtons.checked = customization.playerControls?.shareButtons !== false;

    emitPreviewToAdmin();
  }

  async function loadPersonalization() {
    const response = await fetch('/api/admin/home-customization');
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || t('loadError'));
    }

    fillThemeOptions(payload.themePresets || []);
    fillFontOptions(payload.allowedFonts || []);
    applySavedState(payload.saved || payload.effective || {});
  }

  themeSelect.addEventListener('change', () => {
    applyThemePreset(themeSelect.value);
  });

  [
    form.backgroundImageUrl,
    form.bg,
    form.surface,
    form.border,
    form.accent,
    form.text,
    fontSelect,
  ].forEach((input) => {
    input.addEventListener('input', emitPreviewToAdmin);
    input.addEventListener('change', emitPreviewToAdmin);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusEl.style.display = 'none';

    const body = {
      homeCustomization: {
        theme: themeSelect.value,
        fontFamily: fontSelect.value,
        backgroundImageUrl: form.backgroundImageUrl.value,
        colors: {
          bg: form.bg.value,
          surface: form.surface.value,
          border: form.border.value,
          accent: form.accent.value,
          text: form.text.value,
        },
        playerControls: {
          googleCast: form.googleCast.checked,
          fullscreen: form.fullscreen.checked,
          volume: form.volume.checked,
          mute: form.mute.checked,
          shareButtons: form.shareButtons.checked,
        },
      },
    };

    const response = await fetch('/api/admin/home-customization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showStatus(data.error || t('saveError'), 'error');
      return;
    }

    showStatus(t('saveSuccess'), 'success');
  });

  applyStaticTranslations();
  loadPersonalization().catch((error) => {
    console.error('[PERSONALIZATION] Falha ao carregar personalizacao:', error);
    showStatus(error.message || t('loadError'), 'error');
  });
})();
