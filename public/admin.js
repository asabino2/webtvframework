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
  const adminBrandIcon = document.getElementById('admin-brand-icon');

  let currentHomeCustomization = null;

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      adminTitle: 'Administracao',
      adminKicker: 'Painel administrativo',
      languageLabel: 'Idioma',
      menuBlocks: 'Bloqueio de Regiao',
      menuChannelBlocks: 'Bloqueio de Canal',
      menuStats: 'Estatisticas',
      menuSettings: 'Configuracoes Gerais',
      menuPersonalization: 'Personalizacao da Home',
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
      viewChannelBlocks: 'Bloqueio de Canal',
      viewStats: 'Estatisticas',
      viewSettings: 'Configuracoes Gerais',
      viewPersonalization: 'Personalizacao da Home',
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
      menuChannelBlocks: 'Channel Blocking',
      menuStats: 'Statistics',
      menuSettings: 'General Settings',
      menuPersonalization: 'Home Personalization',
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
      viewChannelBlocks: 'Channel Blocking',
      viewStats: 'Statistics',
      viewSettings: 'General Settings',
      viewPersonalization: 'Home Personalization',
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
    },
    es: {
      adminTitle: 'Administración',
      adminKicker: 'Panel de administración',
      languageLabel: 'Idioma',
      menuBlocks: 'Bloqueo de Región',
      menuChannelBlocks: 'Bloqueo de Canal',
      menuStats: 'Estadísticas',
      menuSettings: 'Configuración General',
      menuPersonalization: 'Personalización de Inicio',
      menuEmbed: 'Incrustación',
      logout: 'Cerrar sesión',
      update: 'Actualizar',
      newVersionAvailable: 'Nueva versión disponible',
      iframeTitle: 'Contenido de administración',
      authTitle: 'Acceso administrativo',
      authSubtitle: 'Ingrese la contraseña para acceder a la administración.',
      authPasswordLabel: 'Contraseña',
      authSubmit: 'Iniciar sesión',
      viewBlocks: 'Bloqueo de Región',
      viewChannelBlocks: 'Bloqueo de Canal',
      viewStats: 'Estadísticas',
      viewSettings: 'Configuración General',
      viewPersonalization: 'Personalización de Inicio',
      viewEmbed: 'Incrustación',
      authStatusError: 'Error al consultar el estado de autenticación',
      invalidPassword: 'Contraseña inválida',
      updateCheckError: 'Error al verificar actualizaciones.',
      updateApplyError: 'Error al aplicar la actualización.',
      updateFound: 'Se encontró una nueva versión',
      currentVersion: 'Versión actual',
      askUpdateNow: '¿Desea actualizar ahora?',
      updateDoneRestart: 'Actualización completada. La aplicación se reiniciará en breve.',
      updateDone: 'Actualización completada con éxito.',
      loadAdminError: 'No se pudo cargar la administración.',
      invalidPasswordShort: 'Contraseña inválida.'
    },
    ru: {
      adminTitle: 'Администрирование',
      adminKicker: 'Панель администратора',
      languageLabel: 'Язык',
      menuBlocks: 'Блокировка региона',
      menuChannelBlocks: 'Блокировка канала',
      menuStats: 'Статистика',
      menuSettings: 'Общие настройки',
      menuPersonalization: 'Персонализация главной',
      menuEmbed: 'Встраивание',
      logout: 'Выйти',
      update: 'Обновить',
      newVersionAvailable: 'Доступна новая версия',
      iframeTitle: 'Содержание администрации',
      authTitle: 'Администраторский доступ',
      authSubtitle: 'Введите пароль для доступа к администрации.',
      authPasswordLabel: 'Пароль',
      authSubmit: 'Войти',
      viewBlocks: 'Блокировка региона',
      viewChannelBlocks: 'Блокировка канала',
      viewStats: 'Статистика',
      viewSettings: 'Общие настройки',
      viewPersonalization: 'Персонализация главной',
      viewEmbed: 'Встраивание',
      authStatusError: 'Ошибка при проверке статуса аутентификации',
      invalidPassword: 'Неверный пароль',
      updateCheckError: 'Ошибка при проверке обновлений.',
      updateApplyError: 'Ошибка при применении обновления.',
      updateFound: 'Найдена новая версия',
      currentVersion: 'Текущая версия',
      askUpdateNow: 'Хотите обновить сейчас?',
      updateDoneRestart: 'Обновление завершено. Приложение перезагрузится в ближайшее время.',
      updateDone: 'Обновление завершено успешно.',
      loadAdminError: 'Не удалось загрузить администрацию.',
      invalidPasswordShort: 'Неверный пароль.'
    },
    zh: {
      adminTitle: '管理',
      adminKicker: '管理面板',
      languageLabel: '语言',
      menuBlocks: '区域阻止',
      menuChannelBlocks: '频道阻止',
      menuStats: '统计',
      menuSettings: '常规设置',
      menuPersonalization: '主页个性化',
      menuEmbed: '嵌入',
      logout: '登出',
      update: '更新',
      newVersionAvailable: '有可用的新版本',
      iframeTitle: '管理内容',
      authTitle: '管理员访问',
      authSubtitle: '输入密码以访问管理。',
      authPasswordLabel: '密码',
      authSubmit: '登录',
      viewBlocks: '区域阻止',
      viewChannelBlocks: '频道阻止',
      viewStats: '统计',
      viewSettings: '常规设置',
      viewPersonalization: '主页个性化',
      viewEmbed: '嵌入',
      authStatusError: '检查身份验证状态失败',
      invalidPassword: '密码无效',
      updateCheckError: '检查更新失败。',
      updateApplyError: '应用更新失败。',
      updateFound: '找到新版本',
      currentVersion: '当前版本',
      askUpdateNow: '您想现在更新吗？',
      updateDoneRestart: '更新完成。应用程序将立即重新启动。',
      updateDone: '更新成功完成。',
      loadAdminError: '无法加载管理。',
      invalidPasswordShort: '密码无效。'
    },
    pl: {
      adminTitle: 'Administracja',
      adminKicker: 'Panel administracyjny',
      languageLabel: 'Język',
      menuBlocks: 'Blokowanie regionu',
      menuChannelBlocks: 'Blokowanie kanału',
      menuStats: 'Statystyki',
      menuSettings: 'Ustawienia ogólne',
      menuPersonalization: 'Personalizacja strony głównej',
      menuEmbed: 'Osadzanie',
      logout: 'Wyloguj się',
      update: 'Aktualizuj',
      newVersionAvailable: 'Dostępna jest nowa wersja',
      iframeTitle: 'Zawartość administracji',
      authTitle: 'Dostęp administracyjny',
      authSubtitle: 'Wprowadź hasło, aby uzyskać dostęp do administracji.',
      authPasswordLabel: 'Hasło',
      authSubmit: 'Zaloguj się',
      viewBlocks: 'Blokowanie regionu',
      viewChannelBlocks: 'Blokowanie kanału',
      viewStats: 'Statystyki',
      viewSettings: 'Ustawienia ogólne',
      viewPersonalization: 'Personalizacja strony głównej',
      viewEmbed: 'Osadzanie',
      authStatusError: 'Błąd podczas sprawdzania statusu uwierzytelnienia',
      invalidPassword: 'Nieprawidłowe hasło',
      updateCheckError: 'Błąd podczas sprawdzania aktualizacji.',
      updateApplyError: 'Błąd podczas stosowania aktualizacji.',
      updateFound: 'Znaleziono nową wersję',
      currentVersion: 'Bieżąca wersja',
      askUpdateNow: 'Czy chcesz teraz zaktualizować?',
      updateDoneRestart: 'Aktualizacja zakończona. Aplikacja wkrótce się uruchomi ponownie.',
      updateDone: 'Aktualizacja pomyślnie zakończona.',
      loadAdminError: 'Nie można załadować administracji.',
      invalidPasswordShort: 'Nieprawidłowe hasło.'
    },
    it: {
      adminTitle: 'Amministrazione',
      adminKicker: 'Pannello di amministrazione',
      languageLabel: 'Lingua',
      menuBlocks: 'Blocco regione',
      menuChannelBlocks: 'Blocco canale',
      menuStats: 'Statistiche',
      menuSettings: 'Impostazioni generali',
      menuPersonalization: 'Personalizzazione della pagina iniziale',
      menuEmbed: 'Incorpora',
      logout: 'Esci',
      update: 'Aggiorna',
      newVersionAvailable: 'È disponibile una nuova versione',
      iframeTitle: 'Contenuto amministrativo',
      authTitle: 'Accesso amministrativo',
      authSubtitle: 'Immettere la password per accedere all\'amministrazione.',
      authPasswordLabel: 'Password',
      authSubmit: 'Accedi',
      viewBlocks: 'Blocco regione',
      viewChannelBlocks: 'Blocco canale',
      viewStats: 'Statistiche',
      viewSettings: 'Impostazioni generali',
      viewPersonalization: 'Personalizzazione della pagina iniziale',
      viewEmbed: 'Incorpora',
      authStatusError: 'Errore nel controllo dello stato di autenticazione',
      invalidPassword: 'Password non valida',
      updateCheckError: 'Errore durante il controllo degli aggiornamenti.',
      updateApplyError: 'Errore durante l\'applicazione dell\'aggiornamento.',
      updateFound: 'È stata trovata una nuova versione',
      currentVersion: 'Versione corrente',
      askUpdateNow: 'Vuoi aggiornare ora?',
      updateDoneRestart: 'Aggiornamento completato. L\'applicazione verrà riavviata a breve.',
      updateDone: 'Aggiornamento completato con successo.',
      loadAdminError: 'Impossibile caricare l\'amministrazione.',
      invalidPasswordShort: 'Password non valida.'
    },
    de: {
      adminTitle: 'Verwaltung',
      adminKicker: 'Verwaltungsbereich',
      languageLabel: 'Sprache',
      menuBlocks: 'Regionsblockierung',
      menuChannelBlocks: 'Kanalblockierung',
      menuStats: 'Statistiken',
      menuSettings: 'Allgemeine Einstellungen',
      menuPersonalization: 'Startseite personalisieren',
      menuEmbed: 'Einbettung',
      logout: 'Abmelden',
      update: 'Aktualisieren',
      newVersionAvailable: 'Neue Version verfügbar',
      iframeTitle: 'Verwaltungsinhalt',
      authTitle: 'Administratorzugriff',
      authSubtitle: 'Geben Sie das Passwort ein, um auf die Verwaltung zuzugreifen.',
      authPasswordLabel: 'Passwort',
      authSubmit: 'Anmelden',
      viewBlocks: 'Regionsblockierung',
      viewChannelBlocks: 'Kanalblockierung',
      viewStats: 'Statistiken',
      viewSettings: 'Allgemeine Einstellungen',
      viewPersonalization: 'Startseite personalisieren',
      viewEmbed: 'Einbettung',
      authStatusError: 'Fehler beim Überprüfen des Authentifizierungsstatus',
      invalidPassword: 'Ungültiges Passwort',
      updateCheckError: 'Fehler beim Überprüfen von Aktualisierungen.',
      updateApplyError: 'Fehler beim Anwenden der Aktualisierung.',
      updateFound: 'Eine neue Version wurde gefunden',
      currentVersion: 'Aktuelle Version',
      askUpdateNow: 'Möchten Sie jetzt aktualisieren?',
      updateDoneRestart: 'Aktualisierung abgeschlossen. Die Anwendung wird in Kürze neu gestartet.',
      updateDone: 'Aktualisierung erfolgreich abgeschlossen.',
      loadAdminError: 'Verwaltung konnte nicht geladen werden.',
      invalidPasswordShort: 'Ungültiges Passwort.'
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

  const routeByView = {
    blocks: '/bloqueios',
    channelBlocks: '/bloqueio-canal',
    stats: '/estatisticas',
    settings: '/configuracoes-gerais',
    personalization: '/personalizacao',
    embed: '/embed-opcao',
  };

  function titleByView(view) {
    if (view === 'channelBlocks') return t('viewChannelBlocks');
    if (view === 'stats') return t('viewStats');
    if (view === 'settings') return t('viewSettings');
    if (view === 'personalization') return t('viewPersonalization');
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
    setText('menu-channel-blocks', t('menuChannelBlocks'));
    setText('menu-stats', t('menuStats'));
    setText('menu-settings', t('menuSettings'));
    setText('menu-personalization', t('menuPersonalization'));
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

  function applyAdminCustomization(homeCustomization) {
    if (!homeCustomization || typeof homeCustomization !== 'object') return;
    currentHomeCustomization = homeCustomization;

    const colors = homeCustomization.colors || {};
    const rootStyle = document.documentElement.style;

    if (colors.bg) rootStyle.setProperty('--bg', colors.bg);
    if (colors.surface) rootStyle.setProperty('--surface', colors.surface);
    if (colors.surface) rootStyle.setProperty('--surface-2', colors.surface);
    if (colors.border) rootStyle.setProperty('--border', colors.border);
    if (colors.accent) rootStyle.setProperty('--accent', colors.accent);
    if (colors.text) {
      rootStyle.setProperty('--text', colors.text);
      rootStyle.setProperty('--muted', colors.text);
    }
    if (homeCustomization.fontFamily) {
      rootStyle.setProperty('--font-family-base', homeCustomization.fontFamily);
    }

    const bgImageUrl = String(homeCustomization.backgroundImageUrl || '').trim();
    if (bgImageUrl) {
      rootStyle.setProperty('--bg-image-url', `url('${bgImageUrl}')`);
    } else {
      rootStyle.removeProperty('--bg-image-url');
    }

  }

  function applyAdminBrandIcon(faviconUrlValue) {
    const faviconUrl = String(faviconUrlValue || '').trim();
    if (adminBrandIcon) {
      if (faviconUrl) {
        adminBrandIcon.src = faviconUrl;
        adminBrandIcon.style.display = 'block';
        adminBrandIcon.onerror = () => {
          adminBrandIcon.src = '/webtvframework.ico';
        };
      } else {
        adminBrandIcon.src = '/webtvframework.ico';
        adminBrandIcon.style.display = 'block';
      }
    }
  }

  async function loadPublicConfig() {
    const response = await fetch('/api/public-config', { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return response.json();
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
      const publicConfig = await loadPublicConfig().catch(() => null);
      if (publicConfig?.homeCustomization) {
        applyAdminCustomization(publicConfig.homeCustomization);
      }
      applyAdminBrandIcon(publicConfig?.faviconUrl || '');

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

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    const data = event.data;
    if (!data || data.type !== 'webtv-home-customization-preview') {
      return;
    }

    applyAdminCustomization(data.homeCustomization);
  });

  applyStaticTranslations();
  boot();
})();
