const workRoster = document.getElementById('work-roster');
const workOpen = document.getElementById('work-open');
const workOpenLabel = document.getElementById('work-open-label');
const workLive = document.getElementById('work-live');
const previousButton = document.querySelector('.arena-control.prev');
const nextButton = document.querySelector('.arena-control.next');

let featuredProjects = [];
let selectedWorkIndex = 0;

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

const selectWorkProject = (index, shouldFocus = false) => {
  if (!featuredProjects.length) return;
  selectedWorkIndex = (index + featuredProjects.length) % featuredProjects.length;
  const selectedProject = featuredProjects[selectedWorkIndex];
  const tiles = [...workRoster.querySelectorAll('.project-tile')];

  tiles.forEach((tile, tileIndex) => {
    const isSelected = tileIndex === selectedWorkIndex;
    tile.setAttribute('aria-selected', String(isSelected));
    tile.tabIndex = isSelected ? 0 : -1;
  });

  workOpen.href = selectedProject.url;
  workOpenLabel.textContent = 'Select';
  workLive.textContent = `${selectedProject.title} selected. ${selectedProject.blurb}`;

  const activeTile = tiles[selectedWorkIndex];
  if (shouldFocus) {
    activeTile?.focus();
    activeTile?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
};

const renderFeaturedProjects = (projects) => {
  featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.workOrder ?? 99) - (b.workOrder ?? 99))
    .slice(0, 5);
  workRoster.replaceChildren();

  featuredProjects.forEach((project, index) => {
    const tile = document.createElement('button');
    tile.className = 'project-tile';
    tile.type = 'button';
    tile.role = 'option';
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

    tile.append(media, copy);
    tile.addEventListener('click', () => selectWorkProject(index));
    tile.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      selectWorkProject(index + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
    workRoster.appendChild(tile);
  });

  selectWorkProject(0);
};

const loadShowcase = async () => {
  const response = await fetch(`data/showcase.json?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Showcase data could not be loaded.');
  const projects = await response.json();
  if (!Array.isArray(projects)) throw new Error('Showcase data is invalid.');
  renderFeaturedProjects(projects);
};

previousButton?.addEventListener('click', () => selectWorkProject(selectedWorkIndex - 1, true));
nextButton?.addEventListener('click', () => selectWorkProject(selectedWorkIndex + 1, true));

loadShowcase().catch(() => {
  workLive.textContent = 'Featured projects are temporarily unavailable. Use Play to browse the catalog.';
  previousButton?.setAttribute('hidden', '');
  nextButton?.setAttribute('hidden', '');
});
