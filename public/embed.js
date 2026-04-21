(function () {
  'use strict';

  const video = document.getElementById('video');
  const playerWrapper = document.getElementById('player-wrapper');
  const loading = document.getElementById('player-loading');
  const errorBox = document.getElementById('player-error');
  const errorMsg = document.getElementById('error-msg');
  const btnPlay = document.getElementById('btn-play');
  const btnMute = document.getElementById('btn-mute');
  const volRange = document.getElementById('volume-range');
  const btnCast = document.getElementById('btn-cast');
  const btnFS = document.getElementById('btn-fullscreen');

  let hls = null;
  let analyticsSessionId = null;
  let heartbeatTimer = null;
  let streamStatePollTimer = null;
  let streamStateChannel = null;
  let streamStateVersion = 0;

  async function loadPublicConfig() {
    try {
      const response = await fetch('/api/public-config', { cache: 'no-store' });
      return await response.json();
    } catch (_) {
      return null;
    }
  }

  function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
  }

  function showError(show, msg = '') {
    errorBox.style.display = show ? 'flex' : 'none';
    if (msg) errorMsg.textContent = msg;
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

      return 'Transmissao indisponivel no momento.';
    } catch (_) {
      return null;
    }
  }

  async function initPlayer() {
    if (hls) {
      hls.destroy();
      hls = null;
    }

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
      hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        showLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          showLoading(false);
          showError(true, 'Erro ao carregar o stream.');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => showLoading(false), { once: true });
      video.play().catch(() => {});
    } else {
      showLoading(false);
      showError(true, 'Navegador sem suporte HLS.');
    }
  }

  btnPlay.addEventListener('click', () => {
    if (video.paused) video.play();
    else video.pause();
  });

  btnMute.addEventListener('click', () => {
    video.muted = !video.muted;
    btnMute.textContent = video.muted ? '🔇' : '🔊';
  });

  volRange.addEventListener('input', () => {
    video.volume = Number(volRange.value);
    video.muted = video.volume === 0;
    btnMute.textContent = video.muted ? '🔇' : '🔊';
  });

  btnFS.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  window.__onGCastApiAvailable = function onGCastApiAvailable(isAvailable) {
    if (!isAvailable || !window.cast?.framework || !window.chrome?.cast) return;

    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    btnCast.style.display = 'inline-flex';
  };

  btnCast.addEventListener('click', async () => {
    if (!window.cast?.framework || !window.chrome?.cast) return;
    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

    try {
      const context = cast.framework.CastContext.getInstance();
      let session = context.getCurrentSession();
      if (!session) {
        await context.requestSession();
        session = context.getCurrentSession();
      }
      if (!session) return;

      const mediaInfo = new chrome.cast.media.MediaInfo(
        new URL('/stream/playlist.m3u8', window.location.origin).toString(),
        'application/x-mpegURL'
      );
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      await session.loadMedia(request);
    } catch (_) {
      // sem ação
    }
  });

  async function startAnalyticsSession() {
    try {
      const response = await fetch('/api/analytics/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      const data = await response.json();
      analyticsSessionId = data.sessionId;
      heartbeatTimer = window.setInterval(sendHeartbeat, data.pingIntervalMs || 20000);
    } catch (_) {
      // sem ação
    }
  }

  async function sendHeartbeat() {
    if (!analyticsSessionId) return;
    try {
      await fetch('/api/analytics/session/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: analyticsSessionId }),
      });
    } catch (_) {
      // sem ação
    }
  }

  function endAnalyticsSession() {
    if (!analyticsSessionId) return;
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (streamStatePollTimer) {
      clearInterval(streamStatePollTimer);
      streamStatePollTimer = null;
    }
    if (streamStateChannel) {
      streamStateChannel.close();
      streamStateChannel = null;
    }

    const payload = JSON.stringify({ sessionId: analyticsSessionId });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/session/end', blob);
    }
  }

  window.addEventListener('beforeunload', endAnalyticsSession);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') endAnalyticsSession();
  });

  async function pollStreamState() {
    const data = await loadPublicConfig();
    const nextVersion = Number(data?.streamStateVersion) || 0;
    if (!nextVersion) return;

    if (streamStateVersion && nextVersion !== streamStateVersion) {
      streamStateVersion = nextVersion;
      initPlayer();
      return;
    }

    streamStateVersion = nextVersion;
  }

  initPlayer();
  startAnalyticsSession();
  loadPublicConfig().then((data) => {
    streamStateVersion = Number(data?.streamStateVersion) || 0;
  }).catch(() => {});
  if ('BroadcastChannel' in window) {
    streamStateChannel = new BroadcastChannel('webtv-stream-state');
    streamStateChannel.addEventListener('message', () => {
      pollStreamState();
    });
  }
  streamStatePollTimer = window.setInterval(pollStreamState, 2000);
})();