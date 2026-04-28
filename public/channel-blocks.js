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
    },
    es: {
      title: 'Bloqueo de Canal',
      pageTitle: 'Bloqueo de Canal',
      pageSubtitle: 'Bloquea el acceso al sitio, stream HLS y/o embed por región, independientemente del programa actual.',
      labelMode: 'Modo de bloqueo',
      optBlacklist: 'Lista negra (bloquear regiones listadas)',
      optWhitelist: 'Lista blanca (permitir solo regiones listadas)',
      hintBlacklist: 'Las regiones listadas serán bloqueadas. Deja todos los campos de región en blanco para bloquear todo acceso.',
      hintWhitelist: 'Solo las regiones listadas tendrán acceso. Todos los demás serán bloqueados.',
      labelTargets: 'Aplicar bloqueo a',
      labelTargetSite: 'Sitio (página de inicio)',
      labelTargetStream: 'Stream HLS',
      labelTargetEmbed: 'Embed independiente',
      labelCountries: 'Países (separados por coma)',
      phCountries: 'Ej.: brasil, argentina',
      labelStates: 'Estados (separados por coma)',
      phStates: 'Ej.: california, texas',
      labelCities: 'Ciudades (separadas por coma)',
      phCities: 'Ej.: nueva york, miami',
      labelReason: 'Motivo (mostrado al usuario bloqueado)',
      phReason: 'Ej.: restricción de acceso regional',
      saveBlock: 'Guardar bloqueo',
      listTitle: 'Bloques registrados',
      thMode: 'Modo',
      thTargets: 'Objetivos',
      thRegion: 'Región',
      thReason: 'Motivo',
      thActive: 'Activo',
      thActions: 'Acciones',
      emptyBlocks: 'Sin bloques registrados.',
      blacklist: 'Lista negra',
      whitelist: 'Lista blanca',
      allRegions: 'Global (todos)',
      country: 'País',
      state: 'Estado',
      city: 'Ciudad',
      targetSite: 'Sitio',
      targetStream: 'Stream HLS',
      targetEmbed: 'Embed',
      toggleActive: 'Activo',
      deleteConfirm: '¿Deseas eliminar este bloqueo?',
      deleteError: 'No se pudo eliminar el bloqueo.',
      saveError: 'No se pudo guardar el bloqueo.',
      targetRequired: 'Selecciona al menos un objetivo (sitio, stream o embed).',
      loadError: 'Error al cargar bloques.'
    },
    ru: {
      title: 'Блокировка канала',
      pageTitle: 'Блокировка канала',
      pageSubtitle: 'Заблокируйте доступ к сайту, потоку HLS и/или встраиванию по регионам, независимо от текущей программы.',
      labelMode: 'Режим блокировки',
      optBlacklist: 'Черный список (заблокировать указанные регионы)',
      optWhitelist: 'Белый список (разрешить только указанные регионы)',
      hintBlacklist: 'Указанные регионы будут заблокированы. Оставьте все поля региона пустыми, чтобы заблокировать весь доступ.',
      hintWhitelist: 'Только указанные регионы будут иметь доступ. Все остальные будут заблокированы.',
      labelTargets: 'Применить блокировку к',
      labelTargetSite: 'Сайт (главная страница)',
      labelTargetStream: 'Поток HLS',
      labelTargetEmbed: 'Независимое встраивание',
      labelCountries: 'Страны (через запятую)',
      phCountries: 'Напр.: бразилия, аргентина',
      labelStates: 'Штаты (через запятую)',
      phStates: 'Напр.: калифорния, техас',
      labelCities: 'Города (через запятую)',
      phCities: 'Напр.: нью-йорк, майами',
      labelReason: 'Причина (показано заблокированному пользователю)',
      phReason: 'Напр.: региональное ограничение доступа',
      saveBlock: 'Сохранить блокировку',
      listTitle: 'Зарегистрированные блокировки',
      thMode: 'Режим',
      thTargets: 'Цели',
      thRegion: 'Регион',
      thReason: 'Причина',
      thActive: 'Активно',
      thActions: 'Действия',
      emptyBlocks: 'Нет зарегистрированных блокировок.',
      blacklist: 'Черный список',
      whitelist: 'Белый список',
      allRegions: 'Глобальный (все)',
      country: 'Страна',
      state: 'Штат',
      city: 'Город',
      targetSite: 'Сайт',
      targetStream: 'Поток HLS',
      targetEmbed: 'Встраивание',
      toggleActive: 'Активно',
      deleteConfirm: 'Вы хотите удалить эту блокировку?',
      deleteError: 'Не удалось удалить блокировку.',
      saveError: 'Не удалось сохранить блокировку.',
      targetRequired: 'Выберите хотя бы одну цель (сайт, поток или встраивание).',
      loadError: 'Ошибка загрузки блокировок.'
    },
    zh: {
      title: '频道阻止',
      pageTitle: '频道阻止',
      pageSubtitle: '按地区阻止对网站、HLS流和/或嵌入的访问，与当前节目无关。',
      labelMode: '阻止模式',
      optBlacklist: '黑名单（阻止列出的地区）',
      optWhitelist: '白名单（仅允许列出的地区）',
      hintBlacklist: '列出的地区将被阻止。将所有地区字段留空以阻止所有访问。',
      hintWhitelist: '只有列出的地区才能访问。所有其他地区将被阻止。',
      labelTargets: '应用阻止到',
      labelTargetSite: '网站（主页）',
      labelTargetStream: 'HLS流',
      labelTargetEmbed: '独立嵌入',
      labelCountries: '国家（用逗号分隔）',
      phCountries: '例如：巴西、阿根廷',
      labelStates: '州（用逗号分隔）',
      phStates: '例如：加州、德州',
      labelCities: '城市（用逗号分隔）',
      phCities: '例如：纽约、迈阿密',
      labelReason: '原因（显示给被阻止的用户）',
      phReason: '例如：地区访问限制',
      saveBlock: '保存阻止',
      listTitle: '已注册的阻止',
      thMode: '模式',
      thTargets: '目标',
      thRegion: '地区',
      thReason: '原因',
      thActive: '活跃',
      thActions: '操作',
      emptyBlocks: '未注册任何阻止。',
      blacklist: '黑名单',
      whitelist: '白名单',
      allRegions: '全球（所有）',
      country: '国家',
      state: '州',
      city: '城市',
      targetSite: '网站',
      targetStream: 'HLS流',
      targetEmbed: '嵌入',
      toggleActive: '活跃',
      deleteConfirm: '您想删除此阻止吗？',
      deleteError: '无法删除阻止。',
      saveError: '无法保存阻止。',
      targetRequired: '至少选择一个目标（网站、流或嵌入）。',
      loadError: '加载阻止时出错。'
    },
    pl: {
      title: 'Blokada kanału',
      pageTitle: 'Blokada kanału',
      pageSubtitle: 'Blokuj dostęp do witryny, strumienia HLS i/lub osadzenia według regionu, niezależnie od bieżącego programu.',
      labelMode: 'Tryb blokady',
      optBlacklist: 'Czarna lista (blokuj wymienione regiony)',
      optWhitelist: 'Biała lista (zezwól tylko wymienione regiony)',
      hintBlacklist: 'Wymienione regiony będą zablokowane. Zostaw wszystkie pola regionu puste, aby zablokować dostęp do wszystkich.',
      hintWhitelist: 'Tylko wymienione regiony będą miały dostęp. Wszystkie inne będą zablokowane.',
      labelTargets: 'Zastosuj blokadę do',
      labelTargetSite: 'Witryna (strona główna)',
      labelTargetStream: 'Strumień HLS',
      labelTargetEmbed: 'Niezależne osadzenie',
      labelCountries: 'Kraje (oddzielone przecinkami)',
      phCountries: 'Np.: brazylia, argentyna',
      labelStates: 'Stany (oddzielone przecinkami)',
      phStates: 'Np.: kalifornia, teksas',
      labelCities: 'Miasta (oddzielone przecinkami)',
      phCities: 'Np.: nowy jork, miami',
      labelReason: 'Przyczyna (pokazana zablokowanemu użytkownikowi)',
      phReason: 'Np.: ograniczenie dostępu regionalnego',
      saveBlock: 'Zapisz blokadę',
      listTitle: 'Zarejestrowane blokady',
      thMode: 'Tryb',
      thTargets: 'Cele',
      thRegion: 'Region',
      thReason: 'Przyczyna',
      thActive: 'Aktywne',
      thActions: 'Działania',
      emptyBlocks: 'Brak zarejestrowanych blokad.',
      blacklist: 'Czarna lista',
      whitelist: 'Biała lista',
      allRegions: 'Globalnie (wszystkie)',
      country: 'Kraj',
      state: 'Stan',
      city: 'Miasto',
      targetSite: 'Witryna',
      targetStream: 'Strumień HLS',
      targetEmbed: 'Osadzenie',
      toggleActive: 'Aktywne',
      deleteConfirm: 'Czy chcesz usunąć tę blokadę?',
      deleteError: 'Nie można usunąć blokady.',
      saveError: 'Nie można zapisać blokady.',
      targetRequired: 'Wybierz co najmniej jeden cel (witrynę, strumień lub osadzenie).',
      loadError: 'Błąd ładowania blokad.'
    },
    it: {
      title: 'Blocco Canale',
      pageTitle: 'Blocco Canale',
      pageSubtitle: 'Blocca l\'accesso al sito, flusso HLS e/o incorporamento per regione, indipendentemente dal programma corrente.',
      labelMode: 'Modalità di blocco',
      optBlacklist: 'Lista nera (blocca regioni elencate)',
      optWhitelist: 'Lista bianca (consenti solo regioni elencate)',
      hintBlacklist: 'Le regioni elencate saranno bloccate. Lascia tutti i campi di regione vuoti per bloccare tutti gli accessi.',
      hintWhitelist: 'Solo le regioni elencate avranno accesso. Tutti gli altri saranno bloccati.',
      labelTargets: 'Applica blocco a',
      labelTargetSite: 'Sito (pagina iniziale)',
      labelTargetStream: 'Flusso HLS',
      labelTargetEmbed: 'Incorporamento indipendente',
      labelCountries: 'Paesi (separati da virgola)',
      phCountries: 'Es.: brasile, argentina',
      labelStates: 'Stati (separati da virgola)',
      phStates: 'Es.: california, texas',
      labelCities: 'Città (separate da virgola)',
      phCities: 'Es.: new york, miami',
      labelReason: 'Motivo (mostrato all\'utente bloccato)',
      phReason: 'Es.: restrizione di accesso regionale',
      saveBlock: 'Salva blocco',
      listTitle: 'Blocchi registrati',
      thMode: 'Modalità',
      thTargets: 'Obiettivi',
      thRegion: 'Regione',
      thReason: 'Motivo',
      thActive: 'Attivo',
      thActions: 'Azioni',
      emptyBlocks: 'Nessun blocco registrato.',
      blacklist: 'Lista nera',
      whitelist: 'Lista bianca',
      allRegions: 'Globale (tutti)',
      country: 'Paese',
      state: 'Stato',
      city: 'Città',
      targetSite: 'Sito',
      targetStream: 'Flusso HLS',
      targetEmbed: 'Incorporamento',
      toggleActive: 'Attivo',
      deleteConfirm: 'Vuoi eliminare questo blocco?',
      deleteError: 'Impossibile eliminare il blocco.',
      saveError: 'Impossibile salvare il blocco.',
      targetRequired: 'Seleziona almeno un obiettivo (sito, flusso o incorporamento).',
      loadError: 'Errore durante il caricamento dei blocchi.'
    },
    de: {
      title: 'Kanalblockierung',
      pageTitle: 'Kanalblockierung',
      pageSubtitle: 'Blockieren Sie den Zugriff auf Website, HLS-Stream und/oder Einbettung nach Region, unabhängig vom aktuellen Programm.',
      labelMode: 'Blockierungsmodus',
      optBlacklist: 'Schwarze Liste (aufgelistete Regionen blockieren)',
      optWhitelist: 'Weiße Liste (nur aufgelistete Regionen zulassen)',
      hintBlacklist: 'Aufgelistete Regionen werden blockiert. Lassen Sie alle Regions-Felder leer, um alle Zugriffe zu blockieren.',
      hintWhitelist: 'Nur aufgelistete Regionen haben Zugriff. Alle anderen werden blockiert.',
      labelTargets: 'Blockierung anwenden auf',
      labelTargetSite: 'Website (Startseite)',
      labelTargetStream: 'HLS-Stream',
      labelTargetEmbed: 'Unabhängige Einbettung',
      labelCountries: 'Länder (durch Komma getrennt)',
      phCountries: 'Z.B.: brasilien, argentinien',
      labelStates: 'Bundesländer (durch Komma getrennt)',
      phStates: 'Z.B.: kalifornien, texas',
      labelCities: 'Städte (durch Komma getrennt)',
      phCities: 'Z.B.: new york, miami',
      labelReason: 'Grund (angezeigt für blockierten Benutzer)',
      phReason: 'Z.B.: regionale Zugriffsbeschränkung',
      saveBlock: 'Blockierung speichern',
      listTitle: 'Registrierte Blockierungen',
      thMode: 'Modus',
      thTargets: 'Ziele',
      thRegion: 'Region',
      thReason: 'Grund',
      thActive: 'Aktiv',
      thActions: 'Aktionen',
      emptyBlocks: 'Keine Blockierungen registriert.',
      blacklist: 'Schwarze Liste',
      whitelist: 'Weiße Liste',
      allRegions: 'Global (alle)',
      country: 'Land',
      state: 'Bundesland',
      city: 'Stadt',
      targetSite: 'Website',
      targetStream: 'HLS-Stream',
      targetEmbed: 'Einbettung',
      toggleActive: 'Aktiv',
      deleteConfirm: 'Möchten Sie diese Blockierung löschen?',
      deleteError: 'Blockierung konnte nicht gelöscht werden.',
      saveError: 'Blockierung konnte nicht gespeichert werden.',
      targetRequired: 'Wählen Sie mindestens ein Ziel (Website, Stream oder Einbettung).',
      loadError: 'Fehler beim Laden von Blockierungen.'
    }
  };

  function getLang() {
    const stored = window.localStorage.getItem(LANG_KEY);
    const validLangs = ['pt', 'en', 'es', 'ru', 'zh', 'pl', 'it', 'de'];
    return validLangs.includes(stored) ? stored : 'pt';
  }

  let currentLang = getLang();

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
