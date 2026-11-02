const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const directory = path.join(__dirname, '..', 'course');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(directory, 'slides.js'), 'utf8') + '\nthis.deck = {slides, folioBooks, readingDesks, excerpts, refs};', context);
const {slides, folioBooks, readingDesks, excerpts, refs} = context.deck;

test('every displayed topic resolves to material and a source', () => {
  for (const slide of slides) {
    assert.ok(slide.title && slide.html && slide.notes && slide.source, slide.title);
    for (const match of slide.html.matchAll(/data-folio="([^"]+)"/g)) {
      assert.ok(folioBooks[match[1]]?.length, match[1]);
      for (const leaf of folioBooks[match[1]]) {
        assert.ok(excerpts[leaf.excerpt], leaf.heading);
        assert.ok(slide.excerpts?.includes(leaf.excerpt), `Source panel missing ${leaf.excerpt}`);
      }
    }
    for (const match of slide.html.matchAll(/data-reading-desk="([^"]+)"/g)) {
      assert.ok(readingDesks[match[1]]?.length, match[1]);
    }
  }
  for (const excerpt of Object.values(excerpts)) {
    assert.ok(excerpt.quote && excerpt.by && excerpt.loc);
    assert.equal(new URL(excerpt.url).protocol, 'https:');
  }
  for (const reference of refs) assert.equal(new URL(reference[2]).protocol, 'https:');
});

test('all presentation images are local and available offline', () => {
  const assets = new Set();
  for (const slide of slides) {
    for (const match of slide.html.matchAll(/src="([^"]+)"/g)) assets.add(match[1]);
  }
  for (const leaves of Object.values(folioBooks)) {
    for (const leaf of leaves) {
      if (leaf.image) assets.add(`assets/${leaf.image}.jpg`);
      if (leaf.cards) for (const card of leaf.cards) assert.ok(card.length === 2 && card.every(Boolean));
    }
  }
  for (const asset of assets) {
    assert.ok(asset.startsWith('assets/'), asset);
    assert.ok(fs.statSync(path.join(directory, asset)).size > 0, asset);
  }
});

test('the folio renderer supports new cards and retains existing image pages', () => {
  const app = fs.readFileSync(path.join(directory, 'app.js'), 'utf8');
  const start = app.indexOf('function folioLeft(');
  const end = app.indexOf('function folioRight(', start);
  vm.runInContext(app.slice(start, end), context);
  const cards = vm.runInContext('folioLeft(folioBooks["poem-evidence"][0])', context);
  const image = vm.runInContext('folioLeft(folioBooks.wartime[0])', context);
  const fallback = vm.runInContext('folioLeft(folioBooks.methods[2])', context);
  assert.match(cards, /folio-card-list/);
  assert.doesNotMatch(cards, /拿破仑研究/);
  assert.match(image, /assets\/yanan.jpg/);
  assert.match(image, /data-zoom-image/);
  assert.match(fallback, /拿破仑研究/);
});
