import { useState } from 'react';
import { XCircle, X } from 'lucide-react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const rejectReasons = [
  'مستندات ناقصة أو غير مكتملة',
  'المعاملة خارج نطاق الاختصاص',
  'وجود تعارض مع الأنظمة واللوائح',
  'تكرار الطلب',
  'سبب آخر',
];

export function RejectModal({ isOpen, onClose, onConfirm }: RejectModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setSelectedReason('');
    setNote('');
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ direction: 'rtl' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b rounded-t-2xl"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(107,31,42,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'rgba(107,31,42,0.1)' }}
            >
              <XCircle className="w-5 h-5" style={{ color: '#6b1f2a' }} />
            </div>
            <div>
              <h3 style={{ color: '#6b1f2a' }}>رفض المعاملة</h3>
              <p className="text-xs opacity-60">يرجى تحديد سبب الرفض</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:bg-gray-100"
          >
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm mb-2 block opacity-70">سبب الرفض</label>
            <div className="space-y-2">
              {rejectReasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                  style={{
                    borderColor: selectedReason === r ? 'rgba(107,31,42,0.4)' : 'var(--border)',
                    backgroundColor: selectedReason === r ? 'rgba(107,31,42,0.04)' : 'var(--beige)',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 shrink-0 transition-all"
                    style={{
                      borderColor: selectedReason === r ? '#6b1f2a' : 'var(--border)',
                      backgroundColor: selectedReason === r ? '#6b1f2a' : 'transparent',
                    }}
                  />
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    className="hidden"
                    onChange={() => setSelectedReason(r)}
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block opacity-70">ملاحظات إضافية (اختياري)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="أضف تفاصيل إضافية..."
              className="w-full p-3 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason}
            className="flex-1 py-2.5 rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6b1f2a', color: 'white' }}
          >
            تأكيد الرفض
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm border transition-all hover:bg-gray-50"
            style={{ borderColor: 'var(--border)' }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
