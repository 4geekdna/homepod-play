(() => {
  const LS = 'homepod-ha-config';
  const SHORTCUT = 'Called erotic music';

  const els = {
    status: document.getElementById('status-line'),
    now: document.getElementById('now-playing'),
    url: document.getElementById('ha-url'),
    token: document.getElementById('ha-token'),
    entity: document.getElementById('ha-entity'),
    settings: document.getElementById('settings'),
    toast: document.getElementById('toast')
  };

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  function loadCfg() {
    try { return JSON.parse(localStorage.getItem(LS) || '{}'); }
    catch { return {}; }
  }

  function saveCfg() {
    const cfg = {
      url: els.url.value.trim().replace(/\/$/, ''),
      token: els.token.value.trim(),
      entity: els.entity.value.trim()
    };
    localStorage.setItem(LS, JSON.stringify(cfg));
    return cfg;
  }

  function cfg() {
    return {
      url: els.url.value.trim().replace(/\/$/, ''),
      token: els.token.value.trim(),
      entity: els.entity.value.trim()
    };
  }

  async function ha(path, options = {}) {
    const { url, token } = cfg();
    if (!url || !token) throw new Error('Save HA URL and token first');
    const res = await fetch(url + path, {
      ...options,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || ('HA error ' + res.status));
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return null;
  }

  async function callService(service) {
    const { entity } = cfg();
    if (!entity) throw new Error('Enter media_player entity id');
    await ha('/api/services/media_player/' + service, {
      method: 'POST',
      body: JSON.stringify({ entity_id: entity })
    });
  }

  async function refreshState() {
    const { entity } = cfg();
    if (!entity) return;
    const st = await ha('/api/states/' + encodeURIComponent(entity));
    const name = st.attributes?.media_title || st.attributes?.friendly_name || entity;
    const artist = st.attributes?.media_artist ? ' — ' + st.attributes.media_artist : '';
    els.now.textContent = (st.state || 'unknown') + ': ' + name + artist;
    els.status.textContent = 'Connected · ' + (st.state || 'unknown');
  }

  async function act(service, label) {
    try {
      await callService(service);
      toast(label);
      setTimeout(refreshState, 400);
    } catch (err) {
      toast(err.message);
      els.status.textContent = 'Request failed';
    }
  }

  document.getElementById('btn-play').addEventListener('click', () => act('media_play', 'Play'));
  document.getElementById('btn-pause').addEventListener('click', () => act('media_pause', 'Pause'));
  document.getElementById('btn-toggle').addEventListener('click', () => act('media_play_pause', 'Play / Pause'));
  document.getElementById('btn-stop').addEventListener('click', () => act('media_stop', 'Stop'));
  document.getElementById('btn-shortcut').addEventListener('click', () => {
    window.location.href = 'shortcuts://run-shortcut?name=' + encodeURIComponent(SHORTCUT);
  });
  document.getElementById('btn-save').addEventListener('click', async () => {
    saveCfg();
    try {
      await refreshState();
      els.settings.open = false;
      toast('Connected');
    } catch (err) {
      toast(err.message);
    }
  });

  const saved = loadCfg();
  if (saved.url) els.url.value = saved.url;
  if (saved.token) els.token.value = saved.token;
  if (saved.entity) els.entity.value = saved.entity;
  if (saved.url && saved.token && saved.entity) {
    els.settings.open = false;
    refreshState().catch(() => {});
  }
})();
