import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, HeartHandshake, ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';
import { RestaurantSettings, PageView } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface AboutPageProps {
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-right space-y-3 max-w-3xl"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>حكاية الزعيم في الحسينية</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          عن مطعم الزعيم
        </h1>
        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
          {settings.tagline}
        </p>
      </motion.div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="lg:col-span-7 space-y-5 text-right"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            أصالة المطبخ الشعبي المصري وجودة نهتم بها في كل وجبة
          </h2>
          <div className="text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>{settings.aboutStory}</p>
            <p>
              نؤمن في مطعم الزعيم بأن المأكولات الشعبية المصرية ليست مجرد وجبة سريعة، بل هي ثقافة وأصالة وعنوان للدفء واللمة الحلوة التي تجمع العائلات وأهالي الحسينية في الصباح الباكر ومساء كل يوم. لذلك نلتزم بتقديم الفول المدمس على أصوله بقوام زبدة وتتبيلة معتبرة، والطعمية الساخنة المقرمشة المحضرة بأجود أنواع الكرات والخضار الطازج والسمسم، مع تشكيلة واسعة من الساندوتشات والوجبات والمقبلات المخللة التي تُعد يومياً بكل حب وأمانة.
            </p>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-[#141820] border border-neutral-800 space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">نظافة وأمانة</h3>
              <p className="text-xs text-neutral-400">
                أعلى درجات العناية بالتعقيم ونظافة المكونات وأدوات التحضير.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-[#141820] border border-neutral-800 space-y-2 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">خدمة أهل الحسينية</h3>
              <p className="text-xs text-neutral-400">
                فخورون بخدمة أهالي مركز الحسينية وزوار محافظة الشرقية على مدار 24 ساعة.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="lg:col-span-5 relative"
        >
          <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3] bg-neutral-900">
            <ImageWithFallback
              src={settings.heroImage}
              alt="مطعم الزعيم الحسينية"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              containerClassName="w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Info Callout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-[#11141b] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>موقع المطعم</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">{settings.address}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>رقم الاتصال المباشر</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 tabular-nums font-bold">
              {settings.phone}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>أوقات العمل</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">{settings.openingHours}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            يمكن تعديل جميع تفاصيل المطعم وصوره بسهولة من لوحة تحكم الإدارة.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNavigate('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>تصفح قائمة الأطباق</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
