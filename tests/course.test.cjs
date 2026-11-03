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

test('slides use direct layouts and declarative headings', () => {
  const books = slides.flatMap(s => [...s.html.matchAll(/data-folio="([^"]+)"/g)].map(m => m[1]));
  assert.deepEqual(Array.from(books), []);
  for (const s of slides) {
    assert.doesNotMatch(s.title, /[？?]/);
    for (const h of s.html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/g)) assert.doesNotMatch(h[1].replace(/<[^>]+>/g, ''), /[？?]/);
    assert.doesNotMatch(s.html, /style="[^"]*font/);
  }
  assert.equal(slides.length, 19);
  assert.equal(slides.filter(s => s.title.includes('实践中读书')).length, 1);
});

test('static cases retain the poem, science and reading methods', () => {
  const poem = slides.find(s => s.title.includes('史料查证'));
  assert.match(poem.html, /少小离家老大回/);
  assert.match(poem.html, /旧唐书·贺知章传/);
  const science = slides.find(s => s.title.includes('宇宙飞行'));
  for (const text of ['人的知识面要宽些', '1616型高速普通车床', '人造卫星']) assert.ok(science.html.includes(text));
  assert.match(slides.find(s => s.title.includes('四种方法')).html, /对照起来读/);
});

test('application image matches its subject and both economic discussions are directly visible', () => {
  const application = slides.find(s => s.cls === 'application-slide');
  assert.match(application.html, /assets\/protracted-war.jpg/);
  assert.doesNotMatch(application.html, /assets\/reading.jpg/);
  assert.ok(application.imageNotes.some(note => note.includes('12371.cn')));
  const economy = slides.find(s => s.cls === 'economy-comparison-slide');
  assert.match(economy.html, /<table class="economy-comparison">/);
  assert.match(economy.html, /教科书的论述/);
  assert.match(economy.html, /毛泽东的意见/);
  assert.match(economy.html, /把事情说得太容易了/);
  assert.match(economy.html, /最根本的权利/);
  assert.doesNotMatch(economy.html, /data-folio/);
});
