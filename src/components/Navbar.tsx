import React, { useState } from 'react';
import { Phone, Menu as MenuIcon, X, Shield, ChevronLeft, ShoppingBag, Compass } from 'lucide-react';
import { PageView, RestaurantSettings } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  settings: RestaurantSettings;
  isAdmin: boolean;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  settings,
  isAdmin,
  cartCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: PageView }[] = [
    { label: 'الرئيسية', view: 'home' },
    { label: 'قائمة الطعام', view: 'menu' },
    { label: 'معرض الصور', view: 'gallery' },
    { label: 'المراجعات', view: 'reviews' },
    { label: 'تتبع طلبك', view: 'track-order' },
    { label: 'عن المطعم', view: 'about' },
    { label: 'تواصل معنا', view: 'contact' },
  ];

  const handleLinkClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0d0f12]/95 dark:bg-[#0d0f12]/95 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* ZONE 1: Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 group text-right cursor-pointer"
          >
            <div className="w-9 h-9 rounded-md bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-extrabold text-xl group-hover:border-amber-500/60 transition-colors">
              ز
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
              {settings.name}
            </span>
          </button>

          {/* ZONE 2: Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`relative py-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-amber-400 font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Primary Actions (Theme, Cart, Phone, Admin) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle (Dark/Light Mode) */}
            <ThemeToggle />

            {/* Shopping Cart Button with count badge */}
            <button
              onClick={() => handleLinkClick('cart')}
              aria-label="سلة المشتريات"
              title="سلة المشتريات"
              className={`relative p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                currentView === 'cart' || currentView === 'checkout'
                  ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                  : 'border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Phone Call CTA */}
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors tabular-nums whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>

            {/* Admin Access Link */}
            {isAdmin ? (
              <button
                onClick={() => handleLinkClick('admin-dashboard')}
                title="لوحة تحكم المدير"
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentView === 'admin-dashboard'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline">لوحة التحكم</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('admin-login')}
                title="تسجيل دخول الإدارة"
                aria-label="تسجيل دخول الإدارة"
                className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/60 rounded-lg transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="فتح القائمة الرئيسية"
              className="lg:hidden p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 bottom-0 right-0 w-5/6 max-w-sm bg-[#11141a] border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    ز
                  </div>
                  <span className="font-bold text-lg text-white">{settings.name}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => {
                  const isActive = currentView === link.view;
                  return (
                    <button
                      key={link.view}
                      onClick={() => handleLinkClick(link.view)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-400 border-r-4 border-amber-500'
                          : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronLeft className="w-4 h-4 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Mobile Action Inside Drawer */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
              <button
                onClick={() => handleLinkClick('cart')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-sm relative"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>سلة المشتريات</span>
                {cartCount > 0 && (
                  <span className="bg-amber-400 text-neutral-950 font-bold text-xs px-2 py-0.5 rounded-full mr-2">
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold rounded-lg transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل الآن ({settings.phone})</span>
              </a>

              <button
                onClick={() => handleLinkClick(isAdmin ? 'admin-dashboard' : 'admin-login')}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-lg transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAdmin ? 'لوحة تحكم الإدارة' : 'دخول المشرف'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
