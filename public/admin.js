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

  const routeByView = {
    blocks: '/bloqueios',
    stats: '/estatisticas',
  };

  const titleByView = {
    blocks: 'Bloqueio de Região',
    stats: 'Estatísticas',
  };

  function setChannelName(name) {
    const channelName = String(name || 'Webtv framework');
    channelNameEl.textContent = channelName;
    document.title = `${channelName} — Administração`;
  }

  function setView(view) {
    const selected = routeByView[view] ? view : 'blocks';

    menuItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.view === selected);
    });

    viewTitle.textContent = titleByView[selected] || titleByView.blocks;

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
      throw new Error('Falha ao consultar status da autenticação');
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
      throw new Error(data.error || 'Senha inválida');
    }

    return response.json();
  }

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
  }

  async function checkForUpdates() {
    const response = await fetch('/api/admin/update/check');
    if (!response.ok) {
      throw new Error('Falha ao verificar atualizações.');
    }

    return response.json();
  }

  async function applyUpdate() {
    const response = await fetch('/api/admin/update/apply', { method: 'POST' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || 'Falha ao aplicar atualização.');
    }

    return payload;
  }

  async function promptAndUpdateIfNeeded() {
    try {
      const status = await checkForUpdates();
      if (!status.hasUpdate) {
        return;
      }

      const shouldUpdate = window.confirm(
        `Foi encontrada uma nova versão (${status.latestVersion}). ` +
        `Versão atual: ${status.currentVersion}. Deseja atualizar agora?`
      );

      if (!shouldUpdate) {
        return;
      }

      const result = await applyUpdate();
      if (result.restartScheduled) {
        window.alert('Atualização concluída. O aplicativo será reiniciado em instantes.');
      } else {
        window.alert('Atualização concluída com sucesso.');
      }
    } catch (error) {
      console.error('[ADMIN] Erro no fluxo de atualização:', error);
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
      authError.textContent = 'Não foi possível carregar a administração.';
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
      authError.textContent = error.message || 'Senha inválida.';
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

  boot();
})();
