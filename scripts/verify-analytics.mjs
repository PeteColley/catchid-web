import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';

const key = 'catchid.website.analytics';
const id = 'G-LPXGL5VTB1';
const loader = `https://www.googletagmanager.com/gtag/js?id=${id}`;

// Execute the actual generated inline script with a deliberately small browser
// boundary. Unexpected network APIs or injected nodes fail rather than being
// silently stubbed. Real-browser/network checks complement this deterministic suite.
function browser(script, initial = null, { readFails = false, writeFails = false, removeFails = false, pending = false } = {}) {
  const values = new Map(initial === null ? [] : [[key, initial]]);
  const requests = [];
  const cookieWrites = [];
  const cookies = new Map([['_ga', 'old'], ['_ga_LPXGL5VTB1', 'old-session'], ['site_preference', 'keep']]);
  const events = new Map();
  const nodes = new Map();
  const loaders = [];
  const document = {
    activeElement: null,
    addEventListener(name, callback) { events.set(`document:${name}`, callback); },
    getElementById(name) {
      if (!nodes.has(name)) nodes.set(name, {
        hidden: true, textContent: '', attributes: {}, listeners: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(name, callback) { this.listeners[name] = callback; },
        focus() { document.activeElement = this; },
      });
      return nodes.get(name);
    },
    querySelector(selector) {
      assert.equal(selector, '.site-header .brand');
      return document.getElementById('brand');
    },
    createElement(tag) {
      assert.equal(tag, 'script');
      return { listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; }, remove() { this.removed = true; } };
    },
    head: { appendChild(node) {
      assert.equal(node.src, loader, 'Only the approved GA4 loader can be requested');
      assert.equal(node.async, true);
      assert.equal(values.get(key), 'granted', 'Explicit saved consent precedes every load');
      assert.equal(window[`ga-disable-${id}`], false);
      requests.push(node.src);
      loaders.push(node);
      if (!pending) node.listeners.load();
    } },
    get cookie() { return [...cookies].map(([name, value]) => `${name}=${value}`).join('; '); },
    set cookie(value) {
      assert.match(value, /^_ga(?:_[^=;]+)?=; Max-Age=0; Path=\/(?:; Domain=[.\w]+)?; SameSite=Lax$/);
      cookieWrites.push(value);
      cookies.delete(value.split('=')[0]);
    },
  };
  const window = { addEventListener(name, callback) { events.set(name, callback); } };
  const localStorage = {
    getItem(name) { if (readFails) throw new Error('Storage blocked'); return values.get(name) ?? null; },
    setItem(name, value) { if (writeFails) throw new Error('Storage full'); values.set(name, value); },
    removeItem(name) { if (removeFails) throw new Error('Storage blocked'); values.delete(name); },
  };
  runInNewContext(script, { document, window, localStorage, location: { hostname: 'catchid.app' } }, { timeout: 1000 });
  events.get('document:DOMContentLoaded')();
  const node = (name) => document.getElementById(`analytics-${name}`);
  const click = (name) => node(name).listeners.click();
  const dispatch = (name, event = {}) => events.get(name)(event);
  const calls = () => Array.from(window.dataLayer ?? [], (args) => Array.from(args));
  return { values, requests, cookies, cookieWrites, window, document, node, click, dispatch, calls, loaders };
}

export function verifyAnalytics(script, page) {
  const assertOff = (b) => {
    assert.equal(b.requests.length, 0, 'No Google requests while unset/rejected');
    assert.equal(b.window.gtag, undefined, 'No gtag initialisation while unset/rejected');
    assert.equal(b.window.dataLayer, undefined, 'No GA command queue before acceptance');
    assert.equal(b.window[`ga-disable-${id}`], true);
  };
  const assertStartedOnce = (b) => {
    assert.deepEqual(b.requests, [loader]);
    assert.deepEqual(b.calls().map((call) => call[0]), ['js', 'config'], 'Exactly one standard initialisation; no custom events');
    assert.equal(b.calls()[1][1], id);
    assert.deepEqual(JSON.parse(JSON.stringify(b.calls()[1][2])), {
      allow_google_signals: false, allow_ad_personalization_signals: false,
    }, 'Normal page view/enhanced measurement; advertising features disabled');
  };

  for (const initial of [null, 'denied', '', 'true', 'accepted', 'GRANTED', 'granted ']) {
    const b = browser(script, initial);
    assertOff(b);
    assert.equal(b.node('consent').hidden, initial === 'denied');
    assert.equal(b.node('choices').hidden, false);
    b.dispatch('pageshow');
    assertOff(b);
    b.click('reject');
    assert.equal(b.values.get(key), 'denied');
    assert.equal(b.node('consent').hidden, true);
    assertOff(b);
    const reloaded = browser(script, b.values.get(key));
    assertOff(reloaded);
    assert.equal(reloaded.node('consent').hidden, true);
    b.click('choices');
    assert.equal(b.node('consent').hidden, false);
    assert.equal(b.node('choices').attributes['aria-expanded'], 'true');
    assert.equal(b.document.activeElement, b.node('title'), 'Reopening focuses the labelled choices');
    b.click('accept');
    assert.equal(b.values.get(key), 'granted');
    assert.equal(b.node('consent').hidden, true);
    assert.equal(b.document.activeElement, b.node('choices'), 'Returns keyboard focus to the footer control');
    assertStartedOnce(b);
  }

  for (const initial of [null, 'granted']) {
    const b = browser(script, initial);
    if (initial === null) b.click('accept');
    assertStartedOnce(b);
    b.dispatch('pageshow');
    b.click('choices');
    b.click('accept');
    b.click('accept');
    assertStartedOnce(b);
    const reloaded = browser(script, b.values.get(key));
    assertStartedOnce(reloaded);
    assert.equal(reloaded.node('consent').hidden, true);
    b.cookies.set('_ga', 'new');
    b.cookies.set('_ga_LPXGL5VTB1', 'new-session');
    b.click('choices');
    b.click('reject');
    assert.equal(b.values.get(key), 'denied');
    assert.equal(b.window[`ga-disable-${id}`], true, 'Withdrawal disables an already loaded or pending GA tag');
    assertStartedOnce(b);
    assert.deepEqual([...b.cookies], [['site_preference', 'keep']], 'Only GA cookies are removed');
    for (const domain of ['', '; Domain=catchid.app', '; Domain=.catchid.app']) {
      assert.ok(b.cookieWrites.includes(`_ga=; Max-Age=0; Path=/${domain}; SameSite=Lax`));
    }
    assertOff(browser(script, b.values.get(key)));
    b.click('choices');
    b.click('accept');
    assert.equal(b.window[`ga-disable-${id}`], false);
    assertStartedOnce(b);
  }

  for (const event of ['storage', 'pageshow']) {
    const b = browser(script, 'granted');
    b.values.set(key, 'denied');
    b.dispatch(event, { key });
    assert.equal(b.window[`ga-disable-${id}`], true, 'Another tab/back navigation must honour withdrawal');
    assert.equal(b.node('consent').hidden, true);
    assertStartedOnce(b);
    b.values.delete(key);
    b.dispatch(event, { key: null });
    assert.equal(b.window[`ga-disable-${id}`], true);
    assert.equal(b.node('consent').hidden, false, 'Clearing storage returns to an explicit choice');
  }
  const otherTab = browser(script);
  otherTab.values.set(key, 'granted');
  otherTab.dispatch('storage', { key: 'unrelated' });
  assertOff(otherTab);
  otherTab.dispatch('storage', { key });
  assertStartedOnce(otherTab);

  for (const acceptBeforeLoad of [false, true]) {
    const b = browser(script, null, { pending: true });
    b.click('accept');
    assert.equal(b.calls().length, 0, 'Wait for the real library before configuring');
    b.click('choices');
    b.click('reject');
    if (acceptBeforeLoad) b.click('accept');
    b.loaders[0].listeners.load();
    if (!acceptBeforeLoad) {
      assert.equal(b.calls().length, 0, 'A delayed library must not initialise after rejection');
      b.click('accept');
    }
    assertStartedOnce(b);
    b.loaders[0].listeners.load();
    b.click('accept');
    assertStartedOnce(b);
  }
  const retry = browser(script, null, { pending: true });
  retry.click('accept');
  retry.loaders[0].listeners.error();
  assert.equal(retry.loaders[0].removed, true);
  retry.click('accept');
  assert.equal(retry.loaders.length, 2, 'An explicit later acceptance can retry a failed download');
  retry.loaders[1].listeners.load();
  assert.equal(retry.calls().filter(([command]) => command === 'config').length, 1);

  for (const options of [{ readFails: true }, { readFails: true, writeFails: true, removeFails: true }, { writeFails: true }]) {
    const b = browser(script, null, options);
    assertOff(b);
    if (options.writeFails) {
      b.click('accept');
      assertOff(b);
      assert.equal(b.node('consent').hidden, false);
      assert.match(b.node('status').textContent, /could not save your choice/);
    }
  }
  const fullStorage = browser(script, 'granted', { writeFails: true });
  fullStorage.click('choices');
  fullStorage.click('reject');
  assert.equal(fullStorage.window[`ga-disable-${id}`], true);
  assert.equal(fullStorage.values.has(key), false, 'Discard a stale grant if saving rejection fails');
  assertOff(browser(script, fullStorage.values.get(key)));
  console.log(`PASS: ${page} — generated consent runtime: default off, exact GA ID, accept/reject/reopen, persistence, deduplication, cookies, storage failures, cross-tab and back navigation.`);
}
