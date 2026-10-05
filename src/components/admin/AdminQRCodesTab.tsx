import React, { useState } from 'react';
import {
  QrCode,
  UtensilsCrossed,
  Star,
  Phone,
  Navigation,
  ExternalLink,
  Printer,
  Download,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { RestaurantSettings, RestaurantTable } from '../../types';
import { QRCodeModal } from '../QRCodeModal';

interface AdminQRCodesTabProps {
  settings: RestaurantSettings;
  tables: RestaurantTable[];
}

export const AdminQRCodesTab: React.FC<AdminQRCodesTabProps> = ({ settings, tables }) => {
  const [selectedTableNum, setSelectedTableNum] = useState<string>(tables[0]?.tableNumber?.toString() || '1');
  const [modalQR, setModalQR] = useState<{ title: string; subtitle: string; dataUrl: string } | null>(null);

  const origin = window.location.origin;

  const menuUrl = `${origin}/#menu`;
  const tableUrl = `${origin}/#menu?table=${selectedTableNum}`;
  const callUrl = `tel:${settings.phone}`;
  const directionsUrl = settings.googleMapsUrl;
  const reviewUrl = settings.googleReviewUrl || '';

  const qrCards = [
    {
      id: 'menu',
      title: 'باركود المنيو الرقمي (Menu QR)',
      desc: 'باركود ديناميكي يفتح قائمة الطعام والأسعار على هاتف الزبون مباشرة دون الحاجة لطباعة ورقية.',
      dataUrl: menuUrl,
      icon: UtensilsCrossed,
      color: 'text-amber-400',
    },
    {
      id: 'table',
      title: 'باركود ترابيزات الصالة (Table QR)',
      desc: 'يربط الطلب آلياً برقم الترابيزة المختارة ليظهر للكاشير فوراً عند إتمام الزبون لطلبه.',
      dataUrl: tableUrl,
      icon: QrCode,
      color: 'text-blue-400',
      hasTableSelector: true,
    },
    {
      id: 'review',
      title: 'باركود تقييم Google Reviews',
      desc: 'يمسحه العميل بالهاتف لينقله مباشرة لصفحة تقييم مطعم الزعيم بنجوم Google.',
      dataUrl: reviewUrl,
      icon: Star,
      color: 'text-yellow-400',
      isReview: true,
    },
    {
      id: 'call',
      title: 'باركود الاتصال السريع (Call QR)',
      desc: `يفتح فوراً شاشة الاتصال برقم هاتف المطعم الموحد (${settings.phone}).`,
      dataUrl: callUrl,
      icon: Phone,
      color: 'text-emerald-400',
    },
    {
      id: 'directions',
      title: 'باركود الاتجاهات وخرائط Google',
      desc: 'يفتح تطبيق خرائط Google ليرشد العميل مباشرة إلى موقع المطعم بالمركز، الحسينية.',
      dataUrl: directionsUrl,
      icon: Navigation,
      color: 'text-indigo-400',
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div>
        <h2 className="text-xl font-bold text-white">مركز إدارة واستخراج رموز الاستجابة السريعة (QR Codes)</h2>
        <p className="text-xs text-neutral-400">
          استخرج رموز QR الرسمية للمطعم، عاينها، وحملها بصيغة PNG أو اطبعها مباشرة لوضعها على الطاولات والمطبوعات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {qrCards.map((qr) => {
          const Icon = qr.icon;
          const isReviewDisabled = qr.isReview && !settings.googleReviewUrl;

          return (
            <div
              key={qr.id}
              className="bg-[#141820] border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-neutral-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 ${qr.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{qr.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">{qr.desc}</p>

                {qr.hasTableSelector && tables.length > 0 && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">اختر الترابيزة:</label>
                    <select
                      value={selectedTableNum}
                      onChange={(e) => setSelectedTableNum(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.tableNumber}>
                          {t.title} (ترابيزة {t.tableNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {isReviewDisabled && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>أضف رابط Google Review من إعدادات المطعم لتفعيل هذا الباركود.</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800/80">
                <button
                  disabled={Boolean(isReviewDisabled)}
                  onClick={() =>
                    setModalQR({
                      title: qr.title,
                      subtitle: qr.desc,
                      dataUrl: qr.dataUrl,
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة وتحميل / طباعة QR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalQR && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setModalQR(null)}
          title={modalQR.title}
          subtitle={modalQR.subtitle}
          dataUrl={modalQR.dataUrl}
        />
      )}
    </div>
  );
};
