import { useState } from 'react';
import { Modal } from './Modal';
import { GitBranch, CheckCircle, Upload, ChevronRight, Circle, CheckCircle2, Shield, Database, FileText, FileCheck } from 'lucide-react';

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProcessStep {
  id: string;
  name: string;
  type: 'user' | 'service';
  configured: boolean;
  role?: string;
  fields: string[];
  files: string[];
  templates: string[];
}

const mockRoles = ['مدير الدائرة', 'مدقق البيانات', 'موظف استقبال', 'مسؤول الموارد البشرية'];
const mockFields = ['اسم الموظف', 'الرقم الوطني', 'تاريخ الميلاد', 'نوع المعاملة', 'عاجل'];
const mockFiles = ['الهوية الشخصية', 'الشهادة الجامعية', 'صورة شخصية'];
const mockTemplates = ['قالب الوثيقة الرسمية', 'قالب شهادة الخبرة'];

export function CreateProcessModal({ isOpen, onClose }: CreateProcessModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: '',
    bpmFile: null as File | null,
  });

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: '1', name: 'استلام الطلب', type: 'service', configured: true, fields: [], files: [], templates: [] },
    { id: '2', name: 'تدقيق البيانات', type: 'user', configured: false, fields: [], files: [], templates: [] },
    { id: '3', name: 'اعتماد المدير', type: 'user', configured: false, fields: [], files: [], templates: [] },
    { id: '4', name: 'إصدار الوثيقة', type: 'service', configured: true, fields: [], files: [], templates: [] },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'المعلومات الأساسية' },
    { number: 2, title: 'رفع ملف سير العمل' },
    { number: 3, title: 'معاينة المعاملة' },
    { number: 4, title: 'تخصيص الخطوات' },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors: Record<string, string> = {};
      if (!formData.name.trim()) newErrors.name = 'اسم المعاملة مطلوب';
      if (!formData.type) newErrors.type = 'نوع المعاملة مطلوب';
      if (!formData.priority) newErrors.priority = 'الأولوية مطلوبة';
      if (!formData.startDate) newErrors.startDate = 'تاريخ البداية مطلوب';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }

    if (currentStep === 2 && !formData.bpmFile) {
      setErrors({ bpmFile: 'يجب رفع ملف سير العمل' });
      return;
    }

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

  const handleSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setCurrentStep(1);
      setFormData({ name: '', type: '', priority: '', startDate: '', endDate: '', bpmFile: null });
      setProcessSteps([
        { id: '1', name: 'استلام الطلب', type: 'service', configured: true, fields: [], files: [], templates: [] },
        { id: '2', name: 'تدقيق البيانات', type: 'user', configured: false, fields: [], files: [], templates: [] },
        { id: '3', name: 'اعتماد المدير', type: 'user', configured: false, fields: [], files: [], templates: [] },
        { id: '4', name: 'إصدار الوثيقة', type: 'service', configured: true, fields: [], files: [], templates: [] },
      ]);
      setSelectedNode(null);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({ name: '', type: '', priority: '', startDate: '', endDate: '', bpmFile: null });
    setErrors({});
    setIsSuccess(false);
    setSelectedNode(null);
    onClose();
  };

  const updateStepConfig = (stepId: string, updates: Partial<ProcessStep>) => {
    setProcessSteps(processSteps.map(step =>
      step.id === stepId ? { ...step, ...updates, configured: true } : step
    ));
  };

  const selectedStep = processSteps.find(s => s.id === selectedNode);

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء معاملة جديدة" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء المعاملة بنجاح</h3>
          <p className="opacity-70 text-center">سيتم تحديث قائمة المعاملات تلقائياً</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء معاملة جديدة" size="xl">
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{
                    backgroundColor: currentStep >= step.number ? 'var(--primary)' : 'var(--beige)',
                  }}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-sm text-center ${currentStep >= step.number ? 'font-medium' : 'opacity-60'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="h-1 flex-1 mx-2 mt-[-20px]"
                  style={{
                    backgroundColor: currentStep > step.number ? 'var(--primary)' : 'var(--beige)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
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
          <div className="space-y-4">
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
                <p className="text-sm opacity-70 mb-4">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
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
                <CheckCircle className="w-6 h-6" style={{ color: 'var(--success)' }} />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Process Visualization */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
              <p className="text-sm opacity-70">معاينة خطوات المعاملة المرفوعة</p>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {processSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div
                    className="min-w-[200px] p-4 rounded-lg border-2 cursor-pointer transition-all"
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

        {/* Step 4: Step Configuration */}
        {currentStep === 4 && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-3">
              <h3 className="font-medium mb-4" style={{ color: 'var(--primary)' }}>اختر خطوة لتخصيصها</h3>
              {processSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => step.type === 'user' && setSelectedNode(step.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    step.type === 'user' ? 'cursor-pointer hover:shadow-md' : 'opacity-50'
                  } ${selectedNode === step.id ? 'ring-2' : ''}`}
                  style={{
                    borderColor: step.configured ? 'var(--success)' : selectedNode === step.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: 'white',
                    '--tw-ring-color': 'var(--primary)',
                  } as any}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {step.type === 'user' ? (
                        <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      ) : (
                        <Circle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      )}
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-sm opacity-70">
                          {step.type === 'user' ? 'مهمة مستخدم - قابلة للتخصيص' : 'مهمة نظام - تلقائية'}
                        </p>
                      </div>
                    </div>
                    {step.configured && (
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-r pr-6" style={{ borderColor: 'var(--border)' }}>
              {selectedStep && selectedStep.type === 'user' ? (
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: 'var(--primary)' }}>تخصيص: {selectedStep.name}</h3>

                  <div>
                    <label className="block mb-2 text-sm">اختيار الدور</label>
                    <select
                      value={selectedStep.role || ''}
                      onChange={(e) => updateStepConfig(selectedStep.id, { role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
                    >
                      <option value="">اختر دور...</option>
                      {mockRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">ربط الحقول</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {mockFields.map(field => (
                        <label key={field} className="flex items-center gap-2 p-2 rounded hover:bg-opacity-50" style={{ backgroundColor: 'var(--beige-light)' }}>
                          <input
                            type="checkbox"
                            checked={selectedStep.fields.includes(field)}
                            onChange={(e) => {
                              const newFields = e.target.checked
                                ? [...selectedStep.fields, field]
                                : selectedStep.fields.filter(f => f !== field);
                              updateStepConfig(selectedStep.id, { fields: newFields });
                            }}
                          />
                          <span className="text-sm">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">ربط الملفات</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {mockFiles.map(file => (
                        <label key={file} className="flex items-center gap-2 p-2 rounded hover:bg-opacity-50" style={{ backgroundColor: 'var(--beige-light)' }}>
                          <input
                            type="checkbox"
                            checked={selectedStep.files.includes(file)}
                            onChange={(e) => {
                              const newFiles = e.target.checked
                                ? [...selectedStep.files, file]
                                : selectedStep.files.filter(f => f !== file);
                              updateStepConfig(selectedStep.id, { files: newFiles });
                            }}
                          />
                          <span className="text-sm">{file}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">ربط القوالب</label>
                    <div className="space-y-2">
                      {mockTemplates.map(template => (
                        <label key={template} className="flex items-center gap-2 p-2 rounded hover:bg-opacity-50" style={{ backgroundColor: 'var(--beige-light)' }}>
                          <input
                            type="checkbox"
                            checked={selectedStep.templates.includes(template)}
                            onChange={(e) => {
                              const newTemplates = e.target.checked
                                ? [...selectedStep.templates, template]
                                : selectedStep.templates.filter(t => t !== template);
                              updateStepConfig(selectedStep.id, { templates: newTemplates });
                            }}
                          />
                          <span className="text-sm">{template}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 opacity-60">
                  <Shield className="w-12 h-12 mb-4" />
                  <p className="text-sm text-center">اختر خطوة مستخدم لتخصيصها</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-lg transition-all"
              style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
            >
              السابق
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              التالي
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'var(--success)', color: 'white' }}
            >
              إنشاء المعاملة
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-lg transition-all"
            style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}
