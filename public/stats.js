(function () {
  'use strict';

  const currentViewers = document.getElementById('metric-current-viewers');
  const totalVisits = document.getElementById('metric-total-visits');
  const visits24h = document.getElementById('metric-last-24h');
  const uniqueIps = document.getElementById('metric-unique-ips');
  const updatedAt = document.getElementById('metric-updated');
  const hourlyChart = document.getElementById('hourly-chart');
  const recentVisits = document.getElementById('recent-visits');
  const topBrowsers = document.getElementById('top-browsers');
  const topOs = document.getElementById('top-os');
  const topCountries = document.getElementById('top-countries');
  const topCities = document.getElementById('top-cities');

  async function applyChannelName() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      const channelName = String(data?.channelName || 'Webtv framework');
      document.title = `${channelName} — Estatísticas`;
    } catch (_) {
      document.title = 'Webtv framework — Estatísticas';
    }
  }

  function renderPills(container, items) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="empty-state">Ainda sem dados suficientes.</p>';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="pill">
        <b>${escapeHtml(item.label)}</b>
        <span>${item.value}</span>
      </div>
    `).join('');
  }

  function renderHourlyChart(series) {
    const max = Math.max(...(series.values || [0]), 1);

    hourlyChart.innerHTML = (series.labels || []).map((label, index) => {
      const value = series.values[index] || 0;
      const height = Math.max(8, (value / max) * 180);

      return `
        <div class="bar-item" title="${escapeHtml(label)}: ${value}">
          <div class="bar-value" style="height:${height}px"></div>
          <div class="bar-label">${escapeHtml(label)}</div>
        </div>
      `;
    }).join('');
  }

  function renderRecentVisits(items) {
    if (!items || !items.length) {
      recentVisits.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhuma visita registrada.</td></tr>';
      return;
    }

    recentVisits.innerHTML = items.map(item => `
      <tr>
        <td>${new Date(item.visitedAt).toLocaleString('pt-BR')}</td>
        <td>${escapeHtml(item.ip)}</td>
        <td>${escapeHtml(item.browser)}</td>
        <td>${escapeHtml(item.operatingSystem)}</td>
        <td>${escapeHtml(item.device)}</td>
        <td>${escapeHtml(`${item.city}, ${item.state}, ${item.country}`)}</td>
      </tr>
    `).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadSummary() {
    const response = await fetch('/api/analytics/summary');
    const data = await response.json();

    currentViewers.textContent = data.currentViewers;
    totalVisits.textContent = data.totalVisits;
    visits24h.textContent = data.visitsLast24Hours;
    uniqueIps.textContent = data.uniqueIpsLast24Hours;
    updatedAt.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR')}`;

    renderHourlyChart(data.hourlyVisits || { labels: [], values: [] });
    renderPills(topBrowsers, data.topBrowsers);
    renderPills(topOs, data.topOperatingSystems);
    renderPills(topCountries, data.topCountries);
    renderPills(topCities, data.topCities);
    renderRecentVisits(data.recentVisits);
  }

  applyChannelName();
  loadSummary().catch(console.error);
  setInterval(() => loadSummary().catch(console.error), 10000);
})();