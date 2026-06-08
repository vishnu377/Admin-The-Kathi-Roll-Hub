/* =============================================
   CSV Export
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= EXPORT =======
function expAll(){if(!allC.length)return toast('⏳ Load ho rahi hai...');const h=['ID','Naam','Phone','Verified','Birthday','Anniversary','City','Points','Tier','Visits','LastVisitDays','FavItems','JoinDate'];const r=allC.map(c=>[c.id,c.name,c.phone,c.phoneVerified?'Yes':'No',c.birthday||'',c.anniversary||'',c.city||'',c.points||0,c.tier||'Silver',c.visits||0,c.lastVisitDays||0,(c.dishes||[]).join(';'),c.joinDateStr||'']);dlCSV([h,...r],'rollhub_all.csv');toast(`✅ ${allC.length}!`);}
function expBday(){const m=new Date().getMonth();const b=allC.filter(c=>c.birthday&&new Date(c.birthday).getMonth()===m);if(!b.length)return toast('❌ Koi nahi');dlCSV([['Naam','Phone','Birthday','Points'],...b.map(c=>[c.name,c.phone,c.birthday,c.points||0])],'bdays.csv');toast(`✅ ${b.length}!`);}
function expRefs(){const r=allC.filter(c=>(c.referralCount||0)>0);dlCSV([['Naam','Phone','Refs'],...r.map(c=>[c.name,c.phone,c.referralCount||0])],'refs.csv');toast('✅');}
function expIa(){const ia=allC.filter(c=>(c.lastVisitDays||0)>=15).sort((a,b)=>(b.lastVisitDays||0)-(a.lastVisitDays||0));if(!ia.length)return toast('✅ Koi inactive nahi!');dlCSV([['Naam','Phone','Days','Points'],...ia.map(c=>[c.name,c.phone,c.lastVisitDays||0,c.points||0])],'inactive.csv');toast(`✅ ${ia.length}!`);}
function dlCSV(d,f){const csv='\ufeff'+d.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.download=f;a.click();}
