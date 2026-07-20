const arenaTabs = [...document.querySelectorAll('.arena-tab')];
const arenaFitTarget = document.querySelector('main.work-stage, main.campaign-main, main.play-main, main.about-stage, main.contact-main');
const desktopArenaQuery = window.matchMedia('(min-width: 1181px)');
const exploreBanner = document.querySelector('[data-explore-banner]');
const exploreBannerLinks = [...(exploreBanner?.querySelectorAll('[data-explore-link]') || [])];
const exploreBannerPrimaryLink = exploreBanner?.querySelector('.explore-banner-enter') || exploreBannerLinks[0];
const exploreBannerTitle = exploreBanner?.querySelector('[data-explore-title]');
const exploreBannerClose = exploreBanner?.querySelector('[data-explore-close]');

let arenaFitFrame = 0;
let exploreBannerTimer = 0;
let exploreBannerPreviousFocus = null;

const hideExploreBanner = ({ restoreFocus = true } = {}) => {
  if (!exploreBanner || exploreBanner.hidden) return;
  window.clearTimeout(exploreBannerTimer);
  exploreBanner.classList.remove('is-visible');
  exploreBannerTimer = window.setTimeout(() => {
    exploreBanner.hidden = true;
    if (restoreFocus) exploreBannerPreviousFocus?.focus({ preventScroll: true });
  }, 190);
};

window.showArenaExploreBanner = ({ title, url }) => {
  if (!url) return;
  if (!desktopArenaQuery.matches || !exploreBanner || !exploreBannerLinks.length || !exploreBannerTitle) {
    window.location.assign(url);
    return;
  }

  window.clearTimeout(exploreBannerTimer);
  exploreBannerPreviousFocus = document.activeElement;
  exploreBannerTitle.textContent = title;
  exploreBannerLinks.forEach((link) => { link.href = url; });
  exploreBanner.hidden = false;
  window.requestAnimationFrame(() => {
    exploreBanner.classList.add('is-visible');
    exploreBannerPrimaryLink?.focus({ preventScroll: true });
  });
};

exploreBannerClose?.addEventListener('click', () => hideExploreBanner());
exploreBanner?.addEventListener('click', (event) => {
  if (event.target === exploreBanner) hideExploreBanner();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && exploreBanner?.classList.contains('is-visible')) {
    event.preventDefault();
    hideExploreBanner();
  }
});

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
