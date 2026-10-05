export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  aboutStory: string;
  category: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  locality: string;
  governorate: string;
  priceRange: string;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  googleMapsUrl: string;
  googleReviewUrl?: string;
  heroImage: string;
  deliveryFee: number;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string; // e.g. "الأكثر طلباً", "جديد", "توقيع الزعيم"
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'all' | 'food' | 'restaurant' | 'atmosphere' | 'owner';
  imageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  content: string;
  status: 'approved' | 'pending' | 'hidden';
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// --- Cart & Ordering System Types ---
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
}

export type OrderType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'cod' | 'pay_at_restaurant';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface CustomerAddress {
  id: string;
  area: string;
  street: string;
  building?: string;
  details?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  addresses: CustomerAddress[];
  ordersCount: number;
  totalSpent: number;
  lastOrder?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ZAEEM-1001
  customerId?: string;
  customerName: string;
  phone: string;
  address: string;
  area?: string;
  streetBuilding?: string;
  orderType: OrderType;
  tableNumber?: string | number;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantTable {
  id: string;
  tableNumber: string | number;
  title: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image?: string;
  oldPrice: number;
  newPrice: number;
  startDate: string;
  endDate: string;
  active: boolean;
  products?: string[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export type PageView =
  | 'home'
  | 'menu'
  | 'gallery'
  | 'reviews'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'track-order'
  | 'order-confirmation'
  | 'admin-login'
  | 'admin-dashboard';
