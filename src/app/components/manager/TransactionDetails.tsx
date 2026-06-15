import { useState } from 'react';
import {
  ArrowRight,
  Paperclip,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Building2,
  FileText,
  Shield,
  Loader2,
  XCircle,
  Eye,
  ArrowDownToLine,
  PenSquare,
} from 'lucide-react';
import { SuccessModal } from './modals/SuccessModal';
import { SignatureModal } from './modals/SignatureModal';
import { RejectModal } from './modals/RejectModal';
import { initialTransactions } from './transactionData';

interface TransactionDetailsProps {
  transactionId: string;
  autoReceive?: boolean;
  onBack: () => void;
}

type TimelineEvent = {
  status: string;
  action: string;
  note?: string;
  user?: string;
  time?: string;
};

const timelineEvents: TimelineEvent[] = [
  { status: 'done', action: 'تسجيل الديوان', note: 'تم التسجيل برقم 458/ص', user: 'محمد خالد', time: '10:00 ص' },
  { status: 'done', action: 'الشؤون الإدارية والمناهج', note: 'تم التدقيق وإبداء الرأي', user: 'سميرة زيدان', time: '11:30 ص' },
  { status: 'current', action: 'رئيس دائرة التعليم الثانوي', note: 'بانتظار توقيعك واتخاذ القرار' },
  { status: 'pending', action: 'مساعد مدير التربية', note: 'للاطلاع والتوقيع' },
  { status: 'pending', action: 'مدير التربية (القرار النهائي)', note: 'للاعتماد والتوجيه لإصدار القرار' },
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

export function TransactionDetails({ transactionId, autoReceive, onBack }: TransactionDetailsProps) {
  const sourceTransaction = initialTransactions.find((tx) => tx.id === transactionId) ?? null;
  const [status, setStatus] = useState(
    autoReceive ? 'قيد المعالجة' : (sourceTransaction?.status ?? 'بانتظار المعالجة')
  );
  const [assignee, setAssignee] = useState(
    autoReceive ? 'محمد العمر' : (sourceTransaction?.assignee ?? null)
  );
  const [showReject, setShowReject] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [note, setNote] = useState('');
  const [receiving, setReceiving] = useState(false);

  const isAssignedElsewhere = Boolean(assignee && assignee !== 'محمد العمر');

  const handleSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  const handleReceive = () => {
    if (isAssignedElsewhere) {
      setSuccessMsg(`تعذر استلام المعاملة ${transactionId} لأن المعاملة مُسجلة بالفعل باسم ${assignee}`);
      setShowSuccess(true);
      return;
    }

    setReceiving(true);
    window.setTimeout(() => {
      setStatus('قيد المعالجة');
      setAssignee('محمد العمر');
      setReceiving(false);
      setSuccessMsg(`تم استلام المعاملة ${transactionId} بنجاح — أصبحت الآن قيد المعالجة`);
      setShowSuccess(true);
    }, 800);
  };

  const handleCancelReceive = () => {
    setReceiving(true);
    window.setTimeout(() => {
      setStatus('بانتظار المعالجة');
      setAssignee(null);
      setReceiving(false);
      setSuccessMsg(`تم إلغاء استلام المعاملة ${transactionId} وإرجاعها لحالة بانتظار المعالجة`);
      setShowSuccess(true);
    }, 600);
  };

  const handleRejectConfirm = () => {
    setStatus('مرفوضة');
    setShowReject(false);
    setSuccessMsg(`تم رفض المعاملة ${transactionId} وإرسال إشعار لمقدم الطلب`);
    setShowSuccess(true);
  };

  const [addedNotes, setAddedNotes] = useState<{ dept: string; date: string; note: string }[]>([]);

  const handleAddNote = () => {
    if (!note.trim()) return;
    setAddedNotes([
      ...addedNotes,
      {
        dept: 'رئيس دائرة التعليم الثانوي',
        date: 'اليوم',
        note: note.trim(),
      },
    ]);
    setNote('');
  };

  const handleSigned = () => {
    setStatus('منجزة');
    // Success notice is shown inside the SignatureModal, but we can update state here
  };

  return (
    <>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
      <SignatureModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onSigned={handleSigned}
        documentTitle={`توقيع المعاملة رقم ${transactionId}`}
      />
      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleRejectConfirm}
      />

      <div className="flex flex-col h-full bg-[#edebe0]">
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-30 px-8 py-5 border-b shadow-sm"
          style={{
            backgroundColor: '#edebe0',
            borderColor: 'var(--border)',
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm transition-all hover:opacity-70 cursor-pointer"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمعاملات
          </button>

          {/* Header Content */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>إجازة خاصة بلا أجر</h1>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor:
                      status === 'قيد المعالجة' ? 'rgba(152,133,97,0.12)' :
                      status === 'مرفوضة' ? 'rgba(107,31,42,0.1)' :
                      'rgba(5,66,57,0.08)',
                    color:
                      status === 'قيد المعالجة' ? '#988561' :
                      status === 'مرفوضة' ? '#6b1f2a' :
                      'var(--primary)'
                  }}
                >
                  {status}
                </span>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}
                >
                  مستعجل
                </span>
              </div>
              <p className="text-sm opacity-60 font-mono">{transactionId}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {status === 'بانتظار المعالجة' && !assignee && (
                <button
                  onClick={handleReceive}
                  disabled={receiving}
                  className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 font-medium cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                  {receiving ? 'جاري الاستلام...' : 'استلام المعاملة'}
                </button>
              )}
              {status === 'قيد المعالجة' && assignee === 'محمد العمر' && (
                <>
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90 flex items-center gap-1.5 font-medium cursor-pointer"
                    style={{ backgroundColor: '#428177', color: 'white' }}
                  >
                    <Shield className="w-4 h-4" />
                    موافقة وتوقيع إلكتروني
                  </button>
                  <button
                    onClick={() => setShowReject(true)}
                    className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90 flex items-center gap-1.5 font-medium cursor-pointer"
                    style={{ backgroundColor: '#6b1f2a', color: 'white' }}
                  >
                    <XCircle className="w-4 h-4" />
                    رفض
                  </button>
                  <button
                    onClick={handleCancelReceive}
                    disabled={receiving}
                    className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90 border hover:bg-gray-50 font-medium cursor-pointer"
                    style={{ borderColor: 'var(--charcoal-medium)', color: 'var(--charcoal-medium)' }}
                  >
                    {receiving ? 'جاري إلغاء الاستلام...' : 'إلغاء استلام المعاملة'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Assignments Alert */}
        {isAssignedElsewhere && (
          <div className="mx-8 mt-6 rounded-xl border p-4" style={{ backgroundColor: 'rgba(107,31,42,0.06)', borderColor: 'rgba(107,31,42,0.18)' }}>
            <p className="text-sm" style={{ color: '#6b1f2a' }}>تم استلام هذه المعاملة من قبل {assignee} مسبقاً، لذلك لا يمكن إجراء أي توقيع أو تحويل الآن.</p>
          </div>
        )}

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Right side: details and note inputs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card 1: Employee/Request Topic Card */}
              <div className="bg-white rounded-xl p-6 border shadow-sm animate-fade-in" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4 mb-6" style={{ direction: 'rtl' }}>
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 shrink-0 border border-gray-200 shadow-inner">
                    أ أ
                  </div>
                  <div className="space-y-0.5 text-right flex-1">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">أحمد خالد المحمود</h2>
                    <p className="text-xs text-gray-500">مدرس مادة الرياضيات • ثانوية الباسل للمتفوقين</p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-100 font-mono">الرقم الذاتي: 984512</span>
                      <span className="px-2.5 py-0.5 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-100 font-mono">الخدمة: 8 سنوات</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-green-600 shrink-0" />
                    <h3 className="font-bold text-gray-900">موضوع الطلب: إجازة خاصة بلا أجر</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-right mb-4">
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">المدة المطلوبة:</span>
                      <span className="text-sm font-semibold text-gray-800">سنة دراسية كاملة</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">الفترة:</span>
                      <span className="text-sm font-semibold text-gray-800">01/09/2026 إلى 31/08/2027</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block mb-1">السبب المذكور:</span>
                    <div className="p-3.5 rounded-lg border-r-4 text-sm leading-relaxed" style={{ backgroundColor: 'rgba(185,167,121,0.08)', borderColor: '#b9a779', color: '#7a6a42' }}>
                      السفر بقصد العمل لتأمين متطلبات المعيشة. مرفق عقد العمل الخارجي.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Attachments Card */}
              <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="w-4 h-4 text-gray-700 font-bold" />
                  <h3 className="font-bold text-gray-900">المرفقات والوثائق</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'وثيقة_قائم_على_رأس_العمل.pdf', size: '1.2 MB' },
                    { name: 'صورة_الهوية_الشخصية.pdf', size: '800 KB' },
                    { name: 'عقد_عمل_مرفق.pdf', size: '2.5 MB' },
                  ].map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border transition-all hover:shadow-sm bg-white"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {/* File Details */}
                      <div className="flex items-center gap-3 text-right">
                        <div className="p-2.5 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 text-right truncate max-w-[150px] md:max-w-[180px]" style={{ direction: 'ltr' }}>{att.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 text-right">{att.size}</p>
                        </div>
                      </div>

                      {/* Action Icon Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="عرض الملف"
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all border border-gray-100 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="تحميل الملف"
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all border border-gray-100 cursor-pointer"
                        >
                          <ArrowDownToLine className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Notes Section (Below Attachments Card) */}
              <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-700" />
                  <h3 className="font-bold text-gray-900">ملاحظات الدوائر السابقة</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { dept: 'دائرة المناهج', date: '04 نيسان 2026', note: 'لا مانع من منح الإجازة. يتوفر لدينا مدرس بديل لتغطية نصاب مادة الرياضيات في ثانوية الباسل.', color: '#428177' },
                    { dept: 'الشؤون الإدارية', date: '03 نيسان 2026', note: 'الطلب مستوفٍ للشروط القانونية وتجاوزت خدمة المدرس المدة المطلوبة.', color: '#988561' },
                  ].map((n, idx) => (
                    <div key={idx} className="p-4 rounded-xl border-r-4 text-right shadow-sm" style={{ backgroundColor: 'var(--beige)', borderRightColor: n.color }}>
                      <div className="flex justify-between items-center mb-1 flex-row-reverse">
                        <span className="text-xs text-gray-400 font-mono">{n.date}</span>
                        <span className="text-sm font-semibold text-gray-800">{n.dept}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.note}</p>
                    </div>
                  ))}

                  {/* Added User Notes */}
                  {addedNotes.map((n, idx) => (
                    <div key={idx} className="p-4 rounded-xl border-r-4 text-right shadow-sm" style={{ backgroundColor: 'var(--beige)', borderRightColor: 'var(--primary)' }}>
                      <div className="flex justify-between items-center mb-1 flex-row-reverse">
                        <span className="text-xs text-gray-400 font-mono">{n.date}</span>
                        <span className="text-sm font-semibold text-gray-800">{n.dept}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.note}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Section */}
                <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--border)' }}>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">إضافة ملاحظة</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="اكتب ملاحظتك هنا..."
                    rows={3}
                    className="w-full p-3 rounded-lg border text-sm outline-none resize-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
                  />
                  {note && (
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="mt-2.5 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90 font-medium cursor-pointer"
                      style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                      إضافة الملاحظة
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Left side: Timeline/Workflow */}
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
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                            <CheckCircle2 className="w-4 h-4 text-green-600 fill-white" />
                          </div>
                        ) : event.status === 'current' ? (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 border border-blue-200">
                            <PenSquare className="w-3 h-3 text-blue-600" />
                          </div>
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-gray-400 bg-white"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {idx === 4 ? '🏁' : idx + 1}
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div
                        className={`flex-1 min-w-0 p-2.5 text-right ${
                          event.status === 'current' ? 'border rounded-xl' : ''
                        }`}
                        style={{
                          borderColor: event.status === 'current' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                          backgroundColor: event.status === 'current' ? 'rgba(59, 130, 246, 0.03)' : 'transparent',
                        }}
                      >
                        <p className="text-sm font-semibold mb-1 text-gray-900">
                          {event.action}
                        </p>
                        {event.user && event.user !== '—' && (
                          <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1"><User className="w-3 h-3" /> {event.user}</p>
                        )}
                        {event.time && event.time !== '—' && (
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</p>
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
            </div>


          </div>
        </div>
      </div>
    </>
  );
}
