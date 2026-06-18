import headphones from "@/assets/product-headphones.jpg";
import blender from "@/assets/product-blender.jpg";
import avocado from "@/assets/product-avocado.jpg";
import sneaker from "@/assets/product-sneaker.jpg";
import { createSeededRandom, pick, pickN, randInt } from "./seeded-random";

const PRODUCT_IMAGES = [headphones, blender, avocado, sneaker];

/** Category → real asset pools (no generic placeholders) */
const CATEGORY_IMAGE_POOL: Record<string, string[]> = {
  electronics: [headphones, headphones, headphones],
  mobiles: [headphones, headphones],
  fashion: [sneaker, sneaker, sneaker],
  footwear: [sneaker, sneaker],
  grocery: [avocado, avocado, avocado],
  beauty: [blender, blender], // reuse warm-tone asset; beauty uses styled SVG fallback
  appliances: [blender, blender, blender],
  fitness: [sneaker, headphones],
  "home-kitchen": [blender, avocado],
};

function categorySvgImage(category: string, name: string, hue: string): string {
  const emoji = category.includes("Beauty") ? "💄" : category.includes("Grocery") ? "🥬" : category.includes("Fashion") ? "👟" : "📦";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${hue}"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><text x="200" y="220" text-anchor="middle" font-size="64">${emoji}</text><text x="200" y="280" text-anchor="middle" fill="white" font-size="14" font-family="Inter,sans-serif" opacity="0.85">${category.slice(0, 18)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function resolveCategoryKey(categoryId: string, categoryName: string): string {
  const id = categoryId.toLowerCase();
  if (CATEGORY_IMAGE_POOL[id]) return id;
  const name = categoryName.toLowerCase();
  if (name.includes("grocery") || name.includes("food") || name.includes("dairy") || name.includes("snack")) return "grocery";
  if (name.includes("beauty") || name.includes("makeup") || name.includes("skin") || name.includes("hair")) return "beauty";
  if (name.includes("fashion") || name.includes("wear") || name.includes("footwear")) return name.includes("foot") ? "footwear" : "fashion";
  if (name.includes("electronic") || name.includes("mobile") || name.includes("laptop") || name.includes("audio")) return name.includes("mobile") ? "mobiles" : "electronics";
  if (name.includes("appliance") || name.includes("kitchen")) return "appliances";
  return "electronics";
}

function productImage(idx: number, name: string, categoryId: string, categoryName: string): string {
  const key = resolveCategoryKey(categoryId, categoryName);
  const pool = CATEGORY_IMAGE_POOL[key] ?? PRODUCT_IMAGES;
  if (key === "beauty" && idx % 3 !== 0) {
    return categorySvgImage(categoryName, name, "#7b2d8e");
  }
  return pool[idx % pool.length];
}

const CATEGORY_DEFS = [
  { id: "grocery", name: "Grocery", emoji: "🥬" },
  { id: "electronics", name: "Electronics", emoji: "🎧" },
  { id: "beauty", name: "Beauty", emoji: "💄" },
  { id: "fashion", name: "Fashion", emoji: "👟" },
  { id: "mobiles", name: "Mobiles", emoji: "📱" },
  { id: "fitness", name: "Fitness", emoji: "🏋️" },
  { id: "appliances", name: "Appliances", emoji: "🔌" },
  { id: "home-kitchen", name: "Home & Kitchen", emoji: "🏠" },
  { id: "stationery", name: "Stationery", emoji: "✏️" },
  { id: "art-craft", name: "Art & Craft", emoji: "🎨" },
  { id: "baby-care", name: "Baby Care", emoji: "🍼" },
  { id: "pet-supplies", name: "Pet Supplies", emoji: "🐾" },
  { id: "books", name: "Books", emoji: "📚" },
  { id: "toys", name: "Toys", emoji: "🧸" },
  { id: "automotive", name: "Automotive", emoji: "🚗" },
  { id: "pharmacy", name: "Pharmacy", emoji: "💊" },
  { id: "footwear", name: "Footwear", emoji: "👞" },
  { id: "watches", name: "Watches", emoji: "⌚" },
  { id: "jewellery", name: "Jewellery", emoji: "💍" },
  { id: "furniture", name: "Furniture", emoji: "🪑" },
];

const EXTRA_CATEGORIES = [
  "Organic Foods", "Snacks", "Beverages", "Dairy", "Personal Care", "Skincare", "Haircare",
  "Makeup", "Men's Fashion", "Women's Fashion", "Kids Wear", "Laptops", "Tablets", "Cameras",
  "Audio", "TV", "Gaming", "Smart Home", "Kitchen Appliances", "Cleaning", "Laundry",
  "Bedding", "Decor", "Lighting", "Garden", "Sports Equipment", "Yoga", "Cycling",
  "Running", "Swimming", "Camping", "Office Supplies", "School Supplies", "Craft Materials",
  "Painting", "Musical Instruments", "Party Supplies", "Gift Cards", "Seasonal", "Festival",
  "Ethnic Wear", "Western Wear", "Innerwear", "Accessories", "Bags", "Sunglasses", "Belts",
  "Wallets", "Travel", "Luggage", "Rainwear", "Winter Wear", "Summer Wear", "Ethnic Jewellery",
  "Silver", "Gold Plated", "Perfumes", "Deodorants", "Shaving", "Oral Care", "Health Supplements",
  "Protein", "Vitamins", "Ayurveda", "Homeopathy", "First Aid", "Diabetes Care", "Elderly Care",
  "Maternity", "Feeding", "Diapers", "Baby Food", "Strollers", "Car Seats", "Dog Food",
  "Cat Food", "Aquarium", "Bird Care", "Fiction", "Non-Fiction", "Competitive Exams", "Children Books",
  "Board Games", "Puzzles", "RC Toys", "Educational Toys", "Car Accessories", "Bike Accessories",
  "Engine Oil", "Tyres", "Batteries", "Tools", "Safety", "Prescription", "OTC Medicines",
  "Medical Devices", "Masks", "Sanitizers", "Formal Shoes", "Casual Shoes", "Sports Shoes",
  "Sandals", "Smartwatches", "Analog Watches", "Luxury Watches", "Rings", "Necklaces",
  "Earrings", "Bangles", "Sofas", "Beds", "Mattresses", "Wardrobes", "Study Tables",
];

const STORE_NAMES = [
  "Croma", "Vijay Sales", "Nature's Basket", "Zudio", "Reliance Digital", "Blinkit", "Decathlon",
  "Nykaa", "DMart", "Big Bazaar", "More Megastore", "Spencer's", "Westside", "Pantaloons",
  "Lifestyle", "Shoppers Stop", "Central", "Max Fashion", "Fabindia", "IKEA", "Home Centre",
  "Urban Ladder", "Pepperfry", "FirstCry", "Hamleys", "Crossword", "Landmark", "Apollo Pharmacy",
  "MedPlus", "Wellness Forever", "JioMart", "Flipkart Minutes", "Zepto", "Swiggy Instamart",
  "Amazon Fresh", "Star Bazaar", "Easyday", "Vishal Mega Mart", "Brand Factory", "Metro Cash",
  "Sangeetha Mobiles", "Poorvika", "Sangeetha", "Univercell", "Chroma", "Samsung Store",
  "Apple Premium Reseller", "Mi Store", "OnePlus Experience", "Boat Lifestyle", "Lenskart",
  "Titan Eye+", "Tanishq", "Kalyan Jewellers", "Malabar Gold", "CaratLane",
];

const CITIES = ["Bandra", "Andheri", "Khar", "Powai", "Juhu", "Worli", "Lower Parel", "Colaba", "Malad", "Goregaon"];

const PRODUCT_TEMPLATES: Record<string, string[]> = {
  Grocery: ["Organic Basmati Rice 5kg", "Cold Press Mustard Oil 1L", "Amul Butter 500g", "Tata Salt 1kg", "Fortune Sunflower Oil 5L", "Britannia Bread", "Fresh Farm Eggs (12)", "Organic Honey 500g", "Kellogg's Corn Flakes", "Maggi Noodles 12-pack", "Tata Tea Premium 500g", "Nescafe Classic 200g", "Parle-G Biscuits Family Pack", "Fresh Paneer 200g", "Organic Turmeric Powder", "Aashirvaad Atta 10kg", "Real Fruit Juice 1L", "Bisleri Water 12L", "Fresh Spinach Bundle", "Cherry Tomatoes 500g"],
  Electronics: ["Sony WH-1000XM5 Headphones", "Bose QuietComfort Ultra", "JBL Flip 6 Speaker", "Samsung 55\" QLED TV", "LG 7kg Washing Machine", "Philips Air Fryer XL", "Dyson V12 Detect", "Canon EOS R50 Camera", "GoPro Hero 12", "Apple AirPods Pro 2", "Samsung Galaxy Buds2 Pro", "Logitech MX Master 3S", "HP Pavilion Laptop", "Lenovo IdeaPad Slim 5", "Asus ROG Strix Monitor", "Amazon Echo Dot 5th Gen", "Google Nest Hub", "Philips Trimmer Series 5000", "Braun Electric Shaver", "Mi Robot Vacuum"],
  Beauty: ["Lakme Absolute Foundation", "Maybelline Fit Me Concealer", "MAC Ruby Woo Lipstick", "The Ordinary Niacinamide", "Cetaphil Gentle Cleanser", "Neutrogena Sunscreen SPF 50", "L'Oreal Paris Shampoo 1L", "Dove Deep Moisture Body Wash", "Forest Essentials Face Cream", "Plum Green Tea Toner", "Biotique Face Pack", "Himalaya Purifying Neem Wash", "Nivea Soft Moisturizing Cream", "Gillette Fusion Razor", "Philips Hair Dryer", "Wella Hair Color Kit", "Schwarzkopf Hair Serum", "Colorbar Nail Polish Set", "Nykaa Matte Lipstick", "Minimalist Retinol Serum"],
  Fashion: ["Allen Solly Formal Shirt", "Levi's 501 Original Jeans", "H&M Cotton T-Shirt", "Zara Linen Blazer", "Peter England Trousers", "Van Heusen Polo Shirt", "Roadster Denim Jacket", "Biba Anarkali Kurta", "Fabindia Cotton Kurta", "Manyavar Sherwani", "Puma Running Shorts", "Nike Dri-FIT T-Shirt", "Adidas Track Pants", "Reebok Training Shoes", "Woodland Leather Belt", "Fossil Leather Wallet", "Ray-Ban Aviator Sunglasses", "Hidesign Leather Bag", "Caprese Sling Bag", "Lavie Handbag"],
  Mobiles: ["Apple iPhone 15 Pro 128GB", "Samsung Galaxy S24 Ultra", "OnePlus 12R 256GB", "Google Pixel 8 Pro", "Xiaomi 14 Ultra", "Realme GT 6", "Vivo X100 Pro", "Oppo Find X7", "Nothing Phone 2a", "Motorola Edge 50 Pro", "Redmi Note 13 Pro+", "Samsung Galaxy A55", "iPhone 14 128GB", "Samsung Galaxy Z Flip 5", "OnePlus Nord CE 4", "Poco F6 Pro", "Asus ROG Phone 8", "iQOO 12 Legend", "Honor Magic 6 Pro", "Nokia G42 5G"],
  Fitness: ["Decathlon Yoga Mat 6mm", "Boldfit Resistance Bands", "Strauss Adjustable Dumbbells", "Cult.fit Gym Bag", "Nike Training Gloves", "Adidas Yoga Block Set", "Fitbit Charge 6", "Garmin Forerunner 265", "Protein Powder 1kg", "Creatine Monohydrate 250g", "Skipping Rope Pro", "Foam Roller Medium", "Pull Up Bar Door Mount", "Exercise Bike Compact", "Treadmill Foldable", "Kettlebell 8kg", "Battle Rope 9m", "Punching Bag 4ft", "Swimming Goggles Pro", "Cycling Helmet MIPS"],
  Appliances: ["Samsung 324L Refrigerator", "LG 1.5 Ton AC", "Whirlpool Microwave 30L", "Prestige Pressure Cooker 5L", "Philips Mixer Grinder", "Bajaj Immersion Rod", "Havells Ceiling Fan", "Crompton Table Fan", "Kent RO Water Purifier", "Eureka Forbes Vacuum", "IFB Washing Machine 8kg", "Godrej Air Cooler", "Morphy Richards Toaster", "Borosil Glass Set", "Milton Thermosteel Flask", "Pigeon Induction Cooktop", "Usha Room Heater", "Orient Electric Kettle", "Voltas Air Purifier", "Blue Star Water Dispenser"],
};

const BADGES = ["Buy 1 Get 1", "Low Stock", "Lowest in 30 days", "Flash"] as const;
const DELIVERIES = ["Same-day", "Next day", "2 days", "10 min", "20 min", "In-store", "Local pickup"];

const REVIEW_TEXTS = [
  "Excellent product, exactly as described. Fast delivery too!",
  "Great value for money. Would definitely recommend.",
  "Good quality but packaging could be better.",
  "Amazing deal! Saved a lot compared to other stores.",
  "Product works perfectly. Very satisfied with purchase.",
  "Decent product for the price point.",
  "Exceeded my expectations. Will buy again.",
  "Average experience. Product is okay.",
  "Best purchase this month. Love it!",
  "Quick delivery and genuine product.",
  "Not bad, but expected slightly better quality.",
  "Perfect for daily use. Highly recommended.",
  "Good build quality and timely delivery.",
  "Fair price. Happy with the purchase.",
  "Outstanding! Five stars from me.",
];

const FIRST_NAMES = ["Aanya", "Arjun", "Priya", "Rohan", "Kavya", "Vikram", "Neha", "Aditya", "Isha", "Karan", "Meera", "Sanjay", "Divya", "Rahul", "Ananya", "Dev", "Pooja", "Nikhil", "Sneha", "Amit"];
const LAST_NAMES = ["Sharma", "Patel", "Reddy", "Iyer", "Singh", "Gupta", "Nair", "Joshi", "Mehta", "Kumar", "Desai", "Rao", "Malhotra", "Kapoor", "Verma", "Agarwal", "Chopra", "Bose", "Menon", "Pillai"];

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  store: string;
  storeId: string;
  price: number;
  mrp: number;
  image: string;
  images: string[];
  dealScore: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  badge?: (typeof BADGES)[number];
  delivery?: string;
  description: string;
};

export type Store = {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  rating: number;
  dealCount: number;
  city: string;
  delivery: boolean;
  pickup: boolean;
  logo: string;
  address: string;
  lat: number;
  lng: number;
  reviewCount: number;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  count: number;
};

export type Review = {
  id: string;
  productId: string;
  storeId?: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
};

export type Deal = {
  id: string;
  title: string;
  type: "best" | "flash" | "limited";
  productId: string;
  storeId: string;
  discount: number;
  expiresAt: string;
  lat: number;
  lng: number;
  stockRemaining: number;
  popularity: number;
};

export type MockUser = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: "user" | "admin";
  avatar?: string;
  joinedAt: string;
};

export type OrderStatus = "Placed" | "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  userId: string;
  store: string;
  storeId: string;
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  paymentMethod: string;
  address: string;
  deliveryType: "delivery" | "pickup";
};

export type Notification = {
  id: string;
  userId: string;
  type: "price_drop" | "order" | "ai" | "deal" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

function storeLogo(name: string, color: string): string {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="12" fill="${color}"/><text x="40" y="48" text-anchor="middle" fill="white" font-size="24" font-family="Inter,sans-serif" font-weight="600">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const COLORS = ["#1e3a5f", "#2d6a4f", "#7b2d8e", "#c1121f", "#e85d04", "#0077b6", "#6a0572", "#40916c", "#bc4749", "#3d405b"];

function generateAll() {
  const rand = createSeededRandom(42);

  const categories: Category[] = CATEGORY_DEFS.map((c) => ({
    ...c,
    count: 0,
  }));

  for (let i = 0; i < EXTRA_CATEGORIES.length; i++) {
    categories.push({
      id: `cat-${i + 21}`,
      name: EXTRA_CATEGORIES[i],
      emoji: pick(rand, ["📦", "🏷️", "✨", "🛍️", "💫"]),
      count: 0,
    });
  }
  while (categories.length < 150) {
    const n = categories.length + 1;
    categories.push({
      id: `cat-gen-${n}`,
      name: `Specialty ${n}`,
      emoji: pick(rand, ["📦", "🏷️", "✨", "🛍️", "💫", "🔖"]),
      count: 0,
    });
  }

  const stores: Store[] = [];
  for (let i = 0; i < 150; i++) {
    const name = STORE_NAMES[i % STORE_NAMES.length] + (i >= STORE_NAMES.length ? ` ${Math.floor(i / STORE_NAMES.length) + 1}` : "");
    const cat = pick(rand, categories);
    stores.push({
      id: `s${i + 1}`,
      name,
      category: cat.name,
      distanceKm: Math.round((rand() * 8 + 0.2) * 10) / 10,
      rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
      dealCount: randInt(rand, 20, 500),
      city: pick(rand, CITIES),
      delivery: rand() > 0.15,
      pickup: rand() > 0.2,
      logo: storeLogo(name, pick(rand, COLORS) ),
      address: `${randInt(rand, 1, 200)}, ${pick(rand, ["Hill Road", "Linking Road", "SV Road", "LBS Marg", "Western Express Hwy"])}, ${pick(rand, CITIES)}, Mumbai`,
      lat: 19.05 + rand() * 0.08,
      lng: 72.82 + rand() * 0.1,
      reviewCount: randInt(rand, 50, 5000),
    });
  }

  const products: Product[] = [];
  for (let i = 0; i < 1500; i++) {
    const cat = pick(rand, categories);
    const store = pick(rand, stores);
    const templates = PRODUCT_TEMPLATES[cat.name] ?? PRODUCT_TEMPLATES[pick(rand, Object.keys(PRODUCT_TEMPLATES))];
    const baseName = templates ? pick(rand, templates) : `${cat.name} Product ${i + 1}`;
    const variant = rand() > 0.7 ? ` ${pick(rand, ["Pro", "Plus", "Max", "Lite", "Ultra", "2024", "Premium"])}` : "";
    const name = baseName + variant;
    const mrp = randInt(rand, 199, 150000);
    const discount = randInt(rand, 5, 45);
    const price = Math.round(mrp * (1 - discount / 100));
    const img = productImage(i, name, cat.id, cat.name);
    const p: Product = {
      id: `p${i + 1}`,
      name,
      category: cat.name,
      categoryId: cat.id,
      store: store.name,
      storeId: store.id,
      price,
      mrp,
      image: img,
      images: [img, productImage(i + 1, name, cat.id, cat.name), productImage(i + 2, name, cat.id, cat.name)],
      dealScore: Math.round((6 + rand() * 4) * 10) / 10,
      distanceKm: store.distanceKm,
      rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
      reviews: randInt(rand, 10, 5000),
      delivery: pick(rand, DELIVERIES),
      description: `${name} — premium quality ${cat.name.toLowerCase()} product available at ${store.name}. Rated ${Math.round((3.5 + rand() * 1.5) * 10) / 10} stars by Smart Deal shoppers.`,
    };
    if (rand() > 0.6) p.badge = pick(rand, [...BADGES]);
    products.push(p);
    cat.count++;
  }

  const reviews: Review[] = [];
  for (let i = 0; i < 10000; i++) {
    const product = pick(rand, products);
    const fn = pick(rand, FIRST_NAMES);
    const ln = pick(rand, LAST_NAMES);
    reviews.push({
      id: `r${i + 1}`,
      productId: product.id,
      storeId: product.storeId,
      userId: `u${randInt(rand, 1, 200)}`,
      userName: `${fn} ${ln.charAt(0)}.`,
      rating: randInt(rand, 3, 5),
      text: pick(rand, REVIEW_TEXTS),
      date: new Date(Date.now() - randInt(rand, 1, 365) * 86400000).toISOString(),
    });
  }

  const deals: Deal[] = [];
  for (let i = 0; i < 1000; i++) {
    const product = pick(rand, products);
    const store = stores.find((s) => s.id === product.storeId) ?? pick(rand, stores);
    deals.push({
      id: `d${i + 1}`,
      title: `${product.name.slice(0, 40)} — ${randInt(rand, 10, 50)}% OFF`,
      type: pick(rand, ["best", "flash", "limited"] as const),
      productId: product.id,
      storeId: store.id,
      discount: randInt(rand, 10, 60),
      expiresAt: new Date(Date.now() + randInt(rand, 1, 72) * 3600000).toISOString(),
      lat: store.lat + (rand() - 0.5) * 0.01,
      lng: store.lng + (rand() - 0.5) * 0.01,
      stockRemaining: randInt(rand, 3, 250),
      popularity: randInt(rand, 10, 100),
    });
  }

  const users: MockUser[] = [];
  for (let i = 0; i < 500; i++) {
    const fn = pick(rand, FIRST_NAMES);
    const ln = pick(rand, LAST_NAMES);
    users.push({
      id: `u${i + 1}`,
      fullName: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@email.com`,
      mobile: `+91 ${randInt(rand, 70000, 99999)} ${randInt(rand, 10000, 99999)}`,
      role: "user",
      joinedAt: new Date(Date.now() - randInt(rand, 30, 1000) * 86400000).toISOString(),
    });
  }

  const orderStatuses: OrderStatus[] = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const orders: Order[] = [];
  for (let i = 0; i < 500; i++) {
    const user = pick(rand, users);
    const store = pick(rand, stores);
    const itemCount = randInt(rand, 1, 4);
    const items = pickN(rand, products, itemCount).map((p) => ({
      productId: p.id,
      name: p.name,
      qty: randInt(rand, 1, 3),
      price: p.price,
      image: p.image,
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const delivery = subtotal > 999 ? 0 : 49;
    const discount = Math.round(subtotal * (rand() * 0.1));
    const status = pick(rand, orderStatuses);
    orders.push({
      id: `SD-${10000 + i}`,
      userId: user.id,
      store: store.name,
      storeId: store.id,
      items,
      subtotal,
      delivery,
      discount,
      total: subtotal + delivery - discount,
      status,
      placedAt: new Date(Date.now() - randInt(rand, 1, 60) * 86400000).toISOString(),
      paymentMethod: pick(rand, ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Cash On Delivery"]),
      address: `${randInt(rand, 1, 200)}, Hill Road, Bandra West, Mumbai 400050`,
      deliveryType: rand() > 0.3 ? "delivery" : "pickup",
    });
  }

  const notifications: Notification[] = [];
  const notifTypes: Notification["type"][] = ["price_drop", "order", "ai", "deal", "system"];
  for (let i = 0; i < 200; i++) {
    const user = pick(rand, users);
    const type = pick(rand, notifTypes);
    const product = pick(rand, products);
    const titles: Record<Notification["type"], string> = {
      price_drop: `Price drop on ${product.name.slice(0, 30)}`,
      order: `Order update — ${pick(rand, orders).id}`,
      ai: "AI recommendation ready",
      deal: `Flash deal near you — ${product.name.slice(0, 25)}`,
      system: "Smart Deal system update",
    };
    notifications.push({
      id: `n${i + 1}`,
      userId: user.id,
      type,
      title: titles[type],
      body: type === "price_drop" ? `Save ₹${randInt(rand, 200, 5000)} at ${product.store}` : pick(rand, REVIEW_TEXTS),
      read: rand() > 0.5,
      createdAt: new Date(Date.now() - randInt(rand, 1, 168) * 3600000).toISOString(),
    });
  }

  return { categories, stores, products, reviews, deals, users, orders, notifications };
}

const DATA = generateAll();

export const categories: Category[] = DATA.categories;
export const stores: Store[] = DATA.stores;
export const products: Product[] = DATA.products;
export const reviews: Review[] = DATA.reviews;
export const deals: Deal[] = DATA.deals;
export const mockUsers: MockUser[] = DATA.users;
export const seedOrders: Order[] = DATA.orders;
export const seedNotifications: Notification[] = DATA.notifications;

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
export const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getStoreById(id: string) {
  return stores.find((s) => s.id === id);
}

export function getProductsByStore(storeId: string) {
  return products.filter((p) => p.storeId === storeId);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function getReviewsForStore(storeId: string) {
  return reviews.filter((r) => r.storeId === storeId);
}

export function getDealsForStore(storeId: string) {
  return deals.filter((d) => d.storeId === storeId);
}

export function getAlternatePrices(productId: string): Record<string, number> {
  const product = getProductById(productId);
  if (!product) return {};
  const out: Record<string, number> = {};
  const otherStores = stores.filter((s) => s.id !== product.storeId).slice(0, 5);
  let seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  for (const s of otherStores) {
    seed = (seed * 16807) % 2147483647;
    const variance = (seed % 1600) - 400;
    out[s.id] = Math.max(product.price * 0.85, product.price + variance);
  }
  return out;
}

export const COUPONS: Record<string, { discount: number; type: "percent" | "flat"; minOrder: number }> = {
  SMART10: { discount: 10, type: "percent", minOrder: 500 },
  SAVE500: { discount: 500, type: "flat", minOrder: 2000 },
  WELCOME: { discount: 15, type: "percent", minOrder: 999 },
  FLASH25: { discount: 25, type: "percent", minOrder: 1500 },
};
