/* =============================================
   Auth — Session Password Login
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= AUTH — Simple Password =======
window.onload=function(){
  if(sessionStorage.getItem('rh_ok')==='1'){
    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='block';
    initApp();
  }
};

function doLogin(){
  const p=document.getElementById('l-pw').value;
  const err=document.getElementById('l-err');
  const btn=document.querySelector('.lb-btn');
  if(!p){err.textContent='Password enter karein!';err.style.display='block';return;}
  const valid=['rollhub2025','VishTech2025','admin123'];
  if(valid.includes(p)){
    sessionStorage.setItem('rh_ok','1');
    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='block';
    initApp();
  }else{
    err.textContent='Galat password!';
    err.style.display='block';
  }
}

function doLogout(){
  if(confirm('Logout?')){sessionStorage.removeItem('rh_ok');location.reload();}
}

function sw(n,btn){
  document.querySelectorAll('.tc').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('tc-'+n).classList.add('active');if(btn)btn.classList.add('active');
  if(n==='rwds')loadRwdsTab();if(n==='help')loadHelp();if(n==='refs')loadRefs();
  if(n==='alerts')loadAlerts();if(n==='bills')loadTodayBills();if(n==='cfg')loadCfg();
  if(n==='inv')loadInv();
}

async function initApp(){await loadCfg();loadDash();loadC();loadMenu();renderPosts();}
