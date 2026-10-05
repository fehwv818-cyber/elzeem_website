import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Sparkles, Filter, ShoppingBag, Check } from 'lucide-react';
import { MenuCategory, MenuItem, RestaurantSettings } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { db } from '../services/db';

interface MenuPageProps {
  categories: MenuCategory[];
  items: MenuItem[];
  settings: RestaurantSettings;
  onSelectItem: (item: MenuItem) => void;
  onCartUpdated?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export const MenuPage: React.FC<MenuPageProps> = ({
  categories,
  items,
  settings,
  onSelectItem,
  onCartUpdated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      // Search match
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-right space-y-3 max-w-3xl"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>قائمة الطعام المعتمدة والأسعار</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          قائمة طعام مطعم الزعيم
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          جميع الساندوتشات والوجبات والفلافل تُحضر طازجة يومياً باستخدام أنقى الزيوت النباتية، الفول البلدي، والخضروات الطازجة.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طعمية، فول، ساندوتش، وجبة، أو مكون..."
            className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#141820] border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/80 transition-colors"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-3.5 text-xs text-neutral-400 hover:text-white"
            >
              مسح
            </button>
          )}
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 p-1 bg-[#13161d] rounded-xl border border-neutral-800/80">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className={`group bg-[#141820] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                item.isAvailable
                  ? 'border-neutral-800/80 hover:border-neutral-700 hover:shadow-xl'
                  : 'border-neutral-800/40 opacity-70'
              }`}
            >
              <div>
                {/* Image Frame */}
                <div
                  onClick={() => onSelectItem(item)}
                  className="relative aspect-[4/3] overflow-hidden bg-neutral-900 cursor-pointer"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  {item.badge && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold text-xs shadow-md">
                      {item.badge}
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white font-bold text-sm">
                      غير متوفر حالياً
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 text-right space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      onClick={() => onSelectItem(item)}
                      className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h2>
                    <div className="text-amber-400 font-black text-xl tabular-nums whitespace-nowrap">
                      {item.price}{' '}
                      <span className="text-xs font-normal text-neutral-400">ج.م</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Actions: Quick Add to Cart + Details */}
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
                  {quickAddedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تمت الإضافة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>أضف للسلة</span>
                    </>
                  )}
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
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#141820] border border-neutral-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">لم نجد أطباقاً مطابقة</h3>
          <p className="text-xs text-neutral-400">
            جرّب تغيير فئة البحث أو مسح كلمة البحث لرؤية كافة الأطباق الشعبية.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            إعادة تعيين الفلتر
          </button>
        </motion.div>
      )}
    </div>
  );
};
