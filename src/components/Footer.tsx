import React from 'react';
import { Phone, MapPin, Clock, Facebook, Instagram, Share2 } from 'lucide-react';
import { PageView, RestaurantSettings } from '../types';

interface FooterProps {
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (view: PageView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090b0e] border-t border-neutral-800/80 text-neutral-400 pt-16 pb-24 lg:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-neutral-800/60">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-extrabold text-lg">
                ز
              </div>
              <h2 className="text-xl font-black text-white">{settings.name}</h2>
            </div>
            <p className="text-amber-400/90 text-sm font-semibold">
              {settings.tagline}
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              {settings.shortDescription}
            </p>

            {/* Social media links if configured */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="صفحة فيسبوك"
                  className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="حساب انستغرام"
                  className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                  className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide">روابط سريعة</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('menu')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  قائمة الطعام والأسعار
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('gallery')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  معرض الصور
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('reviews')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  آراء وتقييمات العملاء
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('about')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  عن مطعم الزعيم
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-amber-400 transition-colors text-right cursor-pointer"
                >
                  تواصل معنا والحجز
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide">معلومات التواصل</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-amber-400 transition-colors tabular-nums font-semibold"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.openingHours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Location Map Callout */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide">موقعنا في الحسينية</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              يسعدنا تشريفكم في أي وقت على مدار 24 ساعة لتذوق أشهى وأطيب فطور وسحور وعشاء شعبي مصري.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>فتح الاتجاهات على خرائط Google</span>
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>طلب اتصال هاتفي مباشر</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300">
          <p>© {currentYear} {settings.name} — جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4">
            <span>مأكولات شعبية مصرية</span>
            <span aria-hidden="true">·</span>
            <span>الحسينية - محافظة الشرقية</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLinkClick('admin-login')}
              className="text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              إدارة الموقع
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
