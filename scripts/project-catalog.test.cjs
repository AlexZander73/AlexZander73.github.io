const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/showcase.json')));
const source = fs.readFileSync(path.join(root, 'assets/js/project-catalog.js'), 'utf8');
function load(prefix = '', response = { ok: true, json: async () => structuredClone(data) }) {
  const calls = [];
  const context = { window: {}, document: { currentScript: { src: `https://example.test${prefix}/assets/js/project-catalog.js?v=1` } }, URL, fetch: async (url) => { calls.push(String(url)); return response; } };
  vm.runInNewContext(source, context);
  return { catalog: context.window.ProjectCatalog, calls };
}
test('one shared fetch works from a nested page and a project-site prefix', async () => {
  const { catalog, calls } = load('/portfolio');
  const [projects, same] = await Promise.all([catalog.load(), catalog.load()]);
  assert.equal(projects, same);
  assert.deepEqual(calls, ['https://example.test/portfolio/data/showcase.json']);
  const vault = projects.find(p => p.id === 'projectvault');
  assert.equal(vault.url, 'https://example.test/portfolio/products/projectvault/');
  const vaultSource = data.find(p => p.id === 'projectvault');
  assert.equal(vault.image, new URL(vaultSource.image, 'https://example.test/portfolio/').href);
  assert.equal(vault.product.supportUrl, 'https://example.test/portfolio/products/projectvault/support/');
  assert.equal(catalog.resolveUrl('https://external.test/example'), 'https://external.test/example');
});
test('featured preview is first and reachable without changing completion counts', async () => {
  const { catalog } = load();
  const projects = await catalog.load();
  const vault = projects[0];
  assert.equal(vault.id, 'projectvault');
  assert.equal(vault.featured, true);
  assert.equal(catalog.isLocked(vault), true);
  assert.equal(catalog.canEnter(vault), true);
  assert.equal(catalog.entryLabel(vault), 'View product preview');
  assert.equal(catalog.unlockedCount(projects), data.filter(p => p.status === 'shipped').length);
  assert.equal(catalog.canEnter({ status: 'development', url: '/somewhere' }), false);
  assert.equal(catalog.canEnter({ status: 'shipped', url: '/somewhere' }), true);
});
test('entry links consistently enable previews and disable unavailable projects', () => {
  const { catalog } = load();
  const attrs = new Map();
  const link = { setAttribute: (k, v) => attrs.set(k, v), removeAttribute: (k) => attrs.delete(k) };
  catalog.setEntry(link, { title: 'Draft', status: 'development', url: '/draft' });
  assert.equal(attrs.get('aria-disabled'), 'true');
  catalog.setEntry(link, { title: 'Draft', status: 'development', previewAvailable: true, url: '/draft' });
  assert.equal(link.href, '/draft');
  assert.equal(attrs.has('aria-disabled'), false);
  assert.equal(attrs.get('aria-label'), 'View product preview: Draft');
});
test('generated compatibility catalog contains every registered product exactly once', () => {
  const generated = JSON.parse(fs.readFileSync(path.join(root, 'products/catalog.json')));
  const expected = data.filter(p => p.product);
  assert.equal(new Set(generated.map(p => p.slug)).size, expected.length);
  assert.equal(generated.length, expected.length);
  for (const p of expected) {
    const item = generated.find(x => x.slug === p.id);
    assert.equal(item.title, p.title);
    assert.equal(item.blurb, p.blurb);
    assert.equal(item.url, p.url);
    assert.equal(item.support_url, p.product.supportUrl);
    assert.equal(item.status, p.status);
  }
});
test('failed and empty catalogs reject instead of showing an obsolete fallback', async () => {
  await assert.rejects(load('', { ok: false }).catalog.load(), /could not be loaded/);
  await assert.rejects(load('', { ok: true, json: async () => [] }).catalog.load(), /empty/);
});
