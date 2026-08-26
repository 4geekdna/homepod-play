(() => {
  const DEFAULT_NAME = 'Called erotic music';
  const input = document.getElementById('shortcut-name');
  const btn = document.getElementById('btn-play');

  function runShortcut() {
    const name = (input.value || DEFAULT_NAME).trim();
    if (!name) return;
    const url = 'shortcuts://run-shortcut?name=' + encodeURIComponent(name);
    window.location.href = url;
  }

  btn.addEventListener('click', runShortcut);
})();
