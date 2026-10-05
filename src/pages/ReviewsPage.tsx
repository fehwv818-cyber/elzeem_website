import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Review, RestaurantSettings } from '../types';
import { db } from '../services/db';

interface ReviewsPageProps {
  reviews: Review[];
  settings: RestaurantSettings;
  onReviewAdded: () => void;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  settings,
  onReviewAdded,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  // Distribution calculation
  const distribution = [
    { stars: 5, percentage: 74, count: 79 },
    { stars: 4, percentage: 18, count: 19 },
    { stars: 3, percentage: 5, count: 5 },
    { stars: 2, percentage: 2, count: 2 },
    { stars: 1, percentage: 1, count: 2 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMessage('يرجى كتابة اسمك الكريم');
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      setErrorMessage('يرجى كتابة تفاصيل رأيك في المطعم (5 أحرف على الأقل)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      db.addReview({
        authorName: authorName.trim(),
        rating,
        content: content.trim(),
      });
      setIsSubmitting(false);
      setSuccessSubmitted(true);
      onReviewAdded();

      setTimeout(() => {
        setSuccessSubmitted(false);
        setModalOpen(false);
        setAuthorName('');
        setContent('');
        setRating(5);
      }, 2500);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-right"
      >
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            شهادات حقيقية نعتز بها
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            آراء عملاء مطعم الزعيم
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            نسعد دائماً بسماع تجاربكم وملاحظاتكم التي تساعدنا في تقديم أفضل طعم مصري أصيل في الحسينية.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer self-start md:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>اكتب مراجعتك الآن</span>
        </motion.button>
      </motion.div>

      {/* Rating Summary & Distribution Box */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="bg-[#141820] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Score Display */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-2 border-b lg:border-b-0 lg:border-l border-neutral-800/80 pb-6 lg:pb-0 lg:pl-8">
            <div className="text-5xl sm:text-6xl font-black text-white tabular-nums">
              {settings.rating}
              <span className="text-2xl text-neutral-500 font-normal"> / 5</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 py-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium tabular-nums">
              بناءً على {settings.reviewsCount} مراجعة مسجلة
            </p>
          </div>

          {/* Stars Breakdown Bars */}
          <div className="lg:col-span-8 space-y-2.5">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-14 text-neutral-300 shrink-0 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.stars} نجوم</span>
                </div>

                <div className="flex-1 h-3 rounded-full bg-neutral-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>

                <span className="w-12 text-left text-neutral-400 tabular-nums">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Reviews Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-3">
          <span className="font-bold text-white text-sm">
            المراجعات المعتمدة ({approvedReviews.length})
          </span>
          <span>ترتيب: الأحدث أولاً</span>
        </div>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {approvedReviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={cardVariant}
              whileHover={{ y: -3 }}
              className="bg-[#141820] border border-neutral-800/90 rounded-2xl p-6 text-right flex flex-col justify-between hover:border-neutral-700 transition-colors space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">{rev.date}</span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed font-medium">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {rev.authorName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white">{rev.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>تقييم موثق</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Write Review Modal with AnimatePresence */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && setModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative z-10 w-full max-w-lg bg-[#141820] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-right"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>

              {successSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">شكراً لمشاركتك رأيك!</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    تم استلام تقييمك بنجاح، وستتم مراجعته واعتماده من قبل إدارة مطعم الزعيم خلال وقت قصير.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white">شاركنا تجربتك</h2>
                    <p className="text-xs text-neutral-400">
                      رأيك يساعدنا في الحفاظ على الجودة وخدمة أهل الحسينية بالشكل اللائق.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  {/* Rating Stars Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-300">
                      تقييمك للمطعم (من 1 إلى 5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-bold text-amber-400 mr-2 tabular-nums">
                        {rating} / 5 نجوم
                      </span>
                    </div>
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="مثال: محمد عبد الله"
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300">
                      رأيك في الطعام والخدمة
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="اكتب تجربتك مع طعم الفول، الطعمية، السرعة، أو النظافة..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-black text-sm transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال المراجعة'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
