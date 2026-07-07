import { X } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function ModalContainer() {
  const { modals, closeModal } = useModal();

  if (modals.length === 0) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" role="presentation">
        {modals.map((modal) => (
          <div
            key={modal.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${modal.id}`}
            tabIndex={-1}
            className={`${sizeClasses[modal.size || 'md']} w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in zoom-in-95`}
          >
            {/* Header */}
            {(modal.title || modal.closable) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                {modal.title && (
                  <h2 id={`modal-title-${modal.id}`} className="text-xl font-black text-gray-900">{modal.title}</h2>
                )}
                {modal.closable && (
                  <button
                    onClick={() => closeModal(modal.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {modal.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}