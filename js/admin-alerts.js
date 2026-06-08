/* =============================================
   Alerts & Smart Notifications
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= ALERTS =======
async function loadAlerts(){
  try{
    const s=await D.custs().get();const custs=s.docs.map(d=>({id:d.id,...d.data()}));
    const ia=custs.filter(c=>(c.lastVisitDays||0)>=15),unver=custs.filter(c=>!c.phoneVerified);
    const msAlerts=[];milestones.forEach(m=>{if(!m.active)return;custs.filter(c=>(c.visits||0)===m.visit).forEach(c=>msAlerts.push({i:'🎁',t:`${c.name} — ${m.visit}th visit! "${m.reward}" dena hai`,a:'WA',f:()=>window.open(`https://wa.me/91${c.phone}?text=${encodeURIComponent(`🎁 Congrats ${c.name} ji! Aapki ${m.visit}th visit pe reward: "${m.reward}" — counter pe claim karein! 🌯`)}`)}););});
    const items=[...msAlerts];
    if(ia.length)items.push({i:'😴',t:`${ia.length} customers 15+ din inactive`,a:'Win-Back',f:()=>{ia.slice(0,3).forEach(c=>window.open(`https://wa.me/91${c.phone}?text=${encodeURIComponent(`😊 Namaste ${c.name} ji! Roll Hub miss kar raha hai — aaj aao, special offer ready! 🌯`)}`));}});
    if(unver.length)items.push({i:'📱',t:`${unver.length} unverified phones`,a:'View',f:()=>{sw('custs',document.querySelectorAll('.tab')[4]);filtUnver();}});
    if(!items.length)items.push({i:'✅',t:'Sab theek! Koi urgent alert nahi.',a:null});
    document.getElementById('al-list').innerHTML=items.map((a,i)=>`<div class="ali"><div class="ali-icon">${a.i}</div><div class="ali-info"><div class="ali-t">${esc(a.t)}</div></div>${a.a?`<button class="ali-btn" onclick="window._alf[${i}]()">${a.a}</button>`:''}</div>`).join('');
    window._alf=items.map(a=>a.f||(()=>{}));
    document.getElementById('seg-sum').innerHTML=[{l:'🥈 Silver',n:custs.filter(c=>(c.points||0)<300).length},{l:'🥇 Gold',n:custs.filter(c=>(c.points||0)>=300&&(c.points||0)<700).length},{l:'💎 VIP',n:custs.filter(c=>(c.points||0)>=700).length},{l:'😴 Inactive',n:ia.length}].map(s=>`<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.8rem;">${s.l}<span style="color:var(--y);font-weight:700;">${s.n}</span></div>`).join('');
    const ts=await D.tasks().where('status','==','pending').get();
    document.getElementById('st-list').innerHTML=ts.docs.length?ts.docs.map(d=>{const t={id:d.id,...d.data()};return`<div class="rvr"><div class="rvt"><strong>${esc(t.custId)}</strong> — ${{ig:'Instagram Follow',gg:'Google Review',wa:'WhatsApp',zom:'Zomato'}[t.taskId]||t.taskId} (+${t.points} pts)</div><button class="rvb" onclick="verST('${t.id}','${t.custId}',${t.points})">✅</button></div>`;}).join(''):'<div style="color:var(--m);font-size:.82rem;">✅ Koi pending nahi</div>';
  }catch(e){toast('❌ '+e.message);}
}
async function verST(tid,cid,pts){try{await D.tasks().doc(tid).update({status:'verified'});await D.cust(cid).update({points:FV.increment(pts)});toast(`✅ ${pts} pts!`);loadAlerts();}catch(e){toast('❌ '+e.message);}}
