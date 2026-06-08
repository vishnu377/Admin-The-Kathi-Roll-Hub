/* =============================================
   Customers — Table, Search, Filter
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= CUSTOMERS =======
async function loadC(){
  try{const s=await D.custs().get();allC=s.docs.map(d=>({id:d.id,...d.data()}));filtCArr=[...allC];curPage=1;renderT();}
  catch(e){document.getElementById('ctbody').innerHTML=`<tr><td colspan="7" style="text-align:center;color:#ef5350;padding:1rem;">❌ Firebase Rules check karo</td></tr>`;}
}
function filtUnver(){filtCArr=allC.filter(c=>!c.phoneVerified);curPage=1;renderT();}
function filtC(){
  const q=(document.getElementById('f-s').value||'').toLowerCase().trim();
  const tier=document.getElementById('f-t').value,so=document.getElementById('f-so').value;
  let arr=[...allC];
  if(q)arr=arr.filter(c=>(c.name||'').toLowerCase().includes(q)||(c.phone||'').includes(q)||(c.id||'').toLowerCase().includes(q));
  if(tier)arr=arr.filter(c=>(c.tier||'Silver')===tier);
  if(so==='pts')arr.sort((a,b)=>(b.points||0)-(a.points||0));
  else if(so==='vis')arr.sort((a,b)=>(b.visits||0)-(a.visits||0));
  else if(so==='ia')arr.sort((a,b)=>(b.lastVisitDays||0)-(a.lastVisitDays||0));
  else arr.sort((a,b)=>{try{return(b.joinDate?.toMillis()||0)-(a.joinDate?.toMillis()||0);}catch{return 0;}});
  filtCArr=arr;curPage=1;renderT();
}
function renderT(){
  const s=(curPage-1)*PAGE,pg=filtCArr.slice(s,s+PAGE),tb=document.getElementById('ctbody');
  if(!pg.length){tb.innerHTML=`<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--m);">Koi customer nahi</td></tr>`;document.getElementById('pag').innerHTML='';return;}
  tb.innerHTML=pg.map(c=>{
    const lv=c.lastVisitDays||0,ti=gT(c.points||0);
    const lvBadge=lv===0?'<span style="color:#66bb6a;font-size:.67rem;">Aaj</span>':lv<7?`<span style="color:var(--y);font-size:.67rem;">${lv}d</span>`:`<span style="color:#ef5350;font-size:.67rem;">${lv}d</span>`;
    return`<tr><td><strong>${esc(c.name)}</strong>${c.phoneVerified?'<span style="color:#66bb6a;font-size:.6rem;margin-left:.2rem;">✅</span>':''}</td><td style="font-size:.77rem;color:var(--m);">${c.phone}</td><td style="color:var(--y);font-weight:700;">${c.points||0}</td><td><span class="${ti.c}">${ti.l}</span></td><td>${c.visits||0}</td><td>${lvBadge}</td><td><button onclick="qP('${c.id}')" style="background:rgba(255,214,0,.1);border:none;border-radius:5px;padding:.2rem .55rem;font-size:.68rem;cursor:pointer;color:var(--y);font-family:DM Sans,sans-serif;">⭐</button></td></tr>`;
  }).join('');
  const tp=Math.ceil(filtCArr.length/PAGE);
  document.getElementById('pag').innerHTML=Array.from({length:tp},(_,i)=>`<button class="pgb ${i+1===curPage?'act':''}" onclick="gP(${i+1})">${i+1}</button>`).join('');
  document.getElementById('cc').textContent=`${filtCArr.length} customers`;
}
function gP(p){curPage=p;renderT();}
function gT(pts){if(pts>=700)return{l:'💎 VIP',c:'tv'};if(pts>=300)return{l:'🥇 Gold',c:'tg'};return{l:'🥈 Silver',c:'ts'};}
function qP(id){const c=allC.find(x=>x.id===id);if(!c)return;sw('pts',document.querySelectorAll('.tab')[1]);document.getElementById('srch').value=c.phone;showCR(c);}

let srchTimer;
function srchCust(){clearTimeout(srchTimer);const q=document.getElementById('srch').value.trim();if(q.length<5)return hideCR();srchTimer=setTimeout(async()=>{const c=allC.find(x=>x.phone===q||x.id===q)||await (async()=>{try{if(q.length===10){const s=await D.custs().where('phone','==',q).get();if(!s.empty)return{id:s.docs[0].id,...s.docs[0].data()};}return null;}catch(e){return null;}})();if(c)showCR(c);else toast('❌ Customer nahi mila');},500);}

function showCR(c){
  selC=c;const ti=gT(c.points||0),lv=c.lastVisitDays||0;
  document.getElementById('cr').style.display='block';
  document.getElementById('cr-nm').textContent=c.name;
  document.getElementById('cr-meta').innerHTML=`📱 ${c.phone} | ID: ${c.id} | ${c.phoneVerified?'✅ Verified':'❌ Unverified'} | Joined: ${c.joinDateStr||'—'}`;
  document.getElementById('cr-tier').innerHTML=`<span class="${ti.c}">${ti.l}</span>`;
  document.getElementById('cr-pts').textContent=c.points||0;
  document.getElementById('cr-last').innerHTML=`🕐 Last: <strong>${lv===0?'Aaj':lv===1?'Kal':lv+'d ago'}</strong> | Visits: ${c.visits||0} | Spend: ₹${c.totalSpend||0}`;
  document.getElementById('unver-warn').style.display=c.phoneVerified?'none':'block';
  // Show active personal offer
  const ofEl=document.getElementById('cr-offers');
  if(ofEl&&c.personalOffer?.msg){
    const exAt=(c.personalOffer.savedAt?.toMillis()||0)+(c.personalOffer.days||3)*86400000;
    if(exAt>Date.now()){
      ofEl.innerHTML=`<div style="background:rgba(255,152,0,.1);border:1px solid rgba(255,152,0,.25);border-radius:8px;padding:.5rem .7rem;font-size:.75rem;"><span style="color:#FFA726;font-weight:600;">💌 Active Offer: </span>${esc(c.personalOffer.msg)} (${c.personalOffer.disc||10}% off) <span style="color:var(--m);">| Code: BACK${c.phone.slice(-4)}</span><button onclick="rmvOffer()" style="margin-left:.5rem;background:rgba(211,47,47,.15);border:none;border-radius:5px;padding:.15rem .45rem;font-size:.68rem;cursor:pointer;color:#ef5350;font-family:DM Sans,sans-serif;">Remove</button></div>`;
    }else ofEl.innerHTML='';
  }else if(ofEl)ofEl.innerHTML='';
  const po=document.getElementById('po-msg');if(po&&c.personalOffer?.msg)po.value=c.personalOffer.msg;
}
function hideCR(){document.getElementById('cr').style.display='none';['sub-add','sub-red','sub-bon','sub-off'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});}
function openSub(n){document.getElementById('sub-'+n).style.display='block';}

async function verifyPh(){if(!selC)return;try{await D.cust(selC.id).update({phoneVerified:true});selC.phoneVerified=true;const i=allC.findIndex(x=>x.id===selC.id);if(i>=0)allC[i].phoneVerified=true;showCR(selC);toast('✅ Verified!');}catch(e){toast('❌ '+e.message);}}
async function rmvOffer(){if(!selC)return;try{await D.cust(selC.id).update({personalOffer:FV.delete()});selC.personalOffer=null;showCR(selC);toast('✅ Offer removed!');}catch(e){toast('❌ '+e.message);}}

function calcPts(){const a=parseFloat(document.getElementById('p-amt').value)||0;document.getElementById('p-pts').value=a?Math.floor(a/(shopCfg.rupeePerPoint||10)):'';}
function showRV(){const p=parseInt(document.getElementById('r-pts').value)||0;document.getElementById('rv').textContent=p>0?`${p} pts = ₹${Math.floor(p*(shopCfg.redeemValue||10)/100)} off`:'';}

async function addPts(){
  if(!selC)return;const amt=parseFloat(document.getElementById('p-amt').value)||0;
  const pts=parseInt(document.getElementById('p-pts').value)||Math.floor(amt/(shopCfg.rupeePerPoint||10));
  if(!pts)return toast('❌ Amount/pts enter karein');
  if(!selC.phoneVerified&&!confirm('Phone unverified — sure ho?'))return;
  const note=document.getElementById('p-note').value||'Visit',countV=document.getElementById('p-vis')?.checked!==false;
  try{
    const upd={points:FV.increment(pts),totalSpend:FV.increment(amt),lastVisit:FV.serverTimestamp(),lastVisitDays:0};
    if(countV)upd.visits=FV.increment(1);
    await D.cust(selC.id).update(upd);
    await D.txns().add({customerId:selC.id,custName:selC.name,type:'earn',points:pts,amount:amt,note,date:FV.serverTimestamp()});
    const np=(selC.points||0)+pts;await chkTier(selC.id,np);
    selC.points=np;if(countV)selC.visits=(selC.visits||0)+1;selC.lastVisitDays=0;
    const i=allC.findIndex(x=>x.id===selC.id);if(i>=0)allC[i]=selC;
    // Milestone check
    const ms=milestones.find(m=>m.active&&parseInt(m.visit)===(selC.visits||0));
    let msg=`✅ +${pts} pts! Total: ${np}`;if(ms)msg+=` 🎁 ${selC.visits}th visit — "${ms.reward}" dena hai!`;
    showCR(selC);toast(msg);
    ['p-amt','p-pts','p-note'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  }catch(e){toast('❌ '+e.message);}
}

async function redeemPts(){
  if(!selC)return;const pts=parseInt(document.getElementById('r-pts').value)||0;
  if(!pts)return toast('❌ Pts enter karein');if(pts>(selC.points||0))return toast(`❌ Sirf ${selC.points} pts hain`);
  try{await D.cust(selC.id).update({points:FV.increment(-pts)});await D.txns().add({customerId:selC.id,custName:selC.name,type:'redeem',points:-pts,note:'Redemption',date:FV.serverTimestamp()});selC.points=(selC.points||0)-pts;const i=allC.findIndex(x=>x.id===selC.id);if(i>=0)allC[i].points=selC.points;showCR(selC);toast(`✅ ${pts} pts redeemed!`);document.getElementById('r-pts').value='';}catch(e){toast('❌ '+e.message);}
}

async function addBonus(){
  if(!selC)return;const pts=parseInt(document.getElementById('b-pts').value)||0,rsn=document.getElementById('b-rsn').value;
  if(!pts)return toast('❌ Pts enter karein');
  try{await D.cust(selC.id).update({points:FV.increment(pts)});await D.txns().add({customerId:selC.id,custName:selC.name,type:'bonus',points:pts,note:rsn,date:FV.serverTimestamp()});selC.points=(selC.points||0)+pts;showCR(selC);toast(`🎯 +${pts} pts!`);document.getElementById('b-pts').value='';}catch(e){toast('❌ '+e.message);}
}


// Personal Offer DB functions
async function savePersonalOfferDb(){
  if(!selC)return;
  const msg=document.getElementById('po-text').value.trim()||'Aapke liye special offer!';
  const disc=parseInt(document.getElementById('po-disc').value)||10;
  const days=parseInt(document.getElementById('po-days')?.value)||3;
  const code='BACK'+selC.phone.slice(-4);
  try{
    await shopDb.customer(selC.id).update({personalOffer:{msg,disc,days,code,savedAt:firebase.firestore.FieldValue.serverTimestamp()}});
    selC.personalOffer={msg,disc,days,code};showCR(selC);
    toast(`✅ Offer saved! ${days} din valid — user app pe dikhega`);
  }catch(e){toast('❌ '+e.message);}
}
async function removePersonalOffer(){
  if(!selC)return;if(!confirm('Offer remove karein?'))return;
  try{
    await shopDb.customer(selC.id).update({personalOffer:firebase.firestore.FieldValue.delete()});
    selC.personalOffer=null;showCR(selC);toast('✅ Offer removed!');
  }catch(e){toast('❌ '+e.message);}
}

async function chkTier(id,pts){let t='Silver';if(pts>=700)t='VIP Diamond';else if(pts>=300)t='Gold';await D.cust(id).update({tier:t}).catch(()=>{});}

function sendPOffer(){
  if(!selC)return;const msg=document.getElementById('po-msg').value||'Special offer aapke liye!';const disc=document.getElementById('po-disc').value||'10';
  const code='BACK'+selC.phone.slice(-4);
  const wa=`Namaste ${selC.name} ji! 😊\n\n${selC.lastVisitDays||0} din ho gaye Roll Hub nahi aaye — miss kar rahe hain!\n\n🎁 *Sirf aapke liye:* ${msg}\n💰 Code: *${code}* — ${disc}% OFF!\n\nCounter pe dikhao — discount milega!\n\n🌯 The Kathi Roll Hub, Murlipura`;
  window.open(`https://wa.me/91${selC.phone}?text=${encodeURIComponent(wa)}`,'_blank');
}

async function savePOfferDb(){
  if(!selC)return;const msg=document.getElementById('po-msg').value||'Special offer!';const disc=parseInt(document.getElementById('po-disc').value)||10;const days=parseInt(document.getElementById('po-days').value)||3;
  try{await D.cust(selC.id).update({personalOffer:{msg,disc,days,code:'BACK'+selC.phone.slice(-4),savedAt:FV.serverTimestamp()}});selC.personalOffer={msg,disc,days};showCR(selC);toast(`✅ Saved! ${days}d valid — app pe bhi dikhega`);}catch(e){toast('❌ '+e.message);}
}
