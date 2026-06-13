import { useState } from 'react';
import { Users, Plus, Search, Grid, List, Eye, Edit, Key, Ban, FileText, Network } from 'lucide-react';
import { CreateEmployeeModal } from './modals/CreateEmployeeModal';

const mockEmployees = [
  {
    id: 1,
    fullName: 'أحمد محمد الأحمد',
    username: 'ahmad.ahmad',
    email: 'ahmad@edu.sy',
    phone: '0944123456',
    organization: 'مديرية التربية الرئيسية',
    department: 'دائرة التعليم الثانوي',
    subdepartment: 'شعبة المدرسين',
    role: 'موظف مختص',
    directManager: 'محمد علي السيد',
    status: 'active',
  },
  {
    id: 2,
    fullName: 'فاطمة أحمد الحسن',
    username: 'fatima.hassan',
    email: 'fatima@edu.sy',
    phone: '0933654321',
    organization: 'مديرية التربية الرئيسية',
    department: 'دائرة التعليم الثانوي',
    subdepartment: 'شعبة الطلاب',
    role: 'رئيس شعبة',
    directManager: 'علي حسن الخطيب',
    status: 'active',
  },
  {
    id: 3,
    fullName: 'محمد علي السيد',
    username: 'mohammad.alsayed',
    email: 'mohammad@edu.sy',
    phone: '0955789012',
    organization: 'مديرية التربية الرئيسية',
    department: 'دائرة التعليم الثانوي',
    subdepartment: '-',
    role: 'رئيس دائرة',
    directManager: 'خالد أحمد النور',
    status: 'active',
  },
  {
    id: 4,
    fullName: 'سارة خالد الأمين',
    username: 'sara.alamin',
    email: 'sara@edu.sy',
    phone: '0966123789',
    organization: 'مديرية التربية الرئيسية',
    department: 'دائرة الشؤون الإدارية',
    subdepartment: 'شعبة الموارد البشرية',
    role: 'موظف إداري',
    directManager: 'نور الدين العمر',
    status: 'active',
  },
  {
    id: 5,
    fullName: 'خالد يوسف المحمد',
    username: 'khaled.mohammed',
    email: 'khaled@edu.sy',
    phone: '0977456123',
    organization: 'مديرية التربية الرئيسية',
    department: 'دائرة الامتحانات',
    subdepartment: 'شعبة الشهادات',
    role: 'مدقق امتحانات',
    directManager: 'حسن علي الجاسم',
    status: 'inactive',
  },
];

export function EmployeesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.fullName.includes(searchTerm) ||
    emp.username.includes(searchTerm) ||
    emp.email.includes(searchTerm)
  );

  return (
    <>
      <CreateEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
              <Users className="w-8 h-8" />
              إدارة الموظفين
            </h1>
            <p className="opacity-70">إدارة حسابات الموظفين والهيكل الإداري</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-all ${viewMode === 'table' ? 'shadow-sm' : ''}`}
                style={{ backgroundColor: viewMode === 'table' ? 'white' : 'transparent' }}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
                style={{ backgroundColor: viewMode === 'grid' ? 'white' : 'transparent' }}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <Plus className="w-5 h-5" />
              إضافة موظف جديد
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40" />
            <input
              type="text"
              placeholder="البحث عن موظف (الاسم، اسم المستخدم، البريد الإلكتروني)..."
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

        {/* Employees List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: 'var(--beige)', borderColor: 'var(--border)' }}>
                    <th className="px-6 py-4 text-right">اسم الموظف</th>
                    <th className="px-6 py-4 text-right">اسم المستخدم</th>
                    <th className="px-6 py-4 text-right">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-right">الهاتف</th>
                    <th className="px-6 py-4 text-right">الدائرة</th>
                    <th className="px-6 py-4 text-right">الشعبة</th>
                    <th className="px-6 py-4 text-right">الدور</th>
                    <th className="px-6 py-4 text-right">الحالة</th>
                    <th className="px-6 py-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-6 py-4 font-medium">{emp.fullName}</td>
                      <td className="px-6 py-4 font-mono text-sm opacity-70">{emp.username}</td>
                      <td className="px-6 py-4 text-sm opacity-70">{emp.email}</td>
                      <td className="px-6 py-4 text-sm opacity-70">{emp.phone}</td>
                      <td className="px-6 py-4 text-sm">{emp.department}</td>
                      <td className="px-6 py-4 text-sm opacity-70">{emp.subdepartment}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: emp.status === 'active' ? '#42817715' : '#6b1f2a15',
                            color: emp.status === 'active' ? '#428177' : '#6b1f2a',
                          }}
                        >
                          {emp.status === 'active' ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 rounded-lg transition-all hover:shadow-sm"
                            style={{ backgroundColor: 'var(--beige)' }}
                            title="عرض الملف الوظيفي"
                          >
                            <Eye className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          </button>
                          <button
                            className="p-2 rounded-lg transition-all hover:shadow-sm"
                            style={{ backgroundColor: 'var(--beige)' }}
                            title="تعديل البيانات"
                          >
                            <Edit className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                          </button>
                          <button
                            className="p-2 rounded-lg transition-all hover:shadow-sm"
                            style={{ backgroundColor: 'var(--beige)' }}
                            title="إعادة تعيين كلمة المرور"
                          >
                            <Key className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                          </button>
                          <button
                            className="p-2 rounded-lg transition-all hover:shadow-sm"
                            style={{ backgroundColor: '#FEE' }}
                            title="تعطيل الحساب"
                          >
                            <Ban className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                  >
                    {emp.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{emp.fullName}</h3>
                    <p className="text-sm opacity-70 font-mono">{emp.username}</p>
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs mt-2"
                      style={{
                        backgroundColor: emp.status === 'active' ? '#42817715' : '#6b1f2a15',
                        color: emp.status === 'active' ? '#428177' : '#6b1f2a',
                      }}
                    >
                      {emp.status === 'active' ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">الدائرة:</span>
                    <span className="font-medium">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">الشعبة:</span>
                    <span>{emp.subdepartment}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">الدور:</span>
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}>
                      {emp.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm text-sm"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    <Eye className="w-4 h-4" />
                    الملف
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm text-sm"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    <FileText className="w-4 h-4" />
                    المعاملات
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm text-sm"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    <Network className="w-4 h-4" />
                    الهيكل
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm text-sm"
                    style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
