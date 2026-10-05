import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Ticket, Check, X } from 'lucide-react';
import { Coupon } from '../../types';
import { db } from '../../services/db';

interface AdminCouponsTabProps {
  coupons: Coupon[];
  onRefreshData: () => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({ coupons, onRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minimumOrder: 40,
    maximumDiscount: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-12-31',
    active: true,
  });

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setForm({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrder: 40,
      maximumDiscount: 20,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrder: coupon.minimumOrder,
      maximumDiscount: coupon.maximumDiscount || 0,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      active: coupon.active,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    if (editingCoupon) {
      db.updateCoupon(editingCoupon.id, form);
    } else {
      db.addCoupon({ ...form, code: form.code.trim().toUpperCase() });
    }
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      db.deleteCoupon(id);
      onRefreshData();
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    db.updateCoupon(coupon.id, { active: !coupon.active });
    onRefreshData();
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة أكواد الخصم والكوبونات ({coupons.length})</h2>
          <p className="text-xs text-neutral-400">
            أكواد ترويجية يتم فحصها وتطبيقها فعلياً عند إتمام الطلب (Checkout)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة كوبون جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`bg-[#141820] border rounded-2xl p-5 space-y-3 shadow-sm ${
              c.active ? 'border-neutral-800' : 'border-neutral-800/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-black text-amber-400 text-lg tracking-wider block">
                  {c.code}
                </span>
                <span className="text-xs text-white font-bold block mt-1">
                  خصم {c.discountValue} {c.discountType === 'percentage' ? '%' : 'ج.م'}
                </span>
              </div>
              <button
                onClick={() => handleToggleActive(c)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {c.active ? 'مفعل' : 'معطل'}
              </button>
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <div>الحد الأدنى للطلب: <span className="text-white font-bold tabular-nums">{c.minimumOrder} ج.م</span></div>
              {c.maximumDiscount ? (
                <div>الحد الأقصى للخصم: <span className="text-white font-bold tabular-nums">{c.maximumDiscount} ج.م</span></div>
              ) : null}
              <div>مرات الاستخدام: <span className="text-amber-400 font-bold tabular-nums">{c.usedCount} مرة</span></div>
            </div>

            <div className="text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-2 flex items-center justify-between">
              <span>ينتهي في: {c.endDate}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-neutral-400 hover:text-white">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 text-neutral-400 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-sm bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right space-y-4">
            <h3 className="font-bold text-base text-white">
              {editingCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-neutral-300">كود الخصم *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ZAEEM20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-neutral-300">نوع الخصم</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-neutral-300">قيمة الخصم *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-neutral-300">الحد الأدنى للطلب (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minimumOrder}
                    onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-neutral-300">أقصى قيمة للخصم (اختياري)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maximumDiscount}
                    onChange={(e) => setForm({ ...form, maximumDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  حفظ الكوبون
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
