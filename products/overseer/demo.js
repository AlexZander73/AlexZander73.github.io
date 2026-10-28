(() => {
  const demo = document.querySelector('#rule-demo');
  if (!demo) return;
  const workloadButtons = [...demo.querySelectorAll('[data-workload]')];
  const activityButtons = [...demo.querySelectorAll('[data-state]')];
  const toggle = demo.querySelector('#cleanup-toggle');
  const range = demo.querySelector('#idle-time');
  const choices = {
    models: { title: 'LM Studio', label: 'Unload models after', action: 'Unload the idle model; keep the app open.', facts: 'Sample: model idle for 60 minutes; app unused for 60 minutes. The app has a separate 2-hour quit rule.' },
    app: { title: 'An open app', label: 'Quit when unused for', action: 'Request a graceful quit. Respect a refusal or save dialog.', facts: 'Sample: the app has been unused for 60 minutes, with no reported active work. Force-quit is off.' },
    simulator: { title: 'Apple simulator', label: 'Shut down when idle for', action: 'Shut down this idle simulator device.', facts: 'Sample: this simulator has been idle for 60 minutes. A separate maximum-open rule can also be configured in the app.' }
  };
  let workload = 'models', activity = 'idle';
  const duration = n => n % 60 === 0 ? `${n / 60} ${n === 60 ? 'hour' : 'hours'}` : n > 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n} minutes`;
  function render() {
    const choice = choices[workload], minutes = Number(range.value);
    demo.querySelector('#sample-title').textContent = choice.title;
    demo.querySelector('#timer-label').textContent = choice.label;
    demo.querySelector('#time-value').value = duration(minutes);
    range.setAttribute('aria-valuetext', duration(minutes));
    demo.querySelector('#sample-facts').textContent = choice.facts;
    workloadButtons.forEach(button => { const selected = button.dataset.workload === workload; button.setAttribute('aria-pressed', String(selected)); button.classList.toggle('selected', selected); });
    activityButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.state === activity)));
    const result = !toggle.checked ? 'Watch only. No cleanup action will be taken.' : activity === 'busy' ? 'Keep running. Active work is protected.' : activity === 'unknown' ? 'Keep running. Activity cannot be verified.' : minutes > 60 ? `Keep watching. The ${duration(minutes)} timeout has not been reached.` : choice.action;
    demo.querySelector('#rule-result').textContent = result;
  }
  workloadButtons.forEach(button => button.addEventListener('click', () => { workload = button.dataset.workload; render(); }));
  activityButtons.forEach(button => button.addEventListener('click', () => { activity = button.dataset.state; render(); }));
  toggle.addEventListener('change', render); range.addEventListener('input', render);
  demo.hidden = false; render();
})();
