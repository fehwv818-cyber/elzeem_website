import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Printer,
  Compass,
  RotateCcw,
  MessageCircle,
  Home,
  Phone,
  Clock,
  MapPin,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { Order, RestaurantSettings, PageView } from '../types';
import { db } from '../services/db';

interface OrderConfirmationPageProps {
  order: Order | null;
  settings: RestaurantSettings;
  onNavigate: (view: PageView) => void;
  onSelectOrderToTrack?: (orderNumber: string, phone: string) => void;
  onCartUpdated?: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  onNavigate,
  onSelectOrderToTrack,
  onCartUpdated,
}) => {
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">لم يتم العثور على طلب حالي</h2>
        <p className="text-xs text-neutral-400">يمكنك متابعة وتتبع طلبك عبر إدخال رقم الطلب ورقم الهاتف.</p>
        <button
          onClick={() => onNavigate('track-order')}
          className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
        >
          صفحة تتبع الطلبات
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleReorder = () => {
    const res = db.reorder(order);
    if (onCartUpdated) onCartUpdated();

    if (res.unavailableItems.length > 0) {
      setReorderNotice(
        `تمت إضافة ${res.addedCount} صنف متاح إلى السلة. تنبيه: بعض الأصناف غير متوفرة حالياً (${res.unavailableItems.join('، ')})`
      );
    } else {
      setReorderNotice('تمت إضافة جميع أصناف الطلب بنجاح إلى سلة المشتريات!');
    }

    setTimeout(() => {
      onNavigate('cart');
    }, 1500);
  };

  const handleTrack = () => {
    if (onSelectOrderToTrack) {
      onSelectOrderToTrack(order.orderNumber, order.phone);
    }
    onNavigate('track-order');
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم مطعم الزعيم، هذا تأكيد لطلبي رقم (${order.orderNumber}) بقيمة إجمالية ${order.total} ج.م باسم ${order.customerName}. شكراً لكم!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-3 no-print"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-white">تم استلام طلبك بنجاح!</h1>
        <p className="text-sm text-neutral-300">
          شكراً لاختيارك <span className="font-bold text-amber-400">{settings.name}</span>. جاري تحضير طلبك بعناية وسرعة.
        </p>
      </motion.div>

      {reorderNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{reorderNotice}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>طباعة الفاتورة (Receipt)</span>
        </button>

        <button
          onClick={handleTrack}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <Compass className="w-4 h-4" />
          <span>تتبع مسار الطلب</span>
        </button>

        <button
          onClick={handleReorder}
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>إعادة الطلب</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>مشاركة واتساب</span>
        </a>
      </div>

      {/* DIGITAL RECEIPT CARD (Styled cleanly for screen & window.print) */}
      <div className="print-receipt-container bg-[#141820] border border-neutral-800 rounded-3xl p-6 sm:p-8 text-right space-y-6 shadow-xl">
        {/* Receipt Header */}
        <div className="border-b border-neutral-800 pb-5 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-white">{settings.name}</div>
          <p className="text-xs text-amber-400 font-bold">{settings.category}</p>
          <p className="text-xs text-neutral-400">{settings.address}</p>
          <p className="text-xs text-neutral-400 tabular-nums">هاتف: {settings.phone}</p>
        </div>

        {/* Order Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800/80 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">رقم الطلب</span>
            <span className="font-black text-amber-400 font-mono text-sm">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">تاريخ الطلب</span>
            <span className="font-semibold text-white">
              {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">نوع الطلب</span>
            <span className="font-bold text-white">
              {order.orderType === 'delivery'
                ? 'توصيل منزلي'
                : order.orderType === 'dine_in'
                ? `داخل الصالة (${order.tableNumber || 'ترابيزة'})`
                : 'استلام من المطعم'}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">طريقة الدفع</span>
            <span className="font-bold text-white">
              {order.paymentMethod === 'cod' ? 'نقداً عند الاستلام' : 'نقداً بالمطعم'}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-1 text-xs border-b border-neutral-800 pb-4">
          <h3 className="font-bold text-white text-sm">بيانات العميل</h3>
          <p className="text-neutral-300">الاسم: <span className="font-bold text-white">{order.customerName}</span></p>
          <p className="text-neutral-300 tabular-nums">الهاتف: <span className="font-bold text-white">{order.phone}</span></p>
          {order.address && (
            <p className="text-neutral-300">العنوان: <span className="font-bold text-white">{order.address} {order.area ? `(${order.area})` : ''}</span></p>
          )}
          {order.notes && (
            <p className="text-amber-300">ملاحظات العميل: {order.notes}</p>
          )}
        </div>

        {/* Order Items Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">تفاصيل الأصناف والكميات</h3>
          <div className="divide-y divide-neutral-800 text-xs">
            <div className="grid grid-cols-12 py-2 font-bold text-neutral-400 border-b border-neutral-800">
              <span className="col-span-6">الصنف</span>
              <span className="col-span-2 text-center">الكمية</span>
              <span className="col-span-2 text-center">سعر الوحدة</span>
              <span className="col-span-2 text-left">الإجمالي</span>
            </div>

            {order.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-6">
                  <span className="font-bold text-white block">{item.productName}</span>
                  {item.notes && (
                    <span className="text-[10px] text-neutral-400 block">({item.notes})</span>
                  )}
                </div>
                <span className="col-span-2 text-center tabular-nums text-neutral-200">{item.quantity}</span>
                <span className="col-span-2 text-center tabular-nums text-neutral-300">{item.unitPrice} ج.م</span>
                <span className="col-span-2 text-left font-bold text-white tabular-nums">{item.subtotal} ج.م</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-300">
            <span>المجموع الفرعي</span>
            <span className="font-bold text-white tabular-nums">{order.subtotal} ج.م</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>خصم الكوبون ({order.couponCode || 'خصم ترويجي'})</span>
              <span className="tabular-nums">- {order.discount} ج.م</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-300">
            <span>رسوم التوصيل</span>
            <span className="tabular-nums">{order.deliveryFee > 0 ? `${order.deliveryFee} ج.م` : 'مجاناً'}</span>
          </div>

          <div className="border-t border-neutral-800/80 pt-2 flex justify-between items-center text-sm">
            <span className="font-black text-white">المجموع الإجمالي</span>
            <span className="font-black text-xl text-amber-400 tabular-nums">{order.total} ج.م</span>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400 space-y-1">
          <p>شكراً لطلبكم من مطعم الزعيم - مأكولات شعبية مصرية</p>
          <p className="text-[11px] text-neutral-500">نتشرف بخدمتكم على مدار 24 ساعة يومياً</p>
        </div>
      </div>

      <div className="text-center no-print">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </button>
      </div>
    </div>
  );
};
