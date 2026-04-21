(function () {
  'use strict';

  const frame = document.getElementById('admin-frame');
  const viewTitle = document.getElementById('view-title');
  const channelNameEl = document.getElementById('channel-name');
  const menuItems = Array.from(document.querySelectorAll('.menu-item'));
  const authOverlay = document.getElementById('auth-overlay');
  const authForm = document.getElementById('auth-form');
  const authError = document.getElementById('auth-error');
  const passwordInput = document.getElementById('admin-password');
  const btnLogout = document.getElementById('btn-logout');
  const btnUpdate = document.getElementById('btn-update');
  const updateSection = document.getElementById('update-section');
  const updateAvailableLabel = document.getElementById('update-available-label');
  const languageSelect = document.getElementById('admin-language-select');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      adminTitle: 'Administracao',
      adminKicker: 'Painel administrativo',
      languageLabel: 'Idioma',
      menuBlocks: 'Bloqueio de Regiao',
      menuStats: 'Estatisticas',
      menuSettings: 'Configuracoes Gerais',
      menuEmbed: 'Embed',
      logout: 'Sair',
      update: 'Atualizar',
      newVersionAvailable: 'Nova versao disponivel',
      iframeTitle: 'Conteudo da administracao',
      authTitle: 'Acesso administrativo',
      authSubtitle: 'Informe a senha para acessar a administracao.',
      authPasswordLabel: 'Senha',
      authSubmit: 'Entrar',
      viewBlocks: 'Bloqueio de Regiao',
      viewStats: 'Estatisticas',
      viewSettings: 'Configuracoes Gerais',
      viewEmbed: 'Embed',
      authStatusError: 'Falha ao consultar status da autenticacao',
      invalidPassword: 'Senha invalida',
      updateCheckError: 'Falha ao verificar atualizacoes.',
      updateApplyError: 'Falha ao aplicar atualizacao.',
      updateFound: 'Foi encontrada uma nova versao',
      currentVersion: 'Versao atual',
      askUpdateNow: 'Deseja atualizar agora?',
      updateDoneRestart: 'Atualizacao concluida. O aplicativo sera reiniciado em instantes.',
      updateDone: 'Atualizacao concluida com sucesso.',
      loadAdminError: 'Nao foi possivel carregar a administracao.',
      invalidPasswordShort: 'Senha invalida.'
    },
    en: {
      adminTitle: 'Administration',
      adminKicker: 'Admin panel',
      languageLabel: 'Language',
      menuBlocks: 'Region Blocking',
      menuStats: 'Statistics',
      menuSettings: 'General Settings',
      menuEmbed: 'Embed',
      logout: 'Sign out',
      update: 'Update',
      newVersionAvailable: 'New version available',
      iframeTitle: 'Administration content',
      authTitle: 'Administrative access',
      authSubtitle: 'Enter password to access administration.',
      authPasswordLabel: 'Password',
      authSubmit: 'Sign in',
      viewBlocks: 'Region Blocking',
      viewStats: 'Statistics',
      viewSettings: 'General Settings',
      viewEmbed: 'Embed',
      authStatusError: 'Failed to load authentication status',
      invalidPassword: 'Invalid password',
      updateCheckError: 'Failed to check updates.',
      updateApplyError: 'Failed to apply update.',
      updateFound: 'A new version was found',
      currentVersion: 'Current version',
      askUpdateNow: 'Do you want to update now?',
      updateDoneRestart: 'Update completed. The application will restart shortly.',
      updateDone: 'Update completed successfully.',
      loadAdminError: 'Could not load administration.',
      invalidPasswordShort: 'Invalid password.'
    }
  };

  function getLang() {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
  }

  let currentLang = getLang();

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  const routeByView = {
    blocks: '/bloqueios',
    stats: '/estatisticas',
    settings: '/configuracoes-gerais',
    embed: '/embed-opcao',
  };

  function titleByView(view) {
    if (view === 'stats') return t('viewStats');
    if (view === 'settings') return t('viewSettings');
    if (view === 'embed') return t('viewEmbed');
    return t('viewBlocks');
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('admin-kicker', t('adminKicker'));
    setText('admin-language-label', t('languageLabel'));
    setText('menu-blocks', t('menuBlocks'));
    setText('menu-stats', t('menuStats'));
    setText('menu-settings', t('menuSettings'));
    setText('menu-embed', t('menuEmbed'));
    setText('btn-logout', t('logout'));
    setText('btn-update', t('update'));
    setText('auth-title', t('authTitle'));
    setText('auth-subtitle', t('authSubtitle'));
    setText('auth-password-label', t('authPasswordLabel'));
    setText('auth-submit', t('authSubmit'));

    if (frame) {
      frame.title = t('iframeTitle');
    }
  }

  function initLanguageControl() {
    if (!languageSelect) return;
    languageSelect.value = currentLang;
    languageSelect.addEventListener('change', () => {
      currentLang = languageSelect.value === 'en' ? 'en' : 'pt';
      window.localStorage.setItem(LANG_KEY, currentLang);
      applyStaticTranslations();
      setView(getCurrentView());
      setChannelName(channelNameEl.textContent || 'Webtv framework');
      try {
        frame.contentWindow?.location.reload();
      } catch (_) {
        // Ignora falhas ocasionais de recarregamento do iframe.
      }
    });
  }

  function getCurrentView() {
    const active = menuItems.find((item) => item.classList.contains('is-active'));
    return active?.dataset.view || 'blocks';
  }

  function setChannelName(name) {
    const channelName = String(name || 'Webtv framework');
    channelNameEl.textContent = channelName;
    document.title = `${channelName} — ${t('adminTitle')}`;
  }

  function setView(view) {
    const selected = routeByView[view] ? view : 'blocks';

    menuItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.view === selected);
    });

    viewTitle.textContent = titleByView(selected);

    const target = routeByView[selected];
    if (frame.getAttribute('src') !== target) {
      frame.setAttribute('src', target);
    }
  }

  function setAuthVisibility(show) {
    authOverlay.style.display = show ? 'flex' : 'none';
    if (show) {
      passwordInput.focus();
      frame.setAttribute('src', 'about:blank');
    }
  }

  async function loadStatus() {
    const response = await fetch('/api/admin/auth/status');
    if (!response.ok) {
      throw new Error(t('authStatusError'));
    }

    return response.json();
  }

  async function submitLogin(password) {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || t('invalidPassword'));
    }

    return response.json();
  }

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
  }

  async function checkForUpdates() {
    const response = await fetch('/api/admin/update/check');
    if (!response.ok) {
      throw new Error(t('updateCheckError'));
    }

    return response.json();
  }

  async function applyUpdate() {
    const response = await fetch('/api/admin/update/apply', { method: 'POST' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || t('updateApplyError'));
    }

    return payload;
  }

  function showUpdateSection(version) {
    updateAvailableLabel.textContent = `${t('newVersionAvailable')} ${version}`;
    updateSection.style.display = 'flex';
  }

  function hideUpdateSection() {
    updateSection.style.display = 'none';
  }

  async function promptAndUpdateIfNeeded() {
    try {
      const status = await checkForUpdates();
      if (!status.hasUpdate) {
        hideUpdateSection();
        return;
      }

      showUpdateSection(status.latestVersion);
    } catch (error) {
      console.error('[ADMIN] Erro ao verificar atualizacao:', error);
    }
  }

  async function boot() {
    try {
      const status = await loadStatus();
      setChannelName(status.channelName);

      if (!status.enabled) {
        btnLogout.style.display = 'none';
        setAuthVisibility(false);
        setView('blocks');
        return;
      }

      btnLogout.style.display = 'inline-flex';

      if (status.authenticated) {
        setAuthVisibility(false);
        setView('blocks');
        promptAndUpdateIfNeeded();
      } else {
        setAuthVisibility(true);
      }
    } catch (error) {
      setAuthVisibility(false);
      frame.setAttribute('src', 'about:blank');
      authError.style.display = 'block';
      authError.textContent = t('loadAdminError');
      console.error('[ADMIN] Erro ao iniciar painel:', error);
    }
  }

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      setView(item.dataset.view || 'blocks');
    });
  });

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    authError.style.display = 'none';
    authError.textContent = '';

    try {
      await submitLogin(passwordInput.value);
      passwordInput.value = '';
      setAuthVisibility(false);
      setView('blocks');
      promptAndUpdateIfNeeded();
    } catch (error) {
      authError.style.display = 'block';
      authError.textContent = error.message || t('invalidPasswordShort');
    }
  });

  btnUpdate.addEventListener('click', async () => {
    try {
      hideUpdateSection();
      const result = await applyUpdate();
      if (result.restartScheduled) {
        window.alert(t('updateDoneRestart'));
      } else {
        window.alert(t('updateDone'));
      }
    } catch (error) {
      console.error('[ADMIN] Erro ao aplicar atualizacao:', error);
      window.alert(t('updateApplyError'));
    }
  });

  btnLogout.addEventListener('click', async () => {
    try {
      await logout();
      setAuthVisibility(true);
    } catch (error) {
      console.error('[ADMIN] Erro ao sair:', error);
    }
  });

  applyStaticTranslations();
  initLanguageControl();
  boot();
})();
