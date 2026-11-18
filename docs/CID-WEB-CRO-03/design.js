// Review interactions only. No network, tracking, cookies or persistent preferences.
const panel=document.querySelector('[data-consent]');
const params=new URLSearchParams(location.search);
if(panel) panel.hidden=params.get('consent')==='saved';
let consentReturnFocus=null;
const mobile=matchMedia('(max-width:760px)');
function reserveConsentSpace(){
  const height=panel&&!panel.hidden&&mobile.matches?Math.ceil(panel.getBoundingClientRect().height):0;
  document.documentElement.style.setProperty('--consent-safe-area',height+'px');
}
if(panel)new ResizeObserver(reserveConsentSpace).observe(panel);
mobile.addEventListener('change',reserveConsentSpace);
reserveConsentSpace();
document.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
  panel.hidden=true;
  reserveConsentSpace();
  document.querySelector('#choice-status').textContent=`Local simulation: ${button.dataset.choice}. Nothing is collected or saved.`;
  (consentReturnFocus||document.querySelector('[data-primary]')).focus({preventScroll:true});
  consentReturnFocus=null;
}));
document.querySelector('[data-reopen]')?.addEventListener('click',event=>{
  consentReturnFocus=event.currentTarget;
  panel.hidden=false;
  reserveConsentSpace();
  panel.querySelector('button').focus();
});
document.addEventListener('focusin',event=>{
  if(!mobile.matches||panel.hidden||panel.contains(event.target)||event.target.closest('dialog'))return;
  const rect=event.target.getBoundingClientRect();
  const visibleBottom=innerHeight-panel.getBoundingClientRect().height-18;
  if(rect.bottom>visibleBottom)window.scrollBy({top:rect.bottom-visibleBottom,behavior:'instant'});
  else if(rect.top<8)window.scrollBy({top:rect.top-12,behavior:'instant'});
});
const dialog=document.querySelector('#preview-dialog');
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#dialog-copy').textContent=button.dataset.preview==='Google Play'?'This Google Play badge is a design example. No store opens and no click is tracked.':`${button.dataset.preview} is a non-operative design example. The existing destination is preserved in the handover; this preview does not open it.`;
  dialog.showModal();
}));
document.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>link.closest('details').open=false));
