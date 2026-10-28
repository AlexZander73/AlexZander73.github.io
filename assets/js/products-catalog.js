/* Product listings are a projection of data/showcase.json, never a second list. */
(() => {
  const grid = document.getElementById('products-grid');
  const message = document.getElementById('products-empty');
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const link = (label, url, className) => {
    const node = text('a', label, className);
    node.href = url;
    return node;
  };
  ProjectCatalog.load().then((projects) => {
    const products = projects.filter((project) => project.product);
    grid.replaceChildren(...products.map((product) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.productId = product.id;
      const image = document.createElement('img');
      image.className = 'thumb';
      image.src = product.image;
      image.alt = `${product.title} artwork`;
      image.loading = 'lazy';
      const body = document.createElement('div');
      body.className = 'body';
      body.append(text('p', `${product.featured ? 'Featured · ' : ''}${ProjectCatalog.isLocked(product) ? 'In development' : 'Released'}`, 'meta'), text('h2', product.title), text('p', product.blurb), text('p', product.platforms.join(', '), 'meta'));
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.append(link('View product', product.url, 'btn btn-primary'));
      if (product.product.supportUrl) actions.append(link('Support', product.product.supportUrl, 'btn'));
      body.append(actions);
      card.append(image, body);
      return card;
    }));
    message.hidden = products.length > 0;
    message.textContent = 'No product pages are available yet.';
  }).catch(() => {
    message.hidden = false;
    message.textContent = 'The product catalog could not be loaded. Please reload this page or contact Zach for help.';
  });
})();
