import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCheck,
  AlertCircle,
  XCircle,
  RotateCcw,
  Phone,
  Printer,
} from 'lucide-react';
import { Order, OrderStatus, RestaurantSettings, PageView } from '../types';
import { db } from '../services/db';

interface TrackOrderPageProps {
  settings: RestaurantSettings;
  initialOrderNumber?: string;
  initialPhone?: string;
  onNavigate: (view: PageView) => void;
  onCartUpdated?: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
  { status: 'new', label: 'تم استلام الطلب', icon: Clock, desc: 'وصل طلبك إلى كاشير مطعم الزعيم' },
  { status: 'confirmed', label: 'تم التأكيد', icon: CheckCircle2, desc: 'تمت مراجعة الأصناف واعتماد الطلب' },
  { status: 'preparing', label: 'جاري التحضير', icon: ChefHat, desc: 'يتم الآن قلي الطعمية وتحضير الفول والساندوتشات طازجة' },
  { status: 'ready', label: 'الطلب جاهز', icon: PackageCheck, desc: 'تم تجهيز وتغليف طلبك بالكامل' },
  { status: 'out_for_delivery', label: 'خرج للتوصيل', icon: Bike, desc: 'الطلب في طريقه إليك مع مندوب التوصيل' },
  { status: 'completed', label: 'تم التسليم', icon: CheckCheck, desc: 'ألف هنا وشفا! تم توصيل واستلام الطلب بنجاح' },
];

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  settings,
  initialOrderNumber = '',
  initialPhone = '',
  onNavigate,
  onCartUpdated,
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      handleSearch(null, initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleSearch = (e: React.FormEvent | null, oNum?: string, oPhone?: string) => {
    if (e) e.preventDefault();
    const queryNum = oNum || orderNumber;
    const queryPhone = oPhone || phone;

    if (!queryNum.trim() || !queryPhone.trim()) return;

    setHasSearched(true);
    const order = db.trackOrder(queryNum, queryPhone);
    setFoundOrder(order || null);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    const idx = ORDER_STEPS.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIndex = foundOrder ? getStepIndex(foundOrder.status) : 0;

  const handleReorder = (order: Order) => {
    const res = db.reorder(order);
    if (onCartUpdated) onCartUpdated();

    if (res.unavailableItems.length > 0) {
      setReorderNotice(
        `تمت إضافة ${res.addedCount} صنف متاح. تنبيه: بعض الأصناف غير متوفرة حالياً (${res.unavailableItems.join('، ')})`
      );
    } else {
      setReorderNotice('تمت إضافة جميع الأصناف إلى السلة بنجاح!');
    }

    setTimeout(() => {
      onNavigate('cart');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-right space-y-2 max-w-2xl">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          متابعة مباشرة لحظة بلحظة
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">تتبع حالة طلبك</h1>
        <p className="text-neutral-400 text-sm">
          أدخل رقم الطلب المسجل (مثل: ZAEEM-1001) ورقم الهاتف الذي قمت بالطلب به لمعرفة مسار الوجبة.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-sm text-right">
        <form onSubmit={(e) => handleSearch(e)} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-neutral-300">رقم الطلب (Order Number)</label>
            <input
              type="text"
              required
              placeholder="مثال: ZAEEM-1001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-neutral-300">رقم الهاتف المستخدم بالطلب</label>
            <input
              type="tel"
              required
              placeholder="مثال: 01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm tabular-nums focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Result */}
      {hasSearched && !foundOrder && (
        <div className="p-8 text-center bg-[#141820] border border-neutral-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">لم نعثر على طلب بهذه البيانات</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            تأكد من كتابة رقم الطلب بصيغة صحيحة (مثال: ZAEEM-1001) ورقم الهاتف الذي استخدمته عند إتمام الطلب، أو اتصل بالمطعم مباشرة:
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 text-amber-400 text-xs font-bold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>اتصل بالمطعم ({settings.phone})</span>
          </a>
        </div>
      )}

      {foundOrder && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {reorderNotice && (
            <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{reorderNotice}</span>
            </div>
          )}

          {/* Cancelled Alert if applicable */}
          {foundOrder.status === 'cancelled' && (
            <div className="p-5 rounded-2xl bg-red-950/70 border border-red-800 text-right space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <XCircle className="w-5 h-5" />
                <span>تم إلغاء هذا الطلب</span>
              </div>
              <p className="text-xs text-red-200">
                تم إلغاء هذا الطلب بواسطة إدارة المطعم أو بناءً على رغبتك. للتواصل والاستفسار، يمكنك الاتصال على {settings.phone}.
              </p>
            </div>
          )}

          {/* Timeline View */}
          {foundOrder.status !== 'cancelled' && (
            <div className="bg-[#141820] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 text-right">
                <div>
                  <span className="text-xs text-neutral-400 block">رقم الطلب</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{foundOrder.orderNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {ORDER_STEPS.find((s) => s.status === foundOrder.status)?.label || foundOrder.status}
                  </span>
                  <button
                    onClick={() => handleReorder(foundOrder)}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-emerald-400" />
                    <span>إعادة الطلب</span>
                  </button>
                </div>
              </div>

              {/* Steps Progress */}
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-5 right-8 left-8 h-1 bg-neutral-800 -z-0">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{
                      width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-2 text-right md:text-center relative z-10">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const IconComponent = step.icon;

                    return (
                      <div key={step.status} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-neutral-950 border-amber-300 ring-4 ring-amber-400/20 shadow-lg'
                              : isDone
                              ? 'bg-amber-400/20 text-amber-400 border-amber-400'
                              : 'bg-neutral-900 text-neutral-600 border-neutral-800'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="space-y-0.5">
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-amber-400 font-black'
                                : isDone
                                ? 'text-white'
                                : 'text-neutral-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 md:max-w-[120px] mx-auto">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details Accordion / Summary */}
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-neutral-800 pb-3 flex justify-between items-center">
              <span>تفاصيل الطلب المسجلة</span>
              <span className="text-xs text-amber-400 tabular-nums">الإجمالي: {foundOrder.total} ج.م</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div>
                <span className="text-neutral-500 block text-[11px]">اسم العميل</span>
                <span className="font-bold text-white">{foundOrder.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">رقم الهاتف</span>
                <span className="font-bold text-white tabular-nums">{foundOrder.phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">عنوان الاستلام</span>
                <span className="font-bold text-white">{foundOrder.address}</span>
              </div>
            </div>

            <div className="divide-y divide-neutral-800/80 text-xs pt-2">
              {foundOrder.items.map((it, i) => (
                <div key={i} className="py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{it.quantity}×</span>
                    <span className="text-white">{it.productName}</span>
                  </div>
                  <span className="font-bold text-neutral-300 tabular-nums">{it.subtotal} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
