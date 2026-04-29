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
      labelMode: 'Modo de bloqueio',
      optBlacklist: 'Lista negra (bloquear regioes listadas)',
      optWhitelist: 'Lista branca (permitir somente regioes listadas)',
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
      labelReferrers: 'Referrers (domínios, separados por vírgula)',
      phReferrers: 'Ex.: facebook.com, twitter.com',
      referrersHelp: 'Se preenchido, o bloqueio também considera o referrer HTTP da requisição.',
      labelAltStreamUrl: 'URL de stream alternativo (opcional)',
      phAltStreamUrl: 'https://exemplo.com/alternativo/playlist.m3u8',
      altStreamHelp: 'Se preenchida, durante o bloqueio por atracao sera exibido este stream alternativo em vez de bloquear a reproducao.',
      saveBlock: 'Salvar bloqueio',
      blocksListTitle: 'Bloqueios cadastrados',
      thMode: 'Modo',
      thAttraction: 'Atracao',
      thRegion: 'Regiao',
      thReason: 'Motivo',
      thActions: 'Acoes',
      emptyBlocks: 'Nenhum bloqueio cadastrado.',
      country: 'Pais',
      state: 'Estado',
      city: 'Cidade',
      global: 'Global',
      blacklist: 'Lista negra',
      whitelist: 'Lista branca',
      altStreamLabel: 'Stream alternativo',
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
      labelMode: 'Blocking mode',
      optBlacklist: 'Blacklist (block listed regions)',
      optWhitelist: 'Whitelist (allow only listed regions)',
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
      labelReferrers: 'Referrers (domains, comma separated)',
      phReferrers: 'E.g.: facebook.com, twitter.com',
      referrersHelp: 'If filled, the block also checks the HTTP referrer of the request.',
      labelAltStreamUrl: 'Alternative stream URL (optional)',
      phAltStreamUrl: 'https://example.com/alternative/playlist.m3u8',
      altStreamHelp: 'If filled, this alternative stream is shown during program blocking instead of fully blocking playback.',
      saveBlock: 'Save block',
      blocksListTitle: 'Registered blocks',
      thMode: 'Mode',
      thAttraction: 'Program',
      thRegion: 'Region',
      thReason: 'Reason',
      thActions: 'Actions',
      emptyBlocks: 'No blocks registered.',
      country: 'Country',
      state: 'State',
      city: 'City',
      global: 'Global',
      blacklist: 'Blacklist',
      whitelist: 'Whitelist',
      altStreamLabel: 'Alternative stream',
      delete: 'Delete',
      saveError: 'Could not save the block.',
      deleteConfirm: 'Do you want to delete this block?',
      deleteError: 'Could not delete the block.',
      loadError: 'Error loading blocks.'
    },
    es: {
      title: 'Bloqueo Regional',
      blocksTitle: 'Bloqueo Regional de Programas',
      blocksSubtitle: 'Define reglas para bloquear transmisiones por país, estado y ciudad de la audiencia.',
      labelAttraction: 'Programa (fragmento del título del EPG)',
      phAttraction: 'Ej.: Campeonato',
      labelCountries: 'Países (separados por coma)',
      phCountries: 'Ej.: brasil, argentina',
      labelStates: 'Estados (separados por coma)',
      phStates: 'Ej.: california, texas',
      labelCities: 'Ciudades (separadas por coma)',
      phCities: 'Ej.: nueva york, miami',
      labelReason: 'Motivo (opcional)',
      phReason: 'Ej.: restricción de derechos de transmisión',
      labelReferrers: 'Referrers (dominios, separados por coma)',
      phReferrers: 'Ej.: facebook.com, twitter.com',
      referrersHelp: 'Si se completa, el bloqueo también considera el referrer HTTP de la solicitud.',
      saveBlock: 'Guardar bloqueo',
      blocksListTitle: 'Bloques registrados',
      thAttraction: 'Programa',
      thRegion: 'Región',
      thReason: 'Motivo',
      thActions: 'Acciones',
      emptyBlocks: 'Sin bloques registrados.',
      country: 'País',
      state: 'Estado',
      city: 'Ciudad',
      global: 'Global',
      delete: 'Eliminar',
      saveError: 'No se pudo guardar el bloqueo.',
      deleteConfirm: '¿Deseas eliminar este bloqueo?',
      deleteError: 'No se pudo eliminar el bloqueo.',
      loadError: 'Error al cargar bloques.'
    },
    ru: {
      title: 'Региональная блокировка',
      blocksTitle: 'Региональная блокировка программ',
      blocksSubtitle: 'Определите правила для блокировки трансляций по стране, штату и городу аудитории.',
      labelAttraction: 'Программа (фрагмент заголовка из EPG)',
      phAttraction: 'Напр.: Чемпионат',
      labelCountries: 'Страны (через запятую)',
      phCountries: 'Напр.: бразилия, аргентина',
      labelStates: 'Штаты (через запятую)',
      phStates: 'Напр.: калифорния, техас',
      labelCities: 'Города (через запятую)',
      phCities: 'Напр.: нью-йорк, майами',
      labelReason: 'Причина (опционально)',
      phReason: 'Напр.: ограничение на трансляцию',
      labelReferrers: 'Реферреры (домены, через запятую)',
      phReferrers: 'Напр.: facebook.com, twitter.com',
      referrersHelp: 'Если заполнено, блокировка также проверяет HTTP referrer запроса.',
      saveBlock: 'Сохранить блокировку',
      blocksListTitle: 'Зарегистрированные блокировки',
      thAttraction: 'Программа',
      thRegion: 'Регион',
      thReason: 'Причина',
      thActions: 'Действия',
      emptyBlocks: 'Нет зарегистрированных блокировок.',
      country: 'Страна',
      state: 'Штат',
      city: 'Город',
      global: 'Глобальный',
      delete: 'Удалить',
      saveError: 'Не удалось сохранить блокировку.',
      deleteConfirm: 'Вы хотите удалить эту блокировку?',
      deleteError: 'Не удалось удалить блокировку.',
      loadError: 'Ошибка загрузки блокировок.'
    },
    zh: {
      title: '地区阻止',
      blocksTitle: '区域节目阻止',
      blocksSubtitle: '根据观众所在国家、州和城市定义规则以阻止传播。',
      labelAttraction: '节目（EPG中的标题片段）',
      phAttraction: '例如：锦标赛',
      labelCountries: '国家（用逗号分隔）',
      phCountries: '例如：巴西、阿根廷',
      labelStates: '州（用逗号分隔）',
      phStates: '例如：加州、德州',
      labelCities: '城市（用逗号分隔）',
      phCities: '例如：纽约、迈阿密',
      labelReason: '原因（可选）',
      phReason: '例如：广播权限制',
      labelReferrers: '引荐来源（域名，用逗号分隔）',
      phReferrers: '例如：facebook.com, twitter.com',
      referrersHelp: '如果填写，阻止也会检查请求的HTTP引荐来源。',
      saveBlock: '保存阻止',
      blocksListTitle: '已注册的阻止',
      thAttraction: '节目',
      thRegion: '地区',
      thReason: '原因',
      thActions: '操作',
      emptyBlocks: '未注册任何阻止。',
      country: '国家',
      state: '州',
      city: '城市',
      global: '全球',
      delete: '删除',
      saveError: '无法保存阻止。',
      deleteConfirm: '您想删除此阻止吗？',
      deleteError: '无法删除阻止。',
      loadError: '加载阻止时出错。'
    },
    pl: {
      title: 'Blokada Regionalna',
      blocksTitle: 'Regionalna Blokada Programów',
      blocksSubtitle: 'Zdefiniuj reguły blokowania transmisji według kraju, stanu i miasta odbiorcy.',
      labelAttraction: 'Program (fragment tytułu z EPG)',
      phAttraction: 'Np.: Mistrzostwa',
      labelCountries: 'Kraje (oddzielone przecinkami)',
      phCountries: 'Np.: brazylia, argentyna',
      labelStates: 'Stany (oddzielone przecinkami)',
      phStates: 'Np.: kalifornia, teksas',
      labelCities: 'Miasta (oddzielone przecinkami)',
      phCities: 'Np.: nowy jork, miami',
      labelReason: 'Przyczyna (opcjonalnie)',
      phReason: 'Np.: ograniczenie praw transmisji',
      labelReferrers: 'Referrery (domeny, oddzielone przecinkami)',
      phReferrers: 'Np.: facebook.com, twitter.com',
      referrersHelp: 'Jeśli wypełniono, blokada sprawdza również HTTP referrer żądania.',
      saveBlock: 'Zapisz blokadę',
      blocksListTitle: 'Zarejestrowane blokady',
      thAttraction: 'Program',
      thRegion: 'Region',
      thReason: 'Przyczyna',
      thActions: 'Działania',
      emptyBlocks: 'Brak zarejestrowanych blokad.',
      country: 'Kraj',
      state: 'Stan',
      city: 'Miasto',
      global: 'Globalnie',
      delete: 'Usuń',
      saveError: 'Nie można zapisać blokady.',
      deleteConfirm: 'Czy chcesz usunąć tę blokadę?',
      deleteError: 'Nie można usunąć blokady.',
      loadError: 'Błąd ładowania blokad.'
    },
    it: {
      title: 'Blocco Regionale',
      blocksTitle: 'Blocco Regionale dei Programmi',
      blocksSubtitle: 'Definisci regole per bloccare le trasmissioni per paese, stato e città del pubblico.',
      labelAttraction: 'Programma (frammento di titolo dall\'EPG)',
      phAttraction: 'Es.: Campionato',
      labelCountries: 'Paesi (separati da virgola)',
      phCountries: 'Es.: brasile, argentina',
      labelStates: 'Stati (separati da virgola)',
      phStates: 'Es.: california, texas',
      labelCities: 'Città (separate da virgola)',
      phCities: 'Es.: new york, miami',
      labelReason: 'Motivo (facoltativo)',
      phReason: 'Es.: restrizione dei diritti di trasmissione',
      labelReferrers: 'Referrer (domini, separati da virgola)',
      phReferrers: 'Es.: facebook.com, twitter.com',
      referrersHelp: 'Se compilato, il blocco verifica anche il referrer HTTP della richiesta.',
      saveBlock: 'Salva blocco',
      blocksListTitle: 'Blocchi registrati',
      thAttraction: 'Programma',
      thRegion: 'Regione',
      thReason: 'Motivo',
      thActions: 'Azioni',
      emptyBlocks: 'Nessun blocco registrato.',
      country: 'Paese',
      state: 'Stato',
      city: 'Città',
      global: 'Globale',
      delete: 'Elimina',
      saveError: 'Impossibile salvare il blocco.',
      deleteConfirm: 'Vuoi eliminare questo blocco?',
      deleteError: 'Impossibile eliminare il blocco.',
      loadError: 'Errore durante il caricamento dei blocchi.'
    },
    de: {
      title: 'Regionale Sperrung',
      blocksTitle: 'Regionale Programmblockierung',
      blocksSubtitle: 'Definieren Sie Regeln zum Blockieren von Übertragungen nach Land, Bundesland und Stadt des Zuschauers.',
      labelAttraction: 'Programm (Titelausschnitt aus EPG)',
      phAttraction: 'Z.B.: Meisterschaft',
      labelCountries: 'Länder (durch Komma getrennt)',
      phCountries: 'Z.B.: brasilien, argentinien',
      labelStates: 'Bundesländer (durch Komma getrennt)',
      phStates: 'Z.B.: kalifornien, texas',
      labelCities: 'Städte (durch Komma getrennt)',
      phCities: 'Z.B.: new york, miami',
      labelReason: 'Grund (optional)',
      phReason: 'Z.B.: Rundfunkrechte-Einschränkung',
      labelReferrers: 'Referrer (Domains, durch Komma getrennt)',
      phReferrers: 'Z.B.: facebook.com, twitter.com',
      referrersHelp: 'Wenn ausgefüllt, prüft die Blockierung auch den HTTP-Referrer der Anfrage.',
      saveBlock: 'Blockierung speichern',
      blocksListTitle: 'Registrierte Blockierungen',
      thAttraction: 'Programm',
      thRegion: 'Region',
      thReason: 'Grund',
      thActions: 'Aktionen',
      emptyBlocks: 'Keine Blockierungen registriert.',
      country: 'Land',
      state: 'Bundesland',
      city: 'Stadt',
      global: 'Global',
      delete: 'Löschen',
      saveError: 'Blockierung konnte nicht gespeichert werden.',
      deleteConfirm: 'Möchten Sie diese Blockierung löschen?',
      deleteError: 'Blockierung konnte nicht gelöscht werden.',
      loadError: 'Fehler beim Laden von Blockierungen.'
    }
  };

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();
  const streamStateChannel = 'BroadcastChannel' in window ? new BroadcastChannel('webtv-stream-state') : null;

  function t(key) {
    return i18n[currentLang][key] || i18n.pt[key] || key;
  }

  function applyStaticTranslations() {
    const localeMap = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'pl': 'pl-PL',
      'it': 'it-IT',
      'de': 'de-DE'
    };
    document.documentElement.lang = localeMap[currentLang] || 'pt-BR';

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('blocks-title', t('blocksTitle'));
    setText('blocks-subtitle', t('blocksSubtitle'));
    setText('label-mode', t('labelMode'));
    setText('opt-blacklist', t('optBlacklist'));
    setText('opt-whitelist', t('optWhitelist'));
    setText('label-attraction', t('labelAttraction'));
    setText('label-countries', t('labelCountries'));
    setText('label-states', t('labelStates'));
    setText('label-cities', t('labelCities'));
    setText('label-reason', t('labelReason'));
    setText('label-alt-stream-url', t('labelAltStreamUrl'));
    setText('label-referrers', t('labelReferrers'));
    setText('referrers-help', t('referrersHelp'));
    setText('alt-stream-help', t('altStreamHelp'));
    setText('btn-save-block', t('saveBlock'));
    setText('blocks-list-title', t('blocksListTitle'));
    setText('th-mode', t('thMode'));
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
    form.alternativeStreamUrl.placeholder = t('phAltStreamUrl');
    if (form.referrers) form.referrers.placeholder = t('phReferrers');
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

  function normalizeAutocompleteText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function setDatalistOptions(listId, options) {
    const datalist = document.getElementById(listId);
    if (!datalist) return;
    datalist.innerHTML = options.map((value) => `<option value="${esc(value)}"></option>`).join('');
  }

  function setupCsvAutocomplete(input, listId, baseValues) {
    if (!input || !Array.isArray(baseValues)) return;

    const refresh = () => {
      const raw = String(input.value || '');
      const parts = raw.split(',');
      const fixedParts = parts.slice(0, -1).map((part) => part.trim()).filter(Boolean);
      const currentPart = String(parts[parts.length - 1] || '').trim();
      const currentNorm = normalizeAutocompleteText(currentPart);

      const options = baseValues
        .filter((value) => {
          const valueNorm = normalizeAutocompleteText(value);
          if (!valueNorm) return false;
          if (fixedParts.some((part) => normalizeAutocompleteText(part) === valueNorm)) return false;
          if (!currentNorm) return true;
          return valueNorm.includes(currentNorm);
        })
        .slice(0, 25)
        .map((value) => [...fixedParts, value].join(', '));

      setDatalistOptions(listId, options);
    };

    input.addEventListener('focus', refresh);
    input.addEventListener('input', refresh);
  }

  function setupPlainAutocomplete(input, listId, baseValues) {
    if (!input || !Array.isArray(baseValues)) return;

    const refresh = () => {
      const term = normalizeAutocompleteText(input.value);
      const options = baseValues
        .filter((value) => {
          const valueNorm = normalizeAutocompleteText(value);
          if (!valueNorm) return false;
          if (!term) return true;
          return valueNorm.includes(term);
        })
        .slice(0, 25);
      setDatalistOptions(listId, options);
    };

    input.addEventListener('focus', refresh);
    input.addEventListener('input', refresh);
  }

  async function setupAutocomplete() {
    try {
      const response = await fetch('/api/admin/block-autocomplete');
      if (!response.ok) return;
      const data = await response.json();

      setupPlainAutocomplete(
        document.getElementById('attraction'),
        'blocks-attraction-suggestions',
        Array.isArray(data.attractions) ? data.attractions : []
      );
      setupCsvAutocomplete(
        document.getElementById('countries'),
        'blocks-countries-suggestions',
        Array.isArray(data.countries) ? data.countries : []
      );
      setupCsvAutocomplete(
        document.getElementById('states'),
        'blocks-states-suggestions',
        Array.isArray(data.states) ? data.states : []
      );
      setupCsvAutocomplete(
        document.getElementById('cities'),
        'blocks-cities-suggestions',
        Array.isArray(data.cities) ? data.cities : []
      );
      setupCsvAutocomplete(
        document.getElementById('referrers'),
        'blocks-referrers-suggestions',
        Array.isArray(data.referrers) ? data.referrers : []
      );
    } catch (_) {
      // Sem autocomplete em caso de erro de rede/API.
    }
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

    body.innerHTML = blocks.map((block) => {
      const mode = block.mode === 'whitelist' ? 'whitelist' : 'blacklist';
      const modeLabel = mode === 'whitelist' ? t('whitelist') : t('blacklist');
      const referrersLine = Array.isArray(block.referrers) && block.referrers.length
        ? `<div class="muted">Referrers: ${esc(block.referrers.join(', '))}</div>`
        : '';
      const altStreamLine = block.alternativeStreamUrl
        ? `<div class="muted">${esc(t('altStreamLabel'))}: ${esc(block.alternativeStreamUrl)}</div>`
        : '';

      return `
        <tr>
          <td><span class="badge-mode badge-${esc(mode)}">${esc(modeLabel)}</span></td>
          <td>${esc(block.attraction)}</td>
          <td>${esc(prettyRegion(block))}${referrersLine}</td>
          <td>${esc(block.reason || '-')}${altStreamLine}</td>
          <td>
            <button class="btn-danger" data-id="${esc(block.id)}">${esc(t('delete'))}</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      mode: form.mode.value,
      attraction: form.attraction.value,
      countries: form.countries.value,
      states: form.states.value,
      cities: form.cities.value,
      referrers: form.referrers ? form.referrers.value : '',
      reason: form.reason.value,
      alternativeStreamUrl: form.alternativeStreamUrl.value,
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
  setupAutocomplete();
  loadBlocks().catch(err => {
    console.error('[BLOCKS] Falha ao carregar bloqueios:', err);
    window.alert(t('loadError'));
  });
})();
