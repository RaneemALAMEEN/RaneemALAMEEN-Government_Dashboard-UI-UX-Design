import { useState } from 'react';
import { FileCheck, Plus, Upload, Eye, Edit, Trash2, Settings } from 'lucide-react';
import { CreateTemplateModal } from './modals/CreateTemplateModal';

const mockTemplates = [
  {
    id: 1,
    name: 'قالب الوثيقة الرسمية',
    fileType: 'DOCX',
    engineType: 'DocX Template',
    lastModified: '2026-05-05',
    usageCount: 45,
  },
  {
    id: 2,
    name: 'قالب شهادة الخبرة',
    fileType: 'PDF',
    engineType: 'PDF Template',
    lastModified: '2026-05-03',
    usageCount: 28,
  },
  {
    id: 3,
    name: 'قالب طلب الإجازة',
    fileType: 'DOCX',
    engineType: 'DocX Template',
    lastModified: '2026-05-01',
    usageCount: 67,
  },
  {
    id: 4,
    name: 'قالب الشهادة الإدارية',
    fileType: 'PDF',
    engineType: 'PDF Template',
    lastModified: '2026-04-28',
    usageCount: 34,
  },
];

export function Templates() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <FileCheck className="w-8 h-8" />
            إدارة قوالب المستندات
          </h1>
          <p className="opacity-70">قوالب المستندات القابلة للتوليد الآلي</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-5 h-5" />
          إضافة قالب جديد
        </button>
      </div>

      <div
        className="bg-white rounded-lg p-8 border-2 border-dashed transition-all hover:border-solid hover:shadow-md cursor-pointer"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--beige)' }}>
            <Upload className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="mb-2" style={{ color: 'var(--primary)' }}>اسحب وأفلت الملف هنا</h3>
          <p className="text-sm opacity-70 mb-4">أو انقر للاختيار من جهازك</p>
          <p className="text-xs opacity-60">الصيغ المدعومة: DOCX, PDF, HTML</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{template.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                    >
                      {template.fileType}
                    </span>
                    <span className="text-xs opacity-60">{template.engineType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg transition-all hover:shadow-sm"
                  style={{ backgroundColor: 'var(--beige)' }}
                  title="عرض"
                >
                  <Eye className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                </button>
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

            <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">آخر تعديل</span>
                <span>{template.lastModified}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">عدد الاستخدامات</span>
                <span className="font-medium" style={{ color: 'var(--primary)' }}>
                  {template.usageCount} مرة
                </span>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-sm mt-4"
                style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
              >
                <Settings className="w-4 h-4" />
                إعدادات القالب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
