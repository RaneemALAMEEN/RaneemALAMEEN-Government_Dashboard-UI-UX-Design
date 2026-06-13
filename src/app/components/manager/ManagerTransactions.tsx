import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  PenSquare,
  ArrowLeftRight,
  X,
  CheckSquare,
  Square,
  ChevronDown,
} from 'lucide-react';
import { TransferModal } from './modals/TransferModal';
import { RejectModal } from './modals/RejectModal';
import { SuccessModal } from './modals/SuccessModal';
import { TransactionDetailsModal } from './modals/TransactionDetailsModal';

const allTransactions = [
  { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية', requester: 'خالد أحمد مطر', dept: 'الشؤون الإدارية', date: '2024-01-31', status: 'بانتظار التوقيع', progress: 60, urgent: true },
  { id: 'TXN-2024-440', type: 'نقل موظف', requester: 'سلمى يوسف النمر', dept: 'الموارد البشرية', date: '2024-01-31', status: 'قيد التنفيذ', progress: 40, urgent: false },
  { id: 'TXN-2024-439', type: 'طلب إجازة', requester: 'محمود السيد علي', dept: 'التعليم الأساسي', date: '2024-01-30', status: 'بانتظار التوقيع', progress: 75, urgent: true },
  { id: 'TXN-2024-438', type: 'مراسلة رسمية', requester: 'نور الدين حسن', dept: 'الشؤون القانونية', date: '2024-01-30', status: 'منجز', progress: 100, urgent: false },
  { id: 'TXN-2024-437', type: 'طلب وثيقة رسمية', requester: 'رنا خليل الأحمد', dept: 'الإدارة العامة', date: '2024-01-29', status: 'مرفوض', progress: 0, urgent: false },
  { id: 'TXN-2024-436', type: 'شهادة خدمة', requester: 'تامر سليم', dept: 'الشؤون الإدارية', date: '2024-01-29', status: 'قيد التنفيذ', progress: 25, urgent: false },
  { id: 'TXN-2024-435', type: 'نقل موظف', requester: 'ليلى عمران', dept: 'الموارد البشرية', date: '2024-01-28', status: 'بانتظار التوقيع', progress: 80, urgent: true },
  { id: 'TXN-2024-434', type: 'مراسلة رسمية', requester: 'فادي منصور', dept: 'التخطيط', date: '2024-01-28', status: 'منجز', progress: 100, urgent: false },
];

const statusFilters = ['الكل', 'بانتظار التوقيع', 'قيد التنفيذ', 'منجز', 'مرفوض'];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'بانتظار التوقيع': { bg: 'rgba(5,66,57,0.08)', color: '#002623' },
  'قيد التنفيذ': { bg: 'rgba(152,133,97,0.1)', color: '#988561' },
  'منجز': { bg: 'rgba(66,129,119,0.1)', color: '#054239' },
  'مرفوض': { bg: 'rgba(107,31,42,0.08)', color: '#6b1f2a' },
};

export function ManagerTransactions({ onViewDetails }: { onViewDetails: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [selected, setSelected] = useState<string[]>([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = allTransactions.filter((tx) => {
    const matchStatus = activeStatus === 'الكل' || tx.status === activeStatus;
    const matchSearch =
      tx.id.includes(search) ||
      tx.requester.includes(search) ||
      tx.type.includes(search);
    return matchStatus && matchSearch;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  };

  const handleSuccess = (msg: string) => {
    setShowTransfer(false);
    setShowReject(false);
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  return (
    <>
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} onConfirm={() => handleSuccess('تم تحويل المعاملات بنجاح')} />
      <RejectModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={() => handleSuccess('تم رفض المعاملات وإشعار أصحابها')} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
      <TransactionDetailsModal isOpen={showDetails} onClose={() => setShowDetails(false)} />

      <div className="p-8 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>المعاملات</h1>
            <p className="text-sm opacity-60">{allTransactions.length} معاملة إجمالاً</p>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-60">{selected.length} محددة</span>
              <button
                onClick={() => setShowTransfer(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                <ArrowLeftRight className="w-4 h-4" />
                تحويل
              </button>
              <button
                onClick={() => setShowReject(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--umber-light)', color: 'white' }}
              >
                <X className="w-4 h-4" />
                رفض
              </button>
            </div>
          )}
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4 flex-wrap" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 min-w-48">
            <input
              type="text"
              placeholder="بحث برقم أو اسم أو نوع المعاملة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className="px-3 py-1.5 rounded-md text-sm transition-all"
                style={{
                  backgroundColor: activeStatus === s ? 'white' : 'transparent',
                  color: activeStatus === s ? 'var(--primary)' : 'var(--charcoal-medium)',
                  boxShadow: activeStatus === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--charcoal-medium)' }}
          >
            <Filter className="w-4 h-4" />
            فلاتر متقدمة
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--beige)' }}>
                <th className="px-4 py-3 text-right w-12">
                  <button onClick={toggleAll}>
                    {selected.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <Square className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                </th>
                {['رقم المعاملة', 'النوع', 'مقدم الطلب', 'الدائرة', 'التاريخ', 'التقدم', 'الحالة', 'إجراء'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-right text-xs opacity-60"
                    style={{ color: 'var(--charcoal-dark)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, idx) => {
                const sc = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
                const isSelected = selected.includes(tx.id);
                return (
                  <tr
                    key={idx}
                    className="border-b transition-colors"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: isSelected ? 'rgba(5,66,57,0.03)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#fafaf9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(tx.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        ) : (
                          <Square className="w-4 h-4 opacity-30" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</span>
                        {tx.urgent && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}>
                            مستعجل
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm opacity-80">{tx.type}</td>
                    <td className="px-4 py-3 text-sm">{tx.requester}</td>
                    <td className="px-4 py-3 text-sm opacity-60">{tx.dept}</td>
                    <td className="px-4 py-3 text-sm opacity-60">{tx.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-24">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${tx.progress}%`,
                              backgroundColor: tx.status === 'مرفوض' ? '#6b1f2a' : tx.progress === 100 ? '#428177' : 'var(--primary)',
                            }}
                          />
                        </div>
                        <span className="text-xs opacity-50">{tx.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { onViewDetails(tx.id); }}
                          className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'var(--beige)' }}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        </button>
                        {tx.status === 'بانتظار التوقيع' && (
                          <button
                            onClick={() => handleSuccess('تم التوقيع بنجاح')}
                            className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                            style={{ backgroundColor: 'rgba(5,66,57,0.06)' }}
                            title="توقيع"
                          >
                            <PenSquare className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                          </button>
                        )}
                        <button
                          onClick={() => setShowTransfer(true)}
                          className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                          style={{ backgroundColor: 'rgba(152,133,97,0.1)' }}
                          title="تحويل"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: '#988561' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center opacity-40">
              <p>لا توجد معاملات تطابق البحث</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
