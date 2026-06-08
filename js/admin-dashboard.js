/* =============================================
   Dashboard — Stats & Top Members
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= DASHBOARD =======
async function loadDash(){
  try{
    const s=await D.custs().get();allC=s.docs.map(d=>({id:d.id,...d.data()}));filtCArr=[...allC];
    const today=new Date(),todayStr=today.toLocaleDateString('en-IN');
    document.getElementById('st-tot').textContent=allC.length;
    document.getElementById('st-td').textContent=allC.filter(c=>c.joinDateStr===todayStr).length;
    document.getElementById('st-pts').textContent=allC.reduce((a,c)=>a+(c.points||0),0).toLocaleString();
    document.getElementById('st-refs').textContent=allC.reduce((a,c)=>a+(c.referralCount||0),0);
    const ia=allC.filter(c=>(c.lastVisitDays||0)>=15);
    document.getElementById('st-ia').textContent=ia.length;
    document.getElementById('st-gold').textContent=allC.filter(c=>(c.points||0)>=300&&(c.points||0)<700).length;
    document.getElementById('st-vip').textContent=allC.filter(c=>(c.points||0)>=700).length;
    const tm=today.getMonth(),td=today.getDate();
    const bdays=allC.filter(c=>c.birthday&&new Date(c.birthday).getMonth()===tm&&new Date(c.birthday).getDate()===td);
    const annis=allC.filter(c=>c.anniversary&&new Date(c.anniversary).getMonth()===tm&&new Date(c.anniversary).getDate()===td);
    if(bdays.length){document.getElementById('bday-ban').style.display='block';document.getElementById('bday-list').innerHTML=bdays.map(c=>{const m=encodeURIComponent(`🎂 Happy Birthday ${c.name} ji!\n\nBirthday pe aao — special reward ready hai! 🌯`);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:.3rem 0;font-size:.78rem;"><span>🎂 <strong>${esc(c.name)}</strong> — ${c.phone}</span><button onclick="window.open('https://wa.me/91${c.phone}?text=${m}')" style="background:rgba(37,211,102,.2);border:none;border-radius:6px;padding:.2rem .55rem;font-size:.68rem;cursor:pointer;color:#25D366;font-family:'DM Sans',sans-serif;">💬 Wish</button></div>`;}).join('');}
    if(annis.length){document.getElementById('anni-ban').style.display='block';document.getElementById('anni-list').innerHTML=annis.map(c=>{const m=encodeURIComponent(`💑 Happy Anniversary ${c.name} ji! Special treat aapka wait kar raha hai! 🌯`);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:.3rem 0;font-size:.78rem;"><span>💑 <strong>${esc(c.name)}</strong> — ${c.phone}</span><button onclick="window.open('https://wa.me/91${c.phone}?text=${m}')" style="background:rgba(37,211,102,.2);border:none;border-radius:6px;padding:.2rem .55rem;font-size:.68rem;cursor:pointer;color:#25D366;font-family:'DM Sans',sans-serif;">💬 Wish</button></div>`;}).join('');}
    topBy('pts');loadUpcoming(allC);renderT();profWarn();
  }catch(e){toast('❌ Dashboard: '+e.message);}
}

function topBy(mode){
  const s=[...allC].sort((a,b)=>mode==='pts'?(b.points||0)-(a.points||0):mode==='vis'?(b.visits||0)-(a.visits||0):(b.totalSpend||0)-(a.totalSpend||0));
  const vFn=c=>mode==='pts'?`${c.points||0}pts`:mode==='vis'?`${c.visits||0}v`:`₹${c.totalSpend||0}`;
  document.getElementById('top-list').innerHTML=s.slice(0,6).map((c,i)=>`<div style="display:flex;align-items:center;gap:.6rem;padding:.38rem 0;border-bottom:1px solid rgba(255,255,255,.04);"><span style="font-size:.9rem;min-width:22px;">${['🥇','🥈','🥉','4.','5.','6.'][i]}</span><div style="flex:1"><div style="font-size:.8rem;font-weight:600;">${esc(c.name)}</div><div style="font-size:.68rem;color:var(--m);">${c.phone}</div></div><span style="font-size:.8rem;color:var(--y);font-weight:700;">${vFn(c)}</span><button onclick="qP('${c.id}')" style="background:rgba(255,214,0,.1);border:none;border-radius:5px;padding:.18rem .48rem;font-size:.67rem;cursor:pointer;color:var(--y);font-family:DM Sans,sans-serif;">⭐</button></div>`).join('')||'<span style="color:var(--m);">No data</span>';
}

function loadUpcoming(custs){
  const today=new Date(),rows=[];
  custs.forEach(c=>{
    if(c.birthday){const b=new Date(c.birthday),nb=new Date(today.getFullYear(),b.getMonth(),b.getDate());if(nb<today)nb.setFullYear(today.getFullYear()+1);const dl=Math.ceil((nb-today)/864e5);if(dl>=0&&dl<=7)rows.push({t:'🎂',nm:c.name,ph:c.phone,dl,tp:'Birthday'});}
    if(c.anniversary){const a=new Date(c.anniversary),na=new Date(today.getFullYear(),a.getMonth(),a.getDate());if(na<today)na.setFullYear(today.getFullYear()+1);const dl=Math.ceil((na-today)/864e5);if(dl>=0&&dl<=7)rows.push({t:'💑',nm:c.name,ph:c.phone,dl,tp:'Anniversary'});}
  });
  rows.sort((a,b)=>a.dl-b.dl);
  document.getElementById('upcoming').innerHTML=rows.length?rows.map(r=>`<div style="display:flex;justify-content:space-between;font-size:.78rem;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);"><span>${r.t} <strong>${esc(r.nm)}</strong> — ${r.tp}, ${r.dl===0?'Aaj!':r.dl===1?'Kal':r.dl+'d'}</span><button onclick="wishU('${r.ph}','${r.nm}','${r.tp}')" style="background:rgba(37,211,102,.12);border:none;border-radius:5px;padding:.15rem .5rem;font-size:.67rem;cursor:pointer;color:#25D366;font-family:DM Sans,sans-serif;">💬</button></div>`).join(''):'<span style="color:var(--m);">Next 7 din mein koi special nahi</span>';
}
function wishU(ph,nm,tp){const m=encodeURIComponent(`${tp==='Birthday'?'🎂 Happy Birthday':'💑 Happy Anniversary'} ${nm} ji!\n\nRoll Hub pe aao — special treat ready! 🌯`);window.open(`https://wa.me/91${ph}?text=${m}`);}
