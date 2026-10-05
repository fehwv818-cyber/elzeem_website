import React from 'react';
import { Phone, UtensilsCrossed, ShoppingBag, Compass } from 'lucide-react';
import { PageView, RestaurantSettings } from '../types';

interface MobileBottomBarProps {
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
  currentView: PageView;
  cartCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  settings,
  onNavigate,
  currentView,
  cartCount,
}) => {
  return (
    <nav
      aria-label="إجراءات الجوال السريعة"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f12]/95 backdrop-blur-md border-t border-neutral-800/90 px-3 py-2 no-print"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
        {/* Menu View Action */}
        <button
          onClick={() => {
            onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            currentView === 'menu'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black'
              : 'bg-neutral-900/90 text-neutral-300 hover:text-amber-400'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-bold">المنيو</span>
        </button>

        {/* Cart View Action with Badge */}
        <button
          onClick={() => {
            onNavigate('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer relative ${
            currentView === 'cart' || currentView === 'checkout'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black'
              : 'bg-neutral-900/90 text-neutral-300 hover:text-amber-400'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5 text-amber-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-neutral-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">السلة</span>
        </button>

        {/* Track Order Action */}
        <button
          onClick={() => {
            onNavigate('track-order');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            currentView === 'track-order'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black'
              : 'bg-neutral-900/90 text-neutral-300 hover:text-amber-400'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-bold">تتبع طلبك</span>
        </button>

        {/* Direct Call Action */}
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors font-bold shadow-sm"
        >
          <Phone className="w-4 h-4 mb-0.5 text-neutral-950" />
          <span className="text-[10px]">اتصال</span>
        </a>
      </div>
    </nav>
  );
};
