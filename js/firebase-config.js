/* =============================================
   Firebase Config — The Kathi Roll Hub
   VishTech Software Services
   ============================================= */

firebase.initializeApp({
  apiKey:"AIzaSyCErNYguHO8s4m5aeyGRQvM_PWV_9IzJKs",
  authDomain:"the-kathi-roll-hub.firebaseapp.com",
  projectId:"the-kathi-roll-hub",
  storageBucket:"the-kathi-roll-hub.firebasestorage.app",
  messagingSenderId:"684649816270",
  appId:"1:684649816270:web:73dc4606b754702f6a309f"
});
const db=firebase.firestore();
const D={
  custs:()=>db.collection('rollhub_customers'),
  cust:(id)=>db.collection('rollhub_customers').doc(id),
  refs:()=>db.collection('rollhub_referrals'),
  txns:()=>db.collection('rollhub_transactions'),
  menu:()=>db.collection('rollhub_config').doc('menu'),
  tasks:()=>db.collection('rollhub_socialTasks'),
  cfg:()=>db.collection('rollhub_config').doc('settings'),
  help:()=>db.collection('rollhub_help'),
  bills:()=>db.collection('rollhub_bills'),
  inv:()=>db.collection('rollhub_inventory')
};
const FV=firebase.firestore.FieldValue;