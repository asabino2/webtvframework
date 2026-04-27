(function () {
  'use strict';

  const form = document.getElementById('cb-form');
  const modeSelect = document.getElementById('cb-mode');
  const modeHint = document.getElementById('mode-hint');
  const table = document.getElementById('cb-table');
  const tbody = document.getElementById('cb-body');
  const empty = document.getElementById('cb-empty');

  const LANG_KEY = 'webtv_lang';

  const i18n = {
    pt: {
      title: 'Bloqueio de Canal',
      pageTitle: 'Bloqueio de Canal',
      pageSubtitle: 'Bloqueie o acesso ao site, stream HLS e/ou embed por regiao, independente da atracao.',
      labelMode: 'Modo de bloqueio',
      optBlacklist: 'Lista negra (bloquear regioes listadas)',
      optWhitelist: 'Lista branca (permitir somente regioes listadas)',
      hintBlacklist: 'Regioes listadas serao bloqueadas. Deixe todos os campos de regiao em branco para bloquear todos os acessos.',
      hintWhitelist: 'Somente regioes listadas terao acesso. Todos os outros serao bloqueados.',
      labelTargets: 'Aplicar bloqueio em',
      labelTargetSite: 'Site (pagina inicial)',
      labelTargetStream: 'Stream HLS',
      labelTargetEmbed: 'Embed independente',
      labelCountries: 'Paises (separados por virgula)',
      phCountries: 'Ex.: brasil, argentina',
      labelStates: 'Estados (separados por virgula)',
      phStates: 'Ex.: sao paulo, minas gerais',
      labelCities: 'Cidades (separadas por virgula)',
      phCities: 'Ex.: campinas, sorocaba',
      labelReason: 'Motivo (exibido para o usuario bloqueado)',
      phReason: 'Ex.: restricao regional de acesso',
      saveBlock: 'Salvar bloqueio',
      listTitle: 'Bloqueios cadastrados',
      thMode: 'Modo',
      thTargets: 'Alvos',
      thRegion: 'Regiao',
      thReason: 'Motivo',
      thActive: 'Ativo',
      thActions: 'Acoes',
      emptyBlocks: 'Nenhum bloqueio cadastrado.',
      blacklist: 'Lista negra',
      whitelist: 'Lista branca',
      allRegions: 'Global (todos)',
      country: 'Pais',
      state: 'Estado',
      city: 'Cidade',
      targetSite: 'Site',
      targetStream: 'Stream HLS',
      targetEmbed: 'Embed',
      toggleActive: 'Ativo',
      deleteConfirm: 'Deseja excluir este bloqueio?',
      deleteError: 'Nao foi possivel excluir o bloqueio.',
      saveError: 'Nao foi possivel salvar o bloqueio.',
      targetRequired: 'Selecione pelo menos um alvo (site, stream ou embed).',
      loadError: 'Erro ao carregar os bloqueios.'
    },
    en: {
      title: 'Channel Blocking',
      pageTitle: 'Channel Blocking',
      pageSubtitle: 'Block access to site, HLS stream and/or embed by region, regardless of the current program.',
      labelMode: 'Block mode',
      optBlacklist: 'Blacklist (block listed regions)',
      optWhitelist: 'Whitelist (allow only listed regions)',
      hintBlacklist: 'Listed regions will be blocked. Leave all region fields blank to block all access.',
      hintWhitelist: 'Only listed regions will have access. All others will be blocked.',
      labelTargets: 'Apply block to',
      labelTargetSite: 'Site (home page)',
      labelTargetStream: 'HLS Stream',
      labelTargetEmbed: 'Standalone embed',
      labelCountries: 'Countries (comma separated)',
      phCountries: 'E.g.: brazil, argentina',
      labelStates: 'States (comma separated)',
      phStates: 'E.g.: california, texas',
      labelCities: 'Cities (comma separated)',
      phCities: 'E.g.: new york, miami',
      labelReason: 'Reason (shown to blocked user)',
      phReason: 'E.g.: regional access restriction',
      saveBlock: 'Save block',
      listTitle: 'Registered blocks',
      thMode: 'Mode',
      thTargets: 'Targets',
      thRegion: 'Region',
      thReason: 'Reason',
      thActive: 'Active',
      thActions: 'Actions',
      emptyBlocks: 'No blocks registered.',
      blacklist: 'Blacklist',
      whitelist: 'Whitelist',
      allRegions: 'Global (all)',
      country: 'Country',
      state: 'State',
      city: 'City',
      targetSite: 'Site',
      targetStream: 'HLS Stream',
      targetEmbed: 'Embed',
      toggleActive: 'Active',
      deleteConfirm: 'Do you want to delete this block?',
      deleteError: 'Could not delete the block.',
      saveError: 'Could not save the block.',
      targetRequired: 'Select at least one target (site, stream or embed).',
      loadError: 'Error loading blocks.'
    }
  };

  function getLang() {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'pt';
  }

  let currentLang = getLang();

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en-US' : 'pt-BR';

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    const setAttr = (id, attr, value) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, value);
    };

    setText('cb-title', t('pageTitle'));
    setText('cb-subtitle', t('pageSubtitle'));
    setText('label-mode', t('labelMode'));
    setText('opt-blacklist', t('optBlacklist'));
    setText('opt-whitelist', t('optWhitelist'));
    setText('label-targets', t('labelTargets'));
    setText('label-target-site', t('labelTargetSite'));
    setText('label-target-stream', t('labelTargetStream'));
    setText('label-target-embed', t('labelTargetEmbed'));
    setText('label-countries', t('labelCountries'));
    setText('label-states', t('labelStates'));
    setText('label-cities', t('labelCities'));
    setText('label-reason', t('labelReason'));
    setText('btn-save-cb', t('saveBlock'));
    setText('cb-list-title', t('listTitle'));
    setText('th-mode', t('thMode'));
    setText('th-targets', t('thTargets'));
    setText('th-region', t('thRegion'));
    setText('th-reason', t('thReason'));
    setText('th-active', t('thActive'));
    setText('th-actions', t('thActions'));
    setText('cb-empty', t('emptyBlocks'));

    setAttr('cb-countries', 'placeholder', t('phCountries'));
    setAttr('cb-states', 'placeholder', t('phStates'));
    setAttr('cb-cities', 'placeholder', t('phCities'));
    setAttr('cb-reason', 'placeholder', t('phReason'));

    updateModeHint();
  }

  function updateModeHint() {
    const mode = modeSelect ? modeSelect.value : 'blacklist';
    if (modeHint) {
      modeHint.textContent = mode === 'whitelist' ? t('hintWhitelist') : t('hintBlacklist');
    }
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

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
    return parts.length ? parts.join(' | ') : t('allRegions');
  }

  function targetLabel(targetId) {
    if (targetId === 'site') return t('targetSite');
    if (targetId === 'stream') return t('targetStream');
    if (targetId === 'embed') return t('targetEmbed');
    return targetId;
  }

  function renderBlocks(blocks) {
    if (!blocks.length) {
      empty.style.display = 'block';
      table.style.display = 'none';
      return;
    }

    empty.style.display = 'none';
    table.style.display = 'table';

    tbody.innerHTML = blocks.map((block) => {
      const modeClass = block.mode === 'whitelist' ? 'badge-whitelist' : 'badge-blacklist';
      const modeLabel = block.mode === 'whitelist' ? t('whitelist') : t('blacklist');
      const targetsHtml = (Array.isArray(block.targets) ? block.targets : [])
        .map((tgt) => `<span class="badge-target">${esc(targetLabel(tgt))}</span>`)
        .join('');
      const region = esc(prettyRegion(block));
      const reason = esc(block.reason || '—');
      const isActive = block.active !== false;

      return `<tr data-id="${esc(block.id)}">
        <td><span class="badge-mode ${modeClass}">${esc(modeLabel)}</span></td>
        <td>${targetsHtml || '—'}</td>
        <td class="muted">${region}</td>
        <td class="muted">${reason}</td>
        <td>
          <label class="toggle-active" title="${esc(t('toggleActive'))}">
            <input type="checkbox" class="toggle-active-cb" data-id="${esc(block.id)}" ${isActive ? 'checked' : ''} />
          </label>
        </td>
        <td>
          <button class="btn-danger btn-delete-cb" data-id="${esc(block.id)}" type="button">✕</button>
        </td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.toggle-active-cb').forEach((checkbox) => {
      checkbox.addEventListener('change', async function () {
        const id = this.dataset.id;
        try {
          await fetch(`/api/channel-blocks/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: this.checked }),
          });
        } catch (_) {
          this.checked = !this.checked;
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-cb').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm(t('deleteConfirm'))) return;
        const id = btn.dataset.id;
        try {
          const res = await fetch(`/api/channel-blocks/${encodeURIComponent(id)}`, { method: 'DELETE' });
          if (!res.ok) throw new Error();
          await loadBlocks();
        } catch (_) {
          alert(t('deleteError'));
        }
      });
    });
  }

  async function loadBlocks() {
    try {
      const response = await fetch('/api/channel-blocks');
      if (!response.ok) throw new Error();
      const data = await response.json();
      renderBlocks(Array.isArray(data) ? data : []);
    } catch (_) {
      empty.textContent = t('loadError');
      empty.style.display = 'block';
      table.style.display = 'none';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const targets = ['site', 'stream', 'embed'].filter(
      (tgt) => document.getElementById(`target_${tgt}`)?.checked
    );

    if (!targets.length) {
      alert(t('targetRequired'));
      return;
    }

    const saveBtn = document.getElementById('btn-save-cb');
    saveBtn.disabled = true;

    const payload = {
      mode: modeSelect.value,
      targets,
      countries: document.getElementById('cb-countries').value,
      states: document.getElementById('cb-states').value,
      cities: document.getElementById('cb-cities').value,
      reason: document.getElementById('cb-reason').value,
      active: true,
    };

    try {
      const response = await fetch('/api/channel-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || t('saveError'));
      }

      form.reset();
      updateModeHint();
      await loadBlocks();
    } catch (err) {
      alert(err.message || t('saveError'));
    } finally {
      saveBtn.disabled = false;
    }
  });

  if (modeSelect) {
    modeSelect.addEventListener('change', updateModeHint);
  }

  applyStaticTranslations();
  applyChannelName();
  loadBlocks();
})();
