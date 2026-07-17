const workRoster = document.getElementById('work-roster');
const workRosterSection = document.querySelector('.work-roster-section');
const workOpen = document.getElementById('work-open');
const workOpenLabel = document.getElementById('work-open-label');
const workLive = document.getElementById('work-live');
const previousButton = document.querySelector('.arena-control.prev');
const nextButton = document.querySelector('.arena-control.next');

const carouselWindowSize = 5;
const carouselInterval = 4400;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let workProjects = [];
let workTrack = null;
let selectedWorkIndex = 0;
let carouselStart = 0;
let carouselTimer = 0;
let carouselPaused = false;

const projectInitials = (title) => title
  .split(/\s+/)
  .map((word) => word[0])
  .join('')
  .slice(0, 3)
  .toUpperCase();

const createProjectMedia = (project, mediaClass) => {
  const media = document.createElement('span');
  media.className = mediaClass;
  media.style.setProperty('--project-accent', project.accent);

  const fallback = document.createElement('span');
  fallback.className = 'project-fallback';
  fallback.textContent = projectInitials(project.title);
  media.appendChild(fallback);

  if (project.image) {
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = '';
    image.loading = 'eager';
    image.addEventListener('error', () => image.remove());
    media.appendChild(image);
  }

  return media;
};

const updateCarouselPosition = () => {
  if (!workTrack) return;
  const firstTile = workTrack.querySelector('.project-tile');
  if (!firstTile) return;
  const styles = getComputedStyle(workTrack);
  const gap = Number.parseFloat(styles.columnGap) || 0;
  const offset = carouselStart * (firstTile.offsetWidth + gap);
  workTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
};

const keepProjectInView = (index) => {
  const maxStart = Math.max(0, workProjects.length - carouselWindowSize);
  if (index < carouselStart) carouselStart = index;
  if (index >= carouselStart + carouselWindowSize) carouselStart = index - carouselWindowSize + 1;
  carouselStart = Math.min(maxStart, Math.max(0, carouselStart));
  updateCarouselPosition();
};

const selectWorkProject = (index, options = {}) => {
  if (!workProjects.length) return;
  const {
    shouldFocus = false,
    moveWindow = false,
    announce = true
  } = options;

  selectedWorkIndex = (index + workProjects.length) % workProjects.length;
  const selectedProject = workProjects[selectedWorkIndex];
  const tiles = [...workRoster.querySelectorAll('.project-tile')];

  tiles.forEach((tile, tileIndex) => {
    const isSelected = tileIndex === selectedWorkIndex;
    tile.setAttribute('aria-selected', String(isSelected));
    tile.tabIndex = isSelected ? 0 : -1;
  });

  if (moveWindow) keepProjectInView(selectedWorkIndex);
  workOpen.href = selectedProject.url;
  workOpenLabel.textContent = 'Select';
  if (announce) workLive.textContent = `${selectedProject.title} selected. ${selectedProject.blurb}`;

  if (shouldFocus) tiles[selectedWorkIndex]?.focus({ preventScroll: true });
};

const stopCarousel = () => {
  window.clearInterval(carouselTimer);
  carouselTimer = 0;
};

const startCarousel = () => {
  stopCarousel();
  if (carouselPaused || reducedMotion.matches || workProjects.length <= carouselWindowSize) return;
  carouselTimer = window.setInterval(() => {
    selectWorkProject(selectedWorkIndex + 1, { moveWindow: true, announce: false });
  }, carouselInterval);
};

const pauseCarousel = () => {
  carouselPaused = true;
  stopCarousel();
};

const resumeCarousel = () => {
  carouselPaused = false;
  startCarousel();
};

const selectFromControl = (direction) => {
  selectWorkProject(selectedWorkIndex + direction, { shouldFocus: true, moveWindow: true });
  startCarousel();
};

const renderProjects = (projects) => {
  workProjects = projects
    .map((project, sourceIndex) => ({ ...project, sourceIndex }))
    .sort((a, b) => {
      const aOrder = a.workOrder ?? Number.POSITIVE_INFINITY;
      const bOrder = b.workOrder ?? Number.POSITIVE_INFINITY;
      return aOrder - bOrder || Number(b.featured) - Number(a.featured) || a.sourceIndex - b.sourceIndex;
    });

  workRoster.replaceChildren();
  workTrack = document.createElement('div');
  workTrack.className = 'work-roster-track';

  workProjects.forEach((project, index) => {
    const tile = document.createElement('button');
    tile.className = 'project-tile';
    tile.type = 'button';
    tile.role = 'option';
    tile.dataset.projectId = project.id;
    tile.setAttribute('aria-label', `${project.title}: ${project.workType || project.type}`);
    tile.setAttribute('aria-selected', String(index === 0));
    tile.style.setProperty('--selection-color', project.accent);
    tile.tabIndex = index === 0 ? 0 : -1;

    const media = createProjectMedia(project, 'project-tile-media');
    const number = document.createElement('span');
    number.className = 'project-number';
    number.textContent = String(index + 1).padStart(2, '0');
    media.appendChild(number);

    const copy = document.createElement('span');
    copy.className = 'project-tile-copy';
    const title = document.createElement('strong');
    title.textContent = project.title;
    const type = document.createElement('span');
    type.textContent = project.workType || project.type;
    copy.append(title, type);

    const inner = document.createElement('span');
    inner.className = 'project-tile-inner';
    inner.append(media, copy);
    const shell = document.createElement('span');
    shell.className = 'project-tile-shell';
    shell.appendChild(inner);
    tile.appendChild(shell);

    tile.addEventListener('click', () => selectWorkProject(index));
    tile.addEventListener('pointerenter', () => selectWorkProject(index, { announce: false }));
    tile.addEventListener('focus', () => selectWorkProject(index, { announce: false }));
    tile.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      selectFromControl(event.key === 'ArrowRight' ? 1 : -1);
    });
    workTrack.appendChild(tile);
  });

  workRoster.appendChild(workTrack);
  carouselStart = 0;
  selectWorkProject(0, { moveWindow: true });
  requestAnimationFrame(updateCarouselPosition);
  startCarousel();
};

const loadShowcase = async () => {
  const response = await fetch(`data/showcase.json?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Showcase data could not be loaded.');
  const projects = await response.json();
  if (!Array.isArray(projects)) throw new Error('Showcase data is invalid.');
  renderProjects(projects);
};

previousButton?.addEventListener('click', () => selectFromControl(-1));
nextButton?.addEventListener('click', () => selectFromControl(1));
workRosterSection?.addEventListener('pointerenter', pauseCarousel);
workRosterSection?.addEventListener('pointerleave', resumeCarousel);
workRosterSection?.addEventListener('focusin', pauseCarousel);
workRosterSection?.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    if (!workRosterSection.contains(document.activeElement)) resumeCarousel();
  });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCarousel();
  else startCarousel();
});
window.addEventListener('resize', () => requestAnimationFrame(updateCarouselPosition));
reducedMotion.addEventListener('change', startCarousel);
document.fonts?.ready.then(updateCarouselPosition);

if ('ResizeObserver' in window && workRoster) {
  new ResizeObserver(() => requestAnimationFrame(updateCarouselPosition)).observe(workRoster);
}

loadShowcase().catch(() => {
  workLive.textContent = 'Projects are temporarily unavailable. Use Play to browse the catalog.';
  previousButton?.setAttribute('hidden', '');
  nextButton?.setAttribute('hidden', '');
});
