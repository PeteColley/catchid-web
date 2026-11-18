// Review interactions only. No network, tracking, cookies or persistent preferences.
const panel=document.querySelector('[data-consent]');
const params=new URLSearchParams(location.search);
if(panel) panel.hidden=params.get('consent')==='saved';
document.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
  panel.hidden=true;
  document.querySelector('#choice-status').textContent=`Local simulation: ${button.dataset.choice}. Nothing is collected or saved.`;
  document.querySelector('[data-primary]').focus({preventScroll:true});
}));
document.querySelector('[data-reopen]')?.addEventListener('click',()=>{
  panel.hidden=false;
  panel.querySelector('button').focus();
});
const dialog=document.querySelector('#preview-dialog');
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#dialog-copy').textContent=button.dataset.preview==='Google Play'?'This Google Play badge is a design example. No store opens and no click is tracked.':`${button.dataset.preview} is a non-operative design example. The existing destination is preserved in the handover; this preview does not open it.`;
  dialog.showModal();
}));
document.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>link.closest('details').open=false));
