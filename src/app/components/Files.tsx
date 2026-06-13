import { useState } from 'react';
import { FileText, Plus, Grid, List as ListIcon, File, FileImage, Download, Eye, Trash2 } from 'lucide-react';
import { UploadFileModal } from './modals/UploadFileModal';

const mockFiles = [
  {
    id: 1,
    name: 'نموذج طلب وثيقة رسمية.pdf',
    type: 'PDF',
    category: 'نماذج',
    size: '245 KB',
    date: '2026-05-01',
    icon: File,
  },
  {
    id: 2,
    name: 'صورة الهوية الشخصية.jpg',
    type: 'صورة',
    category: 'وثائق',
    size: '1.2 MB',
    date: '2026-05-02',
    icon: FileImage,
  },
  {
    id: 3,
    name: 'شهادة الخبرة.docx',
    type: 'DOCX',
    category: 'شهادات',
    size: '89 KB',
    date: '2026-05-03',
    icon: FileText,
  },
  {
    id: 4,
    name: 'طلب إجازة.pdf',
    type: 'PDF',
    category: 'نماذج',
    size: '156 KB',
    date: '2026-05-04',
    icon: File,
  },
  {
    id: 5,
    name: 'الشهادة الجامعية.pdf',
    type: 'PDF',
    category: 'وثائق',
    size: '567 KB',
    date: '2026-05-05',
    icon: File,
  },
  {
    id: 6,
    name: 'صورة شخصية.png',
    type: 'صورة',
    category: 'وثائق',
    size: '890 KB',
    date: '2026-05-06',
    icon: FileImage,
  },
];

export function Files() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <UploadFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <FileText className="w-8 h-8" />
            إدارة الملفات
          </h1>
          <p className="opacity-70">تخزين وإدارة الملفات والمستندات</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
              style={{ backgroundColor: viewMode === 'grid' ? 'white' : 'transparent' }}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list' ? 'shadow-sm' : ''}`}
              style={{ backgroundColor: viewMode === 'list' ? 'white' : 'transparent' }}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" />
            رفع ملف جديد
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFiles.map((file) => {
            const Icon = file.icon;
            return (
              <div
                key={file.id}
                className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
                    <Icon className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    {file.type}
                  </span>
                </div>

                <h3 className="font-medium mb-2 line-clamp-2">{file.name}</h3>

                <div className="space-y-2 text-sm opacity-70 mb-4">
                  <div className="flex items-center justify-between">
                    <span>التصنيف</span>
                    <span>{file.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الحجم</span>
                    <span>{file.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>التاريخ</span>
                    <span>{file.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: 'var(--beige)' }}
                  >
                    <Eye className="w-4 h-4" />
                    عرض
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: 'var(--beige)' }}
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </button>
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-sm"
                    style={{ backgroundColor: '#FEE' }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--beige)', borderColor: 'var(--border)' }}>
                <th className="px-6 py-4 text-right">اسم الملف</th>
                <th className="px-6 py-4 text-right">النوع</th>
                <th className="px-6 py-4 text-right">التصنيف</th>
                <th className="px-6 py-4 text-right">الحجم</th>
                <th className="px-6 py-4 text-right">التاريخ</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {mockFiles.map((file) => {
                const Icon = file.icon;
                return (
                  <tr key={file.id} className="border-b hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
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
                    <td className="px-6 py-4 opacity-70">{file.size}</td>
                    <td className="px-6 py-4 opacity-70">{file.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                          title="تحميل"
                        >
                          <Download className="w-4 h-4" style={{ color: 'var(--accent)' }} />
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
