import { useState } from 'react';
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight, FileText,
  Users, BookOpen, Send, BarChart2, Building2, Monitor, Eye,
} from 'lucide-react';
import { transactionRows, categories, TransactionRow } from './transactionConfigs';

const PAGE_SIZE = 6;

const categoryIcons: Record<string, typeof FileText> = {
  'الموارد البشرية': Users,
  'شؤون المدرسين': BookOpen,
  'المراسلات الوزارية': Send,
  'الإحصائيات والدراسات': BarChart2,
  'الأبنية والصيانة': Building2,
  'المعلوماتية والدعم التقني': Monitor,
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'قيد الانتظار':  { bg: 'rgba(5,66,57,0.08)',     color: '#002623' },
  'قيد المعالجة':  { bg: 'rgba(152,133,97,0.1)',   color: '#988561' },
  'منجزة':         { bg: 'rgba(66,129,119,0.1)',   color: '#428177' },
  'مسودة':         { bg: 'rgba(185,167,121,0.12)', color: '#b9a779' },
  'مرفوضة':        { bg: 'rgba(107,31,42,0.08)',   color: '#6b1f2a' },
};

interface TransactionCenterProps {
  onOpenTypeSelector: () => void;
  onViewDetails: (txId: string) => void;
}

export function TransactionCenter({ onOpenTypeSelector, onViewDetails }: TransactionCenterProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [page, setPage] = useState(1);

  const filtered = transactionRows.filter((tx) => {
    const matchCat = activeCategory === 'الكل' || tx.category === activeCategory;
    const matchSearch = tx.name.includes(search) || tx.id.includes(search) || tx.category.includes(search);
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: 'إجمالي المعاملات',  value: transactionRows.length,                                           color: '#054239', bg: 'rgba(5,66,57,0.08)' },
    { label: 'قيد الانتظار',      value: transactionRows.filter(t => t.status === 'قيد الانتظار').length,  color: '#002623', bg: 'rgba(5,66,57,0.06)' },
    { label: 'قيد المعالجة',      value: transactionRows.filter(t => t.status === 'قيد المعالجة').length,  color: '#988561', bg: 'rgba(152,133,97,0.1)' },
    { label: 'منجزة',             value: transactionRows.filter(t => t.status === 'منجزة').length,         color: '#428177', bg: 'rgba(66,129,119,0.08)' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Title + إنشاء معاملة */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>المعاملات الداخلية</h1>
          <p className="text-sm opacity-60">المعاملات التي تُنشئها وتديرها بنفسك — مديرية التربية ريف دمشق</p>
        </div>
        <button
          onClick={onOpenTypeSelector}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          إنشاء معاملة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: s.bg }}>
                <FileText className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-3xl" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-sm opacity-60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs opacity-50 mb-3">تصنيفات المعاملات</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] ?? FileText;
            const isActive = activeCategory === cat;
            const catColor = transactionRows.find(t => t.category === cat)?.categoryColor ?? 'var(--primary)';
            const count = cat === 'الكل'
              ? transactionRows.length
              : transactionRows.filter(t => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  backgroundColor: isActive
                    ? (cat === 'الكل' ? 'var(--primary)' : `${catColor}15`)
                    : 'var(--beige)',
                  color: isActive
                    ? (cat === 'الكل' ? 'white' : catColor)
                    : 'var(--charcoal-medium)',
                  border: `1px solid ${isActive && cat !== 'الكل' ? `${catColor}30` : 'transparent'}`,
                }}
              >
                {cat !== 'الكل' && <Icon className="w-3.5 h-3.5" />}
                {cat}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث في المعاملات برقم المعاملة أو النوع..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--charcoal-medium)', backgroundColor: 'white' }}
        >
          <Filter className="w-4 h-4" />
          فلتر متقدم
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--beige)' }}>
              {['رقم المعاملة', 'نوع المعاملة', 'التصنيف', 'التاريخ', 'الحالة', 'إجراء'].map((col) => (
                <th key={col} className="px-5 py-3 text-right text-xs opacity-60" style={{ color: 'var(--charcoal-dark)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx) => {
              const sc = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
              const Icon = categoryIcons[tx.category] ?? FileText;
              return (
                <tr
                  key={tx.id}
                  className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => onViewDetails(tx.id)}
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${tx.categoryColor}10` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: tx.categoryColor }} />
                      </div>
                      <span className="text-sm">{tx.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${tx.categoryColor}10`, color: tx.categoryColor }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm opacity-60">{tx.date}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onViewDetails(tx.id)}
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
                <td colSpan={6} className="py-16 text-center opacity-40">
                  <p>لا توجد معاملات تطابق البحث</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs opacity-50">
              عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length} معاملة
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border transition-all hover:shadow-sm disabled:opacity-40"
                style={{ borderColor: 'var(--border)' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: p === page ? 'var(--primary)' : 'transparent',
                    color: p === page ? 'white' : 'var(--charcoal-medium)',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border transition-all hover:shadow-sm disabled:opacity-40"
                style={{ borderColor: 'var(--border)' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
