import { useState, useRef } from 'react';
import {
  ArrowRight, ArrowLeft, Check, FileText, Upload, Download, RefreshCw,
  CheckCircle2, Printer, Eye, Save, File, X, Plus,
} from 'lucide-react';
import { transactionConfigs, FormField, FormStep, TransactionConfig } from './transactionConfigs';
import { SignatureModal } from './modals/SignatureModal';

interface TransactionFormProps {
  typeId: string;
  transactionId?: string;
  onBack: () => void;
  onSaved?: (typeId: string) => void;
}

// ─── Field Renderers ──────────────────────────────────────────────────────────

function TextField({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
      style={{ borderColor: 'var(--border)', backgroundColor: 'white', '--tw-ring-color': 'var(--primary)' } as any}
    />
  );
}

function TextAreaField({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all focus:ring-2"
      style={{ borderColor: 'var(--border)', backgroundColor: 'white', '--tw-ring-color': 'var(--primary)' } as any}
    />
  );
}

function DateField({ value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
      style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
    />
  );
}

function DropdownField({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none appearance-none"
      style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
    >
      <option value="">اختر...</option>
      {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

function RadioField({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {field.options?.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
          style={{
            borderColor: value === opt ? 'rgba(5,66,57,0.4)' : 'var(--border)',
            backgroundColor: value === opt ? 'rgba(5,66,57,0.04)' : 'var(--beige)',
          }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 shrink-0"
            style={{
              borderColor: value === opt ? 'var(--primary)' : 'var(--border)',
              backgroundColor: value === opt ? 'var(--primary)' : 'transparent',
            }}
          />
          <input type="radio" name={field.id} value={opt} className="hidden" onChange={() => onChange(opt)} />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function ChecklistField({ field, value, onChange }: { field: FormField; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div className="space-y-2">
      {field.options?.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
          style={{
            borderColor: value.includes(opt) ? 'rgba(5,66,57,0.4)' : 'var(--border)',
            backgroundColor: value.includes(opt) ? 'rgba(5,66,57,0.04)' : 'var(--beige)',
          }}
        >
          <div
            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
            style={{
              backgroundColor: value.includes(opt) ? 'var(--primary)' : 'transparent',
              border: value.includes(opt) ? 'none' : '2px solid var(--border)',
            }}
          >
            {value.includes(opt) && <Check className="w-3 h-3 text-white" />}
          </div>
          <input type="checkbox" className="hidden" checked={value.includes(opt)} onChange={() => toggle(opt)} />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function FileField({ field, value, onChange, multiple }: { field: FormField; value: File[]; onChange: (v: File[]) => void; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onChange(multiple ? [...value, ...files] : files);
  };
  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-opacity-60"
        style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(5,66,57,0.02)' }}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 opacity-40" style={{ color: 'var(--primary)' }} />
        <p className="text-sm opacity-60">اضغط لاختيار {multiple ? 'ملفات' : 'ملف'}</p>
        {field.hint && <p className="text-xs mt-1 opacity-40">{field.hint}</p>}
        <input ref={ref} type="file" multiple={multiple} className="hidden" onChange={handleChange} />
      </div>
      {value.length > 0 && (
        <div className="mt-2 space-y-1">
          {value.map((f, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
              <File className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="text-xs flex-1 truncate">{f.name}</span>
              <span className="text-xs opacity-40">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => onChange(value.filter((_, i) => i !== idx))}>
                <X className="w-3 h-3 opacity-40 hover:opacity-80" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step Renderers ───────────────────────────────────────────────────────────

function FormStepContent({
  step, formData, setFormData,
}: {
  step: FormStep;
  formData: Record<string, any>;
  setFormData: (d: Record<string, any>) => void;
}) {
  const set = (id: string, val: any) => setFormData({ ...formData, [id]: val });

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      {step.fields?.map((field) => {
        const isFullWidth = field.cols === 2 || ['textarea', 'file', 'multifile', 'checklist'].includes(field.type);
        return (
          <div key={field.id} className={isFullWidth ? 'col-span-2' : 'col-span-1'}>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-sm">{field.label}</label>
              {field.required && <span style={{ color: '#6b1f2a' }} className="text-xs">*</span>}
            </div>
            {(field.type === 'text' || field.type === 'number') && (
              <TextField field={field} value={formData[field.id] ?? ''} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'textarea' && (
              <TextAreaField field={field} value={formData[field.id] ?? ''} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'date' && (
              <DateField field={field} value={formData[field.id] ?? ''} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'dropdown' && (
              <DropdownField field={field} value={formData[field.id] ?? ''} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'radio' && (
              <RadioField field={field} value={formData[field.id] ?? ''} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'checklist' && (
              <ChecklistField field={field} value={formData[field.id] ?? []} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'file' && (
              <FileField field={field} value={formData[field.id] ?? []} onChange={(v) => set(field.id, v)} />
            )}
            {field.type === 'multifile' && (
              <FileField field={field} value={formData[field.id] ?? []} onChange={(v) => set(field.id, v)} multiple />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewStepContent({ config, formData }: { config: ReturnType<typeof transactionConfigs[string]['steps'][number]> & { steps: any }; formData: Record<string, any> }) {
  const allFields = (config as any).steps
    .filter((s: FormStep) => s.stepType === 'form' && s.fields)
    .flatMap((s: FormStep) => s.fields ?? []);

  if (allFields.length === 0) {
    return (
      <div className="text-center py-8 opacity-50">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#428177' }} />
        <p>تم إدخال جميع البيانات المطلوبة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl flex items-center gap-3"
        style={{ backgroundColor: 'rgba(66,129,119,0.08)', color: '#428177' }}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm">يرجى مراجعة جميع البيانات قبل الانتقال لمرحلة توليد PDF. تأكد من دقة المعلومات المدخلة.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allFields.map((field: FormField) => {
          const val = formData[field.id];
          if (!val || (Array.isArray(val) && val.length === 0)) return null;
          let display = '';
          if (Array.isArray(val)) {
            if (val[0] instanceof File) display = val.map((f: File) => f.name).join(', ');
            else display = val.join(' • ');
          } else {
            display = String(val);
          }
          return (
            <div key={field.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}>
              <p className="text-xs opacity-50 mb-1">{field.label}</p>
              <p className="text-sm">{display}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PdfStepContent({ config }: { config: TransactionConfig }) {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="space-y-5">
      {!generated ? (
        <div className="text-center py-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}
          >
            <FileText className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="mb-2" style={{ color: 'var(--primary)' }}>جاهز لإنشاء المستند الرسمي</h3>
          <p className="text-sm opacity-50 mb-6">سيتم توليد مستند PDF رسمي بصيغة حكومية معتمدة</p>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm mx-auto transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            {generating ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> جاري الإنشاء...</>
            ) : (
              <><Printer className="w-4 h-4" /> إنشاء نسخة PDF</>
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-90" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <Download className="w-4 h-4" /> تحميل المستند
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all hover:shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <Eye className="w-4 h-4" /> معاينة
            </button>
            <button onClick={() => setGenerated(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all hover:shadow-sm" style={{ borderColor: 'var(--border)', color: 'var(--charcoal-medium)' }}>
              <RefreshCw className="w-4 h-4" /> إعادة التوليد
            </button>
          </div>

          {/* Document Preview */}
          <div
            className="border rounded-xl overflow-hidden shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Document Header */}
            <div className="p-6 border-b text-center" style={{ backgroundColor: '#f8f8f6', borderColor: 'var(--border)' }}>
              <p className="text-xs opacity-40 mb-1">الجمهورية العربية السورية</p>
              <p className="text-sm mb-0.5" style={{ color: 'var(--primary)' }}>وزارة التربية — مديرية تربية ريف دمشق</p>
              <div className="w-10 h-0.5 mx-auto my-2" style={{ backgroundColor: 'var(--primary)' }} />
              <h4 className="text-base" style={{ color: 'var(--primary)' }}>{config.name}</h4>
              <p className="text-xs opacity-40 mt-1">رقم المستند: SY-EDU-2024-{Math.floor(Math.random() * 9000 + 1000)}</p>
            </div>

            {/* Document Body */}
            <div className="p-6 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                  <p className="text-xs opacity-50 mb-0.5">التاريخ</p>
                  <p>2024-01-31</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                  <p className="text-xs opacity-50 mb-0.5">الفئة</p>
                  <p>{config.category}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg text-sm leading-relaxed" style={{ backgroundColor: 'var(--beige)' }}>
                <p className="opacity-50 text-xs mb-2">نص المعاملة:</p>
                <p>بناءً على الصلاحيات الممنوحة لمديرية تربية ريف دمشق، ووفقاً للأنظمة والتعليمات المرعية الإجراء، يُشير إلى المعاملة المذكورة أعلاه وما تضمنته من بيانات ووثائق داعمة مقدمة من الجهة المعنية.</p>
              </div>

              {/* Signature Area */}
              <div className="flex justify-between items-end pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="w-32 border-b pb-1 mb-1 text-xs opacity-40" style={{ borderColor: 'var(--border)' }}>توقيع مقدم الطلب</div>
                  <p className="text-xs opacity-30">________________</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b pb-1 mb-1 text-xs opacity-40" style={{ borderColor: 'var(--border)' }}>توقيع رئيس الدائرة</div>
                  <p className="text-xs opacity-30">________________</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b pb-1 mb-1 text-xs opacity-40" style={{ borderColor: 'var(--border)' }}>الختم الرسمي</div>
                  <div
                    className="w-12 h-12 rounded-full border-2 mx-auto flex items-center justify-center opacity-20"
                    style={{ borderColor: 'var(--primary)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--primary)' }}>ختم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TransactionForm({ typeId, transactionId, onBack, onSaved }: TransactionFormProps) {
  const config = transactionConfigs[typeId];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSignature, setShowSignature] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  if (!config) {
    return (
      <div className="p-8 text-center opacity-50">
        <p>نوع المعاملة غير موجود</p>
      </div>
    );
  }

  const step = config.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === config.steps.length - 1;
  const isSignatureStep = step.stepType === 'signature';

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
    onSaved?.(typeId);
  };

  const handleSigned = () => {
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: 'rgba(66,129,119,0.12)' }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: '#428177' }} />
          </div>
          <h2 className="mb-2" style={{ color: 'var(--primary)' }}>تم اعتماد المعاملة بنجاح!</h2>
          <p className="text-sm opacity-60 mb-2">
            تم توقيع معاملة "{config.name}" إلكترونياً وإرسالها للمرحلة التالية.
          </p>
          <p className="text-xs opacity-40 mb-6 font-mono">
            رقم المعاملة: {transactionId ?? `TXN-2024-${Date.now().toString().slice(-4)}`}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            العودة لمركز المعاملات
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignatureModal
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        onSigned={handleSigned}
        documentTitle={config.name}
      />

      <div className="p-8 space-y-6">
        {/* Back + Draft */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowRight className="w-4 h-4" />
            العودة لمركز المعاملات
          </button>
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--border)', color: savedDraft ? '#428177' : 'var(--charcoal-medium)' }}
          >
            {savedDraft ? <><Check className="w-4 h-4" /> تم الحفظ</> : <><Save className="w-4 h-4" /> حفظ كمسودة</>}
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${config.categoryColor}12` }}
            >
              <FileText className="w-6 h-6" style={{ color: config.categoryColor }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 style={{ color: 'var(--primary)' }}>{config.name}</h2>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${config.categoryColor}12`, color: config.categoryColor }}
                >
                  {config.category}
                </span>
                {transactionId && (
                  <span className="text-xs font-mono opacity-50">{transactionId}</span>
                )}
              </div>
              <p className="text-sm opacity-50">
                الخطوة {currentStep + 1} من {config.steps.length} — {step.subtitle}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mt-6 gap-0">
            {config.steps.map((s, idx) => {
              const done = idx < currentStep;
              const active = idx === currentStep;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-all"
                      style={{
                        backgroundColor: done ? '#428177' : active ? 'var(--primary)' : 'var(--beige)',
                        color: done || active ? 'white' : 'var(--charcoal-medium)',
                        border: active ? '2px solid var(--primary)' : 'none',
                      }}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <p
                      className="text-xs mt-1 text-center max-w-16 leading-tight hidden md:block"
                      style={{ color: active ? 'var(--primary)' : done ? '#428177' : 'var(--charcoal-medium)', opacity: active || done ? 1 : 0.5 }}
                    >
                      {s.title}
                    </p>
                  </div>
                  {idx < config.steps.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-1 mt-0 md:-mt-4"
                      style={{ backgroundColor: done ? '#428177' : 'var(--border)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-6">
            <h3 style={{ color: 'var(--primary)' }}>{step.title}</h3>
            <p className="text-sm opacity-50 mt-1">{step.subtitle}</p>
          </div>

          {step.stepType === 'form' && (
            <FormStepContent step={step} formData={formData} setFormData={setFormData} />
          )}

          {step.stepType === 'review' && (
            <ReviewStepContent config={config as any} formData={formData} />
          )}

          {step.stepType === 'pdf' && (
            <PdfStepContent config={config} />
          )}

          {step.stepType === 'signature' && (
            <div className="space-y-5">
              <div
                className="p-5 rounded-xl border"
                style={{ backgroundColor: 'rgba(5,66,57,0.03)', borderColor: 'rgba(5,66,57,0.15)' }}
              >
                <p className="text-sm leading-relaxed opacity-70">
                  أنت على وشك توقيع معاملة <strong>"{config.name}"</strong> إلكترونياً. هذا الإجراء لا يمكن التراجع عنه — تأكد من مراجعة جميع البيانات في الخطوات السابقة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'نوع المعاملة', value: config.name },
                  { label: 'الفئة', value: config.category },
                  { label: 'تاريخ الإرسال', value: new Date().toLocaleDateString('ar-SY') },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--beige)' }}>
                    <p className="text-xs opacity-50 mb-0.5">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSignature(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-base transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                التوقيع الإلكتروني الآمن
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {!isSignatureStep && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={isFirst}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--border)' }}
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <div className="flex items-center gap-2">
              {config.steps.map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: idx === currentStep ? 'var(--primary)' : idx < currentStep ? '#428177' : 'var(--border)',
                    width: idx === currentStep ? '20px' : '8px',
                    borderRadius: '9999px',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={isLast}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
