(function () {
  'use strict';

  const embedUrlInput = document.getElementById('embed-url');
  const embedCodeInput = document.getElementById('embed-code');
  const copyUrlButton = document.getElementById('btn-copy-url');
  const copyCodeButton = document.getElementById('btn-copy-code');

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
})();