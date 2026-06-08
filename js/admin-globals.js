/* =============================================
   Global Variables & Utilities
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= GLOBALS =======
let allC=[],filtCArr=[],selC=null,curPage=1;const PAGE=20;
let menuItems=[],milestones=[],bdayRwd={},refRwds={},invItems=[];
let shopCfg={rupeePerPoint:10,welcomePoints:50,redeemValue:10,shopName:'The Kathi Roll Hub',warnPct:5,critPct:8,helpWa:'8619721224',helpActive:1};
let corrBill=null;

function esc(s){const d=document.createElement('div');d.textContent=String(s||'');return d.innerHTML;}
document.getElementById('tb-date').textContent=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'});
