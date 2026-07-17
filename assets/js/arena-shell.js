const arenaTabs = [...document.querySelectorAll('.arena-tab')];
const arenaFitTarget = document.querySelector('main.work-stage, main.play-main, main.about-stage, main.contact-main');
const desktopArenaQuery = window.matchMedia('(min-width: 1181px)');

let arenaFitFrame = 0;

const clearArenaFit = () => {
  document.documentElement.classList.remove('arena-fitted-desktop');
  document.body.classList.remove('arena-fitted-desktop');
  arenaFitTarget?.classList.remove('arena-fit-target');
  arenaFitTarget?.style.removeProperty('width');
  arenaFitTarget?.style.removeProperty('transform');
  arenaFitTarget?.style.removeProperty('--arena-fit-scale');
};

const fitArenaToViewport = () => {
  if (!arenaFitTarget || !desktopArenaQuery.matches) {
    clearArenaFit();
    return;
  }

  document.documentElement.classList.add('arena-fitted-desktop');
  document.body.classList.add('arena-fitted-desktop');
  arenaFitTarget.classList.add('arena-fit-target');
  arenaFitTarget.style.removeProperty('transform');

  const viewportWidth = document.documentElement.clientWidth;
  const headerHeight = document.querySelector('.arena-header')?.getBoundingClientRect().height || 0;
  const availableHeight = Math.max(1, window.innerHeight - headerHeight);

  let scale = 1;
  let designHeight = 1;

  arenaFitTarget.style.width = `${viewportWidth}px`;

  for (let pass = 0; pass < 3; pass += 1) {
    designHeight = Math.max(1, arenaFitTarget.scrollHeight);
    scale = Math.min(1, availableHeight / designHeight);
    arenaFitTarget.style.width = `${viewportWidth / scale}px`;
  }

  designHeight = Math.max(1, arenaFitTarget.scrollHeight);
  scale = Math.min(1, availableHeight / designHeight);
  arenaFitTarget.style.width = `${viewportWidth / scale}px`;
  arenaFitTarget.style.setProperty('--arena-fit-scale', String(scale));
  arenaFitTarget.style.transform = `scale(${scale})`;
};

const scheduleArenaFit = () => {
  window.cancelAnimationFrame(arenaFitFrame);
  arenaFitFrame = window.requestAnimationFrame(fitArenaToViewport);
};

arenaTabs.forEach((tab, index) => {
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const target = arenaTabs[(index + direction + arenaTabs.length) % arenaTabs.length];
    target?.focus();
  });
});

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.closest('.project-tile-media, .play-card-media')?.classList.add('has-image-error');
    image.hidden = true;
  });
});

window.addEventListener('load', scheduleArenaFit);
window.addEventListener('resize', scheduleArenaFit);
desktopArenaQuery.addEventListener('change', scheduleArenaFit);
document.fonts?.ready.then(scheduleArenaFit);

if (arenaFitTarget) {
  new MutationObserver(scheduleArenaFit).observe(arenaFitTarget, { childList: true, subtree: true });
}

document.documentElement.classList.add('arena-ready');
scheduleArenaFit();
