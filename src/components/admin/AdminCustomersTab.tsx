import React, { useState } from 'react';
import { User, Phone, MapPin, ShoppingBag, Banknote, Calendar, Search } from 'lucide-react';
import { Customer, Order } from '../../types';

interface AdminCustomersTabProps {
  customers: Customer[];
  orders: Order[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ customers, orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.phone.trim() === selectedCustomer.phone.trim())
    : [];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">قاعدة بيانات العملاء ({customers.length})</h2>
          <p className="text-xs text-neutral-400">سجل العملاء، عدد الطلبات، إجمالي المشتريات، والعناوين</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-[#141820] border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 border-b border-neutral-800 font-bold">
                <tr>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">رقم الهاتف</th>
                  <th className="py-3 px-4">عدد الطلبات</th>
                  <th className="py-3 px-4">إجمالي الإنفاق</th>
                  <th className="py-3 px-4">آخر طلب</th>
                  <th className="py-3 px-4 text-left">الملف الشخصي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0) || 'ع'}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3 px-4 tabular-nums text-neutral-300">
                      <a href={`tel:${c.phone}`} className="hover:text-amber-400">
                        {c.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-white">
                      {c.ordersCount} طلبات
                    </td>
                    <td className="py-3 px-4 tabular-nums font-bold text-amber-400">
                      {c.totalSpent} ج.م
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-[11px]">
                      {c.lastOrder
                        ? new Date(c.lastOrder).toLocaleDateString('ar-EG')
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer"
                      >
                        عرض السجل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#141820] border border-neutral-800 rounded-2xl space-y-2">
          <User className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">لا يوجد عملاء مسجلين بعد</h3>
          <p className="text-xs text-neutral-400">يتم تسجيل العميل تلقائياً عند قيامه بإتمام أول طلب بنجاح.</p>
        </div>
      )}

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative z-10 w-full max-w-lg bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">{selectedCustomer.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">رقم الهاتف</span>
                <a href={`tel:${selectedCustomer.phone}`} className="font-bold text-amber-400 tabular-nums">
                  {selectedCustomer.phone}
                </a>
              </div>
              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[11px]">إجمالي ما أنفقه</span>
                <span className="font-bold text-white tabular-nums">{selectedCustomer.totalSpent} ج.م</span>
              </div>
            </div>

            {/* Addresses */}
            {selectedCustomer.addresses.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-neutral-300 block">العناوين المسجلة للعميل:</span>
                <div className="space-y-1">
                  {selectedCustomer.addresses.map((a, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{a.street} {a.area ? `(${a.area})` : ''} {a.building || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders History */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-white">سجل طلبات العميل ({customerOrders.length}):</h4>
              {customerOrders.length > 0 ? (
                <div className="divide-y divide-neutral-800 text-xs">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-amber-400 ml-2">{ord.orderNumber}</span>
                        <span className="text-neutral-400 text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                        <span className="text-[11px] text-neutral-500 block">
                          {ord.items.map((i) => `${i.productName} (${i.quantity})`).join('، ')}
                        </span>
                      </div>
                      <span className="font-bold text-white tabular-nums">{ord.total} ج.م</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">لا توجد طلبات سابقة لهذا الرقم.</p>
              )}
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
