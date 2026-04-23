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
      save: 'Save personalization',
      saveSuccess: 'Personalization saved. Restarting application...',
      saveError: 'Could not save personalization.',
      loadError: 'Could not load personalization.',
    }
  };

  let presetByKey = {};

  function getLang() {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
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
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';
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
