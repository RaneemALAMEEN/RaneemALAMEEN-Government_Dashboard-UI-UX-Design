import { useState } from 'react';
import { Database, FileText, Plus, Edit, Trash2, Type, Hash, Calendar, ToggleLeft, List, File, FileImage } from 'lucide-react';
import { CreateFieldModal } from './modals/CreateFieldModal';
import { CreateFileDefinitionModal } from './modals/CreateFileDefinitionModal';

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

const mockFileDefinitions = [
  {
    id: 1,
    name: 'نموذج طلب وثيقة رسمية',
    type: 'PDF',
    category: 'وثائق للمواطن',
    createdAt: '2026-05-01',
    updatedAt: '2026-05-05',
  },
  {
    id: 2,
    name: 'صورة الهوية الشخصية',
    type: 'JPG',
    category: 'وثائق الهوية',
    createdAt: '2026-05-02',
    updatedAt: '2026-05-02',
  },
  {
    id: 3,
    name: 'شهادة الخبرة',
    type: 'DOCX',
    category: 'شهادات وإفادات',
    createdAt: '2026-05-03',
    updatedAt: '2026-05-04',
  },
  {
    id: 4,
    name: 'نموذج طلب إجازة',
    type: 'PDF',
    category: 'وثائق إدارية',
    createdAt: '2026-05-04',
    updatedAt: '2026-05-06',
  },
  {
    id: 5,
    name: 'الشهادة الجامعية',
    type: 'PDF',
    category: 'ملفات مدرسية',
    createdAt: '2026-05-05',
    updatedAt: '2026-05-05',
  },
  {
    id: 6,
    name: 'صورة شخصية',
    type: 'PNG',
    category: 'وثائق الهوية',
    createdAt: '2026-05-06',
    updatedAt: '2026-05-08',
  },
  {
    id: 7,
    name: 'موافقة ولي الأمر',
    type: 'PDF',
    category: 'ملفات مدرسية',
    createdAt: '2026-05-07',
    updatedAt: '2026-05-07',
  },
];

export function FieldsAndFiles() {
  const [activeTab, setActiveTab] = useState<'fields' | 'files'>('fields');
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const getFileTypeIcon = (type: string) => {
    if (type === 'JPG' || type === 'PNG') return FileImage;
    if (type === 'PDF' || type === 'DOCX') return FileText;
    return File;
  };

  return (
    <>
      <CreateFieldModal isOpen={isFieldModalOpen} onClose={() => setIsFieldModalOpen(false)} />
      <CreateFileDefinitionModal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
              <Database className="w-8 h-8" />
              إدارة الحقول والملفات
            </h1>
            <p className="opacity-70">تعريف الحقول الديناميكية والملفات القابلة لإعادة الاستخدام في المعاملات</p>
          </div>
          <button
            onClick={() => activeTab === 'fields' ? setIsFieldModalOpen(true) : setIsFileModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'fields' ? 'إنشاء حقل جديد' : 'إنشاء ملف جديد'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
          <button
            onClick={() => setActiveTab('fields')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all ${
              activeTab === 'fields' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'fields' ? 'white' : 'transparent',
              color: activeTab === 'fields' ? 'var(--primary)' : 'var(--charcoal-dark)',
            }}
          >
            <Database className="w-5 h-5" />
            <span className="font-medium">الحقول الديناميكية</span>
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: activeTab === 'fields' ? 'var(--beige)' : 'transparent',
                color: activeTab === 'fields' ? 'var(--primary)' : 'inherit',
              }}
            >
              {mockFields.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all ${
              activeTab === 'files' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'files' ? 'white' : 'transparent',
              color: activeTab === 'files' ? 'var(--primary)' : 'var(--charcoal-dark)',
            }}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">تعريفات الملفات</span>
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: activeTab === 'files' ? 'var(--beige)' : 'transparent',
                color: activeTab === 'files' ? 'var(--primary)' : 'inherit',
              }}
            >
              {mockFileDefinitions.length}
            </span>
          </button>
        </div>

        {/* Fields Tab Content */}
        {activeTab === 'fields' && (
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
                        {field.usageCount} {field.usageCount === 1 ? 'معاملة' : 'معاملة'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Files Tab Content */}
        {activeTab === 'files' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--beige)', borderColor: 'var(--border)' }}>
                  <th className="px-6 py-4 text-right">#</th>
                  <th className="px-6 py-4 text-right">اسم الملف</th>
                  <th className="px-6 py-4 text-right">نوع الملف</th>
                  <th className="px-6 py-4 text-right">التصنيف</th>
                  <th className="px-6 py-4 text-right">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 text-right">آخر تعديل</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {mockFileDefinitions.map((file) => {
                  const Icon = getFileTypeIcon(file.type);
                  return (
                    <tr key={file.id} className="border-b hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-6 py-4">{file.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                        >
                          {file.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 opacity-70">{file.category}</td>
                      <td className="px-6 py-4 opacity-70">{file.createdAt}</td>
                      <td className="px-6 py-4 opacity-70">{file.updatedAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
