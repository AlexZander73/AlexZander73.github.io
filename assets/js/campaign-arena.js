const campaignGrid = document.getElementById('campaign-grid');
const campaignLive = document.getElementById('campaign-live');
const selectedTitle = document.getElementById('campaign-selected-title');
const selectedType = document.getElementById('campaign-selected-type');
const selectedBlurb = document.getElementById('campaign-selected-blurb');
const selectedStageLabel = document.getElementById('campaign-stage-label');
const previewImage = document.getElementById('campaign-preview-image');
const previewFrame = document.getElementById('campaign-preview-frame');
const previewMode = document.getElementById('campaign-preview-mode');
const toolIcons = document.getElementById('campaign-tool-icons');
const enterStage = document.getElementById('campaign-enter');
const previousStages = document.getElementById('campaign-prev');
const nextStages = document.getElementById('campaign-next');
const pageInfo = document.getElementById('campaign-page-info');
const compactCampaignQuery = window.matchMedia('(max-width: 1180px)');
const stagesPerPage = 8;

let campaignStages = [];
let selectedStageId = '';
let currentPage = 0;

const makeTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

const createStageCard = (stage) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'campaign-stage-card';
  card.classList.toggle('is-locked', ProjectCatalog.isLocked(stage));
    card.classList.toggle('has-preview', stage.previewAvailable === true);
  card.role = 'option';
  card.dataset.stageId = stage.id;
  card.style.setProperty('--stage-accent', stage.accent);
  card.setAttribute('aria-label', `Stage ${stage.number}: ${stage.title}. ${ProjectCatalog.statusLabel(stage)}`);

  // The inset surface follows the same slant as its outer frame, keeping all four edges visible.
  const surface = document.createElement('span');
  surface.className = 'campaign-card-surface';
  const image = document.createElement('img');
  image.src = stage.image;
  image.alt = '';
  image.loading = 'eager';
  image.addEventListener('error', () => card.classList.add('has-image-error'));
  const fallback = makeTextElement('span', 'campaign-card-fallback', stage.title.slice(0, 2).toUpperCase());
  surface.append(image, fallback);

  const number = makeTextElement('span', 'campaign-card-number', stage.number);
  const flag = makeTextElement('span', 'campaign-card-flag', 'P1');
  const copy = makeTextElement('span', 'campaign-card-copy', '');
  copy.append(makeTextElement('strong', '', stage.title), makeTextElement('small', '', stage.type));
  const status = ProjectCatalog.badge(stage);
  const emblem = makeTextElement('span', 'campaign-card-emblem', '');
  emblem.setAttribute('aria-hidden', 'true');
  if (ProjectCatalog.isLocked(stage)) emblem.append(ProjectCatalog.makeIcon('lock'));
  else emblem.textContent = stage.icon || '★';
  if (ProjectCatalog.isLocked(stage)) surface.append(status);
  card.append(surface, number, flag, copy);
  if (!ProjectCatalog.isLocked(stage)) card.append(emblem);
  card.addEventListener('click', () => selectStage(stage.id));
  card.addEventListener('pointerenter', () => selectStage(stage.id));
  card.addEventListener('focus', () => selectStage(stage.id));
  card.addEventListener('keydown', (event) => moveStageSelection(card, event));
  return card;
};

const renderPage = () => {
  const start = currentPage * stagesPerPage;
  campaignGrid.replaceChildren(...campaignStages.slice(start, start + stagesPerPage).map(createStageCard));
  while (campaignGrid.children.length < stagesPerPage) {
    campaignGrid.append(ProjectCatalog.emptySlot('campaign-stage-card'));
  }
  const end = Math.min(start + stagesPerPage, campaignStages.length);
  const pages = Math.ceil(campaignStages.length / stagesPerPage);
  pageInfo.textContent = `${currentPage === 0 ? 'Highlights' : 'More projects'} · ${String(start + 1).padStart(2, '0')}–${String(end).padStart(2, '0')} of ${campaignStages.length} · ${currentPage + 1} / ${pages}`;
  previousStages.disabled = currentPage === 0;
  nextStages.disabled = end === campaignStages.length;
};

const selectStage = (stageId, shouldFocus = false) => {
  const stageIndex = Math.max(0, campaignStages.findIndex((item) => item.id === stageId));
  const stage = campaignStages[stageIndex];
  if (!stage) return;
  const page = Math.floor(stageIndex / stagesPerPage);
  if (page !== currentPage || !campaignGrid.children.length) {
    currentPage = page;
    renderPage();
  }
  const changed = selectedStageId !== stage.id;
  selectedStageId = stage.id;
  const cards = [...campaignGrid.querySelectorAll('[data-stage-id]')];
  cards.forEach((card) => {
    const isSelected = card.dataset.stageId === stage.id;
    card.setAttribute('aria-selected', String(isSelected));
    card.tabIndex = isSelected ? 0 : -1;
  });

  if (changed) {
    const locked = ProjectCatalog.isLocked(stage);
    selectedStageLabel.textContent = locked ? `Stage ${stage.number} · ${ProjectCatalog.statusLabel(stage)}` : `Stage ${stage.number}`;
    selectedTitle.textContent = stage.title;
    selectedType.textContent = stage.type;
    selectedBlurb.textContent = locked ? `Work in progress. ${stage.blurb}` : stage.blurb;
    ProjectCatalog.setEntry(enterStage, stage);
    enterStage.querySelector('strong').textContent = ProjectCatalog.entryLabel(stage);
    enterStage.style.setProperty('--stage-accent', stage.accent);
    document.querySelector('.campaign-preview').style.setProperty('--stage-accent', stage.accent);
    // Keep the complete screenshot visible instead of cropping it to the preview's shape.
    previewImage.src = stage.image;
    previewImage.alt = `${stage.title} project preview`;
    previewImage.hidden = false;
    previewFrame.hidden = true;
    previewFrame.removeAttribute('src');
    previewMode.textContent = locked ? 'Work in progress' : 'Project preview';
    toolIcons.replaceChildren(...ProjectCatalog.toolIcons(stage));
    campaignLive.textContent = `Stage ${stage.number}, ${stage.title}. ${ProjectCatalog.statusLabel(stage)}. ${stage.blurb}`;
    history.replaceState(null, '', `#${stage.id}`);
  }
  if (shouldFocus) cards.find((card) => card.dataset.stageId === stage.id)?.focus({ preventScroll: true });
};

const moveStageSelection = (card, event) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = campaignStages.findIndex((stage) => stage.id === card.dataset.stageId);
  // Six large cards and two wide cards form rows of 3, 3, and 2.
  const slot = currentIndex % stagesPerPage;
  const rowOffsets = {
    ArrowUp: [-2, -2, -1, -3, -3, -3, -3, -2],
    ArrowDown: [3, 3, 3, 3, 3, 2, 2, 3]
  };
  const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : rowOffsets[event.key]?.[slot];
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? campaignStages.length - 1
    : Math.min(campaignStages.length - 1, Math.max(0, currentIndex + offset));
  selectStage(campaignStages[nextIndex].id, true);
};

const turnPage = (direction) => {
  const page = currentPage + direction;
  const stage = campaignStages[page * stagesPerPage];
  if (stage) selectStage(stage.id, true);
};
previousStages.addEventListener('click', () => turnPage(-1));
nextStages.addEventListener('click', () => turnPage(1));

const loadCampaign = async () => {
  try {
    campaignStages = (await ProjectCatalog.load()).map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }));
    const total = campaignStages.length;
    const unlocked = ProjectCatalog.unlockedCount(campaignStages);
    const percent = Math.round(unlocked / total * 100);
    document.getElementById('campaign-unlocked').textContent = unlocked;
    document.getElementById('campaign-total').textContent = total;
    document.getElementById('campaign-meter-fill').style.width = `${percent}%`;
    document.getElementById('campaign-completion').textContent = `${percent}%`;
    document.querySelector('.campaign-progress-card').setAttribute('aria-label', `${unlocked} of ${total} stages unlocked`);
    selectStage(window.location.hash.slice(1) || campaignStages[0].id);
  } catch (error) {
    campaignGrid.replaceChildren(makeTextElement('p', 'campaign-error', 'Campaign data is temporarily unavailable. Please try again.'));
    campaignLive.textContent = error.message;
    previousStages.disabled = true;
    nextStages.disabled = true;
  }
};

enterStage.addEventListener('click', (event) => {
  if (enterStage.getAttribute('aria-disabled') === 'true') event.preventDefault();
});
document.addEventListener('keydown', (event) => {
  if (compactCampaignQuery.matches || event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
  if (event.key.toLowerCase() === 'a' && selectedStageId && enterStage.hasAttribute('href')) {
    event.preventDefault();
    enterStage.click();
  }
});
window.addEventListener('hashchange', () => selectStage(window.location.hash.slice(1)));
loadCampaign();
