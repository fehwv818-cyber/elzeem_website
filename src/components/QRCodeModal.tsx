import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, Copy, Check, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  dataUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  dataUrl,
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !dataUrl) return;

    QRCode.toDataURL(dataUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrSrc(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [isOpen, dataUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrSrc) return;
    const a = document.createElement('a');
    a.href = qrSrc;
    a.download = `alza3eem-qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    let iframe = document.getElementById('qr-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'qr-print-frame';
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
            <title>${title} - مطعم الزعيم</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 30px; }
              h1 { font-size: 24px; margin-bottom: 6px; }
              p { font-size: 15px; color: #333; margin-bottom: 20px; font-weight: bold; }
              img { width: 280px; height: 280px; border: 2px solid #ddd; padding: 12px; border-radius: 16px; margin: auto; }
              .footer { margin-top: 24px; font-size: 13px; color: #555; }
            </style>
          </head>
          <body>
            <h1>مطعم الزعيم</h1>
            <p>${title}</p>
            <img src="${qrSrc}" alt="${title}" />
            <div class="footer">المركز، الحسينية، محافظة الشرقية | هاتف: 01204241578</div>
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

  const handleCopy = () => {
    navigator.clipboard.writeText(dataUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#141820] dark:bg-[#141820] border border-neutral-700 rounded-2xl p-6 shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 text-amber-400">
          <QrIcon className="w-5 h-5" />
          <h3 className="font-bold text-lg text-white">{title}</h3>
        </div>

        {subtitle && <p className="text-xs text-neutral-400 -mt-2">{subtitle}</p>}

        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto">
          {qrSrc ? (
            <img src={qrSrc} alt={title} className="w-56 h-56 mx-auto object-contain" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-neutral-400 text-xs">
              جاري تجهيز الباركود...
            </div>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 truncate max-w-xs mx-auto dir-ltr font-mono bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
          {dataUrl}
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleDownload}
            className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
          <button
            onClick={handleCopy}
            className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
