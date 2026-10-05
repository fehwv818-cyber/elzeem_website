import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  PageView,
  MenuItem,
  RestaurantSettings,
  MenuCategory,
  GalleryImage,
  Review,
  ContactMessage,
  CartItem,
  Order,
} from './types';
import { db } from './services/db';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { DishDetailsModal } from './components/DishDetailsModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [settings, setSettings] = useState<RestaurantSettings>(() => db.getSettings());
  const [categories, setCategories] = useState<MenuCategory[]>(() => db.getCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => db.getMenuItems());
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => db.getGalleryImages());
  const [reviews, setReviews] = useState<Review[]>(() => db.getReviews());
  const [messages, setMessages] = useState<ContactMessage[]>(() => db.getMessages());
  const [cart, setCart] = useState<CartItem[]>(() => db.getCart());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => db.isAdminAuthenticated());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackOrderQuery, setTrackOrderQuery] = useState<{ orderNumber: string; phone: string }>({
    orderNumber: '',
    phone: '',
  });

  const refreshData = useCallback(() => {
    setSettings(db.getSettings());
    setCategories(db.getCategories());
    setMenuItems(db.getMenuItems());
    setGalleryImages(db.getGalleryImages());
    setReviews(db.getReviews());
    setMessages(db.getMessages());
    setCart(db.getCart());
    setIsAdmin(db.isAdminAuthenticated());
  }, []);

  // Subscribe to db updates
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  // URL Hash routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      const validViews: PageView[] = [
        'home',
        'menu',
        'gallery',
        'reviews',
        'about',
        'contact',
        'cart',
        'checkout',
        'order-confirmation',
        'track-order',
        'admin-login',
        'admin-dashboard',
      ];
      if (validViews.includes(hash)) {
        if (hash === 'admin-dashboard' && !db.isAdminAuthenticated()) {
          setCurrentView('admin-login');
        } else {
          setCurrentView(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: PageView) => {
    if (view === 'admin-dashboard' && !isAdmin) {
      setCurrentView('admin-login');
      window.location.hash = 'admin-login';
    } else {
      setCurrentView(view);
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentView('admin-dashboard');
    window.location.hash = 'admin-dashboard';
  };

  const handleLogout = () => {
    db.setAdminAuthenticated(false);
    setIsAdmin(false);
    setCurrentView('home');
    window.location.hash = 'home';
  };

  const featuredItems = menuItems.filter((i) => i.isFeatured && i.isAvailable);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-neutral-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        settings={settings}
        isAdmin={isAdmin}
        cartCount={cartCount}
      />

      {/* Main View Router with Framer Motion Page Transition */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {currentView === 'home' && (
              <HomePage
                settings={settings}
                featuredItems={featuredItems}
                galleryPreview={galleryImages}
                reviews={reviews}
                onNavigate={navigateTo}
                onSelectItem={(item) => setSelectedItem(item)}
                onCartUpdated={refreshData}
              />
            )}

            {currentView === 'menu' && (
              <MenuPage
                categories={categories}
                items={menuItems}
                settings={settings}
                onSelectItem={(item) => setSelectedItem(item)}
                onCartUpdated={refreshData}
              />
            )}

            {currentView === 'gallery' && (
              <GalleryPage images={galleryImages} />
            )}

            {currentView === 'reviews' && (
              <ReviewsPage
                reviews={reviews}
                settings={settings}
                onReviewAdded={refreshData}
              />
            )}

            {currentView === 'about' && (
              <AboutPage settings={settings} onNavigate={navigateTo} />
            )}

            {currentView === 'contact' && (
              <ContactPage settings={settings} onMessageSent={refreshData} />
            )}

            {currentView === 'cart' && (
              <CartPage
                cart={cart}
                settings={settings}
                onNavigate={navigateTo}
                onCartUpdated={refreshData}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutPage
                cart={cart}
                settings={settings}
                onNavigate={navigateTo}
                onOrderCreated={(order) => {
                  setConfirmedOrder(order);
                  navigateTo('order-confirmation');
                }}
              />
            )}

            {currentView === 'order-confirmation' && (
              <OrderConfirmationPage
                order={confirmedOrder}
                settings={settings}
                onNavigate={navigateTo}
                onSelectOrderToTrack={(orderNumber, phone) => {
                  setTrackOrderQuery({ orderNumber, phone });
                  navigateTo('track-order');
                }}
                onCartUpdated={refreshData}
              />
            )}

            {currentView === 'track-order' && (
              <TrackOrderPage
                settings={settings}
                initialOrderNumber={trackOrderQuery.orderNumber}
                initialPhone={trackOrderQuery.phone}
                onNavigate={navigateTo}
                onCartUpdated={refreshData}
              />
            )}

            {currentView === 'admin-login' && (
              <AdminLoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'admin-dashboard' && (
              <AdminDashboardPage
                settings={settings}
                categories={categories}
                menuItems={menuItems}
                galleryImages={galleryImages}
                reviews={reviews}
                messages={messages}
                onLogout={handleLogout}
                onNavigate={navigateTo}
                onRefreshData={refreshData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dish Details Modal */}
      <DishDetailsModal
        item={selectedItem}
        settings={settings}
        onClose={() => setSelectedItem(null)}
        onCartUpdated={refreshData}
      />

      {/* Footer */}
      <Footer settings={settings} onNavigate={navigateTo} />

      {/* Sticky Mobile Bottom Bar */}
      <MobileBottomBar
        settings={settings}
        onNavigate={navigateTo}
        currentView={currentView}
        cartCount={cartCount}
      />
    </div>
  );
}
