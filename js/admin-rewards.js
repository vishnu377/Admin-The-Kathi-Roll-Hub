/* =============================================
   Rewards — Milestones, Birthday, Referral
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= REWARDS TAB =======
async function loadRwdsTab(){
  try{const s=await D.cfg().get();if(s.exists){const d=s.data();milestones=d.milestones||[];bdayRwd=d.bdayReward||{};refRwds=d.refRewards||{};const m={'bday-txt':bdayRwd.text||'','bday-d':bdayRwd.disc||15,'bday-pts-inp':bdayRwd.pts||50,'ref-max':refRwds.maxRefs||3,'ref1':refRwds.r1||50,'ref2':refRwds.r2||70,'ref3':refRwds.r3||100,'ref3-item':refRwds.item3||''};Object.entries(m).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v;});const w=document.getElementById('w-pct');if(w)w.value=d.warnPct||5;const c=document.getElementById('c-pct');if(c)c.value=d.critPct||8;}}catch(e){}
  renderMs();
  const r=shopCfg.rupeePerPoint||10,rd=shopCfg.redeemValue||10,eff=(rd/r)*10;
  const el=document.getElementById('eff-disc');if(el){let cl='#66bb6a',ms='✅ Safe';if(eff>8){cl='#ef5350';ms='❌ Loss!';}else if(eff>5){cl='var(--y)';ms='⚠️ Monitor';}el.innerHTML=`Eff discount: <strong style="color:${cl}">${eff.toFixed(1)}% — ${ms}</strong>`;}
}
function renderMs(){const el=document.getElementById('ms-list');if(!el)return;if(!milestones.length){el.innerHTML='<div style="color:var(--m);font-size:.78rem;padding:.4rem 0;">Koi milestone nahi</div>';return;}el.innerHTML=milestones.map((m,i)=>`<div class="ms-r"><span class="ms-badge">${m.visit}th</span><div style="flex:1;font-size:.8rem;">${esc(m.reward)}</div><span style="font-size:.67rem;padding:.15rem .45rem;border-radius:5px;${m.active?'background:rgba(46,125,50,.2);color:#66bb6a;':'background:rgba(255,255,255,.07);color:var(--m);'}">${m.active?'ON':'OFF'}</span><button onclick="togMs(${i})" style="background:rgba(255,255,255,.06);border:1px solid var(--b);border-radius:6px;padding:.2rem .52px;font-size:.68rem;cursor:pointer;color:var(--m);font-family:DM Sans,sans-serif;">${m.active?'Off':'On'}</button><button onclick="delMs(${i})" style="background:rgba(211,47,47,.1);border:none;border-radius:6px;padding:.2rem .52rem;font-size:.68rem;cursor:pointer;color:#ef5350;font-family:DM Sans,sans-serif;">🗑️</button></div>`).join('');}
function addMs(){const v=parseInt(document.getElementById('ms-v').value),r=document.getElementById('ms-r').value.trim();if(!v||v<1)return toast('❌ Visit no.');if(!r)return toast('❌ Reward');if(milestones.find(m=>m.visit===v))return toast('❌ Already exists');milestones.push({visit:v,reward:r,active:true});milestones.sort((a,b)=>a.visit-b.visit);savMs();}
function togMs(i){milestones[i].active=!milestones[i].active;savMs();}
function delMs(i){if(!confirm('Delete?'))return;milestones.splice(i,1);savMs();}
async function savMs(){await D.cfg().set({milestones},{merge:true}).catch(e=>toast('❌ '+e.message));renderMs();toast('✅ Saved!');}
async function saveBday(){const text=document.getElementById('bday-txt').value.trim();if(!text)return toast('❌ Text likhein');bdayRwd={text,disc:parseInt(document.getElementById('bday-d').value)||15,pts:parseInt(document.getElementById('bday-pts-inp').value)||50};await D.cfg().set({bdayReward:bdayRwd},{merge:true}).catch(e=>toast('❌ '+e.message));toast('✅ Birthday reward saved!');}
async function saveRefs(){refRwds={maxRefs:parseInt(document.getElementById('ref-max').value)||3,r1:parseInt(document.getElementById('ref1').value)||50,r2:parseInt(document.getElementById('ref2').value)||70,r3:parseInt(document.getElementById('ref3').value)||100,item3:document.getElementById('ref3-item').value.trim()||''};await D.cfg().set({refRewards:refRwds},{merge:true}).catch(e=>toast('❌ '+e.message));toast('✅ Referral rewards saved!');}
async function saveWarn(){const warnPct=parseInt(document.getElementById('w-pct').value)||5,critPct=parseInt(document.getElementById('c-pct').value)||8;await D.cfg().set({warnPct,critPct},{merge:true}).catch(e=>toast('❌ '+e.message));shopCfg.warnPct=warnPct;shopCfg.critPct=critPct;toast('✅ Warning saved!');profWarn();}
