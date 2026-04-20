(function () {
  'use strict';

  const form = document.getElementById('block-form');
  const table = document.getElementById('blocks-table');
  const body = document.getElementById('blocks-body');
  const empty = document.getElementById('blocks-empty');

  async function applyChannelName() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      const channelName = String(data?.channelName || 'TV Sabinos');
      document.title = `Bloqueios Regionais - ${channelName}`;
    } catch (_) {
      document.title = 'Bloqueios Regionais - TV Sabinos';
    }
  }

  function prettyRegion(block) {
    const parts = [];

    if (Array.isArray(block.countries) && block.countries.length) {
      parts.push(`País: ${block.countries.join(', ')}`);
    }

    if (Array.isArray(block.states) && block.states.length) {
      parts.push(`Estado: ${block.states.join(', ')}`);
    }

    if (Array.isArray(block.cities) && block.cities.length) {
      parts.push(`Cidade: ${block.cities.join(', ')}`);
    }

    return parts.length ? parts.join(' | ') : 'Global';
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
          <button class="btn-danger" data-id="${esc(block.id)}">Excluir</button>
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
      window.alert(data.error || 'Não foi possível salvar o bloqueio.');
      return;
    }

    form.reset();
    await loadBlocks();
  });

  body.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const id = target.dataset.id;
    if (!id) return;

    const confirmed = window.confirm('Deseja excluir este bloqueio?');
    if (!confirmed) return;

    const response = await fetch(`/api/blocks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      window.alert('Não foi possível excluir o bloqueio.');
      return;
    }

    await loadBlocks();
  });

  applyChannelName();
  loadBlocks().catch(err => {
    console.error('[BLOCKS] Falha ao carregar bloqueios:', err);
    window.alert('Erro ao carregar os bloqueios.');
  });
})();
