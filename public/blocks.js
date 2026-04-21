(function () {
  'use strict';

  const form = document.getElementById('block-form');
  const table = document.getElementById('blocks-table');
  const body = document.getElementById('blocks-body');
  const empty = document.getElementById('blocks-empty');

  const LANG_KEY = 'webtv_lang';
  const i18n = {
    pt: {
      title: 'Bloqueios Regionais',
      blocksTitle: 'Bloqueios Regionais de Atracoes',
      blocksSubtitle: 'Defina regras para impedir a transmissao conforme pais, estado e cidade da audiencia.',
      labelAttraction: 'Atracao (trecho do titulo no EPG)',
      phAttraction: 'Ex.: Campeonato',
      labelCountries: 'Paises (separados por virgula)',
      phCountries: 'Ex.: brasil, argentina',
      labelStates: 'Estados (separados por virgula)',
      phStates: 'Ex.: sao paulo, rio de janeiro',
      labelCities: 'Cidades (separadas por virgula)',
      phCities: 'Ex.: campinas, sorocaba',
      labelReason: 'Motivo (opcional)',
      phReason: 'Ex.: restricao de direitos de transmissao',
      saveBlock: 'Salvar bloqueio',
      blocksListTitle: 'Bloqueios cadastrados',
      thAttraction: 'Atracao',
      thRegion: 'Regiao',
      thReason: 'Motivo',
      thActions: 'Acoes',
      emptyBlocks: 'Nenhum bloqueio cadastrado.',
      country: 'Pais',
      state: 'Estado',
      city: 'Cidade',
      global: 'Global',
      delete: 'Excluir',
      saveError: 'Nao foi possivel salvar o bloqueio.',
      deleteConfirm: 'Deseja excluir este bloqueio?',
      deleteError: 'Nao foi possivel excluir o bloqueio.',
      loadError: 'Erro ao carregar os bloqueios.'
    },
    en: {
      title: 'Regional Blocking',
      blocksTitle: 'Regional Program Blocking',
      blocksSubtitle: 'Define rules to block broadcasts by audience country, state and city.',
      labelAttraction: 'Program (title snippet from EPG)',
      phAttraction: 'E.g.: Championship',
      labelCountries: 'Countries (comma separated)',
      phCountries: 'E.g.: brazil, argentina',
      labelStates: 'States (comma separated)',
      phStates: 'E.g.: california, texas',
      labelCities: 'Cities (comma separated)',
      phCities: 'E.g.: new york, miami',
      labelReason: 'Reason (optional)',
      phReason: 'E.g.: broadcasting rights restriction',
      saveBlock: 'Save block',
      blocksListTitle: 'Registered blocks',
      thAttraction: 'Program',
      thRegion: 'Region',
      thReason: 'Reason',
      thActions: 'Actions',
      emptyBlocks: 'No blocks registered.',
      country: 'Country',
      state: 'State',
      city: 'City',
      global: 'Global',
      delete: 'Delete',
      saveError: 'Could not save the block.',
      deleteConfirm: 'Do you want to delete this block?',
      deleteError: 'Could not delete the block.',
      loadError: 'Error loading blocks.'
    }
  };

  function getLang() {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
  }

  let currentLang = getLang();
  const streamStateChannel = 'BroadcastChannel' in window ? new BroadcastChannel('webtv-stream-state') : null;

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('blocks-title', t('blocksTitle'));
    setText('blocks-subtitle', t('blocksSubtitle'));
    setText('label-attraction', t('labelAttraction'));
    setText('label-countries', t('labelCountries'));
    setText('label-states', t('labelStates'));
    setText('label-cities', t('labelCities'));
    setText('label-reason', t('labelReason'));
    setText('btn-save-block', t('saveBlock'));
    setText('blocks-list-title', t('blocksListTitle'));
    setText('th-attraction', t('thAttraction'));
    setText('th-region', t('thRegion'));
    setText('th-reason', t('thReason'));
    setText('th-actions', t('thActions'));
    setText('blocks-empty', t('emptyBlocks'));

    form.attraction.placeholder = t('phAttraction');
    form.countries.placeholder = t('phCountries');
    form.states.placeholder = t('phStates');
    form.cities.placeholder = t('phCities');
    form.reason.placeholder = t('phReason');
  }

  async function applyChannelName() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      const channelName = String(data?.channelName || 'Webtv framework');
      document.title = `${t('title')} - ${channelName}`;
    } catch (_) {
      document.title = `${t('title')} - Webtv framework`;
    }
  }

  function prettyRegion(block) {
    const parts = [];

    if (Array.isArray(block.countries) && block.countries.length) {
      parts.push(`${t('country')}: ${block.countries.join(', ')}`);
    }

    if (Array.isArray(block.states) && block.states.length) {
      parts.push(`${t('state')}: ${block.states.join(', ')}`);
    }

    if (Array.isArray(block.cities) && block.cities.length) {
      parts.push(`${t('city')}: ${block.cities.join(', ')}`);
    }

    return parts.length ? parts.join(' | ') : t('global');
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function notifyStreamStateChanged() {
    streamStateChannel?.postMessage({ type: 'stream-state-changed' });
  }

  async function loadBlocks() {
    const response = await fetch('/api/blocks');
    const blocks = await response.json();

    if (!Array.isArray(blocks) || !blocks.length) {
      table.style.display = 'none';
      empty.style.display = 'block';
      body.innerHTML = '';
      return;
    }

    empty.style.display = 'none';
    table.style.display = 'table';

    body.innerHTML = blocks.map(block => `
      <tr>
        <td>${esc(block.attraction)}</td>
        <td>${esc(prettyRegion(block))}</td>
        <td>${esc(block.reason || '-')}</td>
        <td>
          <button class="btn-danger" data-id="${esc(block.id)}">${esc(t('delete'))}</button>
        </td>
      </tr>
    `).join('');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      attraction: form.attraction.value,
      countries: form.countries.value,
      states: form.states.value,
      cities: form.cities.value,
      reason: form.reason.value,
    };

    const response = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error || t('saveError'));
      return;
    }

    form.reset();
    notifyStreamStateChanged();
    await loadBlocks();
  });

  body.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const id = target.dataset.id;
    if (!id) return;

    const confirmed = window.confirm(t('deleteConfirm'));
    if (!confirmed) return;

    const response = await fetch(`/api/blocks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      window.alert(t('deleteError'));
      return;
    }

    notifyStreamStateChanged();
    await loadBlocks();
  });

  applyStaticTranslations();
  applyChannelName();
  loadBlocks().catch(err => {
    console.error('[BLOCKS] Falha ao carregar bloqueios:', err);
    window.alert(t('loadError'));
  });
})();
