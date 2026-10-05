import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCheck,
  XCircle,
  Eye,
  Printer,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { db } from '../../services/db';

interface AdminOrdersTabProps {
  orders: Order[];
  onRefreshData: () => void;
}

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: 'طلب جديد', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: Clock },
  confirmed: { label: 'تم التأكيد', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40', icon: CheckCircle2 },
  preparing: { label: 'جاري التحضير', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: ChefHat },
  ready: { label: 'جاهز للاستلام/التوصيل', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40', icon: PackageCheck },
  out_for_delivery: { label: 'خرج للتوصيل', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40', icon: Bike },
  completed: { label: 'مكتمل / تم التسليم', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCheck },
  cancelled: { label: 'ملغي', color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: XCircle },
};

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, onRefreshData }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    onRefreshData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePrintReceipt = (order: Order) => {
    // Safe iframe print for sandbox/iframe environment without popup blockers
    let iframe = document.getElementById('receipt-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'receipt-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html dir="rtl">
          <head>
            <title>فاتورة ${order.orderNumber} - مطعم الزعيم</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; text-align: right; max-width: 380px; margin: auto; }
              h2 { text-align: center; margin: 0; font-size: 20px; }
              .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
              .meta { font-size: 12px; margin-bottom: 10px; line-height: 1.6; }
              .items { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
              .items th, .items td { padding: 5px 2px; border-bottom: 1px solid #eee; }
              .total { font-weight: bold; font-size: 13px; text-align: left; }
              .footer { text-align: center; font-size: 11px; margin-top: 15px; border-top: 1px dashed #000; padding-top: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>مطعم الزعيم</h2>
              <div style="font-size:12px; margin-top:3px;">مأكولات شعبية مصرية - فلافل وفول</div>
              <div style="font-size:11px;">المركز، الحسينية - هاتف: 01204241578</div>
            </div>
            <div class="meta">
              <div>رقم الطلب: <b>${order.orderNumber}</b></div>
              <div>التاريخ: ${new Date(order.createdAt).toLocaleString('ar-EG')}</div>
              <div>العميل: ${order.customerName} (${order.phone})</div>
              <div>نوع الطلب: ${order.orderType === 'delivery' ? 'توصيل منزلي' : order.orderType === 'dine_in' ? `ترابيزة (${order.tableNumber || ''})` : 'استلام من المطعم'}</div>
              <div>العنوان: ${order.address}</div>
            </div>
            <table class="items">
              <thead>
                <tr><th style="text-align:right;">الصنف</th><th>الكمية</th><th>السعر</th><th style="text-align:left;">الإجمالي</th></tr>
              </thead>
              <tbody>
                ${order.items.map((i) => `<tr><td style="text-align:right;">${i.productName}</td><td style="text-align:center;">${i.quantity}</td><td style="text-align:center;">${i.unitPrice}</td><td style="text-align:left;">${i.subtotal}</td></tr>`).join('')}
              </tbody>
            </table>
            <div class="total">المجموع الفرعي: ${order.subtotal} ج.م</div>
            ${order.discount > 0 ? `<div style="font-size:12px; color:green; text-align:left;">الخصم: -${order.discount} ج.م</div>` : ''}
            <div style="font-size:12px; text-align:left;">رسوم التوصيل: ${order.deliveryFee} ج.م</div>
            <div class="total" style="font-size:16px; margin-top:6px; border-top: 1px solid #000; padding-top: 4px;">الإجمالي المطلوب: ${order.total} ج.م</div>
            <div class="footer">شكراً لاختياركم مطعم الزعيم - بالهنا والشفا</div>
          </body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        iframe?.contentWindow?.focus();
        iframe?.contentWindow?.print();
      }, 250);
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة ومتابعة الطلبات ({orders.length})</h2>
          <p className="text-xs text-neutral-400">تحديث حالات الطلبات، طباعة الفواتير، ومتابعة العملاء</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث برقم الطلب، اسم العميل، أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3" />
        </div>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-amber-400 text-neutral-950'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          الكل ({orders.length})
        </button>
        {Object.entries(STATUS_LABELS).map(([st, meta]) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? 'bg-amber-400 text-neutral-950'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-[#141820] border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 border-b border-neutral-800 font-bold">
                <tr>
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">الهاتف</th>
                  <th className="py-3 px-4">النوع</th>
                  <th className="py-3 px-4">الأصناف</th>
                  <th className="py-3 px-4">الإجمالي</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">الوقت</th>
                  <th className="py-3 px-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredOrders.map((order) => {
                  const statusMeta = STATUS_LABELS[order.status] || STATUS_LABELS.new;
                  return (
                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-neutral-300 tabular-nums">
                        {order.phone}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {order.orderType === 'delivery'
                          ? 'توصيل'
                          : order.orderType === 'dine_in'
                          ? `ترابيزة ${order.tableNumber || ''}`
                          : 'استلام'}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        <span className="font-semibold text-white">{order.items.length} أصناف</span>
                        <span className="text-[11px] text-neutral-500 block truncate max-w-[130px]">
                          {order.items.map((i) => i.productName).join('، ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-amber-400 tabular-nums">
                        {order.total} ج.م
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer bg-neutral-900 ${statusMeta.color}`}
                        >
                          {Object.entries(STATUS_LABELS).map(([st, m]) => (
                            <option key={st} value={st}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                            title="عرض تفاصيل الطلب"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(order)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                            title="طباعة الفاتورة"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#141820] border border-neutral-800 rounded-2xl space-y-2">
          <Filter className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">لا توجد طلبات مطابقة للبحث أو الفلتر</h3>
          <p className="text-xs text-neutral-400">ستظهر الطلبات الجديدة تلقائياً فور إرسالها من العملاء.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-lg bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-xs text-neutral-400">تفاصيل الطلب الكاملة</span>
                <h3 className="font-black text-lg text-white font-mono text-amber-400">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
              <div>
                <span className="text-neutral-500 block">اسم العميل</span>
                <span className="font-bold text-white">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">رقم الهاتف</span>
                <a href={`tel:${selectedOrder.phone}`} className="font-bold text-amber-400 tabular-nums hover:underline">
                  {selectedOrder.phone}
                </a>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block">العنوان</span>
                <span className="font-semibold text-white">{selectedOrder.address}</span>
              </div>
              {selectedOrder.notes && (
                <div className="col-span-2 text-amber-300">
                  ملاحظات: {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-white">الأصناف المطلوبة:</h4>
              <div className="divide-y divide-neutral-800 text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-bold ml-2">{it.quantity}×</span>
                      <span className="text-white font-medium">{it.productName}</span>
                      {it.notes && <span className="text-[10px] text-neutral-400 block">({it.notes})</span>}
                    </div>
                    <span className="font-bold text-white tabular-nums">{it.subtotal} ج.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="border-t border-neutral-800 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>المجموع الفرعي:</span>
                <span className="tabular-nums text-white">{selectedOrder.subtotal} ج.م</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>الخصم:</span>
                  <span className="tabular-nums">-{selectedOrder.discount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>رسوم التوصيل:</span>
                <span className="tabular-nums text-white">{selectedOrder.deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-neutral-800">
                <span>الإجمالي الكلي:</span>
                <span className="text-amber-400 tabular-nums text-base">{selectedOrder.total} ج.م</span>
              </div>
            </div>

            {/* Notice */}
            {reorderNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <span>{reorderNotice}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => handlePrintReceipt(selectedOrder)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الفاتورة</span>
              </button>

              <button
                onClick={() => {
                  const res = db.reorder(selectedOrder);
                  onRefreshData();
                  if (res.unavailableItems.length > 0) {
                    setReorderNotice(`تمت إضافة ${res.addedCount} صنف للسلة. تنبيه: (${res.unavailableItems.join('، ')}) غير متوفر حالياً.`);
                  } else {
                    setReorderNotice('تمت إضافة جميع أصناف الطلب بنجاح إلى سلة المشتريات!');
                  }
                  setTimeout(() => setReorderNotice(null), 3500);
                }}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الطلب</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
