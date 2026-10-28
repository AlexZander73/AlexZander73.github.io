#!/usr/bin/env python3
"""Validate the single project registry and generate compatibility/search files."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://' + (ROOT / 'CNAME').read_text().strip()


def local_file(url):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path:
        return None
    target = (ROOT / parts.path.lstrip('/')).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError(f'Path escapes the site: {url}')
    return target / 'index.html' if target.is_dir() or parts.path.endswith('/') else target


def load_projects():
    projects = json.loads((ROOT / 'data/showcase.json').read_text())
    seen = set()
    for project in projects:
        project_id = project['id']
        if project_id in seen:
            raise ValueError(f'Duplicate project: {project_id}')
        seen.add(project_id)
        for field in ('title', 'blurb', 'image', 'url', 'status'):
            if not isinstance(project.get(field), str) or not project[field]:
                raise ValueError(f'{project_id}: missing {field}')
        for field in ('platforms', 'tech', 'tags'):
            if not isinstance(project.get(field), list):
                raise ValueError(f'{project_id}: {field} must be an array')
        links = [project['image'], project['url']]
        if 'product' in project:
            if project['url'] != f'/products/{project_id}/':
                raise ValueError(f'{project_id}: product URL must match its directory')
            links.extend(project['product'].values())
        for url in links:
            target = local_file(url)
            if target and not target.is_file():
                raise ValueError(f'{project_id}: missing local asset/page: {url}')
    published = {p.parent.name for p in (ROOT / 'products').glob('*/index.html')}
    registered = {p['id'] for p in projects if 'product' in p}
    if published != registered:
        raise ValueError(f'Product pages and registry differ: {published ^ registered}')
    return sorted(projects, key=lambda p: (p.get('campaignOrder', float('inf')), not p.get('featured', False)))


def products_output(projects):
    # Kept for older bookmarks/consumers. Live pages use showcase.json directly.
    items = [{
        'slug': p['id'], 'title': p['title'], 'blurb': p['blurb'],
        'image': '/' + p['image'].lstrip('/') if not urlsplit(p['image']).scheme else p['image'],
        'url': p['url'], 'support_url': p['product'].get('supportUrl', ''),
        'platforms': ', '.join(p['platforms']), 'status': p['status'],
        'featured': p.get('featured', False)
    } for p in projects if 'product' in p]
    return json.dumps(items, indent=2, ensure_ascii=False) + '\n'


def sitemap_output():
    # Discover actual pages, not manually maintained project entries or template files.
    pages = set(ROOT.glob('*.html'))
    for directory in ('products', 'projects', 'support', 'privacy', 'carpentry-companion'):
        pages.update((ROOT / directory).rglob('index.html'))
    urls = []
    for page in pages:
        relative = page.relative_to(ROOT).as_posix()
        if relative.endswith('index.html'):
            relative = relative[:-len('index.html')]
        urls.append(f'{DOMAIN}/{relative}')
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    namespace = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
    tree = ET.Element(namespace + 'urlset')
    for url in sorted(set(urls)):
        ET.SubElement(ET.SubElement(tree, namespace + 'url'), namespace + 'loc').text = url
    ET.indent(tree, space='  ')
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(tree, encoding='unicode') + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate without writing; fail for stale generated files.')
    args = parser.parse_args()
    projects = load_projects()
    outputs = {'products/catalog.json': products_output(projects), 'sitemap.xml': sitemap_output()}
    for name, value in outputs.items():
        destination = ROOT / name
        if args.check:
            if not destination.exists() or destination.read_text() != value:
                raise SystemExit(f'{name} is stale. Run python3 scripts/build-catalog.py')
        else:
            destination.write_text(value)
    print(f'Validated {len(projects)} projects and {sum("product" in p for p in projects)} product pages; generated files {"match" if args.check else "updated"}.')


if __name__ == '__main__':
    main()
