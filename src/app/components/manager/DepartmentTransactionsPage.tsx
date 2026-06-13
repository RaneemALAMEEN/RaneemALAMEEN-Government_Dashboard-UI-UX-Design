import { useState } from 'react';
import {
  Search, Eye, FileText,
  Users, BookOpen, Send, BarChart2, Building2, Monitor, ChevronLeft, ChevronRight, User,
} from 'lucide-react';
import { transactionRows } from './transactionConfigs';
import { TransactionDetailView } from './TransactionDetailView';

// Mock "who currently holds this transaction" for rows from transactionConfigs
const assignedToMap: Record<string, string> = {
  'TXN-2024-101': 'محمد العمر',
  'TXN-2024-102': 'حسن كامل',
  'TXN-2024-103': 'سارة يوسف',
  'TXN-2024-104': 'تامر فواز',
  'TXN-2024-105': 'محمد العمر',
  'TXN-2024-106': 'ريم درويش',
  'TXN-2024-107': 'محمد العمر',
  'TXN-2024-108': 'باسل حداد',
  'TXN-2024-109': 'حسن كامل',
  'TXN-2024-110': 'محمد العمر',
  'TXN-2024-111': 'منى الشيخ',
  'TXN-2024-112': 'كريم منصور',
};

interface DeptTx {
  id: string;
  typeId: string;
  name: string;
  category: string;
  categoryColor: string;
  date: string;
  status: 'قيد الانتظار' | 'قيد المعالجة' | 'منجزة' | 'مسودة' | 'مرفوضة';
  assignedTo: string;
}

// Merge transactionRows (add assignedTo) + additional rows
const allDeptTransactions: DeptTx[] = [
  ...transactionRows.map((tx) => ({ ...tx, assignedTo: assignedToMap[tx.id] ?? 'غير محدد' })),
  { id: 'TXN-2024-441', typeId: 'external-transfer', name: 'طلب وثيقة رسمية',   category: 'الموارد البشرية',           categoryColor: '#054239', date: '2024-01-29', status: 'قيد المعالجة', assignedTo: 'محمد العمر' },
  { id: 'TXN-2024-440', typeId: 'internal-transfer', name: 'نقل موظف',            category: 'الموارد البشرية',           categoryColor: '#054239', date: '2024-01-31', status: 'قيد المعالجة', assignedTo: 'حسن كامل' },
  { id: 'TXN-2024-439', typeId: 'unpaid-leave',      name: 'طلب إجازة',           category: 'الموارد البشرية',           categoryColor: '#054239', date: '2024-01-30', status: 'قيد الانتظار', assignedTo: 'محمد العمر' },
  { id: 'TXN-2024-438', typeId: 'ministry-letter',   name: 'مراسلة رسمية',        category: 'المراسلات الوزارية',        categoryColor: '#988561', date: '2024-01-30', status: 'منجزة',         assignedTo: 'سارة يوسف' },
  { id: 'TXN-2024-437', typeId: 'tech-support',      name: 'طلب دعم تقني',        category: 'المعلوماتية والدعم التقني', categoryColor: '#428177', date: '2024-01-29', status: 'مرفوضة',        assignedTo: 'كريم منصور' },
  { id: 'TXN-2024-435', typeId: 'teacher-confirm',   name: 'نقل موظف',            category: 'الموارد البشرية',           categoryColor: '#054239', date: '2024-01-28', status: 'قيد الانتظار', assignedTo: 'محمد العمر' },
];

const PAGE_SIZE = 8;

const categoryIcons: Record<string, typeof FileText> = {
  'الموارد البشرية': Users, 'شؤون المدرسين': BookOpen, 'المراسلات الوزارية': Send,
  'الإحصائيات والدراسات': BarChart2, 'الأبنية والصيانة': Building2, 'المعلوماتية والدعم التقني': Monitor,
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'قيد الانتظار':  { bg: 'rgba(5,66,57,0.08)',     color: '#002623' },
  'قيد المعالجة':  { bg: 'rgba(152,133,97,0.1)',   color: '#988561' },
  'منجزة':         { bg: 'rgba(66,129,119,0.1)',   color: '#428177' },
  'مسودة':         { bg: 'rgba(185,167,121,0.12)', color: '#b9a779' },
  'مرفوضة':        { bg: 'rgba(107,31,42,0.08)',   color: '#6b1f2a' },
};

const categories = [
  'الكل', 'الموارد البشرية', 'شؤون المدرسين', 'المراسلات الوزارية',
  'الإحصائيات والدراسات', 'الأبنية والصيانة', 'المعلوماتية والدعم التقني',
];
const statuses = ['الكل', 'قيد الانتظار', 'قيد المعالجة', 'منجزة', 'مرفوضة'];

export function DepartmentTransactionsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [page, setPage] = useState(1);
  const [viewTxId, setViewTxId] = useState<string | null>(null);

  // Deduplicate by id (keep first occurrence — the additional rows have priority via ordering)
  const seen = new Set<string>();
  const deduped = allDeptTransactions.filter((tx) => {
    if (seen.has(tx.id)) return false;
    seen.add(tx.id);
    return true;
  });

  const filtered = deduped.filter((tx) => {
    const matchCat    = activeCategory === 'الكل' || tx.category === activeCategory;
    const matchStatus = activeStatus   === 'الكل' || tx.status   === activeStatus;
    const matchSearch = tx.id.includes(search) || tx.name.includes(search) || tx.assignedTo.includes(search);
    return matchCat && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (viewTxId) {
    return <TransactionDetailView transactionId={viewTxId} onBack={() => setViewTxId(null)} />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>معاملات الدائرة</h1>
        <p className="text-sm opacity-60">جميع المعاملات الجارية والمنجزة ضمن الدائرة — للعرض والمتابعة فقط</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'الإجمالي',      value: deduped.length,                                           color: '#054239', bg: 'rgba(5,66,57,0.08)' },
          { label: 'قيد الانتظار', value: deduped.filter(t => t.status === 'قيد الانتظار').length,   color: '#002623', bg: 'rgba(5,66,57,0.05)' },
          { label: 'قيد المعالجة', value: deduped.filter(t => t.status === 'قيد المعالجة').length,   color: '#988561', bg: 'rgba(152,133,97,0.1)' },
          { label: 'منجزة',        value: deduped.filter(t => t.status === 'منجزة').length,          color: '#428177', bg: 'rgba(66,129,119,0.08)' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <p className="text-2xl mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs opacity-60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <input
            type="text"
            placeholder="بحث برقم المعاملة، النوع، أو اسم المسؤول..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>
        <select
          value={activeCategory}
          onChange={(e) => { setActiveCategory(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setActiveStatus(s); setPage(1); }}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
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

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm opacity-60">{filtered.length} معاملة</p>
          <div className="flex items-center gap-1.5 text-xs opacity-40">
            <Eye className="w-3.5 h-3.5" />
            للعرض والمتابعة فقط
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--beige)' }}>
              {['رقم المعاملة', 'النوع', 'التصنيف', 'التاريخ', 'بين يدي', 'الحالة', 'عرض التفاصيل'].map((col) => (
                <th key={col} className="px-5 py-3 text-right text-xs opacity-60">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx) => {
              const sc   = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
              const Icon = categoryIcons[tx.category] ?? FileText;
              const isMe = tx.assignedTo === 'محمد العمر';
              return (
                <tr
                  key={tx.id}
                  onClick={() => setViewTxId(tx.id)}
                  className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${tx.categoryColor}10` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: tx.categoryColor }} />
                      </div>
                      <span className="text-sm">{tx.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${tx.categoryColor}10`, color: tx.categoryColor }}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm opacity-55">{tx.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                        style={{
                          backgroundColor: isMe ? 'rgba(5,66,57,0.1)' : 'rgba(152,133,97,0.1)',
                          color: isMe ? 'var(--primary)' : '#988561',
                        }}
                      >
                        {tx.assignedTo[0]}
                      </div>
                      <div>
                        <p className="text-sm leading-tight">{tx.assignedTo}</p>
                        {isMe && (
                          <p className="text-xs" style={{ color: 'var(--primary)' }}>أنت</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setViewTxId(tx.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:shadow-sm"
                      style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="py-14 text-center opacity-40">لا توجد معاملات تطابق الفلتر</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs opacity-50">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: 'var(--border)' }}>
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-sm"
                  style={{ backgroundColor: p === page ? 'var(--primary)' : 'transparent', color: p === page ? 'white' : 'var(--charcoal-medium)' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                className="p-1.5 rounded-lg border disabled:opacity-40" style={{ borderColor: 'var(--border)' }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
