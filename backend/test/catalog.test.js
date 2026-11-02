import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync(new URL('../../frontend/src/catalog.json',import.meta.url)));
test('all supplied categories and uniquely identified searchable features are present',()=>{
 assert.equal(catalog.length,11);
 const features=catalog.flatMap(c=>c.features);
 assert.equal(features.length,92);
 assert.equal(new Set(features.map(f=>f.id)).size,features.length);
 for(const c of catalog){assert.ok(c.id&&c.name&&c.features.length);for(const f of c.features){assert.ok(f.name&&f.description&&f.keywords.length)}}
});
