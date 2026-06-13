import { useState } from 'react';
import { GitBranch, Plus, Play, ArrowRight, CheckCircle, Circle, Clock, Shield, Database, FileText, FileCheck } from 'lucide-react';

interface ProcessesProps {
  onCreateNew?: () => void;
}

interface ProcessStep {
  id: number;
  name: string;
  type: 'user' | 'service';
  role?: string;
  fields: string[];
  files: string[];
  templates: string[];
  status: 'completed' | 'active' | 'pending';
}

const mockProcesses = [
  {
    id: 1,
    name: 'طلب وثيقة رسمية',
    description: 'عملية إصدار الوثائق الرسمية للموظفين',
    status: 'active',
    stepsCount: 4,
    completedCount: 145,
  },
  {
    id: 2,
    name: 'طلب إجازة',
    description: 'عملية الموافقة على طلبات الإجازة',
    status: 'active',
    stepsCount: 3,
    completedCount: 289,
  },
  {
    id: 3,
    name: 'طلب نقل موظف',
    description: 'عملية نقل الموظف بين الأقسام',
    status: 'draft',
    stepsCount: 5,
    completedCount: 67,
  },
];

const processSteps: ProcessStep[] = [
  {
    id: 1,
    name: 'استلام الطلب',
    type: 'service',
    fields: [],
    files: [],
    templates: [],
    status: 'completed',
  },
  {
    id: 2,
    name: 'تدقيق البيانات',
    type: 'user',
    role: 'مدقق البيانات',
    fields: ['اسم الموظف', 'الرقم الوطني', 'تاريخ الميلاد'],
    files: ['الهوية الشخصية', 'الشهادة الجامعية'],
    templates: [],
    status: 'active',
  },
  {
    id: 3,
    name: 'اعتماد المدير',
    type: 'user',
    role: 'مدير الدائرة',
    fields: ['نوع المعاملة', 'عاجل'],
    files: [],
    templates: [],
    status: 'pending',
  },
  {
    id: 4,
    name: 'إصدار الوثيقة',
    type: 'service',
    role: undefined,
    fields: [],
    files: [],
    templates: ['قالب الوثيقة الرسمية'],
    status: 'pending',
  },
];

const availableRoles = ['مدير الدائرة', 'مدقق البيانات', 'موظف استقبال', 'مسؤول الموارد البشرية'];
const availableFields = ['اسم الموظف', 'الرقم الوطني', 'تاريخ الميلاد', 'نوع المعاملة', 'عاجل', 'الشهادة الجامعية'];
const availableFiles = ['الهوية الشخصية', 'الشهادة الجامعية', 'صورة شخصية'];
const availableTemplates = ['قالب الوثيقة الرسمية', 'قالب شهادة الخبرة', 'قالب طلب الإجازة'];

function ProcessStepCard({ step }: { step: ProcessStep }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-lg p-6 border-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
      style={{
        borderColor: step.status === 'active' ? 'var(--primary)' : step.status === 'completed' ? 'var(--success)' : 'var(--border)',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: step.type === 'user' ? 'var(--primary)' : 'var(--accent)',
              color: 'white',
            }}
          >
            {step.status === 'completed' ? (
              <CheckCircle className="w-6 h-6" />
            ) : step.status === 'active' ? (
              <Clock className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold">{step.name}</h3>
              <span
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: step.type === 'user' ? 'var(--primary)' : 'var(--accent)',
                  color: 'white',
                }}
              >
                {step.type === 'user' ? 'مهمة مستخدم' : 'مهمة نظام'}
              </span>
            </div>

            {step.role && (
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Shield className="w-4 h-4" />
                <span>{step.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && step.type === 'user' && (
        <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Shield className="w-4 h-4" />
              <span className="text-sm">الدور المعين</span>
            </div>
            <select
              className="w-full px-4 py-2 rounded-lg border outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige-light)' }}
              value={step.role || ''}
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">اختر دور...</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Database className="w-4 h-4" />
              <span className="text-sm">الحقول المرفقة ({step.fields.length})</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {step.fields.map((field) => (
                <span
                  key={field}
                  className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                >
                  {field}
                  <span className="cursor-pointer hover:opacity-70">×</span>
                </span>
              ))}
            </div>
            <select
              className="w-full px-4 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige-light)' }}
              defaultValue=""
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">إضافة حقل...</option>
              {availableFields.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <FileText className="w-4 h-4" />
              <span className="text-sm">الملفات المرفقة ({step.files.length})</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {step.files.map((file) => (
                <span
                  key={file}
                  className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                >
                  {file}
                  <span className="cursor-pointer hover:opacity-70">×</span>
                </span>
              ))}
            </div>
            <select
              className="w-full px-4 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige-light)' }}
              defaultValue=""
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">إضافة ملف...</option>
              {availableFiles.map((file) => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>
          </div>

          {step.templates && step.templates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-70">
                <FileCheck className="w-4 h-4" />
                <span className="text-sm">القوالب المرفقة ({step.templates.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {step.templates.map((template) => (
                  <span
                    key={template}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    {template}
                    <span className="cursor-pointer hover:opacity-70">×</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Processes({ onCreateNew }: ProcessesProps = {}) {
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);

  return (
    <>
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <GitBranch className="w-8 h-8" />
            إدارة المعاملات
          </h1>
          <p className="opacity-70">تصميم وإدارة المعاملات والسير الوظيفي</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-5 h-5" />
          إنشاء معاملة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockProcesses.map((process) => (
          <div
            key={process.id}
            onClick={() => setSelectedProcess(process.id)}
            className={`bg-white rounded-lg p-6 border-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              selectedProcess === process.id ? 'ring-2' : ''
            }`}
            style={{
              borderColor: selectedProcess === process.id ? 'var(--primary)' : 'var(--border)',
              '--tw-ring-color': 'var(--primary)',
            } as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <GitBranch className="w-6 h-6" />
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: process.status === 'active' ? '#42817715' : '#98856115',
                  color: process.status === 'active' ? '#428177' : '#988561',
                }}
              >
                {process.status === 'active' ? 'نشط' : 'مسودة'}
              </span>
            </div>

            <h3 className="font-bold mb-2">{process.name}</h3>
            <p className="text-sm opacity-70 mb-4">{process.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-70">عدد الخطوات</span>
                <span className="font-medium">{process.stepsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">المعاملات المكتملة</span>
                <span className="font-medium" style={{ color: 'var(--success)' }}>
                  {process.completedCount}
                </span>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-sm mt-4"
              style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
            >
              <Play className="w-4 h-4" />
              عرض تفاصيل المعاملة
            </button>
          </div>
        ))}
      </div>

      {selectedProcess && (
        <div className="bg-white rounded-lg p-8 border shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl mb-2" style={{ color: 'var(--primary)' }}>
              سير عمل المعاملة: {mockProcesses.find(p => p.id === selectedProcess)?.name}
            </h2>
            <p className="opacity-70">
              اضغط على كل خطوة لتعيين الأدوار والحقول والملفات والقوالب المرتبطة
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {processSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full border-2 shrink-0"
                    style={{
                      borderColor: step.status === 'completed' ? 'var(--success)' : step.status === 'active' ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: step.status === 'completed' ? 'var(--success)' : step.status === 'active' ? 'var(--primary)' : 'white',
                      color: step.status === 'pending' ? 'var(--primary)' : 'white',
                    }}
                  >
                    {index + 1}
                  </div>
                  {index < processSteps.length - 1 && (
                    <ArrowRight className="w-6 h-6 shrink-0" style={{ color: 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {processSteps.map((step) => (
              <ProcessStepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}