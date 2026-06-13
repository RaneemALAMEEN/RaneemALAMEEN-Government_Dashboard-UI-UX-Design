import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Upload, ChevronRight, Shield,
  Database, FileText, FileCheck, Check, X, AlertTriangle, Save, GitBranch,
  Circle, ChevronDown, Building2, Layers3,
} from 'lucide-react';

interface CreateProcessPageProps {
  onBack: () => void;
}

interface ProcessStep {
  id: string;
  name: string;
  type: 'user' | 'service';
  configured: boolean;
  organization?: string;
  department?: string;
  section?: string;
  role?: string;
  fields: string[];
  files: string[];
}

// Mock Data
const mockOrganizations = ['مديرية تربية ريف دمشق', 'مديرية تربية دمشق'];
const mockDepartments = {
  all: ['دائرة التعليم الثانوي', 'دائرة التعليم الأساسي', 'دائرة الموارد البشرية', 'دائرة الأبنية'],
  'دائرة التعليم الثانوي': ['شعبة المدرسين', 'شعبة الطلاب'],
  'دائرة التعليم الأساسي': ['شعبة المدرسين', 'شعبة الطلاب'],
};
const mockRoles = ['مدير الدائرة', 'مدقق البيانات', 'موظف استقبال', 'مسؤول الموارد البشرية'];
const mockFields = ['اسم الموظف', 'الرقم الوطني', 'تاريخ الميلاد', 'نوع المعاملة', 'عاجل', 'المؤهل العلمي', 'سنوات الخبرة'];
const mockFiles = ['الهوية الشخصية', 'الشهادة الجامعية', 'صورة شخصية', 'براءة الذمة', 'كشف الخدمة'];

// Multi-Select Dropdown Component
function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = 'اختر...',
  error,
  icon: Icon,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  icon?: typeof Database;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <label className="block mb-2 text-sm flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />}
        <span>{label}</span>
      </label>

      {/* Selected Items Display - shown above the field */}
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ backgroundColor: 'rgba(66,129,119,0.1)', color: '#428177' }}
            >
              <span>{item}</span>
              <button type="button" onClick={() => toggleOption(item)}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border cursor-pointer flex items-center justify-between gap-3 ${error ? 'border-2' : ''}`}
        style={{
          borderColor: error ? 'var(--destructive)' : 'var(--border)',
          backgroundColor: 'white',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm opacity-70 truncate">{placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--primary)' }} />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto"
          style={{ borderColor: 'var(--border)' }}
        >
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-gray-50"
                style={{
                  backgroundColor: isSelected ? 'rgba(66,129,119,0.08)' : 'transparent',
                }}
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#428177' : 'transparent',
                    border: isSelected ? 'none' : '2px solid var(--border)',
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm flex-1">{option}</span>
                {isSelected && <Check className="w-4 h-4" style={{ color: '#428177' }} />}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>}
    </div>
  );
}

export function CreateProcessPage({ onBack }: CreateProcessPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [savedDraft, setSavedDraft] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: '',
    bpmFile: null as File | null,
  });

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: '1', name: 'استلام الطلب', type: 'service', configured: true, fields: [], files: [] },
    { id: '2', name: 'تدقيق البيانات', type: 'user', configured: false, fields: [], files: [] },
    { id: '3', name: 'اعتماد المدير', type: 'user', configured: false, fields: [], files: [] },
    { id: '4', name: 'إصدار الوثيقة', type: 'service', configured: true, fields: [], files: [] },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'المعلومات الأساسية' },
    { number: 2, title: 'رفع ملف سير العمل' },
    { number: 3, title: 'معاينة المعاملة' },
    { number: 4, title: 'إسناد المراحل' },
  ];

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

  const handleNext = () => {
    setErrors({});

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, bpmFile: file });
      setErrors({ ...errors, bpmFile: '' });
    }
  };

  const updateStepConfig = (stepId: string, updates: Partial<ProcessStep>) => {
    setProcessSteps(processSteps.map(step => {
      if (step.id === stepId) {
        const updated = { ...step, ...updates };
        // Check if configured
        updated.configured = !!(
          updated.organization &&
          updated.department &&
          updated.role
        );
        return updated;
      }
      return step;
    }));
  };

  const handleCreate = () => {
    // Validate all user steps are configured
    const userSteps = processSteps.filter(s => s.type === 'user');
    const unconfiguredSteps = userSteps.filter(s => !s.configured);

    if (unconfiguredSteps.length > 0) {
      setShowValidationError(true);
      setValidationMessage('يجب إكمال إسناد جميع المراحل المطلوبة قبل إنشاء المعاملة، أو يمكنك حفظها كمسودة.');
      
      // Scroll to first unconfigured step
      setTimeout(() => {
        const firstUnconfigured = document.querySelector(`[data-step-id="${unconfiguredSteps[0].id}"]`);
        if (firstUnconfigured) {
          firstUnconfigured.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setTimeout(() => setShowValidationError(false), 5000);
      return;
    }

    // Success
    alert('تم إنشاء المعاملة بنجاح!');
    onBack();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', direction: 'rtl' }}>
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-40 bg-white border-b shadow-sm"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(5,66,57,0.1)' }}
              >
                <GitBranch className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h2 className="text-lg" style={{ color: 'var(--primary)' }}>
                  إنشاء معاملة: {formData.name || 'معاملة جديدة'}
                </h2>
                <p className="text-xs opacity-50">
                  الخطوة {currentStep} من {steps.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                <X className="w-4 h-4" />
                إلغاء
              </button>

              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--border)', color: savedDraft ? '#428177' : 'var(--charcoal-dark)' }}
              >
                {savedDraft ? <><Check className="w-4 h-4" /> تم الحفظ</> : <><Save className="w-4 h-4" /> حفظ كمسودة</>}
              </button>

              {currentStep === 4 && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--success)', color: 'white' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  إنشاء المعاملة
                </button>
              )}
            </div>
          </div>

          {/* Validation Error */}
          {showValidationError && currentStep === 4 && (
            <div
              className="mt-3 p-3 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{validationMessage}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center mt-4 gap-0">
            {steps.map((step, idx) => {
              const done = idx < currentStep - 1;
              const active = idx === currentStep - 1;

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-all"
                      style={{
                        backgroundColor: done ? '#428177' : active ? 'var(--primary)' : 'var(--beige)',
                        color: done || active ? 'white' : 'var(--charcoal-medium)',
                        border: active ? '2px solid var(--primary)' : 'none',
                      }}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : step.number}
                    </div>
                    <p
                      className="text-xs mt-1 text-center max-w-20 leading-tight hidden md:block"
                      style={{
                        color: active ? 'var(--primary)' : done ? '#428177' : 'var(--charcoal-medium)',
                        opacity: active || done ? 1 : 0.5,
                      }}
                    >
                      {step.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
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
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-8 border shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <label className="block mb-2">
                اسم المعاملة <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: طلب وثيقة رسمية"
                className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.name ? 'border-2' : ''}`}
                style={{
                  borderColor: errors.name ? 'var(--destructive)' : 'var(--border)',
                  backgroundColor: 'white',
                }}
              />
              {errors.name && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  نوع المعاملة <span style={{ color: 'var(--destructive)' }}>*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.type ? 'border-2' : ''}`}
                  style={{
                    borderColor: errors.type ? 'var(--destructive)' : 'var(--border)',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="">اختر النوع...</option>
                  <option value="transaction">معاملة</option>
                  <option value="administrative">إجراء إداري</option>
                </select>
                {errors.type && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.type}</p>}
              </div>

              <div>
                <label className="block mb-2">
                  الأولوية <span style={{ color: 'var(--destructive)' }}>*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.priority ? 'border-2' : ''}`}
                  style={{
                    borderColor: errors.priority ? 'var(--destructive)' : 'var(--border)',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="">اختر الأولوية...</option>
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                </select>
                {errors.priority && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.priority}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  تاريخ البداية <span style={{ color: 'var(--destructive)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.startDate ? 'border-2' : ''}`}
                  style={{
                    borderColor: errors.startDate ? 'var(--destructive)' : 'var(--border)',
                    backgroundColor: 'white',
                  }}
                />
                {errors.startDate && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.startDate}</p>}
              </div>

              <div>
                <label className="block mb-2">تاريخ النهاية (اختياري)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'white',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: BPMN Upload */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-8 border shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all hover:border-solid"
              style={{ borderColor: errors.bpmFile ? 'var(--destructive)' : 'var(--border)' }}
              onClick={() => document.getElementById('bpmn-upload')?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--beige)' }}>
                  <Upload className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="mb-2" style={{ color: 'var(--primary)' }}>رفع ملف سير العمل</h3>
                <p className="text-sm opacity-70 mb-4">اسحب وأفلت الملف هنا أو انقر للاختيار — ويمكنك تخطي هذا الآن</p>
                <p className="text-xs opacity-60">الصيغة المدعومة: .bpmn, .xml</p>
              </div>
              <input
                id="bpmn-upload"
                type="file"
                accept=".bpmn,.xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {errors.bpmFile && <p className="text-sm" style={{ color: 'var(--destructive)' }}>{errors.bpmFile}</p>}

            {formData.bpmFile && (
              <div className="p-4 rounded-lg flex items-center gap-4" style={{ backgroundColor: 'var(--beige-light)', border: '1px solid var(--border)' }}>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{formData.bpmFile.name}</p>
                  <p className="text-sm opacity-70">{(formData.bpmFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--success)' }} />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Process Visualization */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg p-8 border shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
              <p className="text-sm opacity-70">معاينة خطوات المعاملة المرفوعة</p>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {processSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div
                    className="min-w-[200px] p-4 rounded-lg border-2"
                    style={{
                      borderColor: step.configured ? 'var(--success)' : 'var(--border)',
                      backgroundColor: 'white',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {step.type === 'user' ? (
                        <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      ) : (
                        <Circle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      )}
                      <span className="font-medium text-sm">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: step.type === 'user' ? 'var(--primary)' : 'var(--accent)',
                          color: 'white',
                        }}
                      >
                        {step.type === 'user' ? 'مهمة مستخدم' : 'مهمة نظام'}
                      </span>
                      {step.configured && (
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
                      )}
                    </div>
                  </div>
                  {index < processSteps.length - 1 && (
                    <ChevronRight className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Stages Assignment */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}>
              <h3 className="font-medium mb-1" style={{ color: 'var(--primary)' }}>إسناد المراحل داخل كل مرحلة</h3>
              <p className="text-sm opacity-60">اضغط على أي مرحلة مستخدم لتوسيعها مباشرة، وسيظهر الإسناد داخل البطاقة نفسها.</p>
            </div>

            <div className="space-y-3">
              {processSteps.map((step) => {
                const isExpanded = expandedStageId === step.id;
                const canAssign = step.type === 'user';

                return (
                  <article
                    key={step.id}
                    data-step-id={step.id}
                    className={`rounded-xl border-2 transition-all ${canAssign ? 'hover:shadow-md' : 'opacity-60'}`}
                    style={{
                      borderColor: !step.configured && canAssign && showValidationError
                        ? 'var(--destructive)'
                        : step.configured
                          ? 'var(--success)'
                          : isExpanded
                            ? 'var(--primary)'
                            : 'var(--border)',
                      backgroundColor: 'white',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => canAssign && setExpandedStageId(isExpanded ? null : step.id)}
                      className="w-full p-5 text-right"
                      disabled={!canAssign}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                            style={{
                              backgroundColor: step.configured ? '#428177' : 'rgba(5,66,57,0.1)',
                              color: step.configured ? 'white' : 'var(--primary)',
                            }}
                          >
                            {step.id}
                          </div>
                          <div className="text-right flex-1">
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm opacity-70">
                              {step.type === 'user' ? 'مهمة مستخدم - قابلة للتخصيص' : 'مهمة نظام - تلقائية'}
                            </p>
                            {step.type === 'user' && step.organization && (
                              <p className="text-xs opacity-50 mt-1">
                                {step.organization} • {step.department || '—'} • {step.role || '—'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {step.configured && <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />}
                          {canAssign && (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ color: 'var(--primary)' }}
                            />
                          )}
                        </div>
                      </div>
                    </button>

                    {canAssign && isExpanded && (
                      <div className="px-5 pb-5 border-t pt-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-medium" style={{ color: 'var(--primary)' }}>إسناد المرحلة: {step.name}</h4>
                          <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(66,129,119,0.08)', color: '#428177' }}>
                            داخل هذه المرحلة
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm flex items-center gap-2">
                              <Building2 className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                              <span>المؤسسة <span style={{ color: 'var(--destructive)' }}>*</span></span>
                            </label>
                            <select
                              value={step.organization || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                organization: e.target.value,
                                department: '',
                                section: '',
                              })}
                              className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                            >
                              <option value="">اختر المؤسسة...</option>
                              {mockOrganizations.map(org => <option key={org} value={org}>{org}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-2 text-sm flex items-center gap-2">
                              <Layers3 className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                              <span>القسم / الدائرة <span style={{ color: 'var(--destructive)' }}>*</span></span>
                            </label>
                            <select
                              value={step.department || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                department: e.target.value,
                                section: '',
                              })}
                              className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                            >
                              <option value="">اختر الدائرة...</option>
                              {mockDepartments.all.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                          </div>

                          {step.department && (mockDepartments as any)[step.department] && (
                            <div className="md:col-span-2">
                              <label className="block mb-2 text-sm">الشعبة</label>
                              <select
                                value={step.section || ''}
                                onChange={(e) => updateStepConfig(step.id, { section: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                              >
                                <option value="">اختر الشعبة...</option>
                                {(mockDepartments as any)[step.department].map((sec: string) => (
                                  <option key={sec} value={sec}>{sec}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div>
                            <label className="block mb-2 text-sm flex items-center gap-2">
                              <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                              <span>الدور <span style={{ color: 'var(--destructive)' }}>*</span></span>
                            </label>
                            <select
                              value={step.role || ''}
                              onChange={(e) => updateStepConfig(step.id, { role: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                            >
                              <option value="">اختر دور...</option>
                              {mockRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <MultiSelectDropdown
                              label="الحقول المطلوبة"
                              options={mockFields}
                              selected={step.fields}
                              onChange={(fields) => updateStepConfig(step.id, { fields })}
                              placeholder="اختر الحقول..."
                              icon={Database}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <MultiSelectDropdown
                              label="الملفات المطلوبة"
                              options={mockFiles}
                              selected={step.files}
                              onChange={(files) => updateStepConfig(step.id, { files })}
                              placeholder="اختر الملفات..."
                              icon={FileText}
                            />
                          </div>
                        </div>

                        {!step.configured && showValidationError && (
                          <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                            يجب إكمال تخصيص هذه المرحلة قبل إنشاء المعاملة.
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky Footer Navigation */}
        <div
          className="sticky bottom-0 bg-white border-t shadow-sm mt-6 -mx-8 px-8 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--border)' }}
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className="transition-all"
                  style={{
                    backgroundColor: idx === currentStep - 1 ? 'var(--primary)' : idx < currentStep - 1 ? '#428177' : 'var(--border)',
                    width: idx === currentStep - 1 ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                  }}
                />
              ))}
            </div>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                التالي
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--success)', color: 'white' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                إنشاء المعاملة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
