(() => {
  const toolsGrid = document.getElementById('about-tools');
  const toolsMessage = document.getElementById('about-tools-message');
  const launchCount = document.getElementById('product-launch-count');

  const toolNames = (values) => Array.isArray(values)
    ? values.filter((value) => typeof value === 'string').map((value) => value.trim()).filter(Boolean)
    : [];

  const renderTools = (projects, settings) => {
    const tools = new Map();
    const addTool = (name) => tools.set(name.toLowerCase(), tools.get(name.toLowerCase()) || name);
    projects.forEach((project) => {
      [...toolNames(project.platforms), ...toolNames(project.tech)].forEach(addTool);
    });
    toolNames(settings?.tools?.add).forEach(addTool);
    toolNames(settings?.tools?.hide).forEach((name) => tools.delete(name.toLowerCase()));

    const names = [...tools.values()].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    toolsGrid.replaceChildren(...names.map((name) => {
      const token = document.createElement('span');
      token.className = 'tool-token';
      token.role = 'listitem';
      const glyph = document.createElement('b');
      glyph.className = 'tool-glyph';
      glyph.append(ProjectCatalog.makeIcon(name));
      const label = document.createElement('small');
      label.textContent = name;
      token.append(glyph, label);
      return token;
    }));
    toolsMessage.textContent = names.length ? '' : 'No platforms or technologies listed yet.';
    toolsMessage.hidden = names.length > 0;
  };

  const loadAbout = async () => {
    // Optional personal additions never prevent the automatic project list from loading.
    const settingsRequest = fetch('data/about.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Tool preferences unavailable.');
        return response.json();
      })
      .catch(() => null);
    try {
      const projects = await ProjectCatalog.load();
      const count = ProjectCatalog.unlockedCount(projects);
      launchCount.textContent = count;
      launchCount.setAttribute('aria-label', `${count} product ${count === 1 ? 'launch' : 'launches'}`);
      renderTools(projects);
      const settings = await settingsRequest;
      if (settings) renderTools(projects, settings);
    } catch {
      launchCount.textContent = '—';
      launchCount.setAttribute('aria-label', 'Product launch count unavailable');
      toolsMessage.textContent = 'Project tools are temporarily unavailable. Please try again.';
      toolsMessage.hidden = false;
    }
  };

  loadAbout();
})();
