/* ── app.js — Webtv framework ────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Elementos ────────────────────────────────────────────────────────────
  const video         = document.getElementById('video');
  const playerWrapper = document.getElementById('player-wrapper');
  const loading       = document.getElementById('player-loading');
  const errorBox      = document.getElementById('player-error');
  const errorMsg      = document.getElementById('error-msg');
  const btnPlay       = document.getElementById('btn-play');
  const iconPlay      = document.getElementById('icon-play');
  const iconPause     = document.getElementById('icon-pause');
  const btnMute       = document.getElementById('btn-mute');
  const iconVol       = document.getElementById('icon-vol');
  const iconMuted     = document.getElementById('icon-muted');
  const volRange      = document.getElementById('volume-range');
  const btnFS         = document.getElementById('btn-fullscreen');
  const iconFS        = document.getElementById('icon-fs');
  const iconExitFS    = document.getElementById('icon-exit-fs');
  const btnRetry      = document.getElementById('btn-retry');
  const btnCast       = document.getElementById('btn-cast');
  const logoChannelName = document.getElementById('logo-channel-name');
  const appVersionLine = document.getElementById('app-version-line');

  const btnEpg        = document.getElementById('btn-epg');
  const epgOverlay    = document.getElementById('epg-overlay');
  const epgClose      = document.getElementById('epg-close');
  const epgGridBody   = document.getElementById('epg-grid-body');
  const epgDetailOverlay = document.getElementById('epg-detail-overlay');
  const epgDetailClose   = document.getElementById('epg-detail-close');
  const epgDetailCover   = document.getElementById('epg-detail-cover');
  const epgDetailCoverEmpty = document.getElementById('epg-detail-cover-empty');
  const epgDetailTime    = document.getElementById('epg-detail-time');
  const epgDetailTitle   = document.getElementById('epg-detail-title');
  const epgDetailSubtitle = document.getElementById('epg-detail-subtitle');
  const epgDetailCategory = document.getElementById('epg-detail-category');
  const epgDetailDesc    = document.getElementById('epg-detail-desc');
  const epgDetailExtra   = document.getElementById('epg-detail-extra');

  const currentTitle  = document.getElementById('current-title');
  const currentTime   = document.getElementById('current-time');
  const currentDesc   = document.getElementById('current-desc');
  const currentCat    = document.getElementById('current-cat');
  const progressFill  = document.getElementById('progress-fill');
  const nextTitle     = document.getElementById('next-title');
  const nextTime      = document.getElementById('next-time');
  const nextDesc      = document.getElementById('next-desc');
  const nextCat       = document.getElementById('next-cat');
  const viewerCount   = document.getElementById('viewer-count');
  const viewerUpdated = document.getElementById('viewer-updated-at');

  // ── HLS Player ──────────────────────────────────────────────────────────
  let hls = null;
  let analyticsSessionId = null;
  let heartbeatTimer = null;
  let liveTimer = null;
  let channelName = 'Webtv framework';
  let appVersion = '0.0.1';

  async function loadPublicConfig() {
    try {
      const response = await fetch('/api/public-config');
      const data = await response.json();
      if (data?.channelName) {
        channelName = String(data.channelName);
      }
      if (data?.version) {
        appVersion = String(data.version);
      }
    } catch (_) {
      // Mantém fallback local quando configuração não estiver disponível.
    }

    document.title = `${channelName} — Ao Vivo`;
    if (logoChannelName) {
      logoChannelName.textContent = channelName;
    }
    if (appVersionLine) {
      appVersionLine.textContent = `Webtv Framework - Versão ${appVersion}`;
    }
  }

  async function readStreamNotice() {
    try {
      const response = await fetch('/stream/playlist.m3u8', { cache: 'no-store' });
      if (!response.ok) return null;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/vnd.apple.mpegurl')) return null;

      const playlist = await response.text();
      if (!playlist.includes('/stream/notice.ts')) return null;

      const daterangeMatch = playlist.match(/X-TVSABINOS-MESSAGE="([^"]+)"/);
      if (daterangeMatch?.[1]) return daterangeMatch[1];

      const extinfMatch = playlist.match(/#EXTINF:[^,]*,(.*)/);
      if (extinfMatch?.[1]) return extinfMatch[1].trim();

      return 'Transmissão indisponível no momento.';
    } catch (_) {
      return null;
    }
  }

  async function startPlayback() {
    try {
      await video.play();
    } catch (_) {
      // Fallback para política de autoplay: tenta novamente em modo mudo.
      video.muted = true;
      updateMuteIcon();
      video.play().catch(() => {});
    }
  }

  async function initPlayer() {
    if (hls) { hls.destroy(); hls = null; }

    // Tenta iniciar com áudio; o fallback para mudo ocorre apenas se autoplay for bloqueado.
    video.muted = false;
    updateMuteIcon();

    showLoading(true);
    showError(false);

    const src = '/stream/playlist.m3u8';

    const notice = await readStreamNotice();
    if (notice) {
      showLoading(false);
      showError(true, notice);
      video.pause();
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        showLoading(false);
        startPlayback();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          showLoading(false);
          showError(true, 'Erro ao carregar o stream. Verifique se o servidor de origem está ativo.');
          console.error('[HLS] Erro fatal:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = src;
      video.addEventListener('loadedmetadata', () => showLoading(false), { once: true });
      video.addEventListener('error', () => {
        showLoading(false);
        showError(true, 'Não foi possível reproduzir o stream.');
      }, { once: true });
      startPlayback();
    } else {
      showLoading(false);
      showError(true, 'Seu navegador não suporta reprodução HLS.');
    }
  }

  function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
  }

  function showError(show, msg = '') {
    errorBox.style.display  = show ? 'flex' : 'none';
    if (msg) errorMsg.textContent = msg;
  }

  // ── Controles do Player ──────────────────────────────────────────────────
  btnPlay.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => {
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
  });

  video.addEventListener('pause', () => {
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
  });

  btnMute.addEventListener('click', () => {
    video.muted = !video.muted;
    updateMuteIcon();
  });

  volRange.addEventListener('input', () => {
    video.volume = parseFloat(volRange.value);
    video.muted  = video.volume === 0;
    updateMuteIcon();
  });

  function updateMuteIcon() {
    iconVol.style.display   = video.muted ? 'none'  : 'block';
    iconMuted.style.display = video.muted ? 'block' : 'none';
  }

  btnFS.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    const isFS = !!document.fullscreenElement;
    iconFS.style.display     = isFS ? 'none'  : 'block';
    iconExitFS.style.display = isFS ? 'block' : 'none';
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().catch(err => {
        console.warn('[FS]', err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Duplo clique para fullscreen
  video.addEventListener('dblclick', toggleFullscreen);

  btnRetry.addEventListener('click', initPlayer);

  // ── Google Cast ─────────────────────────────────────────────────────────
  window.__onGCastApiAvailable = function onGCastApiAvailable(isAvailable) {
    if (!isAvailable || !window.cast?.framework || !window.chrome?.cast) {
      return;
    }

    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    btnCast.style.display = 'flex';
  };

  btnCast.addEventListener('click', async () => {
    if (!window.cast?.framework || !window.chrome?.cast) {
      return;
    }

    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      window.alert('Para usar o Google Cast, acesse o site pelo IP da máquina na rede local, não por localhost.');
      return;
    }

    try {
      const context = cast.framework.CastContext.getInstance();
      let session = context.getCurrentSession();

      if (!session) {
        await context.requestSession();
        session = context.getCurrentSession();
      }

      if (!session) {
        return;
      }

      const mediaInfo = new chrome.cast.media.MediaInfo(
        new URL('/stream/playlist.m3u8', window.location.origin).toString(),
        'application/x-mpegURL'
      );
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;

      const metadata = new chrome.cast.media.GenericMediaMetadata();
      metadata.title = `${channelName} ao Vivo`;
      metadata.subtitle = currentTitle.textContent || 'Transmissão ao vivo';
      mediaInfo.metadata = metadata;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      request.currentTime = 0;

      await session.loadMedia(request);
    } catch (err) {
      console.error('[CAST] Falha ao iniciar transmissão:', err);
      window.alert('Não foi possível iniciar o Google Cast nesta tentativa.');
    }
  });

  // ── EPG: Sidebar (agora / próximo) ───────────────────────────────────────
  function fmtTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function updateSidebarEpg() {
    fetch('/api/epg/now')
      .then(r => r.json())
      .then(data => {
        if (!data || !data.length) {
          currentTitle.textContent = 'Sem informação de programação';
          return;
        }

        // Tenta encontrar o canal "TV Sabinos" — fallback para o primeiro
        const entry = data[0];
        const curr  = entry.current;
        const next  = entry.next;

        // Agora
        currentTitle.textContent = decodeHtml(curr?.title) || '—';
        if (curr?.start && curr?.stop) {
          currentTime.textContent = `${fmtTime(curr.start)} — ${fmtTime(curr.stop)}`;
          const total   = new Date(curr.stop) - new Date(curr.start);
          const elapsed = Date.now() - new Date(curr.start);
          const pct     = Math.max(0, Math.min(100, (elapsed / total) * 100));
          progressFill.style.width = `${pct}%`;
        }
        currentDesc.textContent = decodeHtml(curr?.desc) || '';
        currentCat.textContent  = decodeHtml(curr?.category) || '';
        currentCat.style.display = curr?.category ? 'inline-block' : 'none';

        // Próximo
        nextTitle.textContent = decodeHtml(next?.title) || '—';
        if (next?.start && next?.stop) {
          nextTime.textContent = `${fmtTime(next.start)} — ${fmtTime(next.stop)}`;
        } else {
          nextTime.textContent = '';
        }
        nextDesc.textContent = decodeHtml(next?.desc) || '';
        nextCat.textContent  = decodeHtml(next?.category) || '';
        nextCat.style.display = next?.category ? 'inline-block' : 'none';
      })
      .catch(() => {
        currentTitle.textContent = 'Não foi possível carregar o EPG';
      });
  }

  // Atualiza a cada 60 segundos
  updateSidebarEpg();
  setInterval(updateSidebarEpg, 60_000);

  // ── Analytics / audiência ───────────────────────────────────────────────
  function fmtUpdatedAt(iso) {
    if (!iso) return 'Atualização indisponível';
    return `Atualizado às ${new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  }

  function updateViewerCard(viewers, updatedAt = new Date().toISOString()) {
    viewerCount.textContent = String(viewers || 0);
    viewerUpdated.textContent = fmtUpdatedAt(updatedAt);
  }

  async function startAnalyticsSession() {
    try {
      const response = await fetch('/api/analytics/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: window.location.pathname }),
      });
      const data = await response.json();
      analyticsSessionId = data.sessionId;
      updateViewerCard(data.viewers);

      heartbeatTimer = window.setInterval(sendHeartbeat, data.pingIntervalMs || 20000);
      liveTimer = window.setInterval(fetchLiveViewers, 10000);
    } catch (err) {
      console.error('[ANALYTICS] Falha ao iniciar sessão:', err);
    }
  }

  async function sendHeartbeat() {
    if (!analyticsSessionId) return;

    try {
      const response = await fetch('/api/analytics/session/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: analyticsSessionId }),
      });
      const data = await response.json();
      updateViewerCard(data.viewers);
    } catch (err) {
      console.error('[ANALYTICS] Falha no heartbeat:', err);
    }
  }

  async function fetchLiveViewers() {
    try {
      const response = await fetch('/api/analytics/live');
      const data = await response.json();
      updateViewerCard(data.viewers, data.updatedAt);
    } catch (err) {
      console.error('[ANALYTICS] Falha ao buscar audiência:', err);
    }
  }

  function endAnalyticsSession() {
    if (!analyticsSessionId) return;

    const payload = JSON.stringify({ sessionId: analyticsSessionId });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/session/end', blob);
    }
  }

  window.addEventListener('beforeunload', endAnalyticsSession);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      endAnalyticsSession();
    }
  });

  // ── Modal Grade EPG ──────────────────────────────────────────────────────
  let epgLoaded = false;
  let epgGridData = [];

  btnEpg.addEventListener('click', openEpgModal);
  epgClose.addEventListener('click', closeEpgModal);
  epgOverlay.addEventListener('click', e => {
    if (e.target === epgOverlay) closeEpgModal();
  });
  epgGridBody.addEventListener('click', onEpgProgrammeClick);
  epgDetailClose.addEventListener('click', closeProgrammeDetail);
  epgDetailOverlay.addEventListener('click', e => {
    if (e.target === epgDetailOverlay) closeProgrammeDetail();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (isProgrammeDetailOpen()) {
      closeProgrammeDetail();
      return;
    }
    closeEpgModal();
  });

  function openEpgModal() {
    epgOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!epgLoaded) loadEpgGrid();
  }

  function closeEpgModal() {
    epgOverlay.classList.remove('open');
    closeProgrammeDetail();
    document.body.style.overflow = '';
  }

  function loadEpgGrid() {
    epgGridBody.innerHTML = `
      <div class="epg-loading">
        <div class="spinner"></div>
        <p>Carregando grade de programação…</p>
      </div>`;

    fetch('/api/epg/grid')
      .then(r => r.json())
      .then(grid => {
        epgGridData = Array.isArray(grid) ? grid : [];
        renderEpgGrid(epgGridData);
      })
      .catch(() => {
        epgGridBody.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">Não foi possível carregar a grade.</p>';
      });
  }

  function renderEpgGrid(grid) {
    if (!grid || !grid.length) {
      epgGridBody.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">Nenhuma programação disponível.</p>';
      return;
    }

    const now = new Date();
    let html = '';

    for (const [channelIndex, block] of grid.entries()) {
      html += `<div class="epg-channel-block">`;
      if (grid.length > 1) {
        html += `<div class="epg-channel-name">${esc(block.channel?.name || block.channel?.id)}</div>`;
      }

      html += `<div class="epg-programme-list">`;

      let lastDate = '';

      for (const [programmeIndex, prog] of block.programmes.entries()) {
        const start   = prog.start ? new Date(prog.start) : null;
        const stop    = prog.stop  ? new Date(prog.stop)  : null;
        const isCurr  = start && stop && start <= now && stop > now;

        // Separador de data
        if (start) {
          const dateLabel = start.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
          if (dateLabel !== lastDate) {
            html += `<div class="epg-date-separator">${esc(dateLabel)}</div>`;
            lastDate = dateLabel;
          }
        }

        const timeStr = start ? start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';

        html += `<button class="epg-programme-btn" type="button" data-channel-index="${channelIndex}" data-programme-index="${programmeIndex}"><div class="epg-programme${isCurr ? ' is-current' : ''}">
          <div class="epg-prog-time">${timeStr}</div>
          <div class="epg-prog-info">
            <div class="epg-prog-title">${esc(prog.title)}</div>
            ${prog.desc ? `<div class="epg-prog-desc">${esc(prog.desc)}</div>` : ''}
          </div>
          ${isCurr ? '<div class="epg-now-tag">AO VIVO</div>' : ''}
        </div></button>`;
      }

      html += `</div></div>`;
    }

    epgGridBody.innerHTML = html;
    epgLoaded = true;

    // Rola até o programa atual
    const curr = epgGridBody.querySelector('.is-current');
    if (curr) {
      setTimeout(() => curr.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }

  function onEpgProgrammeClick(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('.epg-programme-btn');
    if (!button) return;

    const channelIndex = Number(button.dataset.channelIndex);
    const programmeIndex = Number(button.dataset.programmeIndex);
    const block = epgGridData[channelIndex];
    const programme = block?.programmes?.[programmeIndex];
    if (!programme) return;

    openProgrammeDetail(programme, block.channel);
  }

  function isProgrammeDetailOpen() {
    return epgDetailOverlay.style.display === 'flex';
  }

  function closeProgrammeDetail() {
    epgDetailOverlay.style.display = 'none';
  }

  function addDetailItem(label, value) {
    if (!value) return '';
    return `<div class="epg-detail-item"><span class="epg-detail-label">${esc(label)}</span><div class="epg-detail-value">${esc(value)}</div></div>`;
  }

  function fmtDetailDate(startIso, stopIso) {
    const start = startIso ? new Date(startIso) : null;
    const stop = stopIso ? new Date(stopIso) : null;
    if (!start) return 'Horário indisponível';

    const day = start.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    if (!stop) return `${day} • ${fmtTime(startIso)}`;
    return `${day} • ${fmtTime(startIso)} — ${fmtTime(stopIso)}`;
  }

  function openProgrammeDetail(programme, channel) {
    epgDetailTime.textContent = `${fmtDetailDate(programme.start, programme.stop)}${channel?.name ? ` • ${decodeHtml(channel.name)}` : ''}`;
    epgDetailTitle.textContent = decodeHtml(programme.title || 'Sem título');

    if (programme.subTitle) {
      epgDetailSubtitle.style.display = 'block';
      epgDetailSubtitle.textContent = decodeHtml(programme.subTitle);
    } else {
      epgDetailSubtitle.style.display = 'none';
      epgDetailSubtitle.textContent = '';
    }

    if (programme.category) {
      epgDetailCategory.style.display = 'inline-block';
      epgDetailCategory.textContent = decodeHtml(programme.category);
    } else {
      epgDetailCategory.style.display = 'none';
      epgDetailCategory.textContent = '';
    }

    epgDetailDesc.textContent = decodeHtml(programme.desc || 'Sinopse não disponível para esta atração.');

    if (programme.icon) {
      epgDetailCover.style.display = 'block';
      epgDetailCover.src = programme.icon;
      epgDetailCover.onerror = () => {
        epgDetailCover.style.display = 'none';
        epgDetailCover.removeAttribute('src');
        epgDetailCoverEmpty.style.display = 'flex';
      };
      epgDetailCoverEmpty.style.display = 'none';
    } else {
      epgDetailCover.style.display = 'none';
      epgDetailCover.removeAttribute('src');
      epgDetailCover.onerror = null;
      epgDetailCoverEmpty.style.display = 'flex';
    }

    const actors = Array.isArray(programme.actors) ? programme.actors.join(', ') : '';
    const directors = Array.isArray(programme.directors) ? programme.directors.join(', ') : '';
    const presenters = Array.isArray(programme.presenters) ? programme.presenters.join(', ') : '';
    const producers = Array.isArray(programme.producers) ? programme.producers.join(', ') : '';
    const writers = Array.isArray(programme.writers) ? programme.writers.join(', ') : '';
    const countries = Array.isArray(programme.countries) ? programme.countries.join(', ') : '';

    epgDetailExtra.innerHTML = [
      addDetailItem('Atores', actors),
      addDetailItem('Direção', directors),
      addDetailItem('Apresentação', presenters),
      addDetailItem('Produção', producers),
      addDetailItem('Roteiro', writers),
      addDetailItem('País', countries),
      addDetailItem('Idioma', programme.language),
      addDetailItem('Idioma original', programme.originalLanguage),
      addDetailItem('Data', programme.date),
      addDetailItem('Episódio', programme.episodeNum),
      addDetailItem('Classificação', programme.rating),
    ].filter(Boolean).join('');

    epgDetailOverlay.style.display = 'flex';
  }

  // Decodifica entidades HTML (ex: &#233; → é) usando o DOM
  function decodeHtml(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = String(str);
    return txt.value;
  }

  function esc(str) {
    if (!str) return '';
    // Primeiro decodifica entidades, depois protege contra XSS
    return decodeHtml(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Inicializa ────────────────────────────────────────────────────────────
  loadPublicConfig().finally(() => {
    initPlayer();
    startAnalyticsSession();
  });

})();
