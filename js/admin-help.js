/* =============================================
   Help Tickets
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= HELP =======
async function loadHelp(){
  try{const s=await D.help().limit(50).get();const tks=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>{try{return(b.createdAt?.toMillis()||0)-(a.createdAt?.toMillis()||0);}catch{return 0;}});const op=tks.filter(t=>t.status==='open'),rs=tks.filter(t=>t.status==='resolved');const catC={complaint:'tcat-complaint',query:'tcat-query',suggestion:'tcat-suggestion',compliment:'tcat-compliment'};const rT=(t)=>`<div class="tkt"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;"><span class="tkt-cat ${catC[t.category]||'tcat-query'}">${t.category}</span><span style="font-size:.7rem;color:var(--m);">${esc(t.custName)} · ${esc(t.custPhone)}</span></div><div style="font-size:.8rem;line-height:1.5;margin:.3rem 0;">${esc(t.message)}</div><div style="display:flex;gap:.4rem;margin-top:.5rem;">${t.status==='open'?`<button class="btn btn-g" style="padding:.25rem .6rem;font-size:.7rem;" onclick="resolveTkt('${t.id}')">✅ Resolve</button>`:''}<button class="btn btn-gh" style="padding:.25rem .6rem;font-size:.7rem;" onclick="waHelpR('${t.custPhone}','${t.custName}')">💬 WA</button></div></div>`;
  document.getElementById('help-open').innerHTML=op.length?op.map(rT).join(''):'<div style="color:var(--m);font-size:.82rem;">✅ Koi open nahi</div>';
  document.getElementById('help-res').innerHTML=rs.length?rs.map(rT).join(''):'<div style="color:var(--m);font-size:.82rem;">Koi resolved nahi</div>';}catch(e){toast('❌ '+e.message);}
}
async function resolveTkt(id){try{await D.help().doc(id).update({status:'resolved'});toast('✅ Resolved!');loadHelp();}catch(e){toast('❌ '+e.message);}}
function waHelpR(ph,nm){window.open(`https://wa.me/91${ph}?text=${encodeURIComponent(`Namaste ${nm} ji! Aapka message mila — jald solve karenge! 🌯`)}`,'_blank');}
