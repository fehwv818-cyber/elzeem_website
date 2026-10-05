import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { MenuItem, RestaurantSettings } from '../types';
import { db } from '../services/db';
import { ImageWithFallback } from './ImageWithFallback';

interface DishDetailsModalProps {
  item: MenuItem | null;
  settings: RestaurantSettings;
  onClose: () => void;
  onCartUpdated?: () => void;
}

export const DishDetailsModal: React.FC<DishDetailsModalProps> = ({
  item,
  settings,
  onClose,
  onCartUpdated,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setAddedSuccess(false);
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleAddToCart = () => {
    db.addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      notes: notes.trim(),
    });
    if (onCartUpdated) onCartUpdated();
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم مطعم الزعيم، أود طلب: ${item.name} (${item.price} ج.م)`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative w-full max-w-lg bg-[#141820] border border-neutral-700/80 rounded-2xl overflow-hidden shadow-2xl z-10 text-right max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="إغلاق التفاصيل"
            className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Image */}
          <div className="relative aspect-[16/10] bg-neutral-900">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
            {item.badge && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold text-xs shadow-md">
                {item.badge}
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{item.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {item.isAvailable ? 'متوفر وجاهز للتحضير الفوري' : 'غير متوفر مؤقتاً'}
                  </span>
                </div>
              </div>

              <div className="text-amber-400 font-black text-2xl tabular-nums whitespace-nowrap">
                {item.price} <span className="text-xs font-normal text-neutral-400">ج.م</span>
              </div>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed border-y border-neutral-800/80 py-3">
              {item.description}
            </p>

            {/* Quantity and Order Notes */}
            {item.isAvailable && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">حدد الكمية:</span>
                  <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-white text-sm tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-neutral-400">ملاحظات على هذا الطبق (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: بدون طماطم، طحينة زيادة، خبز محمص"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-900/20'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تمت الإضافة إلى السلة بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        أضف إلى السلة ({item.price * quantity} ج.م)
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick Contact buttons */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="text-[11px] text-neutral-400 mb-2">أو اطلب مباشرة عبر الهاتف / واتساب:</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>اتصال مباشر</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
