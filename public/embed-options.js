(function () {
  'use strict';

  const embedUrlInput = document.getElementById('embed-url');
  const embedCodeInput = document.getElementById('embed-code');
  const copyUrlButton = document.getElementById('btn-copy-url');
  const copyCodeButton = document.getElementById('btn-copy-code');
  const widgetOptionsList = document.getElementById('widget-options-list');
  const widgetOrderList = document.getElementById('widget-order-list');
  const miniPreview = document.getElementById('mini-preview');
  const saveWidgetsButton = document.getElementById('btn-save-widgets');
  const widgetStatus = document.getElementById('widget-status');

  const WIDGET_CATALOG = [
    { id: 'epgButton', label: 'Botao da grade de programacao' },
    { id: 'currentProgram', label: 'Programa atual' },
    { id: 'nextProgram', label: 'Proximo programa' },
    { id: 'currentAudience', label: 'Audiencia atual' },
    { id: 'totalAudience', label: 'Audiencia total' },
  ];

  let embedCustomization = {
    order: WIDGET_CATALOG.map((item) => item.id),
    enabled: {
      epgButton: true,
      currentProgram: true,
      nextProgram: true,
      currentAudience: true,
      totalAudience: false,
    },
  };
  let dragId = null;

  function getEmbedUrl() {
    return new URL('/embed', window.location.origin).toString();
  }

  function getEmbedCode(url) {
    return `<iframe src="${url}" width="100%" height="560" style="border:0;" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  }

  function setStatus(message, isError) {
    widgetStatus.textContent = message;
    widgetStatus.style.color = isError ? '#ff8f8f' : 'rgba(255, 255, 255, 0.85)';
  }

  function sanitizeCustomization(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const ids = WIDGET_CATALOG.map((item) => item.id);
    const orderSource = Array.isArray(source.order) ? source.order : [];
    const uniqueOrder = orderSource
      .map((item) => String(item || '').trim())
      .filter((item, index, list) => ids.includes(item) && list.indexOf(item) === index);

    const order = [
      ...uniqueOrder,
      ...ids.filter((id) => !uniqueOrder.includes(id)),
    ];

    const enabledSource = source.enabled && typeof source.enabled === 'object' ? source.enabled : {};
    const enabled = {};
    ids.forEach((id) => {
      enabled[id] = enabledSource[id] !== false;
    });

    return { order, enabled };
  }

  function getWidgetLabel(id) {
    const widget = WIDGET_CATALOG.find((item) => item.id === id);
    return widget ? widget.label : id;
  }

  function renderWidgetOptions() {
    widgetOptionsList.innerHTML = WIDGET_CATALOG.map((widget) => {
      const checked = embedCustomization.enabled[widget.id] ? 'checked' : '';
      return `<label class="widget-row"><input type="checkbox" data-widget-toggle="${widget.id}" ${checked} /> ${widget.label}</label>`;
    }).join('');
  }

  function renderWidgetOrder() {
    const enabledOrder = embedCustomization.order.filter((id) => embedCustomization.enabled[id]);

    if (!enabledOrder.length) {
      widgetOrderList.innerHTML = '<li class="sortable-item" style="cursor:default">Nenhum widget selecionado.</li>';
      return;
    }

    widgetOrderList.innerHTML = enabledOrder.map((id) => (
      `<li class="sortable-item" draggable="true" data-widget-id="${id}"><span class="drag-handle">::</span> ${getWidgetLabel(id)}</li>`
    )).join('');
  }

  function renderMiniPreview() {
    const enabledOrder = embedCustomization.order.filter((id) => embedCustomization.enabled[id]);
    miniPreview.innerHTML = enabledOrder.map((id) => `<div class="mini-widget">${getWidgetLabel(id)}</div>`).join('');

    if (!enabledOrder.length) {
      miniPreview.innerHTML = '<div class="mini-widget">Selecione ao menos um widget.</div>';
    }
  }

  function renderAll() {
    renderWidgetOptions();
    renderWidgetOrder();
    renderMiniPreview();
  }

  function reorderEnabledWidgets(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;

    const enabledOrder = embedCustomization.order.filter((id) => embedCustomization.enabled[id]);
    const disabledOrder = embedCustomization.order.filter((id) => !embedCustomization.enabled[id]);
    const fromIndex = enabledOrder.indexOf(fromId);
    const toIndex = enabledOrder.indexOf(toId);

    if (fromIndex < 0 || toIndex < 0) return;

    enabledOrder.splice(fromIndex, 1);
    enabledOrder.splice(toIndex, 0, fromId);
    embedCustomization.order = [...enabledOrder, ...disabledOrder];
    renderAll();
  }

  async function loadEmbedCustomization() {
    try {
      const response = await fetch('/api/admin/embed-customization', { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao carregar configuracao do embed.');
      const data = await response.json();
      embedCustomization = sanitizeCustomization(data?.saved || data?.effective);
      renderAll();
    } catch (_) {
      setStatus('Nao foi possivel carregar a configuracao dos widgets.', true);
      renderAll();
    }
  }

  async function saveEmbedCustomization() {
    try {
      saveWidgetsButton.disabled = true;
      setStatus('Salvando configuracao...', false);

      const response = await fetch('/api/admin/embed-customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedCustomization }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Falha ao salvar configuracao.');
      }

      embedCustomization = sanitizeCustomization(payload.embedCustomization);
      renderAll();
      setStatus('Configuracao salva. O embed ja vai refletir a nova ordem.', false);
    } catch (error) {
      setStatus(error.message || 'Nao foi possivel salvar os widgets.', true);
    } finally {
      saveWidgetsButton.disabled = false;
    }
  }

  copyUrlButton.addEventListener('click', async () => {
    const ok = await copyText(embedUrlInput.value);
    if (!ok) window.alert('Nao foi possivel copiar a URL.');
  });

  copyCodeButton.addEventListener('click', async () => {
    const ok = await copyText(embedCodeInput.value);
    if (!ok) window.alert('Nao foi possivel copiar o iframe.');
  });

  const embedUrl = getEmbedUrl();
  embedUrlInput.value = embedUrl;
  embedCodeInput.value = getEmbedCode(embedUrl);

  widgetOptionsList.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const widgetId = String(target.dataset.widgetToggle || '');
    if (!widgetId) return;
    embedCustomization.enabled[widgetId] = target.checked;
    renderAll();
  });

  widgetOrderList.addEventListener('dragstart', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest('.sortable-item');
    if (!(item instanceof HTMLElement)) return;
    dragId = item.dataset.widgetId || null;
    item.classList.add('dragging');
  });

  widgetOrderList.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  widgetOrderList.addEventListener('drop', (event) => {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const dropItem = target.closest('.sortable-item');
    if (!(dropItem instanceof HTMLElement)) return;
    const dropId = dropItem.dataset.widgetId || null;
    reorderEnabledWidgets(dragId, dropId);
  });

  widgetOrderList.addEventListener('dragend', () => {
    dragId = null;
    widgetOrderList.querySelectorAll('.sortable-item').forEach((item) => item.classList.remove('dragging'));
  });

  saveWidgetsButton.addEventListener('click', saveEmbedCustomization);

  loadEmbedCustomization();
})();