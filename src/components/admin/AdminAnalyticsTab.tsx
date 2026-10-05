import React, { useState } from 'react';
import {
  TrendingUp,
  Banknote,
  ShoppingBag,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3,
  PieChart,
  Bike,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { Order } from '../../types';

interface AdminAnalyticsTabProps {
  orders: Order[];
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({ orders }) => {
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredOrders = orders.filter((o) => {
    if (dateFilter === 'all') return true;
    const orderDate = new Date(o.createdAt);
    const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);

    if (dateFilter === 'today') {
      return o.createdAt.startsWith(todayStr);
    }
    if (dateFilter === '7days') {
      return diffDays <= 7;
    }
    if (dateFilter === '30days') {
      return diffDays <= 30;
    }
    return true;
  });

  const completedOrders = filteredOrders.filter((o) => o.status === 'completed');
  const cancelledOrders = filteredOrders.filter((o) => o.status === 'cancelled');

  const totalSales = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const averageOrderValue = completedOrders.length > 0 ? Math.round(totalSales / completedOrders.length) : 0;

  // Today specific metrics
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todaySales = todayOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  // Delivery vs Pickup
  const deliveryCount = filteredOrders.filter((o) => o.orderType === 'delivery').length;
  const pickupCount = filteredOrders.filter((o) => o.orderType === 'pickup').length;
  const dineInCount = filteredOrders.filter((o) => o.orderType === 'dine_in').length;

  // Top products
  const productCountMap: Record<string, { name: string; count: number; revenue: number }> = {};
  filteredOrders.forEach((o) => {
    o.items.forEach((it) => {
      if (!productCountMap[it.productName]) {
        productCountMap[it.productName] = { name: it.productName, count: 0, revenue: 0 };
      }
      productCountMap[it.productName].count += it.quantity;
      productCountMap[it.productName].revenue += it.subtotal;
    });
  });

  const topProducts = Object.values(productCountMap).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">تحليلات المبيعات والأداء الحقيقي</h2>
          <p className="text-xs text-neutral-400">
            أرقام حقيقية مستخرجة بالكامل من الطلبات المكتملة دون أي بيانات افتراضية
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              dateFilter === 'today' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            اليوم
          </button>
          <button
            onClick={() => setDateFilter('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              dateFilter === '7days' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            آخر 7 أيام
          </button>
          <button
            onClick={() => setDateFilter('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              dateFilter === '30days' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            آخر 30 يوم
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              dateFilter === 'all' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            كافة الفترات
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center bg-[#141820] border border-neutral-800 rounded-2xl space-y-3">
          <BarChart3 className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="font-bold text-white text-base">لا توجد بيانات مبيعات بعد</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            ستظهر التحليلات الدقيقة، والرسوم البيانية، وقائمة الأطباق الأكثر مبيعاً تلقائياً بمجرد إتمام أول طلب عبر الموقع.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">مبيعات اليوم</span>
              <span className="text-xl font-black text-amber-400 tabular-nums block mt-1">{todaySales} ج.م</span>
              <span className="text-[10px] text-neutral-500">{todayOrders.length} طلبات اليوم</span>
            </div>

            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">إجمالي مبيعات الفترة</span>
              <span className="text-xl font-black text-white tabular-nums block mt-1">{totalSales} ج.م</span>
              <span className="text-[10px] text-emerald-400">طلبات مكتملة</span>
            </div>

            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">عدد الطلبات</span>
              <span className="text-xl font-black text-white tabular-nums block mt-1">{filteredOrders.length}</span>
              <span className="text-[10px] text-neutral-500">في الفترة المحددة</span>
            </div>

            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">متوسط قيمة الطلب (AOV)</span>
              <span className="text-xl font-black text-amber-400 tabular-nums block mt-1">{averageOrderValue} ج.م</span>
              <span className="text-[10px] text-neutral-500">لكل طلب مكتمل</span>
            </div>

            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">طلبات تم تسليمها</span>
              <span className="text-xl font-black text-emerald-400 tabular-nums block mt-1">{completedOrders.length}</span>
              <span className="text-[10px] text-neutral-500">تمت بنجاح</span>
            </div>

            <div className="bg-[#141820] border border-neutral-800 p-4 rounded-2xl text-right">
              <span className="text-[11px] text-neutral-400 block">طلبات ملغاة</span>
              <span className="text-xl font-black text-red-400 tabular-nums block mt-1">{cancelledOrders.length}</span>
              <span className="text-[10px] text-neutral-500">ملغية</span>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Sold Dishes */}
            <div className="lg:col-span-7 bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>أكثر الأصناف طلباً في هذه الفترة</span>
              </h3>

              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="text-amber-400 font-bold tabular-nums">
                          {p.count} مرات ({p.revenue} ج.م)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-900 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: `${(p.count / topProducts[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">لا توجد مبيعات أصناف في الفترة المحددة.</p>
              )}
            </div>

            {/* Delivery vs Pickup vs Dine-in */}
            <div className="lg:col-span-5 bg-[#141820] border border-neutral-800 rounded-2xl p-6 text-right space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <span>توزيع الطلبات حسب طريقة الاستلام</span>
              </h3>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-medium">توصيل للمنازل</span>
                  </div>
                  <span className="font-bold text-white tabular-nums">{deliveryCount} طلبات</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">استلام من المطعم</span>
                  </div>
                  <span className="font-bold text-white tabular-nums">{pickupCount} طلبات</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">تناول داخل الصالة</span>
                  </div>
                  <span className="font-bold text-white tabular-nums">{dineInCount} طلبات</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
