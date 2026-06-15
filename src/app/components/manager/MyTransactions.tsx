import { useState } from 'react';
import {
  Eye, Search, AlertTriangle, CheckCircle2, Inbox, Loader2, PenSquare,
} from 'lucide-react';
import { SuccessModal } from './modals/SuccessModal';

const baseTransactions = [
  { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية', requester: 'خالد أحمد مطر', dept: 'الشؤون الإدارية', date: '2024-01-29', status: 'بانتظار المعالجة', priority: 'عالية', urgent: true, assignee: null },
  { id: 'TXN-2024-439', type: 'طلب إجازة', requester: 'محمود السيد علي', dept: 'التعليم الأساسي', date: '2024-01-30', status: 'قيد المعالجة', priority: 'عالية', urgent: true, assignee: 'محمد العمر' },
  { id: 'TXN-2024-435', type: 'نقل موظف', requester: 'ليلى عمران', dept: 'الموارد البشرية', date: '2024-01-28', status: 'بانتظار المعالجة', priority: 'عادية', urgent: false, assignee: null },
  { id: 'TXN-2024-432', type: 'تثبيت مدرس', requester: 'سامر حسين', dept: 'التعليم الأساسي', date: '2024-01-27', status: 'بانتظار المعالجة', priority: 'عادية', urgent: false, assignee: null },
  { id: 'TXN-2024-428', type: 'طلب صيانة مدرسة', requester: 'مديرية الأبنية', dept: 'الأبنية والصيانة', date: '2024-01-25', status: 'بانتظار المعالجة', priority: 'عالية', urgent: false, assignee: null },
  { id: 'TXN-2024-420', type: 'مراسلة رسمية', requester: 'وحدة التخطيط', dept: 'التخطيط', date: '2024-01-22', status: 'منجزة', priority: 'عادية', urgent: false, assignee: 'محمد العمر' },
  { id: 'TXN-2024-415', type: 'طلب وثيقة رسمية', requester: 'ناجي سليم', dept: 'الشؤون الإدارية', date: '2024-01-20', status: 'مرفوضة', priority: 'منخفضة', urgent: false, assignee: null },
];

const filterTabs = ['الكل', 'بانتظار المعالجة', 'قيد المعالجة', 'منجزة', 'مرفوضة'];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'بانتظار المعالجة': { bg: 'rgba(37, 99, 235, 0.16)', color: '#1d4ed8' },
  'قيد المعالجة': { bg: 'rgba(249, 115, 22, 0.16)', color: '#c2410c' },
  'منجزة': { bg: 'rgba(34, 197, 94, 0.18)', color: '#15803d' },
  'مرفوضة': { bg: 'rgba(239, 68, 68, 0.18)', color: '#b91c1c' },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  'عالية':   { color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
  'عادية':   { color: '#988561', bg: 'rgba(152,133,97,0.08)' },
  'منخفضة':  { color: '#428177', bg: 'rgba(66,129,119,0.08)' },
};

interface MyTransactionsProps {
  onViewDetails: (id: string, autoReceive?: boolean) => void;
}

export function MyTransactions({ onViewDetails }: MyTransactionsProps) {
  const [transactions, setTransactions] = useState(baseTransactions);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('الكل');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [receivingId, setReceivingId] = useState<string | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchTab = activeTab === 'الكل' || tx.status === activeTab;
    const matchSearch = tx.id.includes(search) || tx.type.includes(search) || tx.requester.includes(search);
    return matchTab && matchSearch;
  });

  const pendingCount  = transactions.filter(t => t.status === 'بانتظار المعالجة').length;
  const urgentCount   = transactions.filter(t => t.urgent).length;
  const completedCount = transactions.filter(t => t.status === 'منجزة').length;

  const handleReceive = (id: string) => {
    const target = transactions.find((tx) => tx.id === id);
    if (!target) return;

    if (target.assignee && target.assignee !== 'محمد العمر') {
      setSuccessMsg(`تعذر استلام المعاملة ${id} لأنها مُسجلة بالفعل باسم ${target.assignee}`);
      setShowSuccess(true);
      return;
    }

    setReceivingId(id);
    window.setTimeout(() => {
      setTransactions((prev) => prev.map((tx) =>
        tx.id === id
          ? { ...tx, status: 'قيد المعالجة', assignee: 'محمد العمر' }
          : tx,
      ));
      setReceivingId(null);
      setSuccessMsg(`تم استلام المعاملة ${id} بنجاح — أصبحت قيد المعالجة الآن`);
      setShowSuccess(true);
    }, 800);
  };


  return (
    <>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />

      <div className="p-8 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>معاملاتي</h1>
          <p className="text-sm opacity-60">المعاملات الموجهة إليك — {pendingCount} تحتاج استلاماً</p>
        </div>



        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-56">
            <input
              type="text"
              placeholder="بحث برقم المعاملة أو الاسم أو النوع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--charcoal-medium)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Urgent Banner */}
        {urgentCount > 0 && activeTab !== 'منجزة' && activeTab !== 'مرفوضة' && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl border-r-4"
            style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderRightColor: '#6b1f2a' }}
          >
            <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#6b1f2a' }} />
            <div>
              <p className="text-sm" style={{ color: '#6b1f2a' }}>
                لديك {urgentCount} معاملات مستعجلة تحتاج استلامك أو متابعتها في أقرب وقت
              </p>
              <p className="text-xs opacity-60 mt-0.5">المعاملات المستعجلة مُشارة بأيقونة التحذير</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--beige)' }}>
                {['رقم المعاملة', 'النوع', 'مقدم الطلب', 'الدائرة', 'التاريخ', 'الأولوية', 'الحالة', 'إجراء'].map((col) => (
                  <th key={col} className="px-4 py-3 text-right text-xs opacity-60">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const sc = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
                const pc = priorityConfig[tx.priority] || priorityConfig['عادية'];
                const needsReceipt = tx.status === 'بانتظار المعالجة';
                return (
                  <tr
                    key={tx.id}
                    className="border-b transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: tx.urgent ? 'rgba(107,31,42,0.018)' : undefined,
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</span>
                        {tx.urgent && (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: '#6b1f2a' }} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm opacity-75">{tx.type}</td>
                    <td className="px-4 py-3 text-sm">{tx.requester}</td>
                    <td className="px-4 py-3 text-sm opacity-60">{tx.dept}</td>
                    <td className="px-4 py-3 text-sm opacity-55">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: pc.bg, color: pc.color }}>
                        {tx.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(tx.id, false)}
                          className="px-2.5 py-1.5 rounded-lg text-xs transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                        >
                          عرض التفاصيل
                        </button>
                        {needsReceipt && (
                          <button
                            onClick={() => onViewDetails(tx.id, true)}
                            className="px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-90"
                            style={{ backgroundColor: 'rgba(37,99,235,0.10)', color: '#1d4ed8' }}
                          >
                            استلام المعاملة
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Inbox className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--primary)' }} />
                    <p className="opacity-40">لا توجد معاملات تطابق هذا الفلتر</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
