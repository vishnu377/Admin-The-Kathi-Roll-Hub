/* =============================================
   Referral System
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= REFERRALS =======
async function loadRefs(){try{const s=await D.refs().get();const refs=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>{try{return(b.date?.toMillis()||0)-(a.date?.toMillis()||0);}catch{return 0;}});const pend=refs.filter(r=>r.status==='pending'),done=refs.filter(r=>r.status==='verified');document.getElementById('ref-pend').innerHTML=!pend.length?'<div style="color:var(--m);font-size:.82rem;">✅ Koi pending nahi</div>':pend.map(r=>`<div class="rvr"><div class="rvt"><strong>${esc(r.referrer)}</strong> → <strong>${esc(r.newCustName||r.newCust)}</strong> (${r.newCustPhone||''})<br><span style="font-size:.7rem;color:var(--m);">Bonus: ${r.bonus||50} pts</span></div><button class="rvb" onclick="verRef('${r.id}','${r.referrer}',${r.bonus||50})">✅ Verify</button></div>`).join('');document.getElementById('ref-done').innerHTML=!done.length?'<div style="color:var(--m);font-size:.82rem;">Koi verified nahi</div>':done.slice(0,15).map(r=>`<div style="padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.76rem;color:var(--m);">✅ ${esc(r.referrer)} → ${esc(r.newCust)} (+${r.bonus||50}pts)</div>`).join('');}catch(e){toast('❌ '+e.message);}}
async function verRef(id,rid,bonus){try{await D.cust(rid).update({points:FV.increment(bonus),referralCount:FV.increment(1),referralBonus:FV.increment(bonus)});await D.refs().doc(id).update({status:'verified'});toast(`✅ +${bonus} pts!`);loadRefs();}catch(e){toast('❌ '+e.message);}}
