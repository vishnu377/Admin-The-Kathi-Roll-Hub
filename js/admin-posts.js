/* =============================================
   Social Media Posts
   The Kathi Roll Hub — Admin Panel
   VishTech Software Services
   ============================================= */

// ======= POSTS =======
const POSTS=[
  {t:"Join Karo",e:"🌯",txt:`🌯 *The Kathi Roll Hub*\nMurlipura, Jaipur | 24x7 Open\n\n⭐ Zomato Top 10 in Rolls!\n\nFREE Loyalty Club:\n✅ 10% Welcome Discount\n🔥 Visit Milestones pe Rewards\n🎂 Birthday Special\n👥 Refer & Earn\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#KathiRollHub #Jaipur`},
  {t:"Birthday",e:"🎂",txt:`🎂 *Birthday Special!*\n\nBirthday month mein special reward!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#BirthdaySpecial #KathiRollHub`},
  {t:"Milestones",e:"🔥",txt:`🔥 *Har visit pe rewards!*\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#Rewards #KathiRollHub`},
  {t:"Refer",e:"💰",txt:`💰 *Refer karo — Earn karo!*\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#ReferAndEarn #KathiRollHub`},
  {t:"Google Review",e:"⭐",txt:`⭐ *5★ Review do — Bonus points!*\n\n👉 https://maps.app.goo.gl/YcMkgZpTJ9hy8MDf8\n\n#GoogleReview #KathiRollHub`},
  {t:"24x7",e:"🌙",txt:`🌙 *Raat ko bhi craving?*\n\n24x7 open!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#24x7Open #KathiRollHub`},
  {t:"VIP",e:"💎",txt:`💎 *VIP Member bano!*\n\n700 pts = VIP Diamond!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#VIPMember #KathiRollHub`},
  {t:"Help Feature",e:"🤝",txt:`🤝 *Koi problem? Hum hain!*\n\nApp mein Help — turant reply!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#CustomerFirst #KathiRollHub`},
  {t:"Momos",e:"🥟",txt:`🥟 *Momos lovers!*\n\nSteam, Fried, Paneer, Kurkure, Gravy!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#Momos #KathiRollHub`},
  {t:"College",e:"🎓",txt:`🎓 *College ke baad spicy?*\n\nRolls | Momos | Chinese | Shakes!\n\n👉 https://the-kathi-roll-hub-users.vercel.app/\n\n#CollegeFood #KathiRollHub`}
];
function renderPosts(){document.getElementById('posts-list').innerHTML=POSTS.map((p,i)=>`<div class="pc"><h4>${p.e} ${p.t}</h4><textarea class="pt" rows="5" readonly>${p.txt}</textarea><div style="display:flex;gap:.4rem;flex-wrap:wrap;"><button class="btn btn-gh" style="padding:.28rem .6rem;font-size:.7rem;" onclick="navigator.clipboard.writeText(POSTS[${i}].txt).then(()=>toast('✅ Copied!'))">📋 Copy</button><button class="btn btn-g" style="padding:.28rem .6rem;font-size:.7rem;" onclick="window.open('https://wa.me/?text='+encodeURIComponent(POSTS[${i}].txt))">💬 WA</button></div></div>`).join('');}
