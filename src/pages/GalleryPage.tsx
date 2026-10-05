import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { GalleryImage } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface GalleryPageProps {
  images: GalleryImage[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const GalleryPage: React.FC<GalleryPageProps> = ({ images }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'food', label: 'الأطعمة والمشروبات' },
    { id: 'restaurant', label: 'المطعم' },
    { id: 'atmosphere', label: 'الأجواء' },
    { id: 'owner', label: 'من المالك' },
  ];

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredImages.length : 0
    );
  }, [activeLightboxIndex, filteredImages.length]);

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredImages.length) % filteredImages.length
        : filteredImages.length - 1
    );
  }, [activeLightboxIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') handlePrev(); // RTL previous is right
      if (e.key === 'ArrowLeft') handleNext(); // RTL next is left
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, handleNext, handlePrev]);

  const activeImage =
    activeLightboxIndex !== null ? filteredImages[activeLightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-right space-y-3 max-w-2xl"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>لقطات حية من مطبخنا وصالتنا</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          معرض صور مطعم الزعيم
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          تعرف على أصالة الأطباق الشعبية وجودة التحضير والأجواء الترحيبية داخل مطعم الزعيم في الحسينية.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        <div className="flex items-center gap-1.5 p-1 bg-[#13161d] rounded-xl border border-neutral-800">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all duration-300"
            >
              <ImageWithFallback
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-right">
                <span className="text-xs text-amber-400 font-semibold mb-1">
                  {categories.find((c) => c.id === img.category)?.label || 'مطعم الزعيم'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {img.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#141820] border border-neutral-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3"
        >
          <p className="text-white font-bold text-base">لا توجد صور في هذا القسم حالياً</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 rounded-lg bg-amber-400 text-neutral-950 font-bold text-xs"
          >
            عرض جميع الصور
          </button>
        </motion.div>
      )}

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {activeImage && activeLightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setActiveLightboxIndex(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative z-10 max-w-4xl w-full flex flex-col items-center"
            >
              {/* Top Toolbar */}
              <div className="w-full flex items-center justify-between pb-3 text-white text-xs px-2">
                <span className="font-bold text-sm text-neutral-200">{activeImage.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400 tabular-nums">
                    {activeLightboxIndex + 1} من {filteredImages.length}
                  </span>
                  <button
                    onClick={() => setActiveLightboxIndex(null)}
                    className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-white transition-colors"
                    aria-label="إغلاق المعرض"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Lightbox Image View */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
                <ImageWithFallback
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-full object-contain"
                  containerClassName="w-full h-full"
                />

                {/* Prev / Next controls */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700/80 transition-colors cursor-pointer"
                      aria-label="الصورة السابقة"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700/80 transition-colors cursor-pointer"
                      aria-label="الصورة التالية"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption */}
              <div className="w-full text-center pt-3 text-neutral-400 text-xs">
                استخدم أزرار الأسهم في لوحة المفاتيح للتنقل أو زر Esc للإغلاق
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
