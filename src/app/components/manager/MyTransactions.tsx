import { useState } from 'react';
import {
  PenSquare, XCircle, Eye, Filter, Search,
  Clock, AlertTriangle, CheckCircle2, Inbox,
} from 'lucide-react';
import { SignatureModal } from './modals/SignatureModal';
import { RejectModal } from './modals/RejectModal';
import { SuccessModal } from './modals/SuccessModal';

// Transactions assigned TO محمد العمر — need his signature or action
const myTransactions = [
  { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية',    requester: 'خالد أحمد مطر',    dept: 'الشؤون الإدارية',   date: '2024-01-29', status: 'بانتظار توقيعي', priority: 'عالية',  urgent: true  },
  { id: 'TXN-2024-439', type: 'طلب إجازة',           requester: 'محمود السيد علي',  dept: 'التعليم الأساسي',   date: '2024-01-30', status: 'بانتظار توقيعي', priority: 'عالية',  urgent: true  },
  { id: 'TXN-2024-435', type: 'نقل موظف',            requester: 'ليلى عمران',       dept: 'الموارد البشرية',   date: '2024-01-28', status: 'بانتظار توقيعي', priority: 'عادية',  urgent: false },
  { id: 'TXN-2024-432', type: 'تثبيت مدرس',          requester: 'سامر حسين',        dept: 'التعليم الأساسي',   date: '2024-01-27', status: 'بانتظار توقيعي', priority: 'عادية',  urgent: false },
  { id: 'TXN-2024-428', type: 'طلب صيانة مدرسة',    requester: 'مديرية الأبنية',    dept: 'الأبنية والصيانة',  date: '2024-01-25', status: 'بانتظار توقيعي', priority: 'عالية',  urgent: false },
  { id: 'TXN-2024-420', type: 'مراسلة رسمية',        requester: 'وحدة التخطيط',     dept: 'التخطيط',           date: '2024-01-22', status: 'منجزة',          priority: 'عادية',  urgent: false },
  { id: 'TXN-2024-415', type: 'طلب وثيقة رسمية',    requester: 'ناجي سليم',         dept: 'الشؤون الإدارية',   date: '2024-01-20', status: 'تم الرفض',       priority: 'منخفضة', urgent: false },
];

const filterTabs = ['الكل', 'بانتظار توقيعي', 'منجزة', 'تم الرفض'];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'بانتظار توقيعي': { bg: 'rgba(5,66,57,0.08)', color: '#002623' },
  'منجزة':          { bg: 'rgba(66,129,119,0.1)', color: '#428177' },
  'تم الرفض':       { bg: 'rgba(107,31,42,0.08)', color: '#6b1f2a' },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  'عالية':   { color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
  'عادية':   { color: '#988561', bg: 'rgba(152,133,97,0.08)' },
  'منخفضة':  { color: '#428177', bg: 'rgba(66,129,119,0.08)' },
};

interface MyTransactionsProps {
  onViewDetails: (id: string) => void;
}

export function MyTransactions({ onViewDetails }: MyTransactionsProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('الكل');
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = myTransactions.filter((tx) => {
    const matchTab = activeTab === 'الكل' || tx.status === activeTab;
    const matchSearch = tx.id.includes(search) || tx.type.includes(search) || tx.requester.includes(search);
    return matchTab && matchSearch;
  });

  const pendingCount  = myTransactions.filter(t => t.status === 'بانتظار توقيعي').length;
  const urgentCount   = myTransactions.filter(t => t.urgent).length;
  const completedCount = myTransactions.filter(t => t.status === 'منجزة').length;

  const handleSign = (id: string) => {
    setSelectedTx(id);
    setShowSignature(true);
  };

  const handleReject = (id: string) => {
    setSelectedTx(id);
    setShowReject(true);
  };

  const handleSigned = () => {
    setShowSignature(false);
    setSuccessMsg(`تم توقيع المعاملة ${selectedTx} بنجاح`);
    setShowSuccess(true);
  };

  const handleRejected = () => {
    setShowReject(false);
    setSuccessMsg(`تم رفض المعاملة ${selectedTx} وإشعار مقدم الطلب`);
    setShowSuccess(true);
  };

  return (
    <>
      <SignatureModal isOpen={showSignature} onClose={() => setShowSignature(false)} onSigned={handleSigned} documentTitle={selectedTx ?? ''} />
      <RejectModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={handleRejected} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />

      <div className="p-8 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>معاملاتي</h1>
          <p className="text-sm opacity-60">المعاملات الموجهة إليك — {pendingCount} بانتظار توقيعك</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'بانتظار توقيعي', value: pendingCount,   icon: PenSquare,    color: '#054239', bg: 'rgba(5,66,57,0.08)' },
            { label: 'مستعجلة',         value: urgentCount,    icon: AlertTriangle, color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
            { label: 'منجزة هذا الشهر', value: completedCount, icon: CheckCircle2,  color: '#428177', bg: 'rgba(66,129,119,0.08)' },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: s.bg }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-3xl" style={{ color: s.color }}>{s.value}</span>
                </div>
                <p className="text-sm opacity-60">{s.label}</p>
              </div>
            );
          })}
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
        {urgentCount > 0 && activeTab !== 'منجزة' && activeTab !== 'تم الرفض' && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl border-r-4"
            style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderRightColor: '#6b1f2a' }}
          >
            <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#6b1f2a' }} />
            <div>
              <p className="text-sm" style={{ color: '#6b1f2a' }}>
                لديك {urgentCount} معاملات مستعجلة تحتاج توقيعك في أقرب وقت
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
                const isPending = tx.status === 'بانتظار توقيعي';
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
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(tx.id)}
                          className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'var(--beige)' }}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        </button>
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleSign(tx.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-90"
                              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                            >
                              <PenSquare className="w-3 h-3" />
                              توقيع
                            </button>
                            <button
                              onClick={() => handleReject(tx.id)}
                              className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                              style={{ backgroundColor: 'rgba(107,31,42,0.07)' }}
                              title="رفض"
                            >
                              <XCircle className="w-3.5 h-3.5" style={{ color: '#6b1f2a' }} />
                            </button>
                          </>
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
