import { useState } from 'react';
import { Database, Plus, Edit, Trash2, Type, Hash, Calendar, ToggleLeft, List } from 'lucide-react';
import { CreateFieldModal } from './modals/CreateFieldModal';

const fieldTypeIcons = {
  text: Type,
  number: Hash,
  date: Calendar,
  boolean: ToggleLeft,
  list: List,
};

const fieldTypeLabels = {
  text: 'نص',
  number: 'رقم',
  date: 'تاريخ',
  boolean: 'نعم/لا',
  list: 'قائمة',
};

const mockFields = [
  {
    id: 1,
    name: 'اسم الموظف',
    code: 'employee_name',
    type: 'text' as const,
    required: true,
    usageCount: 23,
  },
  {
    id: 2,
    name: 'الرقم الوطني',
    code: 'national_id',
    type: 'number' as const,
    required: true,
    usageCount: 45,
  },
  {
    id: 3,
    name: 'تاريخ الميلاد',
    code: 'birth_date',
    type: 'date' as const,
    required: true,
    usageCount: 34,
  },
  {
    id: 4,
    name: 'نوع المعاملة',
    code: 'transaction_type',
    type: 'list' as const,
    options: ['وثيقة رسمية', 'شهادة خبرة', 'إجازة', 'نقل'],
    required: true,
    usageCount: 67,
  },
  {
    id: 5,
    name: 'عاجل',
    code: 'is_urgent',
    type: 'boolean' as const,
    required: false,
    usageCount: 12,
  },
  {
    id: 6,
    name: 'الشهادة الجامعية',
    code: 'degree',
    type: 'list' as const,
    options: ['بكالوريوس', 'ماجستير', 'دكتوراه', 'دبلوم'],
    required: false,
    usageCount: 28,
  },
];

export function Fields() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateFieldModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <Database className="w-8 h-8" />
            إدارة الحقول الديناميكية
          </h1>
          <p className="opacity-70">تعريف حقول البيانات المستخدمة في النماذج والعمليات</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-5 h-5" />
          إنشاء حقل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFields.map((field) => {
          const Icon = fieldTypeIcons[field.type];
          const typeLabel = fieldTypeLabels[field.type];

          return (
            <div
              key={field.id}
              className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${field.type === 'text' ? '#054239' : field.type === 'number' ? '#428177' : field.type === 'date' ? '#b9a779' : field.type === 'boolean' ? '#428177' : '#988561'}15` }}>
                    <Icon className="w-6 h-6" style={{ color: field.type === 'text' ? '#054239' : field.type === 'number' ? '#428177' : field.type === 'date' ? '#b9a779' : field.type === 'boolean' ? '#428177' : '#988561' }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{field.name}</h3>
                    <div className="text-sm opacity-70 font-mono">{field.code}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: 'var(--beige)' }}
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </button>
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: '#FEE' }}
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">النوع</span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    {typeLabel}
                  </span>
                </div>

                {field.required && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">مطلوب</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#4F794215', color: '#4F7942' }}
                    >
                      إلزامي
                    </span>
                  </div>
                )}

                {field.type === 'list' && field.options && (
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm opacity-70 mb-2">الخيارات المتاحة</div>
                    <div className="flex flex-wrap gap-2">
                      {field.options.map((option, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: 'var(--beige-light)', border: '1px solid var(--border)' }}
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm opacity-70">الاستخدام</span>
                  <span className="font-medium" style={{ color: 'var(--primary)' }}>
                    {field.usageCount} عملية
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
