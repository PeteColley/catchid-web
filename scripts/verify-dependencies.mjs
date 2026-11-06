// Targeted regression guard for the 6 November 2026 advisory set.
// A fresh npm audit remains necessary: this is not a future-advisory database.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, posix } from 'node:path';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const semver = require('semver'); // Already supplied by the existing dependency tree.
const read = path => {
  const text = readFileSync(path, 'utf8');
  return JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
};
const manifest = read('package.json');
const lock = read('package-lock.json');
const original = read('docs/CID-WEB-CRO-01/evidence/advisories-2026-11-06.json');
const targets = { astro: '7.3.3', vite: '8.2.4', sharp: '0.35.5', devalue: '5.9.3', 'fast-uri': '3.1.9', 'smol-toml': '1.9.0', 'source-map-js': '1.2.2', undici: '8.12.2', zod: '4.6.6' };
assert.deepEqual(Object.keys(manifest.dependencies).sort(), ['@astrojs/check', 'astro', 'typescript']);
assert.equal(manifest.overrides, undefined, 'No persistent override');
const packages = [];
for (const [name, minimum] of Object.entries(targets)) {
  const copies = Object.entries(lock.packages).filter(([path]) => path.endsWith(`node_modules/${name}`));
  assert.ok(copies.length, `${name} has locked copies`);
  for (const [path, pkg] of copies) {
    assert.ok(semver.gte(pkg.version, minimum), `${path}: patched minimum`);
    assert.ok(existsSync(`${path}/package.json`), `${path}: installed`);
    const actual = read(`${path}/package.json`);
    assert.equal(actual.version, pkg.version, `${path}: installed/locked equality`);
    if (actual.engines?.node) assert.ok(semver.satisfies(process.version, actual.engines.node), `${path}: Node compatibility`);
    packages.push({ name, path, locked: pkg.version, installed: actual.version });
  }
}
const parentEdges = [];
for (const [path, pkg] of Object.entries(lock.packages)) {
  for (const [name, range] of Object.entries({ ...pkg.dependencies, ...pkg.optionalDependencies, ...pkg.peerDependencies })) {
    if (!Object.hasOwn(targets, name)) continue;
    let directory = path;
    let found;
    while (true) {
      const candidate = posix.join(directory, 'node_modules', name);
      if (lock.packages[candidate]) { found = candidate; break; }
      if (!directory || directory === '.') break;
      directory = dirname(directory).replaceAll('\\', '/');
      if (directory === '.') directory = '';
    }
    assert.ok(found, `${path} resolves ${name}`);
    assert.ok(semver.satisfies(lock.packages[found].version, range), `${path}: ${name} satisfies ${range}`);
    parentEdges.push({ parent: path || '(root)', name, range, resolvedPath: found, version: lock.packages[found].version });
  }
}
const advisoryResolution = original.map(advisory => {
  const entries = advisory.vulnerabilities.filter(v => v.package.ecosystem === 'npm');
  const copies = packages.filter(p => entries.some(v => v.package.name === p.name));
  assert.ok(copies.length, advisory.ghsa_id);
  const affected = copies.filter(p => entries.some(v => v.package.name === p.name && semver.satisfies(p.installed, v.vulnerable_version_range.replaceAll(',', ''))));
  assert.deepEqual(affected, [], `${advisory.ghsa_id}: no installed affected copy`);
  return { id: advisory.ghsa_id, url: advisory.html_url, resolvedPackages: [...new Set(copies.map(p => p.name))], originalUpdatedAt: advisory.updated_at, resolvedPaths: copies.map(p => ({ path: p.path, version: p.installed })), result: 'resolved in npm tree (Vite includes its editor bundle)' };
});
assert.equal(new Set(advisoryResolution.map(a => a.id)).size, 32);
const sharp = require('sharp');
const native = Object.entries(lock.packages).filter(([path]) => path.includes('node_modules/@img/sharp-')).map(([path, pkg]) => ({ path, version: pkg.version, os: pkg.os, cpu: pkg.cpu, libc: pkg.libc }));
assert.equal(lock.packages['node_modules/@img/sharp-linux-x64'].version, '0.35.5');
assert.equal(lock.packages['node_modules/@img/sharp-libvips-linux-x64'].version, '1.3.4');
const embeddedUndiciAffected = original.filter(a => a.vulnerabilities.some(v => v.package.name === 'undici' && semver.satisfies(process.versions.undici, v.vulnerable_version_range.replaceAll(',', '')))).map(a => a.ghsa_id);
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), node: process.version, embeddedUndici: process.versions.undici, embeddedUndiciAffected, platform: process.platform, arch: process.arch, lockSha256: createHash('sha256').update(readFileSync('package-lock.json')).digest('hex'), packages, parentEdges, advisoryResolution, sharpRuntimeVersions: sharp.versions, nativeLockEntries: native, result: 'PASS; embedded Node tooling assessed separately' }, null, 2));
