import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Navigation,
  UtensilsCrossed,
  Star,
  Clock,
  MapPin,
  Banknote,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  ChevronLeft,
  HeartHandshake,
} from 'lucide-react';
import { PageView, RestaurantSettings, MenuItem, GalleryImage, Review } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ShareButton } from '../components/ShareButton';
import { db } from '../services/db';

interface HomePageProps {
  settings: RestaurantSettings;
  featuredItems: MenuItem[];
  galleryPreview: GalleryImage[];
  reviews: Review[];
  onNavigate: (view: PageView) => void;
  onSelectItem: (item: MenuItem) => void;
  onCartUpdated?: () => void;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  featuredItems,
  galleryPreview,
  reviews,
  onNavigate,
  onSelectItem,
  onCartUpdated,
}) => {
  const approvedReviews = reviews.filter((r) => r.status === 'approved').slice(0, 3);
  const [quickAddedId, setQuickAddedId] = React.useState<string | null>(null);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    db.addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    if (onCartUpdated) onCartUpdated();
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1200);
  };

  return (
    <div className="space-y-20 lg:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="relative overflow-hidden pt-8 lg:pt-14 pb-12 lg:pb-20 border-b border-neutral-800/60 bg-gradient-to-b from-[#13171f] via-[#0d0f12] to-[#0d0f12]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Text Column (RTL order: first) */}
            <motion.div
              variants={itemVariant}
              className="lg:col-span-7 space-y-6 text-right"
            >
              {/* Subtle kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المذاق الشعبي المصري الأصيل بالحسينية</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                {settings.name}
              </h1>

              {/* Tagline / Subheading */}
              <p className="text-xl sm:text-2xl font-bold text-amber-400 leading-snug">
                "{settings.tagline}"
              </p>

              {/* Short Marketing Description */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {settings.shortDescription}
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onNavigate('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm shadow-lg shadow-amber-900/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>شاهد قائمة الطعام</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${settings.phone}`}
                  className="px-5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-sm flex items-center gap-2 transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>اتصل بنا ({settings.phone})</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>احصل على الاتجاهات</span>
                </motion.a>
              </div>

              {/* Quick Trust Indicator */}
              <div className="pt-4 flex items-center gap-6 text-xs text-neutral-400 border-t border-neutral-800/80">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white tabular-nums">{settings.rating} / 5</span>
                  <span>({settings.reviewsCount} تقييم حقيقي)</span>
                </div>
                <span className="text-neutral-700">|</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{settings.openingHours}</span>
                </div>
              </div>
            </motion.div>

            {/* Right/Hero Image Column */}
            <motion.div
              variants={itemVariant}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-red-600/20 rounded-2xl blur-xl opacity-70" />

                {/* Main Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-900 aspect-[4/3] sm:aspect-[16/10]">
                  <ImageWithFallback
                    src={settings.heroImage}
                    alt="وليمة فطور ومأكولات شعبية مصرية بمطعم الزعيم"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 right-4 left-4 text-white text-right">
                    <span className="text-xs font-semibold text-amber-400">وليمة الزعيم اليومية</span>
                    <p className="text-sm font-bold">فول بلدي بالخلطة، طعمية سخنة مقرمشة، وساندوتشات عيش بلدي</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2. RESTAURANT INFO CARDS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerStagger}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Rating */}
          <motion.div
            variants={itemVariant}
            whileHover={{ y: -3 }}
            className="bg-[#141820] border border-neutral-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-center text-right hover:border-neutral-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="font-extrabold text-lg text-white tabular-nums">{settings.rating} / 5</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium tabular-nums">{settings.reviewsCount} مراجعة حقيقية</p>
          </motion.div>

          {/* Card 2: Cuisine */}
          <motion.div
            variants={itemVariant}
            whileHover={{ y: -3 }}
            className="bg-[#141820] border border-neutral-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-center text-right hover:border-neutral-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base text-white">فلافل ومأكولات شعبية</span>
            </div>
            <p className="text-xs text-neutral-400">طعم مصري بلدي أصيل</p>
          </motion.div>

          {/* Card 3: Price Range */}
          <motion.div
            variants={itemVariant}
            whileHover={{ y: -3 }}
            className="bg-[#141820] border border-neutral-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-center text-right hover:border-neutral-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-400">
              <Banknote className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base text-white tabular-nums">1–200 جنيه</span>
            </div>
            <p className="text-xs text-neutral-400">متوسط السعر للفرد</p>
          </motion.div>

          {/* Card 4: Operating Hours */}
          <motion.div
            variants={itemVariant}
            whileHover={{ y: -3 }}
            className="bg-[#141820] border border-neutral-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-center text-right hover:border-neutral-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-400">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base text-white">على مدار الساعة</span>
            </div>
            <p className="text-xs text-neutral-400">خدمة 24/7 دون توقف</p>
          </motion.div>

          {/* Card 5: Location */}
          <motion.div
            variants={itemVariant}
            whileHover={{ y: -3 }}
            className="col-span-2 md:col-span-1 bg-[#141820] border border-neutral-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-center text-right hover:border-neutral-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-400">
              <MapPin className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base text-white">{settings.locality}</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">المركز - محافظة الشرقية</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. FEATURED MENU SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-right">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              مختارات من المطبخ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              أشهر أطباقنا الشعبية
            </h2>
          </div>
          <button
            onClick={() => {
              onNavigate('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>عرض القائمة الكاملة والأسعار</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Dish Cards Grid */}
        <motion.div
          variants={containerStagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariant}
              whileHover={{ y: -4 }}
              className="group bg-[#141820] border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Dish Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  {item.badge && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500/90 text-neutral-950 font-bold text-xs shadow-md">
                      {item.badge}
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                      غير متوفر حالياً
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 text-right space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <div className="text-amber-400 font-black text-lg tabular-nums whitespace-nowrap">
                      {item.price} <span className="text-xs font-normal text-neutral-400">ج.م</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  disabled={!item.isAvailable}
                  onClick={(e) => handleQuickAdd(item, e)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    quickAddedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {quickAddedId === item.id ? 'تمت الإضافة' : 'أضف للسلة'}
                </button>

                <button
                  onClick={() => onSelectItem(item)}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>التفاصيل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 4. WHY ALZA3EEM SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="bg-[#11141b] border-y border-neutral-800/80 py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              سر تميزنا
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              لماذا يفضل أهل الحسينية مطعم الزعيم؟
            </h2>
            <p className="text-neutral-400 text-sm">
              معايير ثابتة نحرص عليها في كل طبق وساندوتش يخرج من مطبخنا إليك
            </p>
          </div>

          <motion.div
            variants={containerStagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-right"
          >
            {/* Feature 1 */}
            <motion.div
              variants={itemVariant}
              whileHover={{ y: -4 }}
              className="bg-[#161a22] border border-neutral-800/90 rounded-2xl p-6 hover:border-amber-500/30 transition-colors space-y-3 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">طعم مصري أصيل</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                تتبيلة بلدي خاصة ووصفات فلاحية متوارثة تمنح الفلافل قرمشتها الذهبية ورائحة السمسم والكزبرة، وللفول قوام الزبدة ونكهته الغنية.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={itemVariant}
              whileHover={{ y: -4 }}
              className="bg-[#161a22] border border-neutral-800/90 rounded-2xl p-6 hover:border-amber-500/30 transition-colors space-y-3 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">مكونات طازجة يومياً</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                نستخدم أجود أنواع الفول البلدي، خضار الطعمية والسلطة الطازجة يومياً، وزيوت نقية تتغير باستمرار لنضمن صحة وسلامة عملائنا.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={itemVariant}
              whileHover={{ y: -4 }}
              className="bg-[#161a22] border border-neutral-800/90 rounded-2xl p-6 hover:border-amber-500/30 transition-colors space-y-3 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">أسعار شعبية عادلة</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                طعام عالي الجودة والكميات مشبعة بأسعار تناسب كل عائلة وفرد من 1 إلى 200 جنيه.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={itemVariant}
              whileHover={{ y: -4 }}
              className="bg-[#161a22] border border-neutral-800/90 rounded-2xl p-6 hover:border-amber-500/30 transition-colors space-y-3 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">كرم الضيافة والسرعة</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                طاقم عمل بشوش وخدوم يحرص على تجهيز طلبك في دقائق معدودة طوال الـ 24 ساعة دون تأخير.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. GALLERY PREVIEW */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-right">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              من داخل المطعم
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              معرض الصور والأجواء
            </h2>
          </div>
          <button
            onClick={() => {
              onNavigate('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>عرض جميع الصور</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <motion.div
          variants={containerStagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {galleryPreview.slice(0, 4).map((img) => (
            <motion.div
              key={img.id}
              variants={itemVariant}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onNavigate('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer"
            >
              <ImageWithFallback
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-right">
                <span className="text-xs font-semibold text-white">{img.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 6. REVIEWS PREVIEW */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="bg-[#11141b] border-y border-neutral-800/80 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-right">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-amber-400 font-bold text-sm tabular-nums">4.1 / 5</span>
                <span className="text-xs text-neutral-400">({settings.reviewsCount} تقييم)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ماذا يقول عملاء مطعم الزعيم؟
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('reviews');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>عرض جميع المراجعات وكتابة رأيك</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Real Customer Reviews Cards */}
          <motion.div
            variants={containerStagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {approvedReviews.map((rev) => (
              <motion.div
                key={rev.id}
                variants={itemVariant}
                whileHover={{ y: -3 }}
                className="bg-[#161a22] border border-neutral-800/90 rounded-2xl p-6 text-right flex flex-col justify-between hover:border-neutral-700 transition-colors space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-300">{rev.date}</span>
                  </div>
                  <p className="text-neutral-200 text-sm leading-relaxed font-medium">
                    "{rev.content}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {rev.authorName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-white">{rev.authorName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/90 font-medium">زبون مؤكد</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. LOCATION & DIRECTIONS SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 text-right space-y-4">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              الموقع وسهولة الوصول
            </span>
            <h2 className="text-3xl font-black text-white">
              موقعنا في الحسينية
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              يقع مطعم الزعيم في موقع حيوي يسهل الوصول إليه في الحسينية، محافظة الشرقية. نرحب بكم دائماً على مدار الساعة.
            </p>

            <div className="bg-[#141820] border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-neutral-200 font-semibold leading-relaxed">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>احصل على الاتجاهات الآن</span>
              </a>
              <ShareButton variant="button" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[16/9] bg-neutral-900 shadow-xl">
              {/* Responsive Google Maps Embed with fallback link */}
              <iframe
                title="موقع مطعم الزعيم في الحسينية"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  settings.address
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-105"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. CONTACT CTA BAR */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={sectionVariant}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-neutral-900 via-[#181d26] to-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-right shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              جاهز لتجربة أشهى وجبة شعبية؟
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              اتصل بنا هاتفياً للطلبات والتجهيز المسبق أو تفضل بزيارتنا في أي وقت.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${settings.phone}`}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm flex items-center gap-2 transition-colors tabular-nums"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل الآن ({settings.phone})</span>
            </motion.a>

            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold border border-neutral-700 transition-colors"
            >
              الاتجاهات
            </a>

            <ShareButton variant="icon" />
          </div>
        </div>
      </motion.section>
    </div>
  );
};
