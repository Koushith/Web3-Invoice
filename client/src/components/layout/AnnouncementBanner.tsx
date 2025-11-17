import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Banner will come back on page refresh - not permanently dismissed
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-[#635BFF] via-[#7C75FF] to-[#635BFF] border-b border-[#5448E8] transition-all duration-300 ease-out',
        isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      )}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] sm:text-sm leading-relaxed">
                <span className="font-semibold">What you can use now:</span>{' '}
                <span className="font-medium">
                  Create beautiful invoices, manage customers, send professional PDFs, and host public invoice pages.
                </span>{' '}
                <span className="text-white/90 hidden md:inline">
                  Payment tracking and integrations (fiat & stablecoins) are work in progress and will ship in upcoming releases.
                </span>
                <span className="text-white/90 inline md:hidden">
                  Payment features coming soon!
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-colors active:scale-95"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
