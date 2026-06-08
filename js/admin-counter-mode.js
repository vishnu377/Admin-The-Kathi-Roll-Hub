/* =============================================
   ⚡ Counter Mode — 3-Second Fast Billing
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= ⚡ COUNTER MODE — FAST BILLING IN 3 SECONDS =======
let ctC=null,ctItems=[],ctOffer=null;

async function openCounter(){
  document.getElementById('counter-overlay').classList.remove('hidden');
  document.getElementById('ct-phone').value='';
  ctClear(false);
  if(!menuItems.length)await loadMenu();
  renderCtMenu();
  setTimeout(()=>document.getElementById('ct-phone').focus(),300);
}
function closeCounter(){document.getElementById('counter-overlay').classList.add('hidden');}

function renderCtMenu(){
  const grid=document.getElementById('ct-menu-grid');
  if(!menuItems.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--m);padding:1rem;">Menu empty — Menu tab mein add karo</div>';return;}
  grid.innerHTML=menuItems.map((item,i)=>`<button class="ct-item-btn ${item.outOfStock?'out':''}" onclick="ctAdd(${i})" ${item.outOfStock?'disabled':''} id="ctb-${i}"><span class="ci-e">${item.emoji||'🌯'}</span><div class="ci-n">${esc(item.name.length>14?item.name.slice(0,13)+'…':item.name)}</div><div class="ci-p">₹${item.price}</div></button>`).join('');
  ctUpdateBadges();
}

function ctAdd(idx){
  const item=menuItems[idx];if(!item||item.outOfStock)return;
  const ex=ctItems.find(b=>b.name===item.name);
  if(ex)ex.qty++;
  else ctItems.push({name:item.name,price:item.price,emoji:item.emoji||'🌯',qty:1});
  renderCtItems();ctCalc();ctUpdateBadges();
}

function ctUpdateBadges(){
  document.querySelectorAll('[id^="ctb-"]').forEach((btn,i)=>{
    const item=menuItems[i];if(!item)return;
    const ex=ctItems.find(b=>b.name===item.name);
    let badge=btn.querySelector('.ci-qty');
    if(ex&&ex.qty>0){if(!badge){badge=document.createElement('div');badge.className='ci-qty';btn.appendChild(badge);}badge.textContent=ex.qty;}
    else if(badge)badge.remove();
  });
}

function renderCtItems(){
  const el=document.getElementById('ct-items-list');
  if(!ctItems.length){el.innerHTML='<div style="font-size:.78rem;color:var(--m);">Koi item nahi — upar se tap karo</div>';return;}
  el.innerHTML=ctItems.map((b,i)=>`<div class="ct-bi"><span style="font-size:.95rem;">${b.emoji}</span><span class="ct-bi-nm">${esc(b.name)}</span><div class="ct-bi-ctrl"><button class="ct-bi-btn" onclick="ctQty(${i},-1)">−</button><span style="min-width:16px;text-align:center;font-size:.82rem;">${b.qty}</span><button class="ct-bi-btn" onclick="ctQty(${i},1)">+</button></div><span class="ct-bi-price">₹${b.price*b.qty}</span></div>`).join('');
}

function ctQty(i,d){ctItems[i].qty+=d;if(ctItems[i].qty<=0)ctItems.splice(i,1);renderCtItems();ctCalc();ctUpdateBadges();}

let ctSrchT;
function ctSearch(){
  clearTimeout(ctSrchT);
  const q=document.getElementById('ct-phone').value.trim();
  if(q.length<10){ctC=null;document.getElementById('ct-cust').style.display='none';document.getElementById('ct-pts-badge').querySelector('#ct-pts-val').textContent='—';ctCalc();return;}
  ctSrchT=setTimeout(async()=>{
    let c=allC.find(x=>x.phone===q);
    if(!c){try{const s=await D.custs().where('phone','==',q).get();if(!s.empty)c={id:s.docs[0].id,...s.docs[0].data()};}catch(e){}}
    if(c){
      ctC=c;
      const ti=gT(c.points||0);
      document.getElementById('ct-cust').style.display='block';
      document.getElementById('ct-cust-nm').textContent=c.name;
      document.getElementById('ct-cust-sub').textContent=`${c.visits||0} visits · Last: ${c.lastVisitDays||0}d ago`;
      document.getElementById('ct-cust-tier').textContent=ti.l;
      document.getElementById('ct-pts-val').textContent=c.points||0;
      document.getElementById('ct-avail-pts').textContent=`(${c.points||0} pts)`;
      // Show active personal offer
      const offEl=document.getElementById('ct-active-offers');
      if(c.personalOffer?.msg){const exAt=(c.personalOffer.savedAt?.toMillis()||0)+(c.personalOffer.days||3)*86400000;if(exAt>Date.now()){offEl.innerHTML=`<div class="ct-offer-row" id="ct-pers-off"><span class="ct-offer-code">BACK${c.phone.slice(-4)}</span><span class="ct-offer-disc">💌 ${esc(c.personalOffer.msg)} — ${c.personalOffer.disc||10}% off</span><button class="ct-apply-btn" onclick="applyCtPersonal()">Apply</button></div>`;}else offEl.innerHTML='';}else offEl.innerHTML='';
      ctCalc();
    }else{ctC=null;document.getElementById('ct-cust').style.display='none';document.getElementById('ct-pts-val').textContent='—';toast('❌ Not registered — register karwao pehle');}
  },600);
}

function applyCtPersonal(){
  if(!ctC?.personalOffer)return;
  ctOffer={type:'personal',disc:ctC.personalOffer.disc||10,code:'BACK'+ctC.phone.slice(-4)};
  const btn=document.querySelector('#ct-pers-off .ct-apply-btn');
  if(btn){btn.textContent='✅ Applied';btn.disabled=true;}
  document.getElementById('ct-code-result').innerHTML=`<span style="color:#66bb6a;">✅ ${ctOffer.disc}% off applied!</span>`;
  ctCalc();
}

function applyCtCode(){
  const code=(document.getElementById('ct-code-inp').value||'').trim().toUpperCase();
  if(!code)return;
  // Welcome code check
  if(ctC&&code===`ROLL${ctC.phone.slice(-4)}`){
    const joinDays=ctC.joinDate?.toMillis?Math.floor((Date.now()-ctC.joinDate.toMillis())/86400000):0;
    if(joinDays<7&&(ctC.visits||0)<=1){ctOffer={type:'welcome',disc:10,code};document.getElementById('ct-code-result').innerHTML='<span style="color:#66bb6a;">✅ Welcome 10% off!</span>';ctCalc();return;}
    else{document.getElementById('ct-code-result').innerHTML='<span style="color:#ef5350;">❌ Welcome code expired/used</span>';return;}
  }
  // Personal offer check
  if(ctC?.personalOffer&&code===`BACK${ctC.phone.slice(-4)}`){
    const exAt=(ctC.personalOffer.savedAt?.toMillis()||0)+(ctC.personalOffer.days||3)*86400000;
    if(exAt>Date.now()){ctOffer={type:'personal',disc:ctC.personalOffer.disc||10,code};document.getElementById('ct-code-result').innerHTML=`<span style="color:#66bb6a;">✅ ${ctOffer.disc}% off!</span>`;ctCalc();return;}
    else{document.getElementById('ct-code-result').innerHTML='<span style="color:#ef5350;">❌ Offer expired</span>';return;}
  }
  document.getElementById('ct-code-result').innerHTML='<span style="color:#ef5350;">❌ Invalid code</span>';
}

function ctCalc(){
  const sub=ctItems.reduce((a,b)=>a+b.price*b.qty,0);
  const pts=ctC?ctC.points||0:0;
  const tierD=pts>=700?8:pts>=300?5:0;
  const tierA=Math.floor(sub*tierD/100);
  const offD=ctOffer?ctOffer.disc:0;const offA=Math.floor(sub*offD/100);
  const doRdm=document.getElementById('ct-rdm-chk')?.checked;
  const rp=doRdm?parseInt(document.getElementById('ct-rdm-pts')?.value||0):0;
  const rv=Math.floor(rp*(shopCfg.redeemValue||10)/100);
  const final=Math.max(0,sub-tierA-offA-rv);
  const ep=Math.floor(final/(shopCfg.rupeePerPoint||10));
  document.getElementById('ct-total').textContent=final;
  let bk=`Subtotal ₹${sub}`;
  if(tierA)bk+=` · Tier -₹${tierA}`;if(offA)bk+=` · Offer -₹${offA}`;if(rv)bk+=` · Pts -₹${rv}`;
  document.getElementById('ct-breakdown').textContent=bk;
  document.getElementById('ct-earn-pts').textContent=ep;
  document.getElementById('ct-rdm-val').textContent=rv;
  return{sub,tierD,tierA,offD,offA,rp,rv,final,ep};
}

document.addEventListener('change',e=>{if(e.target.id==='ct-rdm-chk'){const r=document.getElementById('ct-rdm-row');if(r)r.style.display=e.target.checked?'flex':'none';ctCalc();}});

async function ctFinalize(){
  if(!ctItems.length)return toast('❌ Items add karein');
  const btn=document.getElementById('ct-done-btn');btn.disabled=true;btn.textContent='⏳...';
  const{sub,tierD,tierA,offD,offA,rp,rv,final,ep}=ctCalc();
  if(rp>0&&ctC&&rp>(ctC.points||0)){btn.disabled=false;btn.textContent='✅ BILL DONE';return toast(`❌ Sirf ${ctC.points} pts hain`);}
  const bid='BILL'+Date.now().toString().slice(-8);
  const pm=document.getElementById('ct-pay-mode').value;
  try{
    await D.bills().doc(bid).set({billId:bid,customerId:ctC?.id||'walkin',custName:ctC?.name||'Walk-in',custPhone:ctC?.phone||'',items:ctItems,subtotal:sub,tierDisc:tierD,tierAmt:tierA,offerDisc:offD,offerAmt:offA,redeemPts:rp,redeemVal:rv,finalAmount:final,earnPts:ep,payMode:pm,payStatus:'paid',date:FV.serverTimestamp(),dateStr:new Date().toLocaleDateString('en-IN')});
    if(ctC){
      await D.cust(ctC.id).update({points:FV.increment(ep-rp),visits:FV.increment(1),totalSpend:FV.increment(final),lastVisit:FV.serverTimestamp(),lastVisitDays:0});
      await D.txns().add({customerId:ctC.id,custName:ctC.name,type:'earn',points:ep,amount:final,note:`Bill ${bid}`,date:FV.serverTimestamp()});
      if(rp>0)await D.txns().add({customerId:ctC.id,custName:ctC.name,type:'redeem',points:-rp,note:`Redeem ${bid}`,date:FV.serverTimestamp()});
      await chkTier(ctC.id,(ctC.points||0)+ep-rp);
      // ⚡ OFFER USED → AUTO-REMOVE FROM DB
      if(ctOffer?.type==='personal'&&ctC.personalOffer){await D.cust(ctC.id).update({personalOffer:FV.delete()});ctC.personalOffer=null;}
      if(ctOffer?.type==='welcome'){await D.cust(ctC.id).update({welcomeCodeUsed:true});}
      ctC.points=(ctC.points||0)+ep-rp;ctC.visits=(ctC.visits||0)+1;
      document.getElementById('ct-pts-val').textContent=ctC.points;
      const i=allC.findIndex(x=>x.id===ctC.id);if(i>=0)allC[i]=ctC;
    }
    const ms=ctC?milestones.find(m=>m.active&&parseInt(m.visit)===(ctC.visits||0)):null;
    let msg=`✅ ₹${final} · +${ep} pts`;if(ms)msg+=` 🎁 ${ctC.visits}th visit reward!`;
    toast(msg);
    ctItems=[];ctOffer=null;renderCtItems();ctUpdateBadges();ctCalc();
    document.getElementById('ct-code-inp').value='';document.getElementById('ct-code-result').textContent='';
    document.getElementById('ct-rdm-chk').checked=false;document.getElementById('ct-rdm-row').style.display='none';
  }catch(e){toast('❌ '+e.message);}
  btn.disabled=false;btn.textContent='✅ BILL DONE';
}

function ctWhatsApp(){
  if(!ctC||!ctItems.length)return toast('Customer + items chahiye');
  const{final,ep}=ctCalc();
  const il=ctItems.map(b=>`   ${b.name} x${b.qty}  ₹${b.price*b.qty}`).join('\n');
  const msg=`*The Kathi Roll Hub*\nMurlipura, Jaipur\n\n*Bill Receipt*\n${new Date().toLocaleDateString('en-IN')}\nCustomer: ${ctC.name} ji\n\n${il}\n\n*Total: ₹${final}*\n+${ep} pts earned!\nBalance: ${ctC.points} pts\n\nShukriya! 🌯`;
  window.open(`https://wa.me/91${ctC.phone}?text=${encodeURIComponent(msg)}`,'_blank');
}

function ctClearItems(){ctItems=[];ctOffer=null;renderCtItems();ctUpdateBadges();ctCalc();document.getElementById('ct-code-inp').value='';document.getElementById('ct-code-result').textContent='';}
function ctClear(resetCust=true){ctItems=[];ctOffer=null;if(resetCust){ctC=null;document.getElementById('ct-cust').style.display='none';document.getElementById('ct-pts-val').textContent='—';}renderCtItems();ctUpdateBadges();ctCalc();}
