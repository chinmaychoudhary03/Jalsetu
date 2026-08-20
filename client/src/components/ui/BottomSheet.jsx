import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = '85vh',
  showHandle = true,
  showCloseButton = false,
  className = '',
}) => {
  // Close on escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) onClose?.();
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end">
      {/* Overlay */}
      <div
        className="sheet-overlay absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          'sheet-panel relative w-full bg-white rounded-t-3xl overflow-hidden',
          'flex flex-col',
          className,
        ].join(' ')}
        style={{ maxHeight }}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
            {title && (
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
