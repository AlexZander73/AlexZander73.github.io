(() => {
  const controls = document.querySelector('.tour-controls');
  if (!controls) return;
  const buttons = [...controls.querySelectorAll('button[data-view]')];
  const select = (button) => {
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      select(buttons[next]);
    });
  });
  controls.hidden = false;
})();
