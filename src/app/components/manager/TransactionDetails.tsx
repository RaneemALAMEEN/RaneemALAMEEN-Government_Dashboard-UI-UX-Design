import { useState } from 'react';
import {
  ArrowRight,
  Paperclip,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeftRight,
  PenSquare,
  User,
  Calendar,
  Building2,
  FileText,
  Shield,
} from 'lucide-react';
import { RejectModal } from './modals/RejectModal';
import { TransferModal } from './modals/TransferModal';
import { SuccessModal } from './modals/SuccessModal';

interface TransactionDetailsProps {
  transactionId: string;
  onBack: () => void;
}

const timelineEvents = [
  { status: 'done', action: 'استلام وتسجيل المعاملة', user: 'نظام الاستقبال', time: '2024-01-29 09:15', note: 'تم استلام المعاملة وإعطاؤها الرقم التسلسلي' },
  { status: 'done', action: 'مراجعة أولية', user: 'حسن كامل', time: '2024-01-29 11:30', note: 'تمت المراجعة — المستندات مكتملة' },
  { status: 'done', action: 'إحالة لرئيس الدائرة', user: 'حسن كامل', time: '2024-01-30 08:45', note: 'تم الإحالة للاعتماد النهائي' },
  { status: 'current', action: 'بانتظار توقيع رئيس الدائرة', user: 'محمد العمر', time: '2024-01-31 10:00', note: '' },
  { status: 'pending', action: 'إصدار القرار النهائي', user: '—', time: '—', note: '' },
  { status: 'pending', action: 'إشعار مقدم الطلب', user: '—', time: '—', note: '' },
];

const auditTrail = [
  { time: '2024-01-30 14:22', user: 'حسن كامل', action: 'تغيير الحالة', from: 'مراجعة أولية', to: 'بانتظار الاعتماد', type: 'status' },
  { time: '2024-01-29 15:10', user: 'حسن كامل', action: 'إضافة ملاحظة', from: '', to: 'المستندات مكتملة وصحيحة', type: 'note' },
  { time: '2024-01-29 11:30', user: 'حسن كامل', action: 'تغيير الحالة', from: 'قيد الاستلام', to: 'مراجعة أولية', type: 'status' },
  { time: '2024-01-29 09:15', user: 'نظام الاستقبال', action: 'إنشاء المعاملة', from: '', to: 'TXN-2024-441', type: 'create' },
];

const attachments = [
  { name: 'طلب رسمي.pdf', size: '245 KB', type: 'pdf' },
  { name: 'صورة الهوية.jpg', size: '128 KB', type: 'img' },
  { name: 'شهادة الخدمة السابقة.pdf', size: '312 KB', type: 'pdf' },
];

export function TransactionDetails({ transactionId, onBack }: TransactionDetailsProps) {
  const [showReject, setShowReject] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [note, setNote] = useState('');

  const handleSuccess = (msg: string) => {
    setShowReject(false);
    setShowTransfer(false);
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  return (
    <>
      <RejectModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={() => handleSuccess('تم رفض المعاملة وإشعار مقدم الطلب')} />
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} onConfirm={() => handleSuccess('تم تحويل المعاملة بنجاح')} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />

      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm transition-all hover:opacity-70"
          style={{ color: 'var(--primary)' }}
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمعاملات
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl" style={{ color: 'var(--primary)' }}>طلب وثيقة رسمية</h1>
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
            <p className="text-sm opacity-60 font-mono">{transactionId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTransfer(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all hover:shadow-md"
              style={{ borderColor: 'var(--border)', color: 'var(--charcoal-dark)' }}
            >
              <ArrowLeftRight className="w-4 h-4" />
              تحويل
            </button>
            <button
              onClick={() => setShowReject(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--umber-light)', color: 'white' }}
            >
              <XCircle className="w-4 h-4" />
              رفض
            </button>
            <button
              onClick={() => handleSuccess('تم التوقيع على المعاملة بنجاح')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <PenSquare className="w-4 h-4" />
              توقيع واعتماد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Requester Info */}
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4" style={{ color: 'var(--primary)' }}>معلومات مقدم الطلب</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: User, label: 'الاسم الكامل', value: 'خالد أحمد مطر' },
                  { icon: Shield, label: 'رقم الهوية', value: '012345678' },
                  { icon: Building2, label: 'الدائرة', value: 'الشؤون الإدارية' },
                  { icon: Calendar, label: 'تاريخ التقديم', value: '2024-01-29' },
                ].map((field, idx) => {
                  const Icon = field.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg mt-0.5" style={{ backgroundColor: 'var(--beige)' }}>
                        <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs opacity-50 mb-0.5">{field.label}</p>
                        <p className="text-sm">{field.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4" style={{ color: 'var(--primary)' }}>تفاصيل المعاملة</h3>
              <div className="space-y-3">
                {[
                  { label: 'نوع المعاملة', value: 'طلب وثيقة رسمية' },
                  { label: 'الغرض', value: 'التقديم على وظيفة خارجية — وزارة التعليم العالي' },
                  { label: 'الأولوية', value: 'مستعجل' },
                  { label: 'المرحلة الحالية', value: 'اعتماد رئيس الدائرة' },
                ].map((d, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm opacity-60">{d.label}</span>
                    <span className="text-sm">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <h3 style={{ color: 'var(--primary)' }}>الملاحظات</h3>
              </div>
              <div className="space-y-3 mb-4">
                {[
                  { user: 'حسن كامل', time: '2024-01-29 15:10', note: 'المستندات مكتملة وصحيحة، يوصى بالاعتماد.' },
                ].map((n, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{n.user}</span>
                      <span className="text-xs opacity-50">{n.time}</span>
                    </div>
                    <p className="text-sm opacity-70">{n.note}</p>
                  </div>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="أضف ملاحظة..."
                rows={3}
                className="w-full p-3 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
              />
              {note && (
                <button
                  className="mt-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                  إضافة الملاحظة
                </button>
              )}
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Paperclip className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <h3 style={{ color: 'var(--primary)' }}>المرفقات</h3>
              </div>
              <div className="space-y-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                        <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p className="text-sm">{att.name}</p>
                        <p className="text-xs opacity-50">{att.size}</p>
                      </div>
                    </div>
                    <button className="text-sm" style={{ color: 'var(--primary)' }}>تحميل</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4" style={{ color: 'var(--primary)' }}>سجل التدقيق (Audit Trail)</h3>
              <div className="space-y-3">
                {auditTrail.map((entry, idx) => (
                  <div key={idx} className="flex gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{
                        backgroundColor:
                          entry.type === 'create' ? '#428177' :
                          entry.type === 'status' ? 'var(--primary)' : '#b9a779',
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium">{entry.action}</span>
                        <span className="text-xs opacity-50">{entry.time}</span>
                      </div>
                      <p className="text-xs opacity-60 mb-0.5">بواسطة: {entry.user}</p>
                      {entry.from && entry.to && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="opacity-50">{entry.from}</span>
                          <span>←</span>
                          <span style={{ color: 'var(--primary)' }}>{entry.to}</span>
                        </div>
                      )}
                      {!entry.from && entry.to && (
                        <p className="text-xs opacity-60">{entry.to}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Timeline */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-5 border shadow-sm sticky top-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-5" style={{ color: 'var(--primary)' }}>مسار سير العمل</h3>
              <div className="relative">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-3 pb-5 last:pb-0 relative">
                    {/* Connector Line */}
                    {idx < timelineEvents.length - 1 && (
                      <div
                        className="absolute top-5 right-[9px] w-0.5 bottom-0"
                        style={{
                          backgroundColor: event.status === 'done' ? 'var(--primary)' : 'var(--border)',
                        }}
                      />
                    )}
                    {/* Icon */}
                    <div className="shrink-0 z-10">
                      {event.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      ) : event.status === 'current' ? (
                        <Clock className="w-5 h-5" style={{ color: '#988561' }} />
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm mb-0.5"
                        style={{
                          color:
                            event.status === 'done' ? 'var(--charcoal-dark)' :
                            event.status === 'current' ? '#988561' : '#aaa',
                          fontWeight: event.status === 'current' ? '500' : '400',
                        }}
                      >
                        {event.action}
                      </p>
                      {event.user !== '—' && (
                        <p className="text-xs opacity-50">{event.user}</p>
                      )}
                      {event.time !== '—' && (
                        <p className="text-xs opacity-40">{event.time}</p>
                      )}
                      {event.note && (
                        <p
                          className="text-xs mt-1 px-2 py-1 rounded"
                          style={{ backgroundColor: 'var(--beige)', color: 'var(--charcoal-medium)' }}
                        >
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h4 className="mb-3 text-sm" style={{ color: 'var(--primary)' }}>إحصائيات سريعة</h4>
              {[
                { label: 'منذ الاستلام', value: '2 يوم' },
                { label: 'عدد المراحل المكتملة', value: '3 من 6' },
                { label: 'عدد المرفقات', value: '3 ملفات' },
                { label: 'عدد الملاحظات', value: '1' },
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between py-1.5 border-b last:border-0 text-sm" style={{ borderColor: 'var(--border)' }}>
                  <span className="opacity-60">{s.label}</span>
                  <span style={{ color: 'var(--primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
