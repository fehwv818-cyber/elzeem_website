import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Tag, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { Offer } from '../../types';
import { db } from '../../services/db';

interface AdminOffersTabProps {
  offers: Offer[];
  onRefreshData: () => void;
}

export const AdminOffersTab: React.FC<AdminOffersTabProps> = ({ offers, onRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    oldPrice: 50,
    newPrice: 40,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    active: true,
  });

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setForm({
      title: '',
      description: '',
      oldPrice: 50,
      newPrice: 40,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description,
      oldPrice: offer.oldPrice,
      newPrice: offer.newPrice,
      startDate: offer.startDate,
      endDate: offer.endDate,
      active: offer.active,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      db.updateOffer(editingOffer.id, form);
    } else {
      db.addOffer(form);
    }
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      db.deleteOffer(id);
      onRefreshData();
    }
  };

  const handleToggleActive = (offer: Offer) => {
    db.updateOffer(offer.id, { active: !offer.active });
    onRefreshData();
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة العروض والخصومات الخاصة ({offers.length})</h2>
          <p className="text-xs text-neutral-400">
            يمكن للمدير فقط إنشاء عروض حقيقية وتحديد أسعارها وفترات صلاحيتها
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء عرض جديد</span>
        </button>
      </div>

      {offers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-[#141820] border rounded-2xl p-5 space-y-4 shadow-sm ${
                offer.active ? 'border-neutral-800' : 'border-neutral-800/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{offer.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{offer.description}</p>
                </div>
                <button
                  onClick={() => handleToggleActive(offer)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    offer.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {offer.active ? 'ساري' : 'متوقف'}
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="text-neutral-500 line-through tabular-nums">{offer.oldPrice} ج.م</span>
                <span className="text-amber-400 font-black text-lg tabular-nums">{offer.newPrice} ج.م</span>
              </div>

              <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 flex items-center justify-between">
                <span>الصلاحية: {offer.startDate} إلى {offer.endDate}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(offer)} className="p-1.5 text-neutral-400 hover:text-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(offer.id)} className="p-1.5 text-neutral-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#141820] border border-neutral-800 rounded-2xl space-y-3">
          <Tag className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">لا توجد عروض مضافة حالياً</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            تطبيقاً لقواعد المصداقية، لا يتم عرض أي عروض وهمية. يمكنك إضافة عرض حقيقي في أي وقت.
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right space-y-4">
            <h3 className="font-bold text-base text-white">
              {editingOffer ? 'تعديل العرض' : 'إنشاء عرض جديد'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-neutral-300">عنوان العرض *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عرض لمة الصحاب 4 ساندوتشات وبطاطس"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-300">وصف العرض</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-neutral-300">السعر الأصلي (ج.م) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-neutral-300">سعر العرض بعد الخصم *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.newPrice}
                    onChange={(e) => setForm({ ...form, newPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-neutral-300">تاريخ البدء</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-neutral-300">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  حفظ العرض
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
