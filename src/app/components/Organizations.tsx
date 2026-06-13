import { useState } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateOrganizationModal } from './modals/CreateOrganizationModal';

const mockOrganizations = [
  { id: 1, name: 'مديرية التربية الرئيسية', parent: '-', location: 'دمشق' },
  { id: 2, name: 'مديرية التربية - ريف دمشق', parent: 'مديرية التربية الرئيسية', location: 'ريف دمشق' },
  { id: 6, name: 'مركز التدريب التربوي', parent: 'مديرية التربية الرئيسية', location: 'دمشق' },
];

export function Organizations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  const filteredOrgs = mockOrganizations.filter(org =>
    org.name.includes(searchTerm) || org.parent.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrgs = filteredOrgs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <CreateOrganizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <Building2 className="w-8 h-8" />
            إدارة المؤسسات
          </h1>
          <p className="opacity-70">عرض وإدارة جميع المؤسسات التعليمية</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-5 h-5" />
          إنشاء مؤسسة جديدة
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40" />
            <input
              type="text"
              placeholder="البحث عن مؤسسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-lg border outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
                '--tw-ring-color': 'var(--primary)',
              } as any}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--beige)', borderColor: 'var(--border)' }}>
                <th className="px-6 py-4 text-right">#</th>
                <th className="px-6 py-4 text-right">اسم المؤسسة</th>
                <th className="px-6 py-4 text-right">المؤسسة الأم</th>
                <th className="px-6 py-4 text-right">الموقع</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentOrgs.map((org) => (
                <tr key={org.id} className="border-b hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">{org.id}</td>
                  <td className="px-6 py-4 font-medium">{org.name}</td>
                  <td className="px-6 py-4 opacity-70">{org.parent}</td>
                  <td className="px-6 py-4 opacity-70">{org.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 rounded-lg transition-all hover:shadow-sm"
                        style={{ backgroundColor: 'var(--beige)' }}
                        title="عرض التفاصيل"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="opacity-70">
            عرض {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrgs.length)} من {filteredOrgs.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
