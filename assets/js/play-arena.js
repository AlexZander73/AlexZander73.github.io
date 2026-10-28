const playGrid = document.getElementById('play-grid');
const playCount = document.getElementById('play-count');
const playLive = document.getElementById('play-live');
const emptyRoster = document.getElementById('empty-roster');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const selectedTitle = document.getElementById('selected-title');
const selectedType = document.getElementById('selected-type');
const selectedBlurb = document.getElementById('selected-blurb');
const selectedTags = document.getElementById('selected-tags');
const selectedOpen = document.getElementById('selected-open');
const selectedSymbol = document.getElementById('selected-symbol');
const compactPlayQuery = window.matchMedia('(max-width: 1180px)');

let allProjects = [];
let visibleProjects = [];
let selectedProjectId = '';
let activeFilter = 'featured';

const initials = (title) => title
  .split(/\s+/)
  .map((word) => word[0])
  .join('')
  .slice(0, 3)
  .toUpperCase();

const statusSymbol = {
  shipped: '◆',
  development: '⚒',
  experiment: '♙',
  infrastructure: '</>'
};

const createCardMedia = (project) => {
  const media = document.createElement('span');
  media.className = 'play-card-media';
  media.style.setProperty('--project-accent', project.accent);

  const fallback = document.createElement('span');
  fallback.className = 'project-fallback';
  fallback.textContent = initials(project.title);
  media.appendChild(fallback);

  if (project.image) {
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove());
    media.appendChild(image);
  }

  return media;
};

const setSelectedProject = (projectId, shouldFocus = false) => {
  const project = visibleProjects.find((item) => item.id === projectId) || visibleProjects[0];
  document.querySelector('.selection-dock').hidden = !project;
  if (!project) { selectedProjectId = ''; selectedOpen.removeAttribute('href'); return; }
  selectedProjectId = project.id;

  const cards = [...playGrid.querySelectorAll('[data-project-id]')];
  cards.forEach((card) => {
    const isSelected = card.dataset.projectId === project.id;
    card.setAttribute('aria-selected', String(!compactPlayQuery.matches && isSelected));
    card.tabIndex = compactPlayQuery.matches || isSelected ? 0 : -1;
  });

  selectedTitle.textContent = project.title;
  selectedType.textContent = ProjectCatalog.isLocked(project) ? `${project.type} · Work in progress` : project.type;
  selectedBlurb.textContent = project.blurb;
  document.querySelector('.selection-action > strong').textContent = ProjectCatalog.isLocked(project) ? 'Stage in progress' : 'Ready to explore?';
  ProjectCatalog.setEntry(selectedOpen, project);
  selectedOpen.textContent = ProjectCatalog.entryLabel(project);
  selectedSymbol.textContent = project.featured ? '★' : (statusSymbol[project.status] || '◆');
  selectedSymbol.style.color = project.accent;
  selectedTags.replaceChildren(...project.tags.map((tag) => {
    const chip = document.createElement('span');
    chip.className = 'project-tag';
    chip.textContent = tag;
    return chip;
  }));
  playLive.textContent = `${project.title} selected. ${ProjectCatalog.statusLabel(project)}. ${project.blurb}`;

  const activeCard = cards.find((card) => card.dataset.projectId === project.id);
  if (shouldFocus) activeCard?.focus();
};

const gridColumnCount = () => {
  const template = getComputedStyle(playGrid).gridTemplateColumns;
  return Math.max(1, template.split(' ').filter(Boolean).length);
};

const updateEmptySlots = () => {
  playGrid.querySelectorAll('.project-empty-slot').forEach((slot) => slot.remove());
  if (!visibleProjects.length) return;
  const columns = gridColumnCount();
  const missing = (columns - visibleProjects.length % columns) % columns;
  for (let slot = 0; slot < missing; slot += 1) {
    playGrid.append(ProjectCatalog.emptySlot('play-card'));
  }
};

const moveSelection = (currentIndex, key) => {
  const columns = gridColumnCount();
  const offsets = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns
  };
  const offset = offsets[key];
  if (!offset) return;
  const nextIndex = Math.min(visibleProjects.length - 1, Math.max(0, currentIndex + offset));
  setSelectedProject(visibleProjects[nextIndex].id, true);
};

const renderRoster = () => {
  playGrid.replaceChildren();
  emptyRoster.classList.toggle('is-visible', visibleProjects.length === 0);
  const unlocked = visibleProjects.filter((project) => !ProjectCatalog.isLocked(project)).length;
  playCount.textContent = `${visibleProjects.length} projects · ${unlocked} unlocked · ${visibleProjects.length - unlocked} WiP`;

  visibleProjects.forEach((project, index) => {
    const card = document.createElement('a');
    card.className = 'play-card';
    if (ProjectCatalog.canEnter(project)) card.href = project.url;
    card.classList.toggle('is-locked', ProjectCatalog.isLocked(project));
    card.classList.toggle('has-preview', project.previewAvailable === true);
    card.role = 'option';
    card.dataset.projectId = project.id;
    card.setAttribute('aria-label', `${project.title}: ${project.type}. ${ProjectCatalog.statusLabel(project)}`);
    card.style.setProperty('--selection-color', project.accent);

    const media = createCardMedia(project);
    const number = document.createElement('span');
    number.className = 'project-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const selectedFlag = document.createElement('span');
    selectedFlag.className = 'selected-flag';
    selectedFlag.textContent = 'P1';
    media.append(number, selectedFlag, ProjectCatalog.badge(project));

    const copy = document.createElement('span');
    copy.className = 'play-card-copy';
    const title = document.createElement('strong');
    title.textContent = project.title;
    const type = document.createElement('span');
    type.textContent = project.type;
    copy.append(title, type);

    const inner = document.createElement('span');
    inner.className = 'play-card-inner';
    inner.append(media, copy);
    const shell = document.createElement('span');
    shell.className = 'play-card-shell';
    shell.appendChild(inner);
    card.appendChild(shell);
    card.addEventListener('click', (event) => {
      if (compactPlayQuery.matches && ProjectCatalog.canEnter(project)) return;
      event.preventDefault();
      setSelectedProject(project.id);
      if (ProjectCatalog.canEnter(project)) window.showArenaExploreBanner?.({ title: project.title, url: project.url });
    });
    card.addEventListener('pointerenter', () => {
      if (!compactPlayQuery.matches) setSelectedProject(project.id);
    });
    card.addEventListener('focus', () => {
      if (!compactPlayQuery.matches) setSelectedProject(project.id);
    });
    card.addEventListener('keydown', (event) => {
      if (compactPlayQuery.matches) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      moveSelection(index, event.key);
    });
    playGrid.appendChild(card);
  });

  updateEmptySlots();
  const retained = visibleProjects.some((project) => project.id === selectedProjectId);
  setSelectedProject(retained ? selectedProjectId : visibleProjects[0]?.id);
};

const applyFilter = (filter) => {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  });

  if (filter === 'featured') {
    visibleProjects = [...allProjects].sort((a, b) => Number(b.featured) - Number(a.featured));
  } else if (filter === 'all') {
    visibleProjects = [...allProjects];
  } else {
    visibleProjects = allProjects.filter((project) => ['experiment', 'infrastructure'].includes(filter) ? project.category === filter : project.status === filter);
  }

  renderRoster();
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

compactPlayQuery.addEventListener('change', () => setSelectedProject(selectedProjectId));
window.addEventListener('resize', updateEmptySlots);

const loadShowcase = async () => {
  const projects = await ProjectCatalog.load();
  allProjects = projects;
  applyFilter(activeFilter);
};

loadShowcase().catch(() => {
  playCount.textContent = 'Roster unavailable';
  emptyRoster.textContent = 'The project roster could not be loaded. Product pages are still available from the main Products index.';
  emptyRoster.classList.add('is-visible');
});
