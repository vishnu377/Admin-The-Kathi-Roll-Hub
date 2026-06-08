/* =============================================
   Bills List & Correction
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= BILLS + CORRECTION =======
async function loadTodayBills(){
  try{const s=await D.bills().get();const today=new Date().toLocaleDateString('en-IN');const bills=s.docs.map(d=>({id:d.id,...d.data()})).filter(b=>b.dateStr===today).sort((a,b)=>{try{return(b.date?.toMillis()||0)-(a.date?.toMillis()||0);}catch{return 0;}});renderBillsList(bills);}catch(e){toast('❌ '+e.message);}
}
async function srchBills(){const q=document.getElementById('bill-srch-inp').value.trim();if(q.length<5){loadTodayBills();return;}try{const s=await D.bills().get();const bills=s.docs.map(d=>({id:d.id,...d.data()})).filter(b=>b.custPhone===q||b.billId?.includes(q)||(b.custName||'').toLowerCase().includes(q.toLowerCase())).sort((a,b)=>{try{return(b.date?.toMillis()||0)-(a.date?.toMillis()||0);}catch{return 0;}});renderBillsList(bills.slice(0,25));}catch(e){toast('❌ '+e.message);}}

function renderBillsList(bills){
  window._bMap=window._bMap||{};
  bills.forEach(b=>window._bMap[b.id]=b);
  const el=document.getElementById('bills-list');
  if(!bills.length){el.innerHTML='<div style="color:var(--m);font-size:.82rem;">Koi bill nahi</div>';return;}
  el.innerHTML=bills.map(b=>{
    const corrTag=b.corrected?'<span style="font-size:.65rem;background:rgba(255,152,0,.15);color:#FFA726;padding:.12rem .4rem;border-radius:4px;margin-left:.4rem;">Corrected</span>':'';
    const ps=b.payStatus==='unpaid'?'background:rgba(211,47,47,.15);color:#ef5350;':b.payStatus==='partial'?'background:rgba(255,152,0,.15);color:#FFA726;':'background:rgba(46,125,50,.15);color:#66bb6a;';
    const psLabel=b.payStatus==='unpaid'?'Unpaid':b.payStatus==='partial'?'Partial':'Paid';
    return`<div style="background:var(--c);border:1px solid var(--b);border-radius:11px;padding:.8rem;margin-bottom:.6rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;">
        <div><strong style="font-size:.85rem;">${esc(b.custName||'—')}</strong>${corrTag} <span style="font-size:.7rem;color:var(--m);">${esc(b.custPhone||'')}</span></div>
        <span style="font-family:'Oswald',sans-serif;font-size:1.1rem;color:var(--y);">₹${b.finalAmount||0}</span>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center;font-size:.72rem;color:var(--m);">
        <span>${(b.items||[]).length} items</span>
        <span>|</span><span>${b.payMode||'Cash'}</span>
        <span>|</span><span style="padding:.1rem .45rem;border-radius:4px;${ps}">${psLabel}</span>
        <span>|</span><span>${b.dateStr||''}</span>
        <button onclick="openCorrById('${b.id}')" style="margin-left:auto;background:rgba(255,214,0,.12);border:1px solid var(--b);border-radius:7px;padding:.22rem .55rem;font-size:.7rem;cursor:pointer;color:var(--y);font-family:'DM Sans',sans-serif;">🔧</button>
        <button onclick="billWAById('${b.id}')" style="background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.25);border-radius:7px;padding:.22rem .55rem;font-size:.7rem;cursor:pointer;color:#25D366;font-family:'DM Sans',sans-serif;">💬</button>
      </div>
    </div>`;
  }).join('');
}
function openCorrById(id){const b=window._bMap&&window._bMap[id];if(b)openCorr(b);}
function billWAById(id){const b=window._bMap&&window._bMap[id];if(!b)return;
  const msg=`Bill ID: ${b.billId||id}\nCustomer: ${b.custName} (${b.custPhone})\nAmount: Rs.${b.finalAmount||0}\nDate: ${b.dateStr}\n\nShukriya! — The Kathi Roll Hub`;
  window.open('https://wa.me/91'+b.custPhone+'?text='+encodeURIComponent(msg),'_blank');
}

async function applyCorrection(){
  if(!corrBill)return;
  const rsn=document.getElementById('corr-reason').value;
  const ptsAdj=parseInt(document.getElementById('corr-pts').value)||0;
  const amtAdj=parseFloat(document.getElementById('corr-amt').value)||0;
  if(!ptsAdj&&!amtAdj)return toast('❌ Kuch adjust karein');
  if(!confirm(`Apply karein?\nPts: ${ptsAdj>0?'+':''}${ptsAdj}\nAmt: ${amtAdj>0?'+':''}${amtAdj}\nReason: ${rsn}`))return;
  try{
    if(corrBill.customerId){
      await D.cust(corrBill.customerId).update({points:FV.increment(ptsAdj),totalSpend:FV.increment(amtAdj)});
      await D.txns().add({customerId:corrBill.customerId,custName:corrBill.custName,type:'correction',points:ptsAdj,amount:amtAdj,note:`Correction: ${rsn}`,billRef:corrBill.billId,date:FV.serverTimestamp()});
    }
    await D.bills().doc(corrBill.id).update({corrected:true,correctionReason:rsn,correctionPts:ptsAdj,correctionAmt:amtAdj,correctedAt:FV.serverTimestamp()});
    const i=allC.findIndex(x=>x.id===corrBill.customerId);if(i>=0)allC[i].points=(allC[i].points||0)+ptsAdj;
    closeCorr();toast(`✅ Correction done! Pts: ${ptsAdj>0?'+':''}${ptsAdj}`);loadTodayBills();
  }catch(e){toast('❌ '+e.message);}
}
