/* =============================================
   Bill Correction Modal
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ===== BILL CORRECTION =====
let corrBill=null;
function openCorr(b){
  if(!b||!b.id)return toast('❌ Bill data missing');
  corrBill=b;
  const info=document.getElementById('corr-info');
  if(info)info.innerHTML='Customer: <strong>'+esc(b.custName||'—')+'</strong> ('+esc(b.custPhone||'')+')<br>Amount: ₹'+(b.finalAmount||0)+' | Pts: '+(b.earnPts||0)+' | Date: '+esc(b.dateStr||'—');
  const cPts=document.getElementById('corr-pts');if(cPts)cPts.value='';
  const cAmt=document.getElementById('corr-amt');if(cAmt)cAmt.value='';
  document.getElementById('corr-modal').classList.remove('hidden');
}
function closeCorr(){document.getElementById('corr-modal').classList.add('hidden');corrBill=null;}
async function applyCorrection(){
  if(!corrBill)return;
  const rsn=document.getElementById('corr-reason')?.value||'Manual correction';
  const pAdj=parseInt(document.getElementById('corr-pts')?.value)||0;
  const aAdj=parseFloat(document.getElementById('corr-amt')?.value)||0;
  if(!pAdj&&!aAdj)return toast('❌ Kuch adjust karein');
  if(!confirm('Apply correction?\nPts: '+(pAdj>0?'+':'')+pAdj+'\nAmt: '+(aAdj>0?'+':'')+aAdj+'\nReason: '+rsn))return;
  try{
    if(corrBill.customerId){
      await D.cust(corrBill.customerId).update({
        points:firebase.firestore.FieldValue.increment(pAdj),
        totalSpend:firebase.firestore.FieldValue.increment(aAdj)
      });
      await D.txns().add({customerId:corrBill.customerId,custName:corrBill.custName,type:'correction',points:pAdj,amount:aAdj,note:'Bill Correction: '+rsn,billRef:corrBill.billId,date:firebase.firestore.FieldValue.serverTimestamp()});
    }
    await D.bills().doc(corrBill.id).update({corrected:true,correctionReason:rsn,correctionPts:pAdj,correctionAmt:aAdj,correctedAt:firebase.firestore.FieldValue.serverTimestamp()});
    const i=allC.findIndex(x=>x.id===corrBill.customerId);
    if(i>=0)allC[i].points=(allC[i].points||0)+pAdj;
    closeCorr();toast('✅ Correction done! Pts: '+(pAdj>0?'+':'')+pAdj);
    loadTodayBills();
  }catch(e){toast('❌ '+e.message);}
}

function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}
