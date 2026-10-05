import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, Send, CheckCircle2, Navigation, MessageCircle } from 'lucide-react';
import { RestaurantSettings } from '../types';
import { db } from '../services/db';
import { ShareButton } from '../components/ShareButton';

interface ContactPageProps {
  settings: RestaurantSettings;
  onMessageSent: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  settings,
  onMessageSent,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسمك الكريم');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('يرجى كتابة نص الرسالة أو الاستفسار');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      db.addMessage({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setIsSubmitting(false);
      setSubmitted(true);
      onMessageSent();

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
        setMessage('');
      }, 3500);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-right space-y-3 max-w-2xl"
      >
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          يسعدنا تواصلكم دائماً
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          تواصل مع مطعم الزعيم
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          لديك استفسار، طلب خاص، أو حجز مسبق للولائم والمناسبات؟ تواصل معنا مباشرة أو أرسل رسالتك وسنرد فوراً.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Info & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-5 space-y-6 text-right"
        >
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-sm">
            <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">
              بيانات التواصل الرسمية
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">الهاتف والطلبات السريعة</span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-base font-bold text-white hover:text-amber-400 transition-colors tabular-nums"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">العنوان وموقع المطعم</span>
                  <p className="text-sm font-semibold text-neutral-200 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">ساعات العمل</span>
                  <p className="text-sm font-semibold text-neutral-200">
                    {settings.openingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2.5">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${settings.phone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors tabular-nums"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصل الآن</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  'السلام عليكم مطعم الزعيم، أود الاستفسار عن...'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </motion.a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>الاتجاهات</span>
              </a>

              <ShareButton variant="icon" />
            </div>
          </div>

          {/* Interactive Google Maps Frame */}
          <div className="rounded-2xl overflow-hidden border border-neutral-800 aspect-[16/9] bg-neutral-900 shadow-xl">
            <iframe
              title="موقع مطعم الزعيم"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                settings.address
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full h-full filter contrast-105"
            />
          </div>
        </motion.div>

        {/* Right Column: Contact Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 sm:p-8 text-right space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">أرسل لنا رسالة</h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                سنكون سعداء بالرد على استفسارك وملاحظاتك في أسرع وقت.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">تم إرسال رسالتك بنجاح!</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    شكراً لتواصلك مع مطعم الزعيم، سنقوم بالتواصل معك هاتفياً في أقرب وقت.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: أحمد عبد الرحمن"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300">
                      رقم الهاتف المحمول *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 01204241578"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500 tabular-nums"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300">
                      نص الرسالة أو الاستفسار *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب استفسارك عن الطلبات، التوصيل، أو أي مقترح تود إرساله لإدارة المطعم..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-black text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الرسالة الآن'}</span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
