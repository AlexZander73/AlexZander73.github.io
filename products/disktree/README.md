# DiskTree product page

A static, local-first product presentation. Serve MainWebsite with a normal static
HTTP server and open `/products/disktree/`. No dependencies or build are needed.

The interactive tree uses fictional file names and sizes. It never accesses the
visitor’s filesystem. Its three preset looks use the app’s intentional artwork
and normalized leaf paths: original blocks/gold, magnolia/birch and ginkgo/crystal.
Five palette controls recolour the demo without changing its selected branch.
This is an illustrative browser demo, not a screenshot or a web build of DiskTree.

Assets were resized from DiskTree’s Resources directory for the web. The social
preview is a capture of this page’s appearance gallery using fictional data. No
private scan screenshots, reports, user paths or SQLite indexes are published.

Listing metadata lives only in `../../data/showcase.json`. DiskTree is featured
with `previewAvailable: true` while its status remains `development`; it does not
increase the portfolio’s shipped-project count. The public-download CTA is
intentionally absent until a distributable release exists.

After editing the shared catalog, run from MainWebsite:

```sh
python3 scripts/build-catalog.py
python3 scripts/build-catalog.py --check
node --test scripts/project-catalog.test.cjs
```

Support and privacy pages live beside this page. Update availability copy when
shipping, and keep CLI/scan behavior descriptions consistent with the native app.
