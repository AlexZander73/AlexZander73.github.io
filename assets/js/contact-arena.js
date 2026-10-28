const contactScenes = new Map(
  [...document.querySelectorAll('[data-contact-scene]')].map((scene) => [scene.dataset.contactScene, scene])
);
const contactForm = document.getElementById('contact-form');
const formScene = contactScenes.get('contact');
const formStatus = document.getElementById('form-status');
const formContext = document.getElementById('form-context');
const contactKicker = document.getElementById('contact-kicker');
const contactIntro = document.getElementById('contact-intro');
const directLinks = document.getElementById('direct-links');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const intentContent = {
  project: {
    hash: 'contact-project',
    kicker: 'New project',
    title: 'Project enquiry',
    intro: 'Tell me what you are building, what is getting in the way, and what a useful outcome looks like.',
    subject: 'New portfolio project enquiry'
  },
  hire: {
    hash: 'contact-hire',
    kicker: 'Join the team',
    title: 'Availability enquiry',
    intro: 'Share the role, product problem, expected scope, and the kind of contribution you need.',
    subject: 'New portfolio availability enquiry'
  },
  message: {
    hash: 'contact-message',
    kicker: 'New conversation',
    title: 'General message',
    intro: 'Ask a question, share useful context, or say hello. Clear details make a thoughtful reply easier.',
    subject: 'New portfolio message'
  },
  links: {
    hash: 'contact-links',
    kicker: 'Direct routes',
    title: 'Direct links',
    intro: 'Use the fastest route for email, code, product support, or the complete product catalog.',
    subject: 'New direct portfolio message'
  }
};

let activeState = 'mission';
let activeIntent = 'project';
let transitionToken = 0;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const stateHash = (state, intent = activeIntent) => {
  if (state === 'mission') return '#mission';
  if (state === 'continue') return '#continue';
  if (state === 'contact') return `#${intentContent[intent]?.hash || intentContent.project.hash}`;
  return '#mission';
};

const routeFromHash = () => {
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  if (hash === 'continue') return { state: 'continue' };
  if (hash === 'unlocked') return { state: 'contact', intent: 'message' };

  const intent = Object.entries(intentContent).find(([, content]) => content.hash === hash)?.[0];
  if (intent) return { state: 'contact', intent };
  return { state: 'mission' };
};

const configureContact = (intent = 'project') => {
  const config = intentContent[intent] || intentContent.project;
  activeIntent = intent in intentContent ? intent : 'project';
  formScene?.classList.toggle('is-links-mode', activeIntent === 'links');
  if (contactKicker) contactKicker.textContent = config.kicker;
  if (contactIntro) contactIntro.textContent = config.intro;
  if (formContext) formContext.textContent = config.title;
};

const focusScene = (state) => {
  const scene = contactScenes.get(state);
  const heading = scene?.querySelector('h1[tabindex="-1"]');
  heading?.focus({ preventScroll: true });

  if (state === 'contact' && activeIntent === 'links') {
    directLinks?.querySelector('a')?.focus({ preventScroll: true });
  }
};

const resetSceneScroll = () => {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
};

const setSceneImmediately = (state, intent = activeIntent) => {
  if (state === 'contact') configureContact(intent);
  contactScenes.forEach((scene, sceneName) => {
    const isActive = sceneName === state;
    scene.hidden = !isActive;
    scene.classList.toggle('is-active', isActive);
    scene.classList.remove('is-leaving');
  });
  activeState = state;
};

const showScene = async (state, options = {}) => {
  const { intent = activeIntent, historyMode = 'push', focus = true } = options;
  const nextScene = contactScenes.get(state);
  const currentScene = contactScenes.get(activeState);
  if (!nextScene) return;

  if (state === 'contact') configureContact(intent);

  if (historyMode !== 'none') {
    const method = historyMode === 'replace' ? 'replaceState' : 'pushState';
    window.history[method]({ state, intent: state === 'contact' ? activeIntent : undefined }, '', stateHash(state, activeIntent));
  }

  if (state === activeState) {
    if (focus) focusScene(state);
    return;
  }

  const token = ++transitionToken;
  currentScene?.classList.add('is-leaving');
  await wait(reducedMotion.matches ? 0 : 230);
  if (token !== transitionToken) return;

  if (currentScene) {
    currentScene.hidden = true;
    currentScene.classList.remove('is-active', 'is-leaving');
  }

  nextScene.hidden = false;
  nextScene.getBoundingClientRect();
  window.requestAnimationFrame(() => nextScene.classList.add('is-active'));
  activeState = state;
  resetSceneScroll();

  if (focus) {
    await wait(reducedMotion.matches ? 0 : 90);
    focusScene(state);
  }
};

document.querySelectorAll('[data-next-state]').forEach((control) => {
  control.addEventListener('click', () => showScene(control.dataset.nextState));
});

document.querySelectorAll('[data-contact-intent]').forEach((control) => {
  control.addEventListener('click', () => showScene('contact', { intent: control.dataset.contactIntent }));
});

const questOptions = [...document.querySelectorAll('.quest-option')];
questOptions.forEach((option, index) => {
  option.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    questOptions[(index + direction + questOptions.length) % questOptions.length]?.focus();
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const config = intentContent[activeIntent];
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim().replace(/\r?\n/g, '\r\n');
  const body = [`Name: ${name}`, `Email: ${email}`, `Interest: ${config.title}`, '', message].join('\r\n');
  const draftUrl = `${contactForm.action}?subject=${encodeURIComponent(config.subject)}&body=${encodeURIComponent(body)}`;

  formStatus.textContent = 'Finish sending in your email app. If no draft opens, copy your message and email index-hearty6c@icloud.com. Your text stays here.';
  window.location.href = draftUrl;
});

window.addEventListener('popstate', () => {
  const route = routeFromHash();
  showScene(route.state, { intent: route.intent, historyMode: 'none', focus: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (activeState === 'contact') showScene('continue');
});

const contactLab = document.getElementById('contact-lab');
if (new URLSearchParams(window.location.search).has('contact-lab')) {
  contactLab.hidden = false;
  contactLab.querySelectorAll('[data-lab-state]').forEach((button) => {
    button.addEventListener('click', () => {
      const state = button.dataset.labState;
      showScene(state, { intent: state === 'contact' ? 'message' : activeIntent });
    });
  });
}

const initialRoute = routeFromHash();
setSceneImmediately(initialRoute.state, initialRoute.intent);
window.history.replaceState(
  { state: initialRoute.state, intent: initialRoute.intent },
  '',
  stateHash(initialRoute.state, initialRoute.intent)
);
window.requestAnimationFrame(resetSceneScroll);
