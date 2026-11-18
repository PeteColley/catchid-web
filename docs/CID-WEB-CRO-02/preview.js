// Review-only interactions. No persistence, cookies, analytics, fetches or attribution mutation.
const parameters = new URLSearchParams(location.search);
const panel = document.querySelector('[data-consent]');
const previewStatus = document.querySelector('[data-preview-status]');
if (parameters.get('consent') === 'saved') panel.hidden = true;
document.querySelectorAll('[data-consent-choice]').forEach(button => {
  button.addEventListener('click', () => {
    panel.hidden = true;
    previewStatus.textContent = `Preview: analytics ${button.dataset.consentChoice}. Nothing was stored or sent; reload to restore the selected preview state.`;
    document.querySelector('[data-primary]').focus({preventScroll: true});
  });
});
document.querySelector('[data-reopen]').addEventListener('click', () => {
  panel.hidden = false;
  panel.querySelector('button').focus();
});
if (parameters.get('text') === 'large') {
  // Snapshot all computed sizes before applying any, so inherited sizes scale exactly once.
  const sizes = [...document.querySelectorAll('body, body *')].map(element => [element, parseFloat(getComputedStyle(element).fontSize)]);
  sizes.forEach(([element, size]) => element.style.fontSize = `${size * 1.6}px`);
  document.documentElement.dataset.textScale = '1.6';
}
