/* =============================================
   Inventory Management
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= INVENTORY FULL =======
async function loadInventory(){
  try{
    const ms=await shopDb.menu().get();const ml=ms.exists?(ms.data().items||[]):menuItems||[];
    const invS=await shopDb.inventory().get();const im={};invS.docs.forEach(d=>im[d.id]={...d.data()});
    allInvItems=ml.map(i=>({name:i.name,emoji:i.emoji||'🌯',price:i.price,stock:im[i.name]?.stock??-1}));
    const inS=allInvItems.filter(i=>i.stock>10).length;
    const lw=allInvItems.filter(i=>i.stock>=1&&i.stock<=10).length;
    const ot=allInvItems.filter(i=>i.stock===0).length;
    document.getElementById('inv-total').textContent=inS;
    document.getElementById('inv-low').textContent=lw;
    document.getElementById('inv-out').textContent=ot;
    renderInvList(allInvItems);renderStockAlerts(allInvItems);
  }catch(e){toast('❌ '+e.message);}
}
function filterInv(){const q=(document.getElementById('inv-search').value||'').toLowerCase();renderInvList(q?allInvItems.filter(i=>i.name.toLowerCase().includes(q)):allInvItems);}
function renderInvList(items){
  const el=document.getElementById('inv-list');
  if(!items.length){el.innerHTML='<div style="color:var(--muted);font-size:.82rem;">Koi item nahi</div>';return;}
  el.innerHTML=items.map(item=>{
    const s=item.stock;let badge='',bs='';
    if(s===0){badge='OUT';bs='background:rgba(211,47,47,.2);color:#ef5350;';}
    else if(s>0&&s<=10){badge=s+' left';bs='background:rgba(255,152,0,.2);color:#FFA726;';}
    else if(s>10){badge=s+'';bs='background:rgba(46,125,50,.2);color:#66bb6a;';}
    else{badge='No track';bs='background:rgba(255,255,255,.07);color:var(--muted);';}
    return`<div style="display:flex;align-items:center;gap:.7rem;padding:.65rem 0;border-bottom:.5px solid rgba(255,255,255,.05);">
      <span style="font-size:1.2rem;">${item.emoji}</span>
      <div style="flex:1"><div style="font-size:.85rem;font-weight:600;">${item.name}</div><div style="font-size:.7rem;color:var(--muted);">₹${item.price}</div></div>
      <span style="font-size:.7rem;font-weight:600;padding:.2rem .6rem;border-radius:6px;${bs}">${badge}</span>
      <input type="number" min="0" max="999" value="${s>=0?s:''}" placeholder="Set" style="width:65px;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:.3rem .5rem;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.78rem;text-align:center;" onchange="setStock('${item.name.replace(/'/g,"\\'")}',this.value)">
      <button onclick="restockItem('${item.name.replace(/'/g,"\\'")}',this)" style="background:rgba(255,214,0,.1);border:1px solid var(--border);border-radius:7px;padding:.28rem .6rem;font-size:.72rem;cursor:pointer;color:var(--yellow);font-family:'DM Sans',sans-serif;">+Add</button>
    </div>`;
  }).join('');
}
async function setStock(nm,val){
  const stock=parseInt(val)||0;
  try{
    await shopDb.inventory().doc(nm).set({stock,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    const ms=await shopDb.menu().get();
    if(ms.exists){const items=ms.data().items||[];const mi=items.findIndex(i=>i.name===nm);if(mi>=0){items[mi].outOfStock=(stock===0);await shopDb.menu().set({items});}}
    toast(stock===0?`⚠️ ${nm} OUT — user app pe hide!`:`✅ ${nm}: ${stock}`);
    loadInventory();
  }catch(e){toast('❌ '+e.message);}
}
async function restockItem(nm){
  const qty=parseInt(prompt(`${nm} mein kitna add karein?`));if(!qty||qty<=0)return;
  try{
    const d=await shopDb.inventory().doc(nm).get();const cur=d.exists?(d.data().stock||0):0;const ns=cur+qty;
    await shopDb.inventory().doc(nm).set({stock:ns,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    const ms=await shopDb.menu().get();
    if(ms.exists){const items=ms.data().items||[];const mi=items.findIndex(i=>i.name===nm);if(mi>=0){items[mi].outOfStock=false;await shopDb.menu().set({items});}}
    toast(`✅ ${nm}: ${cur}+${qty}=${ns}`);loadInventory();
  }catch(e){toast('❌ '+e.message);}
}
async function bulkRestock(){
  if(!confirm('Sab items reset karein?'))return;
  const qty=parseInt(prompt('Har item mein kitna stock?'));if(!qty||qty<=0)return;
  try{for(const item of allInvItems)await shopDb.inventory().doc(item.name).set({stock:qty,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});toast(`✅ Sab: ${qty}!`);loadInventory();}
  catch(e){toast('❌ '+e.message);}
}
function renderStockAlerts(items){
  const al=items.filter(i=>i.stock>=0&&i.stock<=10);const el=document.getElementById('stock-alerts');
  if(!al.length){el.innerHTML='<div style="color:var(--muted);font-size:.82rem;">✅ Sab theek!</div>';return;}
  el.innerHTML=al.map(item=>`<div class="alert-item"><div class="ai-icon">${item.emoji}</div><div class="ai-info"><div class="ai-title">${item.name} — ${item.stock===0?'OUT!':item.stock+' units'}</div><div class="ai-sub">${item.stock===0?'App pe hide':'Low stock'}</div></div><button class="ai-btn" onclick="restockItem('${item.name.replace(/'/g,"\\'")}')">+Restock</button></div>`).join('');
}
async function loadSalesReport(){
  try{
    const s=await shopDb.bills().get();const today=new Date().toLocaleDateString('en-IN');
    const bills=s.docs.map(d=>d.data()).filter(b=>b.dateStr===today);
    const ic={};bills.forEach(b=>(b.items||[]).forEach(i=>{ic[i.name]=(ic[i.name]||0)+i.qty;}));
    const sorted=Object.entries(ic).sort((a,b)=>b[1]-a[1]);
    const el=document.getElementById('sales-report');
    if(!sorted.length){el.innerHTML='<div style="color:var(--muted);font-size:.82rem;">Aaj koi bill nahi</div>';return;}
    el.innerHTML=sorted.map(([name,qty],i)=>{const item=allInvItems.find(x=>x.name===name)||{emoji:'🌯',price:0};return`<div style="display:flex;align-items:center;gap:.6rem;padding:.45rem 0;border-bottom:.5px solid rgba(255,255,255,.04);"><span style="font-size:.82rem;min-width:18px;color:var(--muted);">${i+1}.</span><span>${item.emoji}</span><div style="flex:1;font-size:.82rem;font-weight:600;">${name}</div><span style="color:var(--yellow);font-weight:600;">${qty}x</span><span style="font-size:.75rem;color:var(--muted);">₹${item.price*qty}</span></div>`;}).join('');
  }catch(e){}
}
