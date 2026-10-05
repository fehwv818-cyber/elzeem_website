import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  EyeOff,
  LogOut,
  RotateCcw,
  Star,
  Check,
  X,
  Phone,
  Layers,
  Sparkles,
  Save,
  ShoppingBag,
  Users,
  QrCode,
  Tag,
  Percent,
  Bell,
  Grid,
} from 'lucide-react';
import {
  RestaurantSettings,
  MenuCategory,
  MenuItem,
  GalleryImage,
  Review,
  ContactMessage,
  PageView,
} from '../types';
import { db, IMAGES } from '../services/db';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminQRCodesTab } from '../components/admin/AdminQRCodesTab';
import { AdminTablesTab } from '../components/admin/AdminTablesTab';
import { AdminCouponsTab } from '../components/admin/AdminCouponsTab';
import { AdminOffersTab } from '../components/admin/AdminOffersTab';

interface AdminDashboardPageProps {
  settings: RestaurantSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  galleryImages: GalleryImage[];
  reviews: Review[];
  messages: ContactMessage[];
  onLogout: () => void;
  onNavigate: (view: PageView) => void;
  onRefreshData: () => void;
}

type AdminTab =
  | 'overview'
  | 'orders'
  | 'customers'
  | 'menu'
  | 'categories'
  | 'coupons'
  | 'offers'
  | 'qr'
  | 'tables'
  | 'gallery'
  | 'reviews'
  | 'messages'
  | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  settings,
  categories,
  menuItems,
  galleryImages,
  reviews,
  messages,
  onLogout,
  onNavigate,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Menu Modal State
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    categoryId: 'falafel',
    price: 6,
    image: IMAGES.taameya,
    badge: '',
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
  });

  // Category Modal State
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '', sortOrder: 1 });

  // Gallery Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'food' as 'food' | 'restaurant' | 'atmosphere' | 'owner',
    imageUrl: IMAGES.hero,
    isFeatured: false,
    sortOrder: 1,
  });

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<RestaurantSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Live Data for Orders, Customers, Tables, Coupons, Offers
  const orders = db.getOrders();
  const customers = db.getCustomers();
  const tables = db.getTables();
  const coupons = db.getCoupons();
  const offers = db.getOffers();
  const newOrders = orders.filter((o) => o.status === 'new');
  const newOrdersCount = newOrders.length;
  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);

  // Stats
  const availableCount = menuItems.filter((i) => i.isAvailable).length;
  const unavailableCount = menuItems.length - availableCount;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  // --- Handlers for Menu Items ---
  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setMenuForm({
      name: '',
      description: '',
      categoryId: categories[1]?.id || 'falafel',
      price: 6,
      image: IMAGES.taameya,
      badge: '',
      isAvailable: true,
      isFeatured: false,
      sortOrder: menuItems.length + 1,
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      price: item.price,
      image: item.image,
      badge: item.badge || '',
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder,
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMenuItem) {
      db.saveMenuItem({
        id: editingMenuItem.id,
        ...menuForm,
      });
    } else {
      db.saveMenuItem(menuForm);
    }
    setIsMenuModalOpen(false);
    onRefreshData();
  };

  const handleDeleteMenu = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبق نهائياً؟')) {
      db.deleteMenuItem(id);
      onRefreshData();
    }
  };

  // --- Handlers for Categories ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', slug: '', sortOrder: categories.length });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCatForm({ name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      db.saveCategory({ id: editingCategory.id, ...catForm });
    } else {
      db.saveCategory({ ...catForm, slug: catForm.slug || 'cat_' + Date.now() });
    }
    setIsCategoryModalOpen(false);
    onRefreshData();
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      alert('لا يمكن حذف قسم "الكل" الأساسي');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      db.deleteCategory(id);
      onRefreshData();
    }
  };

  // --- Handlers for Gallery ---
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveGalleryImage(galleryForm);
    setIsGalleryModalOpen(false);
    onRefreshData();
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      db.deleteGalleryImage(id);
      onRefreshData();
    }
  };

  // --- Handlers for Reviews ---
  const handleReviewStatus = (id: string, status: 'approved' | 'hidden' | 'pending') => {
    db.updateReviewStatus(id, status);
    onRefreshData();
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
      db.deleteReview(id);
      onRefreshData();
    }
  };

  // --- Handlers for Messages ---
  const handleToggleMessageRead = (id: string, current: boolean) => {
    db.markMessageRead(id, !current);
    onRefreshData();
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('هل تريد حذف هذه الرسالة؟')) {
      db.deleteMessage(id);
      onRefreshData();
    }
  };

  // --- Handlers for Settings ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    onRefreshData();
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'تحذير: هل أنت متأكد من استعادة كافة بيانات المطعم والمنيو والمراجعات إلى الضبط الأولي الأصلي؟'
      )
    ) {
      db.resetToDefaults();
      onRefreshData();
      alert('تمت استعادة البيانات الأصلية بنجاح!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right">
        <div>
          <span className="text-xs font-bold text-amber-400">لوحة التحكم الإدارية</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            إدارة {settings.name}
          </h1>
          <p className="text-xs text-neutral-400">
            تحكم كامل في الأطباق، الصور، الرسائل، والمراجعات بسهولة وفورية
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
          >
            مشاهدة الموقع
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* New Order Notification Banner */}
      {newOrdersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20 text-right"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold animate-pulse shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                <span>طلب جديد وصل الآن!</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {newOrdersCount} جديد
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5">
                رقم الطلب: <span className="font-bold text-white font-mono">{newOrders[0]?.orderNumber}</span> · العميل: <span className="font-bold text-white">{newOrders[0]?.customerName}</span> ({newOrders[0]?.phone}) · الإجمالي: <span className="font-bold text-white">{newOrders[0]?.total} ج.م</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs shadow-md transition-colors cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>عرض الطلبات الآن</span>
          </button>
        </motion.div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-[#13161d] rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظرة عامة</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>الطلبات ({orders.length})</span>
            {newOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] animate-pulse">
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>العملاء ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>الأطباق والمنيو ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الأقسام ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>الكوبونات ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>العروض ({offers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>باركود QR</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>ترابيزات الصالة ({tables.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>الصور ({galleryImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>المراجعات</span>
            {pendingReviewsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">
                {pendingReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>الرسائل</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إعدادات المطعم</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {/* TAB CONTENT: 1. OVERVIEW */}
          {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Orders Stat */}
            <div
              onClick={() => setActiveTab('orders')}
              className="bg-[#141820] hover:bg-[#181d27] border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 text-right space-y-1 cursor-pointer transition-all"
            >
              <span className="text-xs text-neutral-400">إجمالي الطلبات</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                {orders.length}
              </div>
              <div className="text-[11px] text-emerald-400 tabular-nums font-bold">
                {newOrdersCount > 0 ? `${newOrdersCount} طلب جديد` : 'مستقرة'}
              </div>
            </div>

            {/* Sales Stat */}
            <div className="bg-[#141820] border border-neutral-800 rounded-xl p-4 sm:p-5 text-right space-y-1">
              <span className="text-xs text-neutral-400">إجمالي المبيعات</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {totalRevenue} <span className="text-xs font-normal text-neutral-400">ج.م</span>
              </div>
              <div className="text-[11px] text-amber-400">الطلبات المكتملة والمؤكدة</div>
            </div>

            {/* Customers Stat */}
            <div
              onClick={() => setActiveTab('customers')}
              className="bg-[#141820] hover:bg-[#181d27] border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 text-right space-y-1 cursor-pointer transition-all"
            >
              <span className="text-xs text-neutral-400">قاعدة العملاء</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {customers.length}
              </div>
              <div className="text-[11px] text-neutral-400">عميل مسجل بالسجل</div>
            </div>

            {/* Menu Items Stat */}
            <div
              onClick={() => setActiveTab('menu')}
              className="bg-[#141820] hover:bg-[#181d27] border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 text-right space-y-1 cursor-pointer transition-all"
            >
              <span className="text-xs text-neutral-400">أطباق المنيو</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {menuItems.length}
              </div>
              <div className="text-[11px] text-emerald-400 tabular-nums">
                {availableCount} متاح · {unavailableCount} غير متوفر
              </div>
            </div>

            {/* Reviews Stat */}
            <div
              onClick={() => setActiveTab('reviews')}
              className="bg-[#141820] hover:bg-[#181d27] border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 text-right space-y-1 cursor-pointer transition-all"
            >
              <span className="text-xs text-neutral-400">المراجعات</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {reviews.length}
              </div>
              <div className="text-[11px] text-neutral-400 tabular-nums">
                {pendingReviewsCount > 0 ? (
                  <span className="text-red-400 font-bold">{pendingReviewsCount} معلق يتطلب الموافقة</span>
                ) : (
                  'جميعها مراجعة'
                )}
              </div>
            </div>

            {/* Messages Stat */}
            <div
              onClick={() => setActiveTab('messages')}
              className="bg-[#141820] hover:bg-[#181d27] border border-neutral-800 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 text-right space-y-1 cursor-pointer transition-all"
            >
              <span className="text-xs text-neutral-400">رسائل العملاء</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {messages.length}
              </div>
              <div className="text-[11px] text-neutral-400 tabular-nums">
                {unreadMessagesCount > 0 ? (
                  <span className="text-amber-400 font-bold">{unreadMessagesCount} رسالة جديدة</span>
                ) : (
                  'مقروءة بالكامل'
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-4">
            <h3 className="font-bold text-white text-base">إجراءات سريعة</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إدارة ومتابعة الطلبات ({orders.length})</span>
              </button>

              <button
                onClick={handleOpenAddMenu}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طبق جديد للمنيو</span>
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>باركود QR للترابيزات والمنيو</span>
              </button>

              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صورة للمعرض</span>
              </button>

              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم منيو جديد</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة البيانات الأصلية</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. MENU ITEMS CRUD */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white text-right">إدارة أطباق المنيو</h2>
            <button
              onClick={handleOpenAddMenu}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طبق جديد</span>
            </button>
          </div>

          <div className="bg-[#141820] border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4 font-bold">الطبق</th>
                    <th className="py-3 px-4 font-bold">القسم</th>
                    <th className="py-3 px-4 font-bold">السعر</th>
                    <th className="py-3 px-4 font-bold">الحالة</th>
                    <th className="py-3 px-4 font-bold">مميز</th>
                    <th className="py-3 px-4 font-bold">الشارة</th>
                    <th className="py-3 px-4 font-bold text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {menuItems.map((item) => {
                    const categoryName =
                      categories.find((c) => c.id === item.categoryId)?.name || item.categoryId;
                    return (
                      <tr key={item.id} className="hover:bg-neutral-850/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-white block">{item.name}</span>
                              <span className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-300 font-medium">
                          {categoryName}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-400 tabular-nums">
                          {item.price} ج.م
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              db.toggleItemAvailability(item.id);
                              onRefreshData();
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              item.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {item.isAvailable ? 'متاح' : 'غير متوفر'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              db.toggleItemFeatured(item.id);
                              onRefreshData();
                            }}
                            className={`p-1.5 rounded cursor-pointer ${
                              item.isFeatured
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          {item.badge ? (
                            <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 text-[10px]">
                              {item.badge}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditMenu(item)}
                              className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-md hover:bg-neutral-800 transition-colors"
                              title="تعديل الطبق"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(item.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-400 rounded-md hover:bg-neutral-800 transition-colors"
                              title="حذف الطبق"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white text-right">إدارة أقسام المنيو</h2>
            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          <div className="bg-[#141820] border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between text-right hover:bg-neutral-850/50"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                  <span className="text-[11px] text-neutral-400">معرف: {cat.slug}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {cat.id !== 'all' && (
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white text-right">إدارة صور المعرض</h2>
            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صورة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="bg-[#141820] border border-neutral-800 rounded-xl overflow-hidden text-right flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-neutral-900">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-amber-400 text-[10px] font-bold">
                      {img.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-white text-sm">{img.title}</h3>
                    <p className="text-[11px] text-neutral-400">تاريخ الإضافة: {img.createdAt}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-neutral-800/60 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {img.isFeatured ? '⭐ في المعاينة' : 'في المعرض'}
                  </span>
                  <button
                    onClick={() => handleDeleteGallery(img.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. REVIEWS MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white text-right">إدارة واعتماد المراجعات</h2>
            <span className="text-xs text-neutral-400">
              المراجعات الجديدة تكون معلقة حتى يتم اعتمادها
            </span>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#141820] border border-neutral-800 rounded-xl p-5 text-right flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{rev.authorName}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400">{rev.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rev.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {rev.status === 'approved'
                        ? 'معتمدة'
                        : rev.status === 'pending'
                        ? 'معلقة بانتظار الموافقة'
                        : 'مخفية'}
                    </span>
                  </div>
                  <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed">
                    "{rev.content}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleReviewStatus(rev.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>اعتماد</span>
                    </button>
                  )}

                  {rev.status === 'approved' && (
                    <button
                      onClick={() => handleReviewStatus(rev.id, 'hidden')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 transition-colors"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>إخفاء</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white text-right">رسائل واستفسارات العملاء</h2>
            <span className="text-xs text-neutral-400 tabular-nums">
              {messages.length} رسالة
            </span>
          </div>

          <div className="space-y-3">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-[#141820] border rounded-xl p-5 text-right space-y-3 transition-colors ${
                    msg.isRead ? 'border-neutral-800/80 opacity-80' : 'border-amber-500/40 bg-amber-500/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{msg.name}</span>
                      <a
                        href={`tel:${msg.phone}`}
                        className="text-xs text-amber-400 font-semibold tabular-nums hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{msg.phone}</span>
                      </a>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {new Date(msg.createdAt).toLocaleString('ar-EG')}
                    </span>
                  </div>

                  <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleMessageRead(msg.id, msg.isRead)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                    >
                      {msg.isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-400 text-sm bg-[#141820] rounded-xl border border-neutral-800">
                لا توجد رسائل واردة حالياً
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <AdminOrdersTab orders={orders} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: CUSTOMERS */}
      {activeTab === 'customers' && (
        <AdminCustomersTab customers={customers} orders={orders} />
      )}

      {/* TAB CONTENT: COUPONS */}
      {activeTab === 'coupons' && (
        <AdminCouponsTab coupons={coupons} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: OFFERS */}
      {activeTab === 'offers' && (
        <AdminOffersTab offers={offers} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: QR CODES */}
      {activeTab === 'qr' && (
        <AdminQRCodesTab settings={settings} tables={tables} />
      )}

      {/* TAB CONTENT: TABLES */}
      {activeTab === 'tables' && (
        <AdminTablesTab tables={tables} onRefreshData={onRefreshData} />
      )}

      {/* TAB CONTENT: 7. RESTAURANT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl text-right">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">إعدادات وبيانات المطعم</h2>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>

          {settingsSaved && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>تم حفظ إعدادات المطعم وتحديث كافة الصفحات بنجاح!</span>
            </div>
          )}

          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">اسم المطعم</label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">رقم الهاتف الرسمي</label>
                <input
                  type="text"
                  required
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">الشعار التسويقي (Tagline)</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">العنوان الكامل</label>
              <input
                type="text"
                required
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">ساعات العمل</label>
                <input
                  type="text"
                  value={settingsForm.openingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">متوسط السعر للفرد</label>
                <input
                  type="text"
                  value={settingsForm.priceRange}
                  onChange={(e) => setSettingsForm({ ...settingsForm, priceRange: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">رسوم التوصيل (ج.م)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.deliveryFee ?? 15}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">رابط خرائط Google للاتجاهات</label>
              <input
                type="text"
                value={settingsForm.googleMapsUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">رابط صورة الهيرو الرئيسية</label>
              <input
                type="text"
                value={settingsForm.heroImage}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">قصة المطعم (صفحة عن المطعم)</label>
              <textarea
                rows={4}
                value={settingsForm.aboutStory}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutStory: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">رابط فيسبوك (اختياري)</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  value={settingsForm.facebookUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">رابط انستغرام (اختياري)</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={settingsForm.instagramUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-300">رابط تيك توك (اختياري)</label>
                <input
                  type="text"
                  placeholder="https://tiktok.com/@..."
                  value={settingsForm.tiktokUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-neutral-800">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-md transition-colors"
              >
                حفظ التغييرات
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                استعادة القيم الأصلية الأولية
              </button>
            </div>
          </div>
        </form>
      )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsMenuModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-white mb-4">
              {editingMenuItem ? 'تعديل طبق في المنيو' : 'إضافة طبق جديد'}
            </h2>

            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">اسم الطبق *</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-300">القسم *</label>
                  <select
                    value={menuForm.categoryId}
                    onChange={(e) => setMenuForm({ ...menuForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-300">السعر (ج.م) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">الوصف والمكونات</label>
                <textarea
                  rows={3}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-300">شارة مميزة (Badge)</label>
                  <input
                    type="text"
                    placeholder="مثال: الأكثر طلباً"
                    value={menuForm.badge}
                    onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-300">رابط الصورة</label>
                  <input
                    type="text"
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                  <input
                    type="checkbox"
                    checked={menuForm.isAvailable}
                    onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded bg-neutral-900 border-neutral-700"
                  />
                  <span>متاح للطلب</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                  <input
                    type="checkbox"
                    checked={menuForm.isFeatured}
                    onChange={(e) => setMenuForm({ ...menuForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded bg-neutral-900 border-neutral-700"
                  />
                  <span>مميز في الصفحة الرئيسية</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm transition-colors"
                >
                  حفظ الطبق
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-white mb-4">
              {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">اسم القسم *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ساندوتشات خاصة"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">المعرف اللاتيني (Slug)</label>
                <input
                  type="text"
                  placeholder="مثال: specials"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors"
                >
                  حفظ القسم
                </button>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY IMAGE */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsGalleryModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-white mb-4">إضافة صورة للمعرض</h2>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">عنوان الصورة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تجهيز أطباق الفطور"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">تصنيف الصورة</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) =>
                    setGalleryForm({
                      ...galleryForm,
                      category: e.target.value as 'food' | 'restaurant' | 'atmosphere' | 'owner',
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="food">الأطعمة والمشروبات</option>
                  <option value="restaurant">المطعم</option>
                  <option value="atmosphere">الأجواء</option>
                  <option value="owner">من المالك</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">رابط الصورة (URL)</label>
                <input
                  type="text"
                  required
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featGal"
                  checked={galleryForm.isFeatured}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-amber-500 rounded bg-neutral-900 border-neutral-700"
                />
                <label htmlFor="featGal" className="text-xs font-bold text-neutral-200 cursor-pointer">
                  عرضها في معاينة الصفحة الرئيسية
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors"
                >
                  إضافة الصورة
                </button>
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
