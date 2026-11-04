(()=>{const q=s=>document.querySelector(s),cv=q('#sigCv'),x=cv.getContext('2d');let strokes=[],cur=null;
const K='cbSigPen';const load=()=>{try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}};const store=a=>localStorage.setItem(K,JSON.stringify(a));
const sw=['#1b1220','#000000','#1a3fa8','#ff2d8a','#7a2bbf','#0a8a4a'];q('#sigSw').innerHTML=sw.map(c=>'<button type="button" data-c="'+c+'" title="'+c+'" style="width:26px;height:26px;padding:0;border-radius:50%;background:'+c+';border:2px solid #fff"></button>').join('');
q('#sigSw').onclick=e=>{const b=e.target.closest('[data-c]');if(b)q('#sigCol').value=b.dataset.c};
q('#sigSize').oninput=e=>q('#sigSzV').textContent=e.target.value;
function draw(){x.clearRect(0,0,cv.width,cv.height);x.lineCap=x.lineJoin='round';strokes.forEach(s=>{x.strokeStyle=s.c;x.lineWidth=s.w;x.beginPath();s.p.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));if(s.p.length==1)x.lineTo(s.p[0][0]+.1,s.p[0][1]);x.stroke()})}
const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);cur={c:q('#sigCol').value,w:+q('#sigSize').value*(e.pressure&&e.pointerType==='pen'?0.5+e.pressure:1),p:[pt(e)]};strokes.push(cur);draw();e.preventDefault()});
cv.addEventListener('pointermove',e=>{if(!cur)return;cur.p.push(pt(e));draw()});
['pointerup','pointercancel','pointerleave'].forEach(t=>cv.addEventListener(t,()=>cur=null));
q('#sigUndo').onclick=()=>{strokes.pop();draw()};q('#sigClear').onclick=()=>{strokes=[];draw()};
function png(){if(!strokes.length)return null;let a=1e9,b=1e9,c=-1e9,d=-1e9;strokes.forEach(s=>s.p.forEach(p=>{a=Math.min(a,p[0]-s.w);b=Math.min(b,p[1]-s.w);c=Math.max(c,p[0]+s.w);d=Math.max(d,p[1]+s.w)}));a=Math.max(0,a);b=Math.max(0,b);c=Math.min(cv.width,c);d=Math.min(cv.height,d);const o=document.createElement('canvas');o.width=c-a+8;o.height=d-b+8;o.getContext('2d').drawImage(cv,a,b,c-a,d-b,4,4,c-a,d-b);return o.toDataURL('image/png')}
const T=m=>{const t=q('#toast');if(t){t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)}};
function list(){const a=load();q('#sigSaved').innerHTML=a.length?a.map((s,i)=>'<div style="margin:4px 0"><img src="'+s.img+'" alt=""> <b>'+s.name.replace(/[<>&"]/g,'')+'</b> <button type="button" data-u="'+i+'">Use</button> <button type="button" class="ghost" data-d="'+i+'">Remove</button></div>').join(''):'No saved signatures yet.'}
q('#sigSaved').onclick=e=>{const u=e.target.dataset.u,d=e.target.dataset.d,a=load();if(u!=null){use(a[u].img)}if(d!=null&&confirm('Remove this saved signature?')){a.splice(d,1);store(a);list()}};
q('#sigSave').onclick=()=>{const i=png();if(!i)return T('Draw your signature first');const a=load();a.push({name:q('#sigNm').value.trim()||'Signature '+(a.length+1),img:i});store(a);list();T('Signature saved')};
q('#sigPng').onclick=()=>{const i=png();if(!i)return T('Draw your signature first');const l=document.createElement('a');l.href=i;l.download='coffeebreak-signature.png';l.click()};
function use(i){window.cbSig.set(i);window.cbSigShow();q('#sigM').classList.remove('on');T('Signature added to your email')}
q('#sigIns').onclick=()=>{const i=png();if(!i)return T('Draw your signature first');use(i)};
window.cbSigShow=()=>{const i=window.cbSig&&cbSig.get();q('#cSigPrev').innerHTML=i?'Signature: <img class="sigimg" src="'+i+'" alt="Signature"> <button type="button" class="ghost" id="sigRm">Remove</button>':''};
q('#cSigPrev').onclick=e=>{if(e.target.id==='sigRm'){cbSig.set('');cbSigShow()}};
q('#cSigPen').onclick=()=>{list();q('#sigM').classList.add('on')};q('#sigClose').onclick=()=>q('#sigM').classList.remove('on');
})();
