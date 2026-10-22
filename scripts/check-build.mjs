#!/usr/bin/env node
/**
 * Assert the built site carries the things that are invisible in a browser but
 * decide whether a share card renders and whether a crawler sees one page or two.
 *
 * There is no typecheck in this project, so `npm run build` succeeding only means it
 * compiled. This script is the part that checks the output.
 *
 *   npm run check:build        (after npm run build)
 *
 * Each check names the defect it prevents. Every one of them failed at least once
 * against a deliberately broken dist before it was trusted.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://cromtongroup.com';

const failures = [];
const notes = [];

const fail = (check, detail) => failures.push(`${check}: ${detail}`);
const ok = (check) => notes.push(`  ok   ${check}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Width/height from a JPEG's first SOFn marker — no image library needed. */
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

// ---------------------------------------------------------------- 404 + robots
if (!existsSync(path.join(DIST, '404.html'))) fail('404 page', 'dist/404.html is missing');
else {
  const html = await readFile(path.join(DIST, '404.html'), 'utf8');
  if (!/name="robots" content="noindex/.test(html)) fail('404 page', 'not marked noindex');
  else ok('404 page exists and is noindex');
}

if (!existsSync(path.join(DIST, 'robots.txt'))) fail('robots.txt', 'dist/robots.txt is missing');
else {
  const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
  if (!robots.includes(`${SITE}/sitemap-index.xml`)) fail('robots.txt', 'does not point at the sitemap');
  else ok('robots.txt points at the sitemap');
}

// -------------------------------------------------------------------- sitemap
const sitemapFiles = (await readdir(DIST)).filter((f) => f.startsWith('sitemap-') && f.endsWith('.xml'));
if (!sitemapFiles.length) fail('sitemap', 'no sitemap-*.xml in dist');
else {
  const xml = await Promise.all(sitemapFiles.map((f) => readFile(path.join(DIST, f), 'utf8')));
  const locs = xml.join('\n').match(/<loc>[^<]+<\/loc>/g)?.map((l) => l.slice(5, -6)) ?? [];
  const bad = locs.filter((u) => u === `${SITE}/` || u === `${SITE}/404/` || u === `${SITE}/404.html`);
  if (bad.length) fail('sitemap', `lists non-content URLs: ${bad.join(', ')}`);
  if (!locs.some((u) => u === `${SITE}/en/`)) fail('sitemap', 'does not list the English homepage');
  if (!locs.some((u) => u === `${SITE}/ar/`)) fail('sitemap', 'does not list the Arabic homepage');
  if (!failures.some((f) => f.startsWith('sitemap'))) ok(`sitemap lists ${locs.length} real URLs, no redirect`);
}

// ----------------------------------------------------------------- HTML pages
const pages = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const ogImagePath = path.join(DIST, 'images', 'og', 'og-cromton-group.jpg');

for (const file of pages) {
  const rel = `/${path.relative(DIST, file)}`;
  const html = await readFile(file, 'utf8');

  // `/index.html` is Astro's meta-refresh stub for the `/` → `/en/` redirect. It never
  // renders, so it needs no canonical or share card — but it must stay out of the index.
  if (/http-equiv="refresh"/.test(html)) {
    if (!/name="robots" content="noindex"/.test(html)) fail('redirect stub', `${rel} is not noindex`);
    continue;
  }

  // canonical: exactly one, absolute, and pointing at this page's own address
  const canonicals = html.match(/<link rel="canonical" href="([^"]+)"/g) ?? [];
  const is404 = rel === '/404.html';
  if (is404) {
    // A 404 is served for arbitrary paths, so a canonical would claim one URL for all of
    // them. It carries none on purpose.
    if (canonicals.length) fail('canonical', '404.html carries a canonical, which cannot be right for every path');
  } else if (canonicals.length !== 1) {
    fail('canonical', `${rel} has ${canonicals.length} canonical tags`);
  } else {
    const href = canonicals[0].match(/href="([^"]+)"/)[1];
    const expected = rel.replace(/index\.html$/, '');
    if (!href.startsWith(SITE)) fail('canonical', `${rel} is not absolute: ${href}`);
    else if (!new URL(href).pathname.endsWith(expected)) {
      fail('canonical', `${rel} points at ${new URL(href).pathname}, expected ${expected}`);
    }
  }

  // share card
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!html.includes(`property="${tag}"`)) fail('social card', `${rel} has no ${tag}`);
  }
  if (!html.includes('name="twitter:card"')) fail('social card', `${rel} has no twitter:card`);
  if (html.includes('property="og:image"') && !html.includes('/images/og/og-cromton-group.jpg')) {
    fail('social card', `${rel} og:image does not point at the generated card`);
  }

  // hreflang only where a translation exists
  const isHome = rel === '/en/index.html' || rel === '/ar/index.html';
  const alts = html.match(/rel="alternate" hreflang="/g) ?? [];
  if (isHome && alts.length !== 3) fail('hreflang', `${rel} has ${alts.length} alternates, expected 3`);
  if (!isHome && alts.length !== 0) fail('hreflang', `${rel} advertises ${alts.length} alternates with no Arabic page`);

  // third-party font hosting
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail('fonts', `${rel} still references Google Fonts`);
}
if (!failures.some((f) => f.startsWith('canonical'))) ok(`canonical absolute and self-referential on ${pages.length} pages`);
if (!failures.some((f) => f.startsWith('social card'))) ok('og/twitter tags on every page');
if (!failures.some((f) => f.startsWith('hreflang'))) ok('hreflang on the en/ar homepage pair only');

// -------------------------------------------------------------- fonts on disk
const cssFiles = (await walk(path.join(DIST, '_astro'))).filter((f) => f.endsWith('.css'));
const css = (await Promise.all(cssFiles.map((f) => readFile(f, 'utf8')))).join('\n');
const fontRefs = [...new Set(css.match(/\/fonts\/[\w.-]+\.woff2/g) ?? [])];

if (!fontRefs.length) fail('fonts', 'no self-hosted @font-face url() in the built CSS');
for (const ref of fontRefs) {
  if (!existsSync(path.join(DIST, ref))) fail('fonts', `${ref} is referenced but not in dist`);
}
if (/fonts\.(googleapis|gstatic)\.com/.test(css)) fail('fonts', 'built CSS still loads Google Fonts');
if (!failures.some((f) => f.startsWith('fonts'))) ok(`${fontRefs.length} self-hosted font files resolve`);

// ------------------------------------------------------------- the share card
if (!existsSync(ogImagePath)) fail('og image', 'dist/images/og/og-cromton-group.jpg is missing');
else {
  const size = jpegSize(await readFile(ogImagePath));
  const bytes = (await stat(ogImagePath)).size;
  if (!size) fail('og image', 'is not a readable JPEG');
  else if (size.width !== 1200 || size.height !== 630) {
    fail('og image', `is ${size.width}x${size.height}, expected 1200x630`);
  } else if (bytes > 300 * 1024) fail('og image', `is ${(bytes / 1024).toFixed(0)} KiB, over the 300 KiB budget`);
  else ok(`og image 1200x630, ${(bytes / 1024).toFixed(0)} KiB`);
}

// --------------------------------------------------------------------- report
console.log(`checked ${pages.length} pages in dist/`);
for (const n of notes) console.log(n);

if (failures.length) {
  console.error(`\n${failures.length} FAILED`);
  for (const f of failures) console.error(`  FAIL ${f}`);
  process.exit(1);
}
console.log('\nall checks passed');
