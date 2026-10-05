import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bike,
  Store,
  UtensilsCrossed,
  Phone,
  User,
  MapPin,
  Banknote,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { CartItem, RestaurantSettings, Order, OrderType, PaymentMethod, PageView, RestaurantTable } from '../types';
import { db } from '../services/db';

interface CheckoutPageProps {
  cart: CartItem[];
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  settings,
  onNavigate,
  onOrderCreated,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('الحسينية');
  const [streetBuilding, setStreetBuilding] = useState('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check URL table parameter if scanned from Table QR
  useEffect(() => {
    setTables(db.getTables().filter((t) => t.isActive));
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
      setOrderType('dine_in');
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? (settings.deliveryFee ?? 15) : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (code: string) => {
    if (!code.trim()) return;
    const res = db.validateCoupon(code, subtotal);
    if (res.valid) {
      setCouponDiscount(res.discount);
      setCouponCode(code.trim().toUpperCase());
      setErrorMessage('');
    } else {
      setCouponDiscount(0);
      setErrorMessage(res.message);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('سلة المشتريات فارغة');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('يرجى كتابة الاسم الكريم');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('يرجى كتابة رقم هاتف صحيح للتواصل والمتابعة');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setErrorMessage('يرجى إدخال عنوان التوصيل بالتفصيل (الشارع والمبنى)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = db.createOrder({
        customerName: name,
        phone,
        address: orderType === 'delivery' ? address : (orderType === 'dine_in' ? `ترابيزة ${tableNumber || 'داخل المطعم'}` : 'استلام من المطعم بالمركز'),
        area: orderType === 'delivery' ? area : '',
        streetBuilding,
        orderType,
        tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
        paymentMethod,
        notes,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
      });

      setIsSubmitting(false);

      if (result.success && result.order) {
        onOrderCreated(result.order);
      } else {
        setErrorMessage(result.error || 'حدث خطأ أثناء حفظ الطلب، يرجى المحاولة ثانية');
      }
    }, 400);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">لا توجد منتجات لإتمام الطلب</h2>
        <p className="text-xs text-neutral-400">سلتك فارغة، تفضل بزيارة المنيو لإضافة طلباتك.</p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
        >
          العودة لقائمة الطعام
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-5 text-right">
        <button
          onClick={() => onNavigate('cart')}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
          title="العودة للسلة"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">إتمام الطلب (Checkout)</h1>
          <p className="text-xs text-neutral-400">أدخل بياناتك لاكتمال وتجهيز طلبك فوراً</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Details Column */}
        <div className="lg:col-span-7 space-y-6 text-right">
          {/* 1. Order Type Selection */}
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <label className="block text-xs font-bold text-neutral-300">اختر طريقة استلام الطلب *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'delivery'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                    : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <Bike className="w-5 h-5" />
                <span className="text-xs">توصيل للمنزل</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'pickup'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                    : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-xs">استلام من المطعم</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'dine_in'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                    : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-xs">داخل الصالة</span>
              </button>
            </div>

            {orderType === 'dine_in' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-300 mb-1">اختر رقم الترابيزة</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">اختر الترابيزة...</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.tableNumber}>
                      {t.title} (ترابيزة {t.tableNumber})
                    </option>
                  ))}
                  <option value="مباشر">جلوس حر / غير محدد</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Customer Contact Info */}
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>بيانات الاتصال</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs text-neutral-300">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد أحمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-neutral-300">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500 tabular-nums"
                />
              </div>
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>عنوان التوصيل بالتفصيل بالحسينية</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs text-neutral-300">المنطقة / الحي</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="مثال: المركز - وسط البلد"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs text-neutral-300">رقم العمارة / الشقة</label>
                    <input
                      type="text"
                      value={streetBuilding}
                      onChange={(e) => setStreetBuilding(e.target.value)}
                      placeholder="مثال: عمارة 5 - شقة 2"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-neutral-300">اسم الشارع وعلامة مميزة *</label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: شارع المركز الرئيسي، بجوار البنك الأهلي، الدور الأرضي"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1 pt-1">
              <label className="block text-xs text-neutral-300">ملاحظات إضافية على الطلب (اختياري)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: طحينة زيادة، خبز ساخن، الاتصال عند الوصول"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Banknote className="w-4 h-4 text-amber-400" />
              <span>طريقة الدفع</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-white block">الدفع عند الاستلام (كاش)</span>
                    <span className="text-[11px] text-neutral-400">سدد المبلغ نقداً عند استلام الوجبة</span>
                  </div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('pay_at_restaurant')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'pay_at_restaurant'
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pay_at_restaurant'}
                    onChange={() => setPaymentMethod('pay_at_restaurant')}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-white block">الدفع داخل المطعم</span>
                    <span className="text-[11px] text-neutral-400">عند الكاشير بالمركز</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right/Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-4 shadow-lg sticky top-24">
            <h3 className="font-bold text-base text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
              <span>ملخص الطلب</span>
              <span className="text-xs font-normal text-amber-400">{cart.length} أصناف</span>
            </h3>

            {/* Items review */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-neutral-800 text-neutral-300 font-bold flex items-center justify-center text-[10px] tabular-nums">
                      {item.quantity}×
                    </span>
                    <span className="text-white truncate max-w-[170px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-neutral-300 tabular-nums">{item.price * item.quantity} ج.م</span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-white tabular-nums">{subtotal} ج.م</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>خصم الكوبون ({couponCode})</span>
                  <span className="tabular-nums">- {couponDiscount} ج.م</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-300">
                <span>رسوم التوصيل</span>
                <span className="tabular-nums">
                  {orderType === 'delivery' ? `${deliveryFee} ج.م` : 'مجاناً (استلام)'}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                <span className="font-bold text-base text-white">الإجمالي النهائي</span>
                <span className="font-black text-xl text-amber-400 tabular-nums">{grandTotal} ج.م</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري تأكيد وحفظ الطلب...' : 'تأكيد الطلب الآن'}</span>
            </button>

            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>طلبك يصلك طازجاً وساخناً مباشرة من مطبخ الزعيم</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
