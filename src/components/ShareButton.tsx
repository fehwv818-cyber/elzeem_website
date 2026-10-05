import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'pill' | 'button' | 'icon';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = 'مطعم الزعيم - المأكولات الشعبية المصرية',
  text = 'أفضل مأكولات شعبية وفلافل وفول في الحسينية، محافظة الشرقية.',
  url = window.location.href,
  className = '',
  variant = 'button',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch (err: unknown) {
        // User cancelled or aborted
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual prompt if clipboard restricted
      window.prompt('انسخ رابط المطعم:', url);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        aria-label="مشاركة موقع المطعم"
        title="مشاركة موقع المطعم"
        className={`p-2.5 rounded-lg border border-neutral-700/80 bg-neutral-800/80 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors flex items-center justify-center ${className}`}
      >
        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-medium text-neutral-200 hover:border-amber-500/60 hover:text-amber-400 bg-neutral-900/60 transition-colors ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">تم نسخ الرابط!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-amber-500" />
          <span>مشاركة المطعم</span>
        </>
      )}
    </button>
  );
};
