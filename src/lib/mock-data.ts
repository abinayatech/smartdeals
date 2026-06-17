import headphones from "@/assets/product-headphones.jpg";
import blender from "@/assets/product-blender.jpg";
import avocado from "@/assets/product-avocado.jpg";
import sneaker from "@/assets/product-sneaker.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  store: string;
  storeId: string;
  price: number;
  mrp: number;
  image: string;
  dealScore: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  badge?: "Buy 1 Get 1" | "Low Stock" | "Lowest in 30 days" | "Flash";
  delivery?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "QuietComfort Ultra Headphones",
    category: "Electronics",
    store: "Croma",
    storeId: "s1",
    price: 24999,
    mrp: 35900,
    image: headphones,
    dealScore: 9.8,
    distanceKm: 2.4,
    rating: 4.7,
    reviews: 1284,
    badge: "Flash",
    delivery: "Same-day",
  },
  {
    id: "p2",
    name: "Ninja Professional Plus Blender",
    category: "Appliances",
    store: "Vijay Sales",
    storeId: "s2",
    price: 12499,
    mrp: 14999,
    image: blender,
    dealScore: 8.4,
    distanceKm: 1.1,
    rating: 4.5,
    reviews: 642,
    delivery: "Local pickup",
  },
  {
    id: "p3",
    name: "Organic Hass Avocado (Pack of 4)",
    category: "Grocery",
    store: "Nature's Basket",
    storeId: "s3",
    price: 499,
    mrp: 998,
    image: avocado,
    dealScore: 9.1,
    distanceKm: 0.8,
    rating: 4.6,
    reviews: 312,
    badge: "Buy 1 Get 1",
    delivery: "20 min",
  },
  {
    id: "p4",
    name: "Classic Court Sneaker",
    category: "Fashion",
    store: "Zudio",
    storeId: "s4",
    price: 1999,
    mrp: 3499,
    image: sneaker,
    dealScore: 7.9,
    distanceKm: 1.1,
    rating: 4.3,
    reviews: 856,
    badge: "Low Stock",
    delivery: "In-store",
  },
  {
    id: "p5",
    name: "Apple iPhone 15 Pro (128GB)",
    category: "Mobiles",
    store: "Reliance Digital",
    storeId: "s5",
    price: 124900,
    mrp: 134900,
    image: headphones,
    dealScore: 8.6,
    distanceKm: 0.8,
    rating: 4.8,
    reviews: 4210,
    badge: "Lowest in 30 days",
    delivery: "Same-day",
  },
  {
    id: "p6",
    name: "Cold Press Olive Oil 1L",
    category: "Grocery",
    store: "Blinkit",
    storeId: "s6",
    price: 749,
    mrp: 1099,
    image: avocado,
    dealScore: 8.9,
    distanceKm: 0.3,
    rating: 4.4,
    reviews: 198,
    delivery: "10 min",
  },
  {
    id: "p7",
    name: "Premium Yoga Mat 6mm",
    category: "Fitness",
    store: "Decathlon",
    storeId: "s7",
    price: 1299,
    mrp: 1899,
    image: sneaker,
    dealScore: 7.6,
    distanceKm: 3.2,
    rating: 4.5,
    reviews: 422,
    delivery: "Next day",
  },
  {
    id: "p8",
    name: "Korean Beauty Serum 30ml",
    category: "Beauty",
    store: "Nykaa",
    storeId: "s8",
    price: 1849,
    mrp: 2499,
    image: blender,
    dealScore: 8.2,
    distanceKm: 2.0,
    rating: 4.6,
    reviews: 1024,
    delivery: "2 days",
  },
];

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
};

export const stores: Store[] = [
  { id: "s1", name: "Croma", category: "Electronics", distanceKm: 2.4, rating: 4.5, dealCount: 142, city: "Bandra", delivery: true, pickup: true },
  { id: "s2", name: "Vijay Sales", category: "Appliances", distanceKm: 1.1, rating: 4.3, dealCount: 98, city: "Andheri", delivery: true, pickup: true },
  { id: "s3", name: "Nature's Basket", category: "Grocery", distanceKm: 0.8, rating: 4.7, dealCount: 64, city: "Khar", delivery: true, pickup: true },
  { id: "s4", name: "Zudio", category: "Fashion", distanceKm: 1.1, rating: 4.2, dealCount: 213, city: "Bandra", delivery: false, pickup: true },
  { id: "s5", name: "Reliance Digital", category: "Mobiles", distanceKm: 0.8, rating: 4.4, dealCount: 87, city: "Bandra", delivery: true, pickup: true },
  { id: "s6", name: "Blinkit", category: "Grocery", distanceKm: 0.3, rating: 4.6, dealCount: 312, city: "Khar", delivery: true, pickup: false },
  { id: "s7", name: "Decathlon", category: "Fitness", distanceKm: 3.2, rating: 4.5, dealCount: 154, city: "Powai", delivery: true, pickup: true },
  { id: "s8", name: "Nykaa", category: "Beauty", distanceKm: 2.0, rating: 4.6, dealCount: 421, city: "Bandra", delivery: true, pickup: false },
];

export const categories = [
  { id: "grocery", name: "Grocery", emoji: "🥬", count: 1240 },
  { id: "electronics", name: "Electronics", emoji: "🎧", count: 894 },
  { id: "beauty", name: "Beauty", emoji: "💄", count: 612 },
  { id: "fashion", name: "Fashion", emoji: "👟", count: 1801 },
  { id: "mobiles", name: "Mobiles", emoji: "📱", count: 332 },
  { id: "fitness", name: "Fitness", emoji: "🏋️", count: 287 },
  { id: "stationery", name: "Stationery", emoji: "✏️", count: 198 },
  { id: "art-craft", name: "Art & Craft", emoji: "🎨", count: 142 },
];

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export const discountPct = (price: number, mrp: number) =>
  Math.round(((mrp - price) / mrp) * 100);