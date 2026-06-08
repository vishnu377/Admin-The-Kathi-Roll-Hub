/* =============================================
   Billing — Bill Creation & WhatsApp
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= BILLING FUNCTIONS =======
let billC=null,billItems=[],allInvItems=[];

async function billSearch(){
  const q=document.getElementById('bill-srch').value.trim();if(q.length<5)return;
  let c=allC.find(x=>x.phone===q||x.id===q);
  if(!c){try{const s=await shopDb.customers().where('phone','==',q).get();if(!s.empty)c={id:s.docs[0].id,...s.docs[0].data()};}catch(e){}}
  if(c){billC=c;showBillCust(c);}else toast('❌ Customer nahi mila');
}
function showBillCust(c){
  document.getElementById('bill-cust-info').style.display='block';
  document.getElementById('bc-name').textContent=c.name;
  document.getElementById('bc-tier').textContent=gT(c.points||0).l;
  document.getElementById('bc-pts').textContent=c.points||0;
  document.getElementById('bc-meta').textContent=`📱 ${c.phone} | Last: ${c.lastVisitDays||0}d ago`;
  document.getElementById('b-disc-pct').textContent=(c.points||0)>=700?8:(c.points||0)>=300?5:0;
  document.getElementById('b-redeem-avail').textContent=`(${c.points||0} pts)`;
  calcBill();
}
async function loadBillingMenu(){
  try{
    const s=await shopDb.menu().get();
    const items=(s.exists?s.data().items||[]:menuItems||[]).filter(i=>i.price>0);
    const invSnap=await shopDb.inventory().get();const inv={};invSnap.docs.forEach(d=>inv[d.id]={...d.data()});
    window._bmi=items;
    document.getElementById('bill-menu-grid').innerHTML=items.map((item,i)=>{
      const st=inv[item.name]?.stock;const out=st===0;const low=st!==undefined&&st>0&&st<=10;
      return`<button onclick="addBillItem(${i})" style="background:${out?'rgba(211,47,47,.1)':'var(--card)'};border:1px solid ${out?'rgba(211,47,47,.3)':low?'rgba(255,152,0,.3)':'var(--border)'};border-radius:10px;padding:.55rem .5rem;cursor:${out?'not-allowed':'pointer'};font-family:DM Sans,sans-serif;text-align:center;${out?'opacity:.5':''}" ${out?'disabled':''}><div style="font-size:1.1rem;">${item.emoji||'🌯'}</div><div style="font-size:.72rem;font-weight:600;color:var(--text);margin-top:.2rem;">${esc(item.name)}</div><div style="font-size:.68rem;color:var(--yellow);">₹${item.price}</div>${out?'<div style="font-size:.6rem;color:#ef5350;">Out</div>':low?`<div style="font-size:.6rem;color:#FFA726;">${st} left</div>`:''}</button>`;
    }).join('');
  }catch(e){toast('Menu load error: '+e.message);}
}
function addBillItem(idx){const items=window._bmi||[];if(!items[idx])return;const item=items[idx];const ex=billItems.find(b=>b.name===item.name);if(ex)ex.qty++;else billItems.push({name:item.name,price:item.price,emoji:item.emoji||'🌯',qty:1});renderBillItems();calcBill();}
function renderBillItems(){
  const el=document.getElementById('bill-items-list');
  if(!billItems.length){el.innerHTML='<div style="font-size:.8rem;color:var(--muted);">Koi item select nahi</div>';return;}
  el.innerHTML=billItems.map((b,i)=>`<div style="display:flex;align-items:center;gap:.5rem;padding:.4rem 0;border-bottom:0.5px solid rgba(255,255,255,.05);"><span style="font-size:1rem;">${b.emoji}</span><span style="flex:1;font-size:.82rem;">${esc(b.name)}</span><button onclick="chgQtyB(${i},-1)" style="background:rgba(255,255,255,.07);border:none;border-radius:4px;width:22px;height:22px;cursor:pointer;color:var(--text);font-family:DM Sans,sans-serif;">−</button><span style="font-size:.82rem;min-width:16px;text-align:center;">${b.qty}</span><button onclick="chgQtyB(${i},1)" style="background:rgba(255,255,255,.07);border:none;border-radius:4px;width:22px;height:22px;cursor:pointer;color:var(--text);font-family:DM Sans,sans-serif;">+</button><span style="font-size:.82rem;color:var(--yellow);min-width:48px;text-align:right;">₹${b.price*b.qty}</span><button onclick="remBI(${i})" style="background:none;border:none;color:#ef5350;cursor:pointer;font-size:1rem;">×</button></div>`).join('');
}
function chgQtyB(i,d){billItems[i].qty+=d;if(billItems[i].qty<=0)billItems.splice(i,1);renderBillItems();calcBill();}
function remBI(i){billItems.splice(i,1);renderBillItems();calcBill();}
function calcBill(){
  const sub=billItems.reduce((a,b)=>a+b.price*b.qty,0);
  const pts=billC?billC.points||0:0;const dp=pts>=700?8:pts>=300?5:0;const da=Math.floor(sub*dp/100);
  const rp=document.getElementById('b-redeem-chk')?.checked?parseInt(document.getElementById('b-redeem-pts')?.value||0):0;
  const rv=Math.floor(rp*(shopSettings.redeemValue||10)/100);
  const final=Math.max(0,sub-da-rv);const ep=Math.floor(final/(shopSettings.rupeePerPoint||10));
  document.getElementById('b-subtotal').textContent=sub;document.getElementById('b-disc-amt').textContent=da;
  document.getElementById('b-redeem-val').textContent=rv;document.getElementById('b-final').textContent=final;
  document.getElementById('b-earn-pts').textContent=ep+' pts';
}
function toggleRedeem(){const c=document.getElementById('b-redeem-chk').checked;const r=document.getElementById('b-redeem-row');if(r)r.style.display=c?'flex':'none';calcBill();}
async function finalizeBill(){
  if(!billC)return toast('❌ Customer select karein');if(!billItems.length)return toast('❌ Items add karein');
  const sub=billItems.reduce((a,b)=>a+b.price*b.qty,0);
  const dp=(billC.points||0)>=700?8:(billC.points||0)>=300?5:0;const da=Math.floor(sub*dp/100);
  const rp=document.getElementById('b-redeem-chk')?.checked?parseInt(document.getElementById('b-redeem-pts')?.value||0):0;
  if(rp>(billC.points||0))return toast(`❌ Sirf ${billC.points||0} pts hain`);
  const rv=Math.floor(rp*(shopSettings.redeemValue||10)/100);const final=Math.max(0,sub-da-rv);const ep=Math.floor(final/(shopSettings.rupeePerPoint||10));
  const pm=document.getElementById('b-pay-mode').value,ps=document.getElementById('b-pay-status').value,note=document.getElementById('b-note').value||'';
  const bid='BILL'+Date.now().toString().slice(-8);
  try{
    await shopDb.bills().doc(bid).set({billId:bid,customerId:billC.id,custName:billC.name,custPhone:billC.phone,items:billItems,subtotal:sub,discPct:dp,discAmt:da,redeemPts:rp,redeemVal:rv,finalAmount:final,earnPts:ep,payMode:pm,payStatus:ps,note,date:firebase.firestore.FieldValue.serverTimestamp(),dateStr:new Date().toLocaleDateString('en-IN')});
    await shopDb.customer(billC.id).update({points:firebase.firestore.FieldValue.increment(ep-rp),visits:firebase.firestore.FieldValue.increment(1),totalSpend:firebase.firestore.FieldValue.increment(final),lastVisit:firebase.firestore.FieldValue.serverTimestamp(),lastVisitDays:0});
    await shopDb.transactions().add({customerId:billC.id,custName:billC.name,type:'earn',points:ep,amount:final,note:`Bill ${bid}`,date:firebase.firestore.FieldValue.serverTimestamp()});
    if(rp>0)await shopDb.transactions().add({customerId:billC.id,custName:billC.name,type:'redeem',points:-rp,amount:0,note:`Redeem ${bid}`,date:firebase.firestore.FieldValue.serverTimestamp()});
    await chkTier(billC.id,(billC.points||0)+ep-rp);
    for(const item of billItems){try{const ir=shopDb.inventory().doc(item.name);const id2=await ir.get();if(id2.exists&&(id2.data().stock||0)>0)await ir.update({stock:firebase.firestore.FieldValue.increment(-item.qty)});}catch(e){}}
    billC.points=(billC.points||0)+ep-rp;const ci=allC.findIndex(x=>x.id===billC.id);if(ci>=0)allC[ci]=billC;
    toast(`✅ Bill done! ₹${final} | +${ep} pts`);showBillCust(billC);clearBill(true);loadTodayBills();
  }catch(e){toast('❌ '+e.message);}
}
function clearBill(keepCust=false){
  billItems=[];renderBillItems();calcBill();
  ['b-note','b-redeem-pts'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const rc=document.getElementById('b-redeem-chk');if(rc)rc.checked=false;
  const rr=document.getElementById('b-redeem-row');if(rr)rr.style.display='none';
  if(!keepCust){billC=null;document.getElementById('bill-cust-info').style.display='none';document.getElementById('bill-srch').value='';}
}
function billWhatsApp(){
  if(!billC||!billItems.length)return toast('Customer + items chahiye');
  const sub=billItems.reduce((a,b)=>a+b.price*b.qty,0);
  const dp=(billC.points||0)>=700?8:(billC.points||0)>=300?5:0;const da=Math.floor(sub*dp/100);
  const rp=document.getElementById('b-redeem-chk')?.checked?parseInt(document.getElementById('b-redeem-pts')?.value||0):0;
  const rv=Math.floor(rp*(shopSettings.redeemValue||10)/100);const final=Math.max(0,sub-da-rv);const ep=Math.floor(final/(shopSettings.rupeePerPoint||10));
  const pm=document.getElementById('b-pay-mode')?.value||'Cash',ps=document.getElementById('b-pay-status')?.value||'paid';
  const note=document.getElementById('b-note')?.value||'';
  const newPts=(billC.points||0)+ep-rp;const tier=newPts>=700?'Diamond VIP':newPts>=300?'Gold':'Silver';
  const il=billItems.map(b=>`   ${esc(b.name)} x${b.qty}   Rs.${b.price*b.qty}`).join('\n');
  const da_line=da>0?`Discount (${dp}%):  -Rs.${da}\n`:'';
  const rv_line=rv>0?`Points Redeem:    -Rs.${rv}\n`:'';
  const sub_line=da||rv?`Subtotal:         Rs.${sub}\n`:'';
  const msg=`*━━━━━━━━━━━━━━━━━━━━━━*\n    THE KATHI ROLL HUB\n    Murlipura, Jaipur | 8619721224\n*━━━━━━━━━━━━━━━━━━━━━━*\n\n*BILL RECEIPT*\nDate: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}\nCustomer: ${billC.name} ji\n\n*━━━ ITEMS ━━━*\n${il}\n*━━━━━━━━━━━━━*\n${sub_line}${da_line}${rv_line}*TOTAL: Rs.${final}*\n*${ps==='paid'?`PAID via ${pm}`:ps==='partial'?'PARTIAL PAID':'UNPAID — Pending'}*\n*━━━━━━━━━━━━━*\n\n*LOYALTY POINTS*\nEarned: +${ep} pts\nBalance: ${newPts} pts | ${tier}\n\nDashboard: https://the-kathi-roll-hub-users.vercel.app/\nShukriya! Phir aana 🌯`;
  window.open(`https://wa.me/91${billC.phone}?text=${encodeURIComponent(msg)}`,'_blank');
}
function sendUnpaidReminder(){
  if(!billC)return toast('Customer select karein');
  const sub=billItems.reduce((a,b)=>a+b.price*b.qty,0);
  const final=sub;const il=billItems.map(b=>`   ${b.name} x${b.qty}  Rs.${b.price*b.qty}`).join('\n');
  const msg=`Namaste ${billC.name} ji!\n\nRoll Hub se reminder —\nAapka ${new Date().toLocaleDateString('en-IN')} ka bill pending hai:\n\n${il}\n\n*Total: Rs.${final}*\n\nJab suvidha ho payment kar dena.\nUPI: 8619721224@upi\n\nShukriya!\n— The Kathi Roll Hub`;
  window.open(`https://wa.me/91${billC.phone}?text=${encodeURIComponent(msg)}`,'_blank');
}
