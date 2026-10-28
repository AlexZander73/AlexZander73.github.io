/* One catalog powers Home, Play, Campaign, About, Products and Support. */
(() => {
  const siteRoot = new URL('../../', document.currentScript.src);
  const resolveUrl = (value) => value ? new URL(value.replace(/^\/(?!\/)/, ''), siteRoot).href : '';
  let catalogPromise;
  const isLocked = (project) => project.status !== 'shipped';
  const canEnter = (project) => Boolean(project.url) && (!isLocked(project) || project.previewAvailable === true);
  const entryLabel = (project) => isLocked(project) ? (canEnter(project) ? 'View product preview' : 'Locked Stage · WiP') : 'Enter project';
  const unlockedCount = (projects) => projects.filter((project) => !isLocked(project)).length;
  const emptySlot = (className) => {
    const slot = document.createElement('div');
    slot.className = `${className} project-empty-slot`;
    slot.setAttribute('aria-hidden', 'true');
    return slot;
  };
  const statusLabel = (project) => isLocked(project) ? (canEnter(project) ? 'In development · Preview available' : 'Locked Stage · WiP') : 'Unlocked';
  const lockIcon = '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>';
  const iconShapes = {
    iPhone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
    iPad: '<rect x="3" y="2" width="18" height="20" rx="2"/><path d="M11 19h2"/>',
    Web: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
    macOS: '<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M8 21h8M12 17v4"/>',
    'Apple Watch': '<rect x="6" y="6" width="12" height="12" rx="3"/><path d="m8 6 1-5h6l1 5M8 18l1 5h6l1-5M12 9v3l2 1"/>',
    React: '<circle cx="12" cy="12" r="1"/><ellipse cx="12" cy="12" rx="11" ry="4"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)"/>',
    Capacitor: '<path d="m5 3 16 16-2 2L3 5zm14 0 2 2L5 21l-2-2z"/>',
    HTML: '<path d="m4 2 2 18 6 2 6-2 2-18zM16 6H8l.5 5h7l-.5 5-3 1-3-1"/>',
    CSS: '<path d="m4 2 2 18 6 2 6-2 2-18zM8 6h8l-.5 5H9m6.5 0-.5 5-3 1-3-1"/>',
    SwiftUI: '<path d="M3 5c5 5 8 7 12 8L6 2l13 10c2-3 0-6-1-8 5 5 5 10 2 13l2 4-5-2C10 23 4 18 2 14c4 3 7 3 10 2z"/>',
    SwiftData: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    Android: '<path d="M5 11a7 7 0 0 1 14 0v7H5zM8 5 6 2m10 3 2-3M8 18v4m8-4v4M2 11v6m20-6v6"/><path d="M9 8h.01M15 8h.01"/>',
    WidgetKit: '<rect x="2" y="2" width="9" height="9" rx="2"/><rect x="15" y="2" width="7" height="9" rx="2"/><rect x="2" y="15" width="20" height="7" rx="2"/>',
    'Next.js': '<circle cx="12" cy="12" r="10"/><path d="M7 17V7l10 13M16 7v7"/>',
    Expo: '<path d="m3 18 7-13q2-3 4 0l7 13-4 2-5-10-5 10z"/>',
    Prisma: '<path d="m9 2 13 17-18 3-3-6zM9 2l-5 20"/>',
    Vite: '<path d="m2 4 10 18L22 4l-7 1-1-4-7 2-1 8 5-2-1 7"/>',
    PixiJS: '<path d="M4 22V2h9a7 7 0 0 1 0 14H9v6zM9 7v4h4a2 2 0 0 0 0-4z"/>',
    'GitHub Pages': '<circle cx="7" cy="5" r="3"/><circle cx="7" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M7 8v8m0-4c8 0 11-1 11-4"/>',
    'GitHub Wiki': '<path d="M12 5C8 2 4 2 1 4v16c4-2 8-1 11 1 3-2 7-3 11-1V4c-3-2-7-2-11 1zm0 0v16"/>',
  };
  const makeIcon = (name) => {
    if (name === 'iOS') name = 'iPhone';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('stroke-linecap', 'round');
    // Shapes are local constants; catalog text is never inserted as markup.
    if (name === 'lock' || iconShapes[name]) svg.innerHTML = name === 'lock' ? lockIcon : iconShapes[name];
    else {
      const text = document.createElementNS(svg.namespaceURI, 'text');
      text.setAttribute('x', '12');
      text.setAttribute('y', '16');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('stroke', 'none');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', '800');
      text.textContent = ({ JavaScript: 'JS', TypeScript: 'TS', Python: 'Py', MLX: 'MLX' })[name] || name.slice(0, 2);
      svg.append(text);
    }
    return svg;
  };
  const badge = (project) => {
    const element = document.createElement('span');
    element.className = `project-status ${isLocked(project) ? 'is-locked' : 'is-unlocked'}`;
    if (!isLocked(project)) {
      element.hidden = true;
      return element;
    }
    if (project.previewAvailable === true) {
      element.classList.add('project-preview-badge');
      element.textContent = 'Preview · WiP';
      return element;
    }
    element.classList.add('project-lock-tape');
    element.setAttribute('aria-label', 'Locked stage, work in progress');
    const track = document.createElement('span');
    track.className = 'lock-tape-track';
    track.setAttribute('aria-hidden', 'true');
    // Equal repeated strips make the marquee loop without a jump.
    for (let copy = 0; copy < 2; copy += 1) {
      const strip = document.createElement('span');
      strip.className = 'lock-tape-strip';
      for (let item = 0; item < 4; item += 1) {
        const word = document.createElement('span');
        word.textContent = 'LOCKED · WIP';
        strip.append(word);
      }
      track.append(strip);
    }
    element.append(track);
    return element;
  };
  const setEntry = (link, project) => {
    if (!canEnter(project)) {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    } else {
      link.href = project.url;
      link.removeAttribute('aria-disabled');
    }
    link.setAttribute('aria-label', `${entryLabel(project)}: ${project.title}`);
  };
  const toolIcons = (project) => [...new Set([...(project.platforms || []), ...(project.tech || [])])].map((name) => {
    const button = document.createElement('button');
    button.className = 'project-tool';
    button.type = 'button';
    button.setAttribute('aria-label', name);
    button.setAttribute('aria-expanded', 'false');
    const tooltip = document.createElement('span');
    tooltip.className = 'project-tool-tooltip';
    tooltip.textContent = name;
    button.append(makeIcon(name), tooltip);
    button.addEventListener('click', () => {
      button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
    });
    button.addEventListener('blur', () => button.setAttribute('aria-expanded', 'false'));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { button.setAttribute('aria-expanded', 'false'); button.blur(); }
    });
    return button;
  });
  window.ProjectCatalog = {
    isLocked, canEnter, entryLabel, resolveUrl, unlockedCount, emptySlot, statusLabel, badge, setEntry, toolIcons, makeIcon,
    load: () => catalogPromise ||= fetch(new URL('data/showcase.json', siteRoot), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Project catalog could not be loaded.');
        return response.json();
      })
      .then((projects) => {
        if (!Array.isArray(projects) || !projects.length) throw new Error('Project catalog is empty.');
        projects = projects.map((project) => ({
          ...project,
          url: resolveUrl(project.url),
          image: resolveUrl(project.image),
          product: project.product ? {
            ...project.product,
            supportUrl: resolveUrl(project.product.supportUrl),
            privacyUrl: resolveUrl(project.product.privacyUrl)
          } : undefined
        }));
        return projects.sort((a, b) => (a.campaignOrder ?? Infinity) - (b.campaignOrder ?? Infinity)
          || Number(b.featured) - Number(a.featured));
      })
  };
})();
