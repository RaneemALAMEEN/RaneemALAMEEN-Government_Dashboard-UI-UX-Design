import { useState } from 'react';
import {
  Plus,
  GitBranch,
  Circle,
  ArrowLeft,
  CheckCircle2,
  Settings2,
  Layers,
} from 'lucide-react';

const workflowTypes = [
  {
    id: 1,
    name: 'طلب وثيقة رسمية',
    stages: 5,
    active: 23,
    color: '#054239',
    desc: 'إصدار الوثائق الرسمية والمصادق عليها',
  },
  {
    id: 2,
    name: 'نقل موظف',
    stages: 7,
    active: 8,
    color: '#428177',
    desc: 'إجراءات نقل الموظفين بين الدوائر',
  },
  {
    id: 3,
    name: 'طلب إجازة',
    stages: 4,
    active: 14,
    color: '#988561',
    desc: 'طلبات الإجازة السنوية والطارئة',
  },
  {
    id: 4,
    name: 'مراسلة رسمية',
    stages: 3,
    active: 31,
    color: '#b9a779',
    desc: 'المراسلات الرسمية بين الجهات الحكومية',
  },
  {
    id: 5,
    name: 'شهادة خدمة',
    stages: 4,
    active: 6,
    color: '#6b1f2a',
    desc: 'إصدار شهادات الخدمة للموظفين',
  },
];

const stagesForSelected = [
  { id: 1, name: 'الاستقبال والتسجيل', responsible: 'موظف الاستقبال', duration: '1 يوم', auto: true },
  { id: 2, name: 'المراجعة الأولية', responsible: 'المراجع الأول', duration: '2 يوم', auto: false },
  { id: 3, name: 'التدقيق القانوني', responsible: 'الشؤون القانونية', duration: '3 يوم', auto: false },
  { id: 4, name: 'اعتماد رئيس الدائرة', responsible: 'رئيس الدائرة', duration: '1 يوم', auto: false },
  { id: 5, name: 'الإصدار والتسليم', responsible: 'الأرشيف', duration: '1 يوم', auto: true },
];

export function WorkflowSetup() {
  const [selectedType, setSelectedType] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'types' | 'stages' | 'editor'>('types');

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>إعداد سير العمل</h1>
        <p className="text-sm opacity-60">إدارة أنواع المعاملات ومراحل سير العمل</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white border w-fit" style={{ borderColor: 'var(--border)' }}>
        {[
          { id: 'types', label: 'أنواع المعاملات', icon: Layers },
          { id: 'stages', label: 'مراحل سير العمل', icon: GitBranch },
          { id: 'editor', label: 'محرر بصري', icon: Settings2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id as typeof activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--charcoal-medium)',
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'types' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm opacity-60">{workflowTypes.length} أنواع معاملات مُعرَّفة</p>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              إضافة نوع جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTypes.map((wt) => (
              <div
                key={wt.id}
                onClick={() => { setSelectedType(wt.id); setActiveTab('stages'); }}
                className="bg-white rounded-xl p-5 border shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${wt.color}12` }}
                  >
                    <GitBranch className="w-5 h-5" style={{ color: wt.color }} />
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(5,66,57,0.06)', color: 'var(--primary)' }}
                  >
                    {wt.active} نشطة
                  </span>
                </div>
                <h4 className="mb-1" style={{ color: 'var(--charcoal-dark)' }}>{wt.name}</h4>
                <p className="text-xs opacity-50 mb-3">{wt.desc}</p>
                <div className="flex items-center justify-between text-xs opacity-60">
                  <span>{wt.stages} مراحل</span>
                  <span className="flex items-center gap-1" style={{ color: wt.color }}>
                    عرض المراحل
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stages' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              className="px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
              value={selectedType ?? 1}
              onChange={(e) => setSelectedType(Number(e.target.value))}
            >
              {workflowTypes.map((wt) => (
                <option key={wt.id} value={wt.id}>{wt.name}</option>
              ))}
            </select>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--charcoal-medium)' }}
            >
              <Plus className="w-4 h-4" />
              إضافة مرحلة
            </button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {stagesForSelected.map((stage, idx) => (
              <div
                key={stage.id}
                className="flex items-center gap-4 p-4 border-b last:border-0 transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Stage Number */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
                >
                  {idx + 1}
                </div>

                {/* Stage Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm">{stage.name}</p>
                    {stage.auto && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(66,129,119,0.1)', color: '#428177' }}
                      >
                        تلقائي
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-50">المسؤول: {stage.responsible}</p>
                </div>

                {/* Duration */}
                <div className="text-sm opacity-60 shrink-0">{stage.duration}</div>

                {/* Arrow */}
                {idx < stagesForSelected.length - 1 && (
                  <ArrowLeft className="w-4 h-4 opacity-30" />
                )}
                {idx === stagesForSelected.length - 1 && (
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#428177' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="bg-white rounded-xl border shadow-sm p-8" style={{ borderColor: 'var(--border)' }}>
          <div className="text-center mb-8">
            <h3 className="mb-2" style={{ color: 'var(--primary)' }}>محرر سير العمل البصري</h3>
            <p className="text-sm opacity-50">تصور بصري لمراحل المعاملة</p>
          </div>

          {/* Visual Workflow Editor (Concept) */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-0 min-w-max mx-auto w-fit">
              {stagesForSelected.map((stage, idx) => (
                <div key={stage.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {/* Node */}
                    <div
                      className="relative w-36 rounded-xl p-4 border-2 shadow-sm text-center cursor-pointer transition-all hover:shadow-md"
                      style={{
                        borderColor: idx === 3 ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: idx === 3 ? 'rgba(5,66,57,0.04)' : 'white',
                      }}
                    >
                      {stage.auto && (
                        <div
                          className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: '#428177', color: 'white' }}
                        >
                          A
                        </div>
                      )}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                        style={{
                          backgroundColor: idx === 3 ? 'rgba(5,66,57,0.12)' : 'var(--beige)',
                          color: 'var(--primary)',
                        }}
                      >
                        {idx < 3 ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#428177' }} />
                        ) : idx === 3 ? (
                          <Circle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        ) : (
                          <Circle className="w-4 h-4 opacity-30" />
                        )}
                      </div>
                      <p className="text-xs leading-tight" style={{ color: idx > 3 ? '#aaa' : 'var(--charcoal-dark)' }}>
                        {stage.name}
                      </p>
                      <p className="text-xs mt-1 opacity-40">{stage.duration}</p>
                    </div>

                    {/* Responsible Label */}
                    <div
                      className="mt-2 px-2 py-0.5 rounded text-xs opacity-60 max-w-36 text-center truncate"
                    >
                      {stage.responsible}
                    </div>
                  </div>

                  {/* Arrow Connector */}
                  {idx < stagesForSelected.length - 1 && (
                    <div className="flex items-center px-2 mb-6">
                      <div className="w-8 h-0.5" style={{ backgroundColor: idx < 3 ? 'var(--primary)' : 'var(--border)' }} />
                      <ArrowLeft className="w-3 h-3 -ml-1" style={{ color: idx < 3 ? 'var(--primary)' : 'var(--border)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-6 p-4 rounded-lg text-sm text-center"
            style={{ backgroundColor: 'var(--beige)', color: 'var(--charcoal-medium)' }}
          >
            المرحلة المُظللة هي المرحلة الحالية للمعاملة • المراحل الخضراء مكتملة
          </div>
        </div>
      )}
    </div>
  );
}
