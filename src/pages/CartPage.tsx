import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { CartItem, RestaurantSettings, PageView } from '../types';
import { db } from '../services/db';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface CartPageProps {
  cart: CartItem[];
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
  onCartUpdated: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  settings,
  onNavigate,
  onCartUpdated,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discount: number;
    message: string;
  } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponResult?.valid ? couponResult.discount : 0;
  const deliveryFee = settings.deliveryFee ?? 15;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleQuantityChange = (productId: string, newQty: number) => {
    db.updateCartQuantity(productId, newQty);
    onCartUpdated();
  };

  const handleRemove = (productId: string) => {
    db.removeFromCart(productId);
    onCartUpdated();
  };

  const handleClear = () => {
    if (window.confirm('هل تود تفريغ سلة المشتريات بالكامل؟')) {
      db.clearCart();
      onCartUpdated();
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = db.validateCoupon(couponCode, subtotal);
    setCouponResult(res);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto"
        >
          <ShoppingBag className="w-10 h-10" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">سلة المشتريات فارغة</h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            لم تقم بإضافة أي وجبات أو ساندوتشات إلى سلتك بعد. تصفح منيو مطعم الزعيم واطلب أشهى الأكلات الشعبية الآن!
          </p>
        </div>
        <div>
          <button
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/20 transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>تصفح قائمة الطعام</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div className="space-y-1 text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلبك من مطعم الزعيم</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">سلة الطلبات ({cart.length})</h1>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-neutral-800/80 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>تفريغ السلة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141820] border border-neutral-800/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-right shadow-sm"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white truncate">{item.name}</h3>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-amber-400 font-bold text-xs sm:text-sm tabular-nums">
                    {item.price} ج.م <span className="text-[11px] text-neutral-400 font-normal">/ للقطعة</span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded inline-block">
                      ملاحظة: {item.notes}
                    </p>
                  )}

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white text-xs cursor-pointer"
                        aria-label="تقليل الكمية"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-white text-xs tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white text-xs cursor-pointer"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-black text-white tabular-nums mr-auto">
                      المجموع: {item.price * item.quantity} ج.م
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => onNavigate('menu')}
            className="w-full py-3 rounded-xl border border-dashed border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إضافة المزيد من الأطباق من المنيو</span>
          </button>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-5 shadow-lg">
            <h2 className="font-bold text-lg text-white border-b border-neutral-800 pb-3">ملخص الحساب</h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">هل لديك كود خصم (كوبون)؟</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="مثال: ZAEEM10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs uppercase focus:outline-none focus:border-amber-500 tracking-wider font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>تطبيق</span>
                </button>
              </div>

              {couponResult && (
                <div
                  className={`text-xs p-2.5 rounded-lg flex items-center gap-1.5 ${
                    couponResult.valid
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950/60 text-red-300 border border-red-800'
                  }`}
                >
                  {couponResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{couponResult.message}</span>
                </div>
              )}
            </form>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>المجموع الفرعي للطلب</span>
                <span className="font-bold text-white tabular-nums">{subtotal} ج.م</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>قيمة الخصم بالكوبون</span>
                  <span className="tabular-nums">- {discount} ج.م</span>
                </div>
              )}

              <div className="flex justify-between items-center text-neutral-300">
                <span>رسوم التوصيل المقدرة</span>
                <span className="tabular-nums">{deliveryFee} ج.م</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                <span className="font-bold text-base text-white">الإجمالي التقريبي</span>
                <span className="font-black text-xl text-amber-400 tabular-nums">{grandTotal} ج.م</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>متابعة إتمام الطلب (Checkout)</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <p className="text-[11px] text-neutral-400 text-center">
              الدفع نقداً عند الاستلام أو عند الحضور بالمطعم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
