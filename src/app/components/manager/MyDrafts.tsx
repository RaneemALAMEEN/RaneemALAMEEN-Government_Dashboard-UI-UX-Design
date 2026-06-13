import { useState } from 'react';
import {
  FileText, Clock, Trash2, ArrowLeft, AlertCircle, Edit3,
  Users, BookOpen, Send, BarChart2, Building2, Monitor,
} from 'lucide-react';

const categoryIcons: Record<string, typeof FileText> = {
  'الموارد البشرية': Users,
  'شؤون المدرسين': BookOpen,
  'المراسلات الوزارية': Send,
  'الإحصائيات والدراسات': BarChart2,
  'الأبنية والصيانة': Building2,
  'المعلوماتية والدعم التقني': Monitor,
};

interface Draft {
  id: string;
  typeId: string;
  name: string;
  category: string;
  categoryColor: string;
  savedAt: string;
  currentStep: number;
  totalSteps: number;
  completionPct: number;
}

const initialDrafts: Draft[] = [
  {
    id: 'DRF-2024-001',
    typeId: 'external-transfer',
    name: 'نقل خارجي للمدرس',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    savedAt: '2024-01-31 14:25',
    currentStep: 2,
    totalSteps: 5,
    completionPct: 40,
  },
  {
    id: 'DRF-2024-002',
    typeId: 'maintenance',
    name: 'طلب صيانة مدرسة',
    category: 'الأبنية والصيانة',
    categoryColor: '#6b1f2a',
    savedAt: '2024-01-30 09:10',
    currentStep: 3,
    totalSteps: 5,
    completionPct: 60,
  },
  {
    id: 'DRF-2024-003',
    typeId: 'annual-study',
    name: 'دراسة إحصائية سنوية',
    category: 'الإحصائيات والدراسات',
    categoryColor: '#b9a779',
    savedAt: '2024-01-29 16:40',
    currentStep: 1,
    totalSteps: 5,
    completionPct: 20,
  },
  {
    id: 'DRF-2024-004',
    typeId: 'ministry-letter',
    name: 'كتاب موجه إلى وزارة التربية',
    category: 'المراسلات الوزارية',
    categoryColor: '#988561',
    savedAt: '2024-01-28 11:00',
    currentStep: 2,
    totalSteps: 5,
    completionPct: 40,
  },
];

interface MyDraftsProps {
  onContinue: (typeId: string, draftId: string) => void;
}

export function MyDrafts({ onContinue }: MyDraftsProps) {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>مسوداتي</h1>
          <p className="text-sm opacity-60">المعاملات المحفوظة بشكل مؤقت ولم تُرسَل بعد</p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-sm"
          style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
        >
          {drafts.length} مسودة
        </div>
      </div>

      {/* Notice */}
      {drafts.length > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: 'rgba(185,167,121,0.08)', borderColor: 'rgba(185,167,121,0.3)' }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#988561' }} />
          <p className="text-sm" style={{ color: '#988561' }}>
            المسودات محفوظة محلياً. يُنصح بإتمام وإرسال المعاملات في أقرب وقت لتجنب فقدان البيانات.
          </p>
        </div>
      )}

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="bg-white rounded-2xl border shadow-sm py-20 text-center" style={{ borderColor: 'var(--border)' }}>
          <Edit3 className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--primary)' }} />
          <p className="opacity-40">لا توجد مسودات محفوظة</p>
          <p className="text-sm opacity-30 mt-1">ستظهر هنا المعاملات التي تحفظها كمسودة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => {
            const Icon = categoryIcons[draft.category] ?? FileText;
            const isDeleting = deleteConfirm === draft.id;

            return (
              <div
                key={draft.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${draft.categoryColor}10` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: draft.categoryColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 style={{ color: 'var(--charcoal-dark)' }}>{draft.name}</h4>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${draft.categoryColor}10`, color: draft.categoryColor }}
                          >
                            {draft.category}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(185,167,121,0.12)', color: '#b9a779' }}
                          >
                            مسودة
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs opacity-50 mb-3">
                          <span className="font-mono">{draft.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            آخر حفظ: {draft.savedAt}
                          </span>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs opacity-50">
                              الخطوة {draft.currentStep} من {draft.totalSteps}
                            </span>
                            <span className="text-xs" style={{ color: draft.categoryColor }}>
                              {draft.completionPct}% مكتمل
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${draft.completionPct}%`,
                                backgroundColor: draft.categoryColor,
                              }}
                            />
                          </div>
                          {/* Step dots */}
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: draft.totalSteps }, (_, i) => (
                              <div
                                key={i}
                                className="h-1 rounded-full transition-all"
                                style={{
                                  flex: 1,
                                  backgroundColor:
                                    i < draft.currentStep ? draft.categoryColor :
                                    i === draft.currentStep ? `${draft.categoryColor}40` :
                                    'var(--border)',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => onContinue(draft.typeId, draft.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                      >
                        متابعة
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(draft.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:shadow-sm"
                        style={{ borderColor: 'rgba(107,31,42,0.2)', color: '#6b1f2a' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete Confirm Banner */}
                {isDeleting && (
                  <div
                    className="px-5 py-3 border-t flex items-center justify-between"
                    style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderTopColor: 'rgba(107,31,42,0.15)' }}
                  >
                    <p className="text-sm" style={{ color: '#6b1f2a' }}>
                      هل أنت متأكد من حذف هذه المسودة؟ لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(draft.id)}
                        className="px-4 py-1.5 rounded-lg text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: '#6b1f2a', color: 'white' }}
                      >
                        تأكيد الحذف
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-1.5 rounded-lg text-sm border transition-all"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      {drafts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: 'حفظ تلقائي', desc: 'يتم حفظ المسودات تلقائياً كل دقيقتين أثناء الإدخال' },
            { icon: FileText, title: 'استمرارية العمل', desc: 'يمكنك مغادرة الصفحة والعودة لإكمال المعاملة لاحقاً' },
            { icon: AlertCircle, title: 'تنبيه', desc: 'المسودات لا تُرسل للجهات المختصة حتى تضغط على "توقيع وإرسال"' },
          ].map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--beige)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--primary)' }}>{tip.title}</span>
                </div>
                <p className="text-xs opacity-60 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
