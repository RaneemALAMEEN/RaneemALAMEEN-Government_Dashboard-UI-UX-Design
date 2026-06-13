import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ArrowLeftRight,
  XCircle,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { SuccessModal } from './modals/SuccessModal';
import { TransferModal } from './modals/TransferModal';

const complaints = [
  {
    id: 'CMP-2024-021',
    title: 'تأخر في معالجة طلب الوثيقة الرسمية',
    submitter: 'خالد سعيد',
    date: '2024-01-30',
    status: 'جديدة',
    priority: 'عالية',
    category: 'تأخر في الإنجاز',
    desc: 'مر أكثر من أسبوعين على تقديم الطلب ولم يُبت فيه حتى الآن رغم مرور المدة القانونية.',
  },
  {
    id: 'CMP-2024-020',
    title: 'سوء معاملة من موظف الاستقبال',
    submitter: 'ليلى محمود',
    date: '2024-01-29',
    status: 'قيد المراجعة',
    priority: 'متوسطة',
    category: 'سلوك موظف',
    desc: 'أُبلغت بمعلومات خاطئة حول المستندات المطلوبة مما اضطرها لمراجعة الدائرة ثلاث مرات.',
  },
  {
    id: 'CMP-2024-019',
    title: 'خطأ في بيانات الشهادة الصادرة',
    submitter: 'منصور عبدالله',
    date: '2024-01-28',
    status: 'قيد المراجعة',
    priority: 'عالية',
    category: 'خطأ إداري',
    desc: 'تم إصدار الشهادة باسم مختلف ويطلب تصحيح البيانات بشكل عاجل.',
  },
  {
    id: 'CMP-2024-018',
    title: 'تكرار رفض الطلبات دون سبب واضح',
    submitter: 'رانيا سليم',
    date: '2024-01-27',
    status: 'مغلقة',
    priority: 'منخفضة',
    category: 'إجراءات',
    desc: 'رُفض طلبها ثلاث مرات بسبب مستندات مختلفة في كل مرة.',
  },
  {
    id: 'CMP-2024-017',
    title: 'عدم الرد على الاستفسارات الهاتفية',
    submitter: 'فادي نصر',
    date: '2024-01-26',
    status: 'مغلقة',
    priority: 'منخفضة',
    category: 'تواصل',
    desc: 'حاول التواصل عدة مرات دون الحصول على رد.',
  },
];

const statusFilters = ['الكل', 'جديدة', 'قيد المراجعة', 'مغلقة'];

const statusConfig: Record<string, { bg: string; color: string; icon: typeof Clock }> = {
  'جديدة': { bg: 'rgba(5,66,57,0.08)', color: '#002623', icon: MessageSquare },
  'قيد المراجعة': { bg: 'rgba(152,133,97,0.1)', color: '#988561', icon: Clock },
  'مغلقة': { bg: 'rgba(66,129,119,0.1)', color: '#428177', icon: CheckCircle2 },
};

const priorityConfig: Record<string, { color: string }> = {
  'عالية': { color: '#6b1f2a' },
  'متوسطة': { color: '#988561' },
  'منخفضة': { color: '#428177' },
};

export function ManagerComplaints() {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = complaints.filter((c) => {
    const matchStatus = activeStatus === 'الكل' || c.status === activeStatus;
    const matchSearch = c.title.includes(search) || c.submitter.includes(search) || c.id.includes(search);
    return matchStatus && matchSearch;
  });

  const handleSuccess = (msg: string) => {
    setShowTransfer(false);
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  return (
    <>
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} onConfirm={() => handleSuccess('تم تحويل الشكوى للجهة المختصة')} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />

      <div className="p-8 space-y-6">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>الشكاوى</h1>
            <p className="text-sm opacity-60">{complaints.length} شكوى إجمالاً</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: 'جديدة', count: complaints.filter(c => c.status === 'جديدة').length, color: '#002623', bg: 'rgba(5,66,57,0.08)' },
              { label: 'قيد المراجعة', count: complaints.filter(c => c.status === 'قيد المراجعة').length, color: '#988561', bg: 'rgba(152,133,97,0.1)' },
              { label: 'مغلقة', count: complaints.filter(c => c.status === 'مغلقة').length, color: '#428177', bg: 'rgba(66,129,119,0.1)' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-3 py-1.5 rounded-lg text-sm text-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <span className="block text-lg">{stat.count}</span>
                <span className="text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <input
              type="text"
              placeholder="بحث في الشكاوى..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className="px-3 py-1.5 rounded-md text-sm transition-all"
                style={{
                  backgroundColor: activeStatus === s ? 'var(--primary)' : 'transparent',
                  color: activeStatus === s ? 'white' : 'var(--charcoal-medium)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint Cards */}
        <div className="space-y-4">
          {filtered.map((c) => {
            const sc = statusConfig[c.status] || { bg: '#eee', color: '#333', icon: Clock };
            const StatusIcon = sc.icon;
            const pc = priorityConfig[c.priority] || { color: '#333' };
            const isExpanded = expanded === c.id;

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-mono opacity-60">{c.id}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {c.status}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ color: pc.color, backgroundColor: `${pc.color}12` }}
                        >
                          أولوية {c.priority}
                        </span>
                        <span className="text-xs opacity-40">{c.category}</span>
                      </div>
                      <h4 className="mb-1" style={{ color: 'var(--charcoal-dark)' }}>{c.title}</h4>
                      <div className="flex items-center gap-4 text-xs opacity-50">
                        <span>مقدم: {c.submitter}</span>
                        <span>التاريخ: {c.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : c.id)}
                        className="p-2 rounded-lg transition-all hover:shadow-sm"
                        style={{ backgroundColor: 'var(--beige)' }}
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </button>
                      {c.status !== 'مغلقة' && (
                        <button
                          onClick={() => setShowTransfer(true)}
                          className="p-2 rounded-lg transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'rgba(152,133,97,0.1)' }}
                          title="تحويل"
                        >
                          <ArrowLeftRight className="w-4 h-4" style={{ color: '#988561' }} />
                        </button>
                      )}
                      {c.status !== 'مغلقة' && (
                        <button
                          onClick={() => handleSuccess('تم إغلاق الشكوى بنجاح')}
                          className="p-2 rounded-lg transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'rgba(107,31,42,0.06)' }}
                          title="إغلاق"
                        >
                          <XCircle className="w-4 h-4" style={{ color: '#6b1f2a' }} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      className="mt-4 p-4 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--beige)', color: 'var(--charcoal-medium)' }}
                    >
                      <p className="mb-2 opacity-60 text-xs">تفاصيل الشكوى:</p>
                      <p className="leading-relaxed">{c.desc}</p>
                    </div>
                  )}
                </div>

                {c.priority === 'عالية' && c.status !== 'مغلقة' && (
                  <div
                    className="px-5 py-2 flex items-center gap-2 text-xs border-t"
                    style={{
                      backgroundColor: 'rgba(107,31,42,0.04)',
                      borderTopColor: 'rgba(107,31,42,0.15)',
                      color: '#6b1f2a',
                    }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    هذه الشكوى تستوجب الاهتمام الفوري نظراً لأولويتها العالية
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
