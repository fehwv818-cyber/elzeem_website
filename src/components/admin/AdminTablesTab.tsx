import React, { useState } from 'react';
import { Plus, Trash2, Edit2, QrCode, Utensils, Check, X } from 'lucide-react';
import { RestaurantTable } from '../../types';
import { db } from '../../services/db';
import { QRCodeModal } from '../QRCodeModal';

interface AdminTablesTabProps {
  tables: RestaurantTable[];
  onRefreshData: () => void;
}

export const AdminTablesTab: React.FC<AdminTablesTabProps> = ({ tables, onRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [form, setForm] = useState({ tableNumber: 1, title: '', capacity: 4 });
  const [qrModalData, setQrModalData] = useState<{ title: string; dataUrl: string } | null>(null);

  const handleOpenAdd = () => {
    setEditingTable(null);
    const nextNum = tables.length + 1;
    setForm({ tableNumber: nextNum, title: `ترابيزة ${nextNum}`, capacity: 4 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tbl: RestaurantTable) => {
    setEditingTable(tbl);
    setForm({ tableNumber: Number(tbl.tableNumber), title: tbl.title, capacity: tbl.capacity || 4 });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTable) {
      db.updateTable(editingTable.id, form);
    } else {
      db.addTable(form);
    }
    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الترابيزة؟')) {
      db.deleteTable(id);
      onRefreshData();
    }
  };

  const handleToggleActive = (tbl: RestaurantTable) => {
    db.updateTable(tbl.id, { isActive: !tbl.isActive });
    onRefreshData();
  };

  const handleOpenQR = (tbl: RestaurantTable) => {
    const origin = window.location.origin;
    const tableUrl = `${origin}/#menu?table=${tbl.tableNumber}`;
    setQrModalData({
      title: `${tbl.title} (ترابيزة ${tbl.tableNumber})`,
      dataUrl: tableUrl,
    });
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">إدارة ترابيزات الصالة والـ QR Code ({tables.length})</h2>
          <p className="text-xs text-neutral-400">
            توليد كود QR لكل ترابيزة يتيح للزبون مسح الباركود، طلب الأكل مباشرة، وتسجيل رقم الترابيزة آلياً
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ترابيزة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((tbl) => (
          <div
            key={tbl.id}
            className={`bg-[#141820] border rounded-2xl p-5 space-y-4 transition-all shadow-sm ${
              tbl.isActive ? 'border-neutral-800' : 'border-neutral-800/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-bold block">ترابيزة رقم {tbl.tableNumber}</span>
                <h3 className="font-bold text-base text-white">{tbl.title}</h3>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  السعة: {tbl.capacity || 4} أفراد
                </span>
              </div>

              <button
                onClick={() => handleToggleActive(tbl)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                  tbl.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {tbl.isActive ? 'نشطة ومتاحة' : 'معطلة'}
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenQR(tbl)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>عرض وطباعة الـ QR</span>
              </button>

              <button
                onClick={() => handleOpenEdit(tbl)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                title="تعديل"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(tbl.id)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-red-400"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-sm bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-right space-y-4">
            <h3 className="font-bold text-base text-white">
              {editingTable ? 'تعديل الترابيزة' : 'إضافة ترابيزة جديدة'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-neutral-300">رقم الترابيزة *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.tableNumber}
                  onChange={(e) => setForm({ ...form, tableNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-300">اسم أو وصف الترابيزة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ترابيزة 1 أو ترابيزة عائلية"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-300">سعة الأفراد</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 tabular-nums"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  حفظ
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

      {/* QR Code Preview Modal */}
      {qrModalData && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setQrModalData(null)}
          title={qrModalData.title}
          subtitle="امسح الباركود للطلب المباشر من المنيو مع تحديد رقم الترابيزة"
          dataUrl={qrModalData.dataUrl}
        />
      )}
    </div>
  );
};
