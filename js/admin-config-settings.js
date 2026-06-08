/* =============================================
   Config & Settings
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= CONFIG =======
async function loadCfg(){
  try{const s=await D.cfg().get();if(s.exists){const d=s.data();shopCfg={...shopCfg,...d};milestones=d.milestones||[];bdayRwd=d.bdayReward||{};refRwds=d.refRewards||{};}}
  catch(e){}
  const map={'s-rate':shopCfg.rupeePerPoint||10,'s-wel':shopCfg.welcomePoints||50,'s-rdm':shopCfg.redeemValue||10,'s-nm':shopCfg.shopName||'','s-hwa':shopCfg.helpWa||''};
  Object.entries(map).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v;});
  const ha=document.getElementById('s-hon');if(ha)ha.value=shopCfg.helpActive??1;
  cfgPreview();
}
function cfgPreview(){
  const r=parseInt(document.getElementById('s-rate')?.value)||10;
  const w=parseInt(document.getElementById('s-wel')?.value)||50;
  const rd=parseInt(document.getElementById('s-rdm')?.value)||10;
  const hint=document.getElementById('s-hint');if(hint)hint.textContent=`₹${r*10}=10pts`;
  const p=document.getElementById('s-prev');
  if(p)p.innerHTML=`⭐ ₹${r} = 1 pt  |  🎁 Welcome: ${w} pts  |  🎫 100pts=₹${rd} off  |  📊 Eff: <strong style="color:var(--y)">${((rd/r)*10).toFixed(1)}%</strong>`;
  const eff=(rd/r)*10;const ww=shopCfg.warnPct||5;const cr=shopCfg.critPct||8;
  const ec=document.getElementById('s-eco');
  if(ec){let cl='#66bb6a',ms='✅ Safe';if(eff>cr){cl='#ef5350';ms='❌ Loss risk!';}else if(eff>ww){cl='var(--y)';ms='⚠️ Monitor';}ec.innerHTML=`<div style="background:rgba(255,255,255,.04);border-radius:8px;padding:.6rem;font-size:.76rem;color:${cl};">${ms} — Eff: ${eff.toFixed(1)}%</div>`;}
  profWarn();
}
async function saveCfg(){
  const cfg={rupeePerPoint:parseInt(document.getElementById('s-rate').value)||10,welcomePoints:parseInt(document.getElementById('s-wel').value)||50,redeemValue:parseInt(document.getElementById('s-rdm').value)||10,shopName:document.getElementById('s-nm').value||'The Kathi Roll Hub',helpWa:document.getElementById('s-hwa').value||'8619721224',helpActive:parseInt(document.getElementById('s-hon')?.value)||1,updatedAt:FV.serverTimestamp()};
  try{await D.cfg().set(cfg,{merge:true});shopCfg={...shopCfg,...cfg};toast('✅ Settings saved!');cfgPreview();}
  catch(e){toast('❌ '+e.message);}
}
function chPw(){
  const p=document.getElementById('new-pw').value.trim();
  if(!p||p.length<6)return toast('❌ 6+ chars chahiye');
  // Simple: show new password - owner note kar le
  if(confirm('Naya password: '+p+'\n\nYeh note kar lo! OK click karo.')){
    toast('✅ Password noted! File mein update karo ya VishTech ko batao.');
    document.getElementById('new-pw').value='';
  }
}

function profWarn(){
  const r=shopCfg.rupeePerPoint||10,rd=shopCfg.redeemValue||10;
  const eff=(rd/r)*10,w=shopCfg.warnPct||5,cr=shopCfg.critPct||8;
  const el=document.getElementById('pw-dash');
  if(eff>cr&&el)el.innerHTML=`<div class="pw-box pw-crit">🚨 Loss Risk! Discount ${eff.toFixed(1)}% — critical!</div>`;
  else if(eff>w&&el)el.innerHTML=`<div class="pw-box pw-warn">⚠️ Discount ${eff.toFixed(1)}% — monitor karo.</div>`;
  else if(el)el.innerHTML='';
}
