import {
  ArrowRight, CheckCircle2, Clock, Circle,
  FileText, Building2, Calendar, Tag, User,
} from 'lucide-react';
import { transactionRows, transactionConfigs } from './transactionConfigs';

interface TransactionDetailViewProps {
  transactionId: string;
  onBack: () => void;
}

const workflowStages = [
  { id: 'created',       label: 'تم إنشاء المعاملة',        sublabel: 'الإنشاء والتسجيل الأولي' },
  { id: 'signed',        label: 'تم توقيعها إلكترونياً',    sublabel: 'التوقيع والاعتماد الأولي' },
  { id: 'division-head', label: 'رئيس الشعبة',              sublabel: 'مراجعة ومتابعة الشعبة' },
  { id: 'dept-head',     label: 'رئيس الدائرة',             sublabel: 'الاعتماد الإداري' },
  { id: 'director',      label: 'مدير التربية',             sublabel: 'المراجعة النهائية' },
  { id: 'ministry',      label: 'وزارة التربية',            sublabel: 'الاعتماد الرسمي النهائي' },
];

// Mock current stage per transaction
const stageMap: Record<string, number> = {
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

// Mock timestamps per stage
const timestampsMap: Record<string, string[]> = {
  'TXN-2024-101': ['2024-01-25 09:00', '2024-01-25 10:30', '2024-01-26 08:15', '2024-01-27 14:00'],
  'TXN-2024-102': ['2024-01-26 09:00', '2024-01-26 11:00', '2024-01-27 14:30'],
  'TXN-2024-104': ['2024-01-20 09:00', '2024-01-20 11:00', '2024-01-21 09:30', '2024-01-22 14:00', '2024-01-23 10:00', '2024-01-24 16:00'],
  'TXN-2024-108': ['2024-01-20 09:00', '2024-01-20 11:00', '2024-01-21 09:30', '2024-01-22 14:00', '2024-01-23 10:00', '2024-01-24 16:00'],
  'TXN-2024-112': ['2024-01-24 08:00', '2024-01-24 09:30', '2024-01-24 13:00', '2024-01-25 10:00', '2024-01-26 09:00', '2024-01-26 15:00'],
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'قيد الانتظار':  { bg: 'rgba(5,66,57,0.08)',     color: '#002623' },
  'قيد المعالجة':  { bg: 'rgba(152,133,97,0.1)',   color: '#988561' },
  'منجزة':          { bg: 'rgba(66,129,119,0.1)',    color: '#428177' },
  'مسودة':          { bg: 'rgba(185,167,121,0.12)',  color: '#b9a779' },
  'مرفوضة':         { bg: 'rgba(107,31,42,0.08)',    color: '#6b1f2a' },
};

export function TransactionDetailView({ transactionId, onBack }: TransactionDetailViewProps) {
  const tx = transactionRows.find((t) => t.id === transactionId);
  const config = tx ? transactionConfigs[tx.typeId] : null;

  if (!tx || !config) {
    return (
      <div className="p-8 text-center opacity-40">
        <p>لم يتم العثور على المعاملة</p>
        <button onClick={onBack} className="mt-4 text-sm" style={{ color: 'var(--primary)' }}>
          العودة
        </button>
      </div>
    );
  }

  const currentStage = stageMap[tx.id] ?? 0;
  const timestamps = timestampsMap[tx.id] ?? [];
  const sc = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
  const progressPct = Math.round((currentStage / (workflowStages.length - 1)) * 100);

  return (
    <div className="p-8 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
        style={{ color: 'var(--primary)' }}
      >
        <ArrowRight className="w-4 h-4" />
        العودة لمركز المعاملات
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${tx.categoryColor}10` }}
            >
              <FileText className="w-7 h-7" style={{ color: tx.categoryColor }} />
            </div>
            <div>
              <h2 className="mb-1" style={{ color: 'var(--primary)' }}>{tx.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono opacity-50">{tx.id}</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${tx.categoryColor}10`, color: tx.categoryColor }}
                >
                  {tx.category}
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: sc.bg, color: sc.color }}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-left shrink-0">
            <p className="text-xs opacity-50 mb-0.5">تاريخ الإنشاء</p>
            <p className="text-sm">{tx.date}</p>
          </div>
        </div>

        {/* 3-stage status bar */}
        <div className="flex items-center gap-2">
          {['قيد الانتظار', 'جاري المعالجة', 'منجزة'].map((s, idx) => {
            const stages = ['قيد الانتظار', 'جاري المعالجة', 'منجزة'];
            const currentIdx = stages.indexOf(tx.status) === -1 ? 0 : stages.indexOf(tx.status);
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-full h-2 rounded-full"
                    style={{
                      backgroundColor: done ? '#428177' : active ? 'var(--primary)' : 'var(--border)',
                    }}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: done ? '#428177' : active ? 'var(--primary)' : 'var(--charcoal-medium)', opacity: active || done ? 1 : 0.4 }}
                  >
                    {s}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline — full width on left */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: 'var(--primary)' }}>مسار سير العمل</h3>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${progressPct}%`, backgroundColor: '#428177' }}
                />
              </div>
              <span className="text-xs opacity-50">{progressPct}%</span>
            </div>
          </div>

          <div className="relative">
            {workflowStages.map((stage, idx) => {
              const done    = idx < currentStage;
              const active  = idx === currentStage;
              const pending = idx > currentStage;
              const time    = timestamps[idx];

              return (
                <div key={stage.id} className="flex gap-4 pb-6 last:pb-0 relative">
                  {idx < workflowStages.length - 1 && (
                    <div
                      className="absolute top-10 right-[19px] w-0.5 bottom-0"
                      style={{
                        backgroundColor: done ? '#428177' : 'var(--border)',
                        backgroundImage: active
                          ? 'repeating-linear-gradient(to bottom,var(--primary) 0,var(--primary) 5px,transparent 5px,transparent 10px)'
                          : undefined,
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10"
                    style={{
                      backgroundColor: done ? '#428177' : active ? 'var(--primary)' : 'var(--beige)',
                      border: active ? '2px solid var(--primary)' : done ? 'none' : '2px solid var(--border)',
                    }}
                  >
                    {done    ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                     active  ? <Clock className="w-5 h-5 text-white" /> :
                               <Circle className="w-5 h-5 opacity-25" />}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 p-4 rounded-xl border"
                    style={{
                      backgroundColor: active ? 'rgba(5,66,57,0.04)' : done ? 'rgba(66,129,119,0.03)' : 'transparent',
                      borderColor: active ? 'rgba(5,66,57,0.2)' : done ? 'rgba(66,129,119,0.15)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p
                            className="text-sm"
                            style={{
                              color: done ? '#428177' : active ? 'var(--primary)' : 'var(--charcoal-medium)',
                              opacity: pending ? 0.45 : 1,
                            }}
                          >
                            {stage.label}
                          </p>
                          {active && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(5,66,57,0.1)', color: 'var(--primary)' }}
                            >
                              الموقع الحالي
                            </span>
                          )}
                          {idx === currentStage + 1 && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(152,133,97,0.1)', color: '#988561' }}
                            >
                              التالي
                            </span>
                          )}
                        </div>
                        <p className="text-xs opacity-40">{stage.sublabel}</p>
                        {done && (
                          <p className="text-xs mt-1" style={{ color: '#428177' }}>✓ تمت هذه المرحلة بنجاح</p>
                        )}
                        {active && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(5,66,57,0.1)' }}>
                              <div className="h-1 rounded-full" style={{ width: '40%', backgroundColor: 'var(--primary)' }} />
                            </div>
                            <span className="text-xs opacity-40">40%</span>
                          </div>
                        )}
                      </div>
                      {time && (
                        <div className="text-left shrink-0">
                          <p className="text-xs opacity-50">{time.split(' ')[0]}</p>
                          <p className="text-xs opacity-35">{time.split(' ')[1]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h4 className="mb-4" style={{ color: 'var(--primary)' }}>ملخص المعاملة</h4>
            {[
              { icon: FileText,   label: 'نوع المعاملة', value: tx.name },
              { icon: Tag,        label: 'التصنيف',      value: tx.category },
              { icon: Calendar,   label: 'تاريخ الإنشاء', value: tx.date },
              { icon: Building2,  label: 'الجهة المنشئة', value: 'مديرية تربية ريف دمشق' },
              { icon: User,       label: 'المُنشئ',       value: 'محمد العمر' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 opacity-35" />
                  <div>
                    <p className="text-xs opacity-50">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Stage Card */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: 'rgba(5,66,57,0.04)', borderColor: 'rgba(5,66,57,0.15)' }}
          >
            <p className="text-xs opacity-60 mb-1">المرحلة الحالية</p>
            <p className="mb-0.5" style={{ color: 'var(--primary)' }}>
              {workflowStages[currentStage]?.label}
            </p>
            <p className="text-xs opacity-40 mb-3">{workflowStages[currentStage]?.sublabel}</p>
            {currentStage < workflowStages.length - 1 ? (
              <>
                <div className="flex items-center gap-2 text-xs opacity-40 mb-2">
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                  ←
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                </div>
                <p className="text-xs opacity-50 mb-0.5">المرحلة التالية</p>
                <p className="text-sm opacity-65">{workflowStages[currentStage + 1]?.label}</p>
              </>
            ) : (
              <div className="flex items-center gap-2" style={{ color: '#428177' }}>
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">اكتمل مسار المعاملة بالكامل</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h4 style={{ color: 'var(--primary)' }}>نسبة الإنجاز</h4>
              <span className="text-sm" style={{ color: '#428177' }}>{progressPct}%</span>
            </div>
            <div className="h-2.5 rounded-full mb-1" style={{ backgroundColor: 'var(--border)' }}>
              <div
                className="h-2.5 rounded-full transition-all"
                style={{ width: `${progressPct}%`, backgroundColor: '#428177' }}
              />
            </div>
            <p className="text-xs opacity-40 mt-2">
              {currentStage} من {workflowStages.length - 1} مراحل مكتملة
            </p>

            {/* Stage dots */}
            <div className="flex items-center gap-1 mt-3">
              {workflowStages.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: i < currentStage ? '#428177' : i === currentStage ? 'var(--primary)' : 'var(--border)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Steps of this transaction type */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h4 className="mb-3" style={{ color: 'var(--primary)' }}>خطوات النموذج</h4>
            <div className="space-y-2">
              {config.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{
                      backgroundColor: 'rgba(5,66,57,0.08)',
                      color: 'var(--primary)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="opacity-70">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
