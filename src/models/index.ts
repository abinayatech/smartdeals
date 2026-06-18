export type {
  Product,
  Store,
  Category,
  Review,
  Deal,
  MockUser,
  Order,
  OrderStatus,
  Notification,
} from "@/lib/data-generator";

export type PricePoint = { date: string; price: number };

export type UserActivity = {
  recentlyViewedProducts: string[];
  recentlyViewedStores: string[];
  recentlyCompared: string[];
  searchHistory: { query: string; at: string; filters?: Record<string, string> }[];
  recentOrders: string[];
  favoriteCategories: string[];
};

export type WishlistCollection = {
  id: string;
  name: string;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type SavedSearch = {
  id: string;
  name: string;
  query: string;
  filters: Record<string, string>;
  createdAt: string;
};

export type AchievementId =
  | "deal-hunter"
  | "budget-master"
  | "savings-champion"
  | "smart-shopper"
  | "loyalty-expert"
  | "planner-expert";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
};

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type StoredAccount = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role: "user" | "admin" | "dealer";
  storeId?: string;
  avatar?: string;
  joinedAt: string;
};

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  role: "user" | "admin" | "dealer";
  storeId?: string;
  avatar?: string;
};

export type CustomerReview = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  images: string[];
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReviewAnalytics = {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  verifiedCount: number;
};

export type ProductAnswer = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isDealer: boolean;
  createdAt: string;
};

export type ProductQuestion = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  createdAt: string;
  answers: ProductAnswer[];
};

export type InventoryRecord = {
  productId: string;
  storeId: string;
  stockAvailable: number;
  stockSold: number;
  reservedStock: number;
  returnedStock: number;
};

export type BudgetPlanResult = {
  id: "cheapest" | "fastest" | "balanced";
  title: string;
  cost: number;
  savings: number;
  distanceKm: number;
  storeCount: number;
  timeEstimate: string;
  productIds: string[];
  stores: string[];
};

export type LoyaltyProfile = {
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  badges: string[];
  milestones: { id: string; title: string; target: number; progress: number; unlockedAt?: string }[];
  rewards: { id: string; title: string; pointsCost: number; redeemed: boolean }[];
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  productName: string;
  reason: string;
  status: "Requested" | "Approved" | "Rejected" | "Refunded";
  requestedAt: string;
  updatedAt: string;
};

export type DealerAnalytics = {
  revenue: number;
  orders: number;
  productsSold: number;
  bestProduct: string;
  storePerformance: { storeName: string; revenue: number; orders: number; rating: number };
};

export type ShoppingInsights = {
  monthlySpending: number;
  monthlySavings: number;
  favoriteStore: string;
  favoriteCategory: string;
  mostPurchasedCategory: string;
  purchaseFrequency: number;
  totalOrders: number;
  totalSavings: number;
  dealSuccessRate: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
};
