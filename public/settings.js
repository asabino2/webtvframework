(function () {
  'use strict';

  const form = document.getElementById('settings-form');
  const statusEl = document.getElementById('settings-status');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      title: 'Configuracoes Gerais',
      pageTitle: 'Configuracoes Gerais',
      subtitle: 'Defina as URLs base do stream e do EPG (XMLTV).',
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
      subtitle: 'Set source stream and EPG (XMLTV) URLs.',
      streamLabel: 'Original stream URL (M3U8)',
      epgLabel: 'Original EPG URL (XMLTV)',
      streamHelp: 'If empty, uses environment variable M3U8_URL.',
      epgHelp: 'If empty, EPG is disabled on the home page.',
      save: 'Save settings',
      saveSuccess: 'Settings saved. Restarting application...',
      saveError: 'Could not save settings.',
      loadError: 'Could not load settings.',
    }
  };

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

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';
    document.title = `${t('pageTitle')} - Webtv framework`;

    setText('settings-title', t('title'));
    setText('settings-subtitle', t('subtitle'));
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

    form.streamUrl.value = payload.streamUrl || '';
    form.epgUrl.value = payload.epgUrl || '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusEl.style.display = 'none';

    const payload = {
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

  applyStaticTranslations();
  loadSettings().catch((error) => {
    console.error('[SETTINGS] Falha ao carregar configuracoes:', error);
    showStatus(error.message || t('loadError'), 'error');
  });
})();