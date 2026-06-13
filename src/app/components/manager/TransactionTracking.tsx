import { useState } from 'react';
import {
  Search, CheckCircle2, Clock, Circle, ChevronDown,
  FileText, User, Building2, Calendar, ArrowLeft,
} from 'lucide-react';
import { transactionRows } from './transactionConfigs';

const trackingStages = [
  { id: 'created', label: 'تم إنشاء المعاملة', sublabel: 'الإنشاء والتسجيل', icon: FileText },
  { id: 'signed', label: 'تم توقيعها إلكترونياً', sublabel: 'التوقيع والاعتماد الأولي', icon: CheckCircle2 },
  { id: 'division-head', label: 'وصلت إلى رئيس الشعبة', sublabel: 'مراجعة ومتابعة الشعبة', icon: User },
  { id: 'dept-head', label: 'بانتظار رئيس الدائرة', sublabel: 'الاعتماد الإداري', icon: Building2 },
  { id: 'director', label: 'مدير التربية', sublabel: 'المراجعة النهائية', icon: Building2 },
  { id: 'ministry', label: 'وزارة التربية', sublabel: 'الاعتماد الرسمي النهائي', icon: Building2 },
];

// Per-transaction current stage (mock data)
const txStageMap: Record<string, number> = {
  'TXN-2024-101': 3,
  'TXN-2024-102': 2,
  'TXN-2024-103': 1,
  'TXN-2024-104': 5,
  'TXN-2024-105': 0,
  'TXN-2024-106': 2,
  'TXN-2024-107': 1,
  'TXN-2024-108': 5,
  'TXN-2024-109': 3,
  'TXN-2024-110': 0,
  'TXN-2024-111': 2,
  'TXN-2024-112': 5,
};

const txTimesMap: Record<string, string[]> = {
  'TXN-2024-101': ['2024-01-25 09:00', '2024-01-25 10:30', '2024-01-26 08:15', '2024-01-27 14:00', '', ''],
  'TXN-2024-108': ['2024-01-20 09:00', '2024-01-20 11:00', '2024-01-21 09:30', '2024-01-22 14:00', '2024-01-23 10:00', '2024-01-24 16:00'],
};

export function TransactionTracking() {
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(transactionRows[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = transactionRows.filter(
    (tx) => tx.name.includes(search) || tx.id.includes(search)
  );

  const currentStage = txStageMap[selectedTx.id] ?? 2;
  const times = txTimesMap[selectedTx.id] ?? [];

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>تتبع المعاملات</h1>
        <p className="text-sm opacity-60">تابع مسار أي معاملة عبر مراحل سير العمل</p>
      </div>

      {/* Transaction Selector */}
      <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
        <label className="text-sm opacity-60 mb-2 block">اختر المعاملة المراد تتبعها</label>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs opacity-60">{selectedTx.id}</span>
              <span>{selectedTx.name}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${selectedTx.categoryColor}12`, color: selectedTx.categoryColor }}
              >
                {selectedTx.category}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 opacity-40 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div
              className="absolute top-full right-0 left-0 mt-1 bg-white border rounded-xl shadow-lg z-10 overflow-hidden"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
                    autoFocus
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => { setSelectedTx(tx); setShowDropdown(false); setSearch(''); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-right transition-all hover:bg-gray-50"
                    style={{ backgroundColor: selectedTx.id === tx.id ? 'rgba(5,66,57,0.04)' : undefined }}
                  >
                    <span className="font-mono text-xs opacity-50">{tx.id}</span>
                    <span className="text-sm flex-1">{tx.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${tx.categoryColor}10`, color: tx.categoryColor }}
                    >
                      {tx.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'المرحلة الحالية', value: `${currentStage + 1} / ${trackingStages.length}`, color: 'var(--primary)' },
          { label: 'المرحلة الحالية', value: trackingStages[currentStage]?.label ?? '—', color: '#988561' },
          { label: 'المرحلة القادمة', value: trackingStages[currentStage + 1]?.label ?? 'مكتملة ✓', color: '#428177' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border shadow-sm text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs opacity-50 mb-1">{s.label}</p>
            <p className="text-sm" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vertical Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="mb-6" style={{ color: 'var(--primary)' }}>مسار سير العمل</h3>

          <div className="relative">
            {trackingStages.map((stage, idx) => {
              const done = idx < currentStage;
              const active = idx === currentStage;
              const pending = idx > currentStage;
              const Icon = stage.icon;
              const time = times[idx];

              return (
                <div key={stage.id} className="flex gap-5 pb-8 last:pb-0 relative">
                  {/* Connector line */}
                  {idx < trackingStages.length - 1 && (
                    <div
                      className="absolute top-10 right-[19px] w-0.5 bottom-0"
                      style={{
                        backgroundColor: done ? '#428177' : active ? 'rgba(5,66,57,0.2)' : 'var(--border)',
                        backgroundImage: active ? 'repeating-linear-gradient(to bottom, var(--primary) 0, var(--primary) 6px, transparent 6px, transparent 12px)' : undefined,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10"
                    style={{
                      backgroundColor: done ? '#428177' : active ? 'var(--primary)' : 'var(--beige)',
                      border: active ? '2px solid var(--primary)' : done ? 'none' : '2px solid var(--border)',
                    }}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : active ? (
                      <Clock className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 opacity-30" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 pb-2 rounded-xl p-4 border"
                    style={{
                      backgroundColor: active ? 'rgba(5,66,57,0.04)' : done ? 'rgba(66,129,119,0.04)' : 'var(--beige)',
                      borderColor: active ? 'rgba(5,66,57,0.2)' : done ? 'rgba(66,129,119,0.2)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="text-sm"
                            style={{
                              color: done ? '#428177' : active ? 'var(--primary)' : 'var(--charcoal-medium)',
                              opacity: pending ? 0.5 : 1,
                            }}
                          >
                            {stage.label}
                          </p>
                          {active && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full animate-pulse"
                              style={{ backgroundColor: 'rgba(5,66,57,0.1)', color: 'var(--primary)' }}
                            >
                              الموقع الحالي
                            </span>
                          )}
                          {idx === currentStage + 1 && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(152,133,97,0.1)', color: '#988561' }}>
                              التالي
                            </span>
                          )}
                        </div>
                        <p className="text-xs opacity-40">{stage.sublabel}</p>
                      </div>
                      {time && (
                        <div className="text-left shrink-0">
                          <p className="text-xs opacity-50">{time.split(' ')[0]}</p>
                          <p className="text-xs opacity-40">{time.split(' ')[1]}</p>
                        </div>
                      )}
                    </div>

                    {done && (
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle2 className="w-3 h-3" style={{ color: '#428177' }} />
                        <span className="text-xs" style={{ color: '#428177' }}>تمت المرحلة بنجاح</span>
                      </div>
                    )}
                    {active && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(5,66,57,0.1)' }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: '45%', backgroundColor: 'var(--primary)' }}
                            />
                          </div>
                          <span className="text-xs opacity-50">45%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-4">
          {/* Transaction Summary */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h4 className="mb-4" style={{ color: 'var(--primary)' }}>ملخص المعاملة</h4>
            {[
              { icon: FileText, label: 'النوع', value: selectedTx.name },
              { icon: Building2, label: 'التصنيف', value: selectedTx.category },
              { icon: Calendar, label: 'تاريخ الإنشاء', value: selectedTx.date },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 opacity-40" />
                  <div>
                    <p className="text-xs opacity-50">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage Summary Card */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: 'rgba(5,66,57,0.04)', borderColor: 'rgba(5,66,57,0.15)' }}
          >
            <p className="text-xs opacity-60 mb-2">المرحلة الحالية</p>
            <p className="mb-1" style={{ color: 'var(--primary)' }}>
              {trackingStages[currentStage]?.label}
            </p>
            <p className="text-xs opacity-50 mb-4">{trackingStages[currentStage]?.sublabel}</p>

            {currentStage < trackingStages.length - 1 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-0.5" style={{ backgroundColor: 'var(--border)' }} />
                  <ArrowLeft className="w-3 h-3 opacity-30" />
                </div>
                <p className="text-xs opacity-40 mb-1">المرحلة القادمة</p>
                <p className="text-sm opacity-70">{trackingStages[currentStage + 1]?.label}</p>
              </>
            )}

            {currentStage === trackingStages.length - 1 && (
              <div className="flex items-center gap-2" style={{ color: '#428177' }}>
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">اكتمل مسار المعاملة</span>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h4 className="mb-4" style={{ color: 'var(--primary)' }}>نسبة الإنجاز</h4>
            <div className="relative mb-2">
              <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.round(((currentStage) / (trackingStages.length - 1)) * 100)}%`,
                    backgroundColor: '#428177',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs opacity-50">
              <span>0%</span>
              <span className="font-medium" style={{ color: '#428177' }}>
                {Math.round(((currentStage) / (trackingStages.length - 1)) * 100)}%
              </span>
              <span>100%</span>
            </div>
            <p className="text-xs mt-3 opacity-50">
              {currentStage} من {trackingStages.length - 1} مراحل مكتملة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
