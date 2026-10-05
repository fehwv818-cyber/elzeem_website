import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'صورة طعام',
  fallbackText,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${containerClassName}`}>
      {!hasError ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`${className} ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
            {...props}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-900/80 animate-pulse flex items-center justify-center">
              <Utensils className="w-6 h-6 text-neutral-700" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-neutral-400 p-4 text-center">
          <Utensils className="w-8 h-8 text-amber-500/60 mb-2" />
          <span className="text-xs text-neutral-300 font-medium">{fallbackText || alt}</span>
        </div>
      )}
    </div>
  );
};
