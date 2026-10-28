(() => {
  const grid = document.getElementById('support-grid');
  const status = document.getElementById('support-status');
  ProjectCatalog.load().then((projects) => {
    const products = projects.filter((project) => project.product?.supportUrl);
    grid.replaceChildren(...products.map((product) => {
      const link = document.createElement('a');
      link.className = 'app-link';
      link.href = product.product.supportUrl;
      const name = document.createElement('strong');
      name.textContent = product.title;
      const description = document.createElement('p');
      description.textContent = `${product.title} help and support.`;
      link.append(name, description);
      return link;
    }));
    status.hidden = products.length > 0;
    status.textContent = 'No support pages are available yet. Please use the email below.';
  }).catch(() => {
    status.textContent = 'The support directory could not be loaded. Please reload or use the email below.';
  });
})();
