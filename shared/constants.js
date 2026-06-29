
// ── MENU CATEGORIES (SEED DATA — fallback/first-run only) ───
//  NOTE: Yeh sirf PEHLI BAAR seed karne ke liye hai. Asli
//  category-list ab Firestore ke "categories" collection mein
//  dynamic hai — admin Menu page se khud add/delete kar sakta
//  hai. Yeh array sirf naya shop set-up karte waqt reference
//  ke liye hai, code mein kahin force nahi hota.
// ── ────────────────────────────────────────────────────────
export const CATEGORIES = [
  "Egg Rolls",
  "Chicken Rolls",
  "Aloo Rolls",
  "Veg Rolls",
  "Chaap Rolls",
  "Paneer Rolls",
  "Mushroom Rolls",
  "Momos",
  "Extra",
  "Beverages",
  "Chinese Snack",
  "Chinese Main Course",
  "Rice",
  "Noodles & Pasta",
  "Maggie & Fries",
  "Other",
];

// ── FIRESTORE COLLECTION NAMES ──────────────────────────────
export const COLLECTIONS = {
  users:      "users",
  bills:      "bills",
  menu:       "menu",
  categories: "categories",
  settings:   "settings",
  shop:       "shop",
  feedback:   "feedback",
};

// ── LOCALSTORAGE KEYS (offline fallback) ────────────────────
export const LS = {
  users:      "krh_users",
  bills:      "krh_bills",
  menu:       "krh_menu",
  categories: "krh_categories",
  settings:   "krh_settings",
  shop:       "krh_shop",
  feedback:   "krh_feedback",
  theme:      "krh_theme",
  adminPw:    "krh_admin_pass",
  current:    "krh_current",
};