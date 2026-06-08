# 🌯 The Kathi Roll Hub — Admin Panel
**VishTech Software Services**

## Folder Structure
```
rollhub-admin/
├── index.html              ← Main entry point (upload this to Vercel)
├── README.md
├── css/
│   └── admin.css           ← All styles
├── js/
│   ├── firebase-config.js  ← Firebase init + DB shortcuts
│   ├── admin-globals.js    ← Global variables
│   ├── admin-auth.js       ← Session password login
│   ├── admin-config-settings.js ← Settings tab
│   ├── admin-dashboard.js  ← Dashboard stats, birthday alerts
│   ├── admin-customers.js  ← Customer table, search, filter
│   ├── admin-menu.js       ← Menu management
│   ├── admin-rewards.js    ← Milestones, birthday, referral rewards
│   ├── admin-alerts.js     ← Smart alerts, inactive customers
│   ├── admin-help.js       ← Help tickets
│   ├── admin-referrals.js  ← Referral verification
│   ├── admin-billing.js    ← Bill creation, WhatsApp receipt
│   ├── admin-bills-correction.js ← Bills list, correction
│   ├── admin-counter-mode.js ← ⚡ Fast 3-second billing
│   ├── admin-inventory.js  ← Stock management
│   ├── admin-posts.js      ← Social media posts
│   ├── admin-export.js     ← CSV export
│   └── admin-correction-modal.js ← Correction modal
└── lib/
    ├── bootstrap.min.css   ← Bootstrap 5 (local, no CDN needed)
    └── bootstrap.bundle.min.js

```

## Login
- **Password:** `rollhub2025`
- No Firebase Auth needed — simple session password

## Deploy to Vercel
1. Upload entire `rollhub-admin/` folder to Vercel
2. Set root to `rollhub-admin/`
3. Done! No build step needed.

## Firebase Rules
Copy from Admin Panel → Settings tab → Firebase Rules section
