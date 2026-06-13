import { X, FileText, User, Calendar, Building2, CheckCircle2, Clock } from 'lucide-react';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailsModal({ isOpen, onClose }: TransactionDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto"
        style={{ direction: 'rtl' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)' }}>تفاصيل المعاملة</h3>
              <p className="text-xs font-mono opacity-50">TXN-2024-441</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:bg-gray-100">
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
            >
              بانتظار التوقيع
            </span>
            <span
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}
            >
              مستعجل
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: User, label: 'مقدم الطلب', value: 'خالد أحمد مطر' },
              { icon: Building2, label: 'الدائرة', value: 'الشؤون الإدارية' },
              { icon: FileText, label: 'نوع المعاملة', value: 'طلب وثيقة رسمية' },
              { icon: Calendar, label: 'تاريخ التقديم', value: '2024-01-29' },
            ].map((field, idx) => {
              const Icon = field.icon;
              return (
                <div key={idx} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 mt-0.5 opacity-40 shrink-0" />
                  <div>
                    <p className="text-xs opacity-50">{field.label}</p>
                    <p className="text-sm">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="opacity-60">التقدم</span>
              <span style={{ color: 'var(--primary)' }}>60%</span>
            </div>
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
              <div className="h-2 rounded-full" style={{ width: '60%', backgroundColor: 'var(--primary)' }} />
            </div>
            <p className="text-xs opacity-40 mt-1">المرحلة 3 من 5</p>
          </div>

          {/* Mini Timeline */}
          <div>
            <p className="text-sm mb-3 opacity-60">مسار المعاملة</p>
            {[
              { label: 'استلام وتسجيل', done: true },
              { label: 'مراجعة أولية', done: true },
              { label: 'إحالة للرئيس', done: true },
              { label: 'بانتظار التوقيع', done: false, current: true },
              { label: 'الإصدار', done: false },
            ].map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                {s.done ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#428177' }} />
                ) : s.current ? (
                  <Clock className="w-4 h-4 shrink-0" style={{ color: '#988561' }} />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--border)' }} />
                )}
                <span
                  className="text-sm"
                  style={{
                    color: s.done ? 'var(--charcoal-dark)' : s.current ? '#988561' : '#aaa',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            className="flex-1 py-2.5 rounded-lg text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            توقيع واعتماد
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm border transition-all hover:bg-gray-50"
            style={{ borderColor: 'var(--border)' }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
