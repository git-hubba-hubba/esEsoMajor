import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import postcss from 'postcss';
import darkColors, {themedValue} from './dark-colors.mjs';

const process = (css, file = 'account.css') => postcss([darkColors()]).process(css, {from: file});

test('component colors receive scoped overrides without changing light rules or layout', async () => {
  const result = await process('.card{background:white;color:#15356b;border:1px solid #d3dce9;padding:24px}');
  const [light, dark] = result.root.nodes;
  assert.equal(light.toString(), '.card{background:white;color:#15356b;border:1px solid #d3dce9;padding:24px}');
  assert.equal(dark.selector, ':root[data-theme="neon-dark"] .card');
  assert.equal(dark.nodes.find(n => n.prop === 'background').value, 'var(--night-surface)');
  assert.equal(dark.nodes.find(n => n.prop === 'color').value, 'var(--night-text)');
  assert.equal(dark.nodes.find(n => n.prop === 'border').value, '1px solid var(--night-border)');
  assert.ok(!dark.nodes.some(n => n.prop === 'padding'));
});

test('responsive and interactive selectors retain their specificity and media scope', async () => {
  const result = await process('@media(max-width:650px){.cards>button:hover,.cards>button[aria-pressed=true]{background:#edf3fd}}');
  assert.equal(result.root.first.name, 'media');
  assert.equal(result.root.first.nodes[1].selector, ':root[data-theme="neon-dark"] .cards>button:hover,:root[data-theme="neon-dark"] .cards>button[aria-pressed=true]');
});

test('alpha and status colors survive while badges receive dark backgrounds', () => {
  assert.equal(themedValue('#fff3', 'background', '.badge'), 'rgb(var(--night-surface-rgb) / 0.2)');
  assert.equal(themedValue('#fff1e1', 'background', '.badge'), 'var(--night-warm-surface)');
  assert.equal(themedValue('#9d5012', 'color', '.badge'), 'var(--night-warm)');
  assert.equal(themedValue('#ebf7ee', 'background', '.success'), 'var(--night-success-surface)');
});

test('assets, keyframes, and hand-authored dark styles are preserved', async () => {
  const asset = 'url("data:image/svg+xml,%23fff")';
  assert.equal(themedValue(asset, 'background', '.image'), asset);
  const keyframes = '@keyframes pulse{to{background:white}}';
  assert.equal((await process(keyframes)).css, keyframes);
  const dark = ':root[data-theme="neon-dark"] .card{color:#e6edf7}';
  assert.equal((await process(dark, 'neon-dark.css')).css, dark);
});

test('all application styles with literal UI colors receive dark counterparts', async () => {
  const directory = new URL('../src/', import.meta.url);
  let count = 0;
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.css') || /^(neon-dark|splash|game|guide-portraits)\.css$/.test(name)) continue;
    const result = await process(await readFile(new URL(name, directory), 'utf8'), name);
    const rules = [];
    result.root.walkRules(rule => rules.push(rule));
    for (const rule of rules) {
      if (rule.selector.includes(':root') || rule.parent.name?.endsWith('keyframes')) continue;
      const needsTheme = rule.nodes.some(node => node.type === 'decl' && !node.prop.startsWith('--') && /color|background|border|outline|shadow|fill|stroke/.test(node.prop) && themedValue(node.value, node.prop, rule.selector) !== node.value);
      if (!needsTheme) continue;
      assert.ok(rule.next()?.selector.startsWith(':root[data-theme="neon-dark"]'), `${name}: ${rule.selector}`);
      count++;
    }
  }
  assert.ok(count > 800, `Expected broad UI coverage, got ${count}`);
});

test('palette text and controls have readable contrast on every surface', async () => {
  const css = await readFile(new URL('../src/neon-dark.css', import.meta.url), 'utf8');
  const rgb = Object.fromEntries([...css.matchAll(/--night-([a-z-]+)-rgb:(\d+) (\d+) (\d+)/g)].map(m => [m[1], m.slice(2).map(Number)]));
  const luminance = color => color.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [.2126,.7152,.0722][i], 0);
  const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  for (const surface of ['background','surface','raised','brand']) {
    for (const text of ['text','muted','blue']) assert.ok(contrast(rgb[text],rgb[surface]) >= 4.5, `${text} on ${surface}: ${contrast(rgb[text],rgb[surface])}`);
  }
  for (const status of ['warm','success','danger']) assert.ok(contrast(rgb[status],rgb[`${status}-surface`]) >= 4.5);
  assert.ok(contrast([11,23,41], rgb.blue) >= 4.5);
});
