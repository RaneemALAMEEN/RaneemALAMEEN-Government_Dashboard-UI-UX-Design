import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center" style={{ direction: 'rtl' }}>
        <div className="p-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(66,129,119,0.12)' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: '#428177' }} />
          </div>
          <h3 className="mb-2" style={{ color: 'var(--primary)' }}>تمت العملية بنجاح</h3>
          <p className="text-sm opacity-60 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
}
