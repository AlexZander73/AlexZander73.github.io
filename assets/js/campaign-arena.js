const campaignGrid = document.getElementById('campaign-grid');
const campaignLive = document.getElementById('campaign-live');
const selectedTitle = document.getElementById('campaign-selected-title');
const selectedType = document.getElementById('campaign-selected-type');
const selectedBlurb = document.getElementById('campaign-selected-blurb');
const selectedStageLabel = document.getElementById('campaign-stage-label');
const previewImage = document.getElementById('campaign-preview-image');
const previewFrame = document.getElementById('campaign-preview-frame');
const previewMode = document.getElementById('campaign-preview-mode');
const focusList = document.getElementById('campaign-focus-list');
const selectedStatus = document.getElementById('campaign-status');
const selectedPlatforms = document.getElementById('campaign-platforms');
const selectedRole = document.getElementById('campaign-role');
const selectedTech = document.getElementById('campaign-tech');
const enterStage = document.getElementById('campaign-enter');

let campaignStages = [];
let selectedStageId = '';

const makeTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

const createStageCard = (stage) => {
  const card = document.createElement('button');
  card.className = 'campaign-stage-card';
  card.type = 'button';
  card.role = 'option';
  card.dataset.stageId = stage.id;
  card.style.setProperty('--stage-accent', stage.accent);
  card.setAttribute('aria-label', `Stage ${stage.number}: ${stage.title}, ${stage.type}`);

  const image = document.createElement('img');
  image.src = stage.image;
  image.alt = '';
  image.loading = 'eager';
  image.addEventListener('error', () => card.classList.add('has-image-error'));

  const fallback = makeTextElement('span', 'campaign-card-fallback', stage.title.slice(0, 2).toUpperCase());
  const number = makeTextElement('span', 'campaign-card-number', stage.number);
  const flag = makeTextElement('span', 'campaign-card-flag', 'P1');
  const icon = makeTextElement('span', 'campaign-card-icon', stage.icon);

  const copy = document.createElement('span');
  copy.className = 'campaign-card-copy';
  copy.append(
    makeTextElement('strong', '', stage.title),
    makeTextElement('small', '', stage.type)
  );

  const tags = document.createElement('span');
  tags.className = 'campaign-card-tags';
  stage.tags.slice(0, 3).forEach((tag) => tags.appendChild(makeTextElement('i', '', tag)));

  const star = makeTextElement('span', 'campaign-card-star', '★');
  card.append(image, fallback, number, flag, icon, copy, tags, star);
  card.addEventListener('click', () => selectStage(stage.id));
  card.addEventListener('pointerenter', () => selectStage(stage.id));
  card.addEventListener('focus', () => selectStage(stage.id));
  card.addEventListener('dblclick', () => window.location.assign(stage.url));
  card.addEventListener('keydown', (event) => moveStageSelection(card, event));
  return card;
};

const setPreview = (stage) => {
  const isWebsite = stage.previewType === 'website';
  previewImage.hidden = false;
  previewFrame.hidden = !isWebsite;
  previewMode.textContent = isWebsite ? 'Live website preview' : 'Image preview';
  previewImage.src = isWebsite ? stage.image : stage.preview;
  previewImage.alt = `${stage.title} project preview`;

  if (isWebsite) {
    previewFrame.classList.remove('is-loaded');
    if (previewFrame.getAttribute('src') !== stage.preview) previewFrame.src = stage.preview;
    previewFrame.title = `${stage.title} website preview`;
  } else {
    previewFrame.removeAttribute('src');
  }
};

const renderFocusAreas = (stage) => {
  focusList.replaceChildren(...stage.focus.map((focus) => {
    const row = document.createElement('div');
    row.className = 'campaign-focus-row';
    row.style.setProperty('--stage-accent', stage.accent);
    const copy = document.createElement('span');
    copy.append(
      makeTextElement('strong', '', focus.title),
      makeTextElement('small', '', focus.detail)
    );
    row.append(makeTextElement('b', '', focus.icon), copy);
    return row;
  }));
};

const selectStage = (stageId, shouldFocus = false) => {
  const stage = campaignStages.find((item) => item.id === stageId) || campaignStages[0];
  if (!stage) return;
  selectedStageId = stage.id;

  const cards = [...campaignGrid.querySelectorAll('.campaign-stage-card')];
  cards.forEach((card) => {
    const isSelected = card.dataset.stageId === stage.id;
    card.setAttribute('aria-selected', String(isSelected));
    card.tabIndex = isSelected ? 0 : -1;
  });

  selectedStageLabel.textContent = `Stage ${stage.number}`;
  selectedTitle.textContent = stage.title;
  selectedType.textContent = stage.type;
  selectedBlurb.textContent = stage.blurb;
  selectedStatus.textContent = stage.status;
  selectedPlatforms.textContent = stage.platforms;
  selectedRole.textContent = stage.role;
  selectedTech.textContent = stage.tech;
  enterStage.href = stage.url;
  enterStage.style.setProperty('--stage-accent', stage.accent);
  document.querySelector('.campaign-preview')?.style.setProperty('--stage-accent', stage.accent);
  setPreview(stage);
  renderFocusAreas(stage);
  campaignLive.textContent = `Stage ${stage.number}, ${stage.title} selected. ${stage.blurb}`;
  history.replaceState(null, '', `#${stage.id}`);

  if (shouldFocus) cards.find((card) => card.dataset.stageId === stage.id)?.focus();
};

const stageColumns = () => {
  const columns = getComputedStyle(campaignGrid).gridTemplateColumns.split(' ').filter(Boolean).length;
  return Math.max(1, columns);
};

const moveStageSelection = (card, event) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = campaignStages.findIndex((stage) => stage.id === card.dataset.stageId);
  const columns = stageColumns();
  const offset = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns
  }[event.key];
  const nextIndex = Math.min(campaignStages.length - 1, Math.max(0, currentIndex + offset));
  selectStage(campaignStages[nextIndex].id, true);
};

const loadCampaign = async () => {
  try {
    const response = await fetch('data/campaign.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Campaign data could not be loaded.');
    campaignStages = await response.json();
    campaignGrid.replaceChildren(...campaignStages.map(createStageCard));
    const requestedStage = window.location.hash.slice(1);
    selectStage(campaignStages.some((stage) => stage.id === requestedStage) ? requestedStage : campaignStages[0]?.id);
  } catch (error) {
    campaignGrid.replaceChildren(makeTextElement('p', 'campaign-error', 'Campaign data is temporarily unavailable.'));
    campaignLive.textContent = error.message;
  }
};

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key.toLowerCase() === 'a' && selectedStageId) {
    event.preventDefault();
    enterStage.click();
  }
});

previewFrame.addEventListener('load', () => previewFrame.classList.add('is-loaded'));

loadCampaign();
