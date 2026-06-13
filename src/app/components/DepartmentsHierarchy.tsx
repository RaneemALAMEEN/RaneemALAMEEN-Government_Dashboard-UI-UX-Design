import { useState } from 'react';
import { Folders, Plus, ChevronDown, ChevronLeft, Users, FileText, User, Building2 } from 'lucide-react';
import { CreateDepartmentModal } from './modals/CreateDepartmentModal';

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface Transaction {
  id: number;
  name: string;
  status: string;
}

interface SubDepartment {
  id: number;
  name: string;
  head: string;
  employees: Employee[];
  transactions: Transaction[];
}

interface Department {
  id: number;
  name: string;
  organization: string;
  head: string;
  employees: Employee[];
  subDepartments: SubDepartment[];
  transactions: Transaction[];
  active: boolean;
}

const mockDepartmentsData: Department[] = [
  {
    id: 1,
    name: 'دائرة التعليم الثانوي',
    organization: 'مديرية التربية الرئيسية',
    head: 'محمد علي السيد',
    employees: [
      { id: 1, name: 'أحمد محمود', role: 'موجه اختصاصي' },
      { id: 2, name: 'فاطمة حسن', role: 'موظف إداري' },
    ],
    subDepartments: [
      {
        id: 1,
        name: 'شعبة المدرسين',
        head: 'خالد أحمد النور',
        employees: [
          { id: 3, name: 'سارة الأمين', role: 'موظف مختص' },
          { id: 4, name: 'علي حسن', role: 'موظف مختص' },
        ],
        transactions: [
          { id: 1, name: 'طلب إجازة بلا أجر', status: 'قيد المعالجة' },
          { id: 2, name: 'تخفيض النصاب', status: 'مكتملة' },
          { id: 3, name: 'موافقة جواز سفر', status: 'قيد المعالجة' },
          { id: 4, name: 'نقل مدرس', status: 'جديدة' },
        ],
      },
      {
        id: 2,
        name: 'شعبة الطلاب',
        head: 'نور الدين العمر',
        employees: [
          { id: 5, name: 'ليلى الخطيب', role: 'موظف مختص' },
          { id: 6, name: 'حسن المحمد', role: 'موظف مختص' },
        ],
        transactions: [
          { id: 5, name: 'نقل طالب', status: 'قيد المعالجة' },
          { id: 6, name: 'قبول طالب وافد', status: 'جديدة' },
          { id: 7, name: 'إعادة تسجيل', status: 'مكتملة' },
        ],
      },
    ],
    transactions: [
      { id: 8, name: 'معاملة عامة للدائرة', status: 'قيد المعالجة' },
    ],
    active: true,
  },
  {
    id: 2,
    name: 'دائرة الشؤون الإدارية',
    organization: 'مديرية التربية الرئيسية',
    head: 'عمر يوسف الجاسم',
    employees: [
      { id: 7, name: 'رنا السعيد', role: 'مسؤول موارد بشرية' },
    ],
    subDepartments: [
      {
        id: 3,
        name: 'شعبة الموارد البشرية',
        head: 'منى الحسين',
        employees: [
          { id: 8, name: 'كريم العلي', role: 'موظف إداري' },
        ],
        transactions: [
          { id: 9, name: 'تعيين موظف جديد', status: 'قيد المعالجة' },
        ],
      },
    ],
    transactions: [],
    active: true,
  },
];

export function DepartmentsHierarchy() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([1]);
  const [expandedSubDepartments, setExpandedSubDepartments] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const toggleDepartment = (deptId: number) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const toggleSubDepartment = (subDeptId: number) => {
    setExpandedSubDepartments(prev =>
      prev.includes(subDeptId) ? prev.filter(id => id !== subDeptId) : [...prev, subDeptId]
    );
  };

  return (
    <>
      <CreateDepartmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
              <Folders className="w-8 h-8" />
              الهيكل التنظيمي للأقسام
            </h1>
            <p className="opacity-70">عرض هرمي تفاعلي للدوائر والأقسام والشُعب والموظفين</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <Plus className="w-5 h-5" />
            إنشاء قسم جديد
          </button>
        </div>

        <div className="space-y-4">
          {mockDepartmentsData.map((dept) => {
            const isExpanded = expandedDepartments.includes(dept.id);

            return (
              <div
                key={dept.id}
                className="bg-white rounded-lg border-2 shadow-sm overflow-hidden"
                style={{ borderColor: isExpanded ? 'var(--primary)' : 'var(--border)' }}
              >
                {/* Department Header */}
                <div
                  className="p-6 cursor-pointer transition-all hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--beige-light)' }}
                  onClick={() => toggleDepartment(dept.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--beige)' }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        ) : (
                          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>

                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                        <Building2 className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--primary)' }}>{dept.name}</h2>
                        <p className="text-sm opacity-70">{dept.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                          {dept.subDepartments.length}
                        </div>
                        <div className="text-xs opacity-70">شعبة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                          {dept.employees.length + dept.subDepartments.reduce((sum, sub) => sum + sub.employees.length, 0)}
                        </div>
                        <div className="text-xs opacity-70">موظف</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                          {dept.transactions.length + dept.subDepartments.reduce((sum, sub) => sum + sub.transactions.length, 0)}
                        </div>
                        <div className="text-xs opacity-70">معاملة</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Content */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Department Head */}
                    <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--beige-light)', border: '2px solid var(--primary)' }}>
                      <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm opacity-70 mb-1">رئيس الدائرة</p>
                        <p className="font-bold text-lg">{dept.head}</p>
                      </div>
                    </div>

                    {/* Department Employees */}
                    {dept.employees.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                          <Users className="w-5 h-5" />
                          موظفو الدائرة ({dept.employees.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dept.employees.map(emp => (
                            <div key={emp.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                                {emp.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{emp.name}</p>
                                <p className="text-sm opacity-70">{emp.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub-departments */}
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                        <Folders className="w-5 h-5" />
                        الشُعب التابعة ({dept.subDepartments.length})
                      </h3>
                      <div className="space-y-3">
                        {dept.subDepartments.map(subDept => {
                          const isSubExpanded = expandedSubDepartments.includes(subDept.id);
                          return (
                            <div
                              key={subDept.id}
                              className="border-2 rounded-lg overflow-hidden"
                              style={{ borderColor: isSubExpanded ? 'var(--accent)' : 'var(--border)', marginRight: '2rem' }}
                            >
                              <div
                                className="p-4 cursor-pointer transition-all hover:bg-opacity-70"
                                style={{ backgroundColor: 'rgba(185, 167, 121, 0.1)' }}
                                onClick={() => toggleSubDepartment(subDept.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <button className="p-1 rounded">
                                      {isSubExpanded ? (
                                        <ChevronDown className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                      ) : (
                                        <ChevronLeft className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                      )}
                                    </button>
                                    <Folders className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                                    <div>
                                      <p className="font-bold">{subDept.name}</p>
                                      <p className="text-sm opacity-70">رئيس الشعبة: {subDept.head}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-center">
                                      <div className="font-bold" style={{ color: 'var(--accent)' }}>{subDept.employees.length}</div>
                                      <div className="text-xs opacity-70">موظف</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold" style={{ color: 'var(--success)' }}>{subDept.transactions.length}</div>
                                      <div className="text-xs opacity-70">معاملة</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {isSubExpanded && (
                                <div className="p-4 space-y-4" style={{ backgroundColor: 'white' }}>
                                  {/* Sub-department Employees */}
                                  <div>
                                    <h4 className="font-medium mb-2 text-sm flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                      <Users className="w-4 h-4" />
                                      الموظفون
                                    </h4>
                                    <div className="space-y-2">
                                      {subDept.employees.map(emp => (
                                        <div key={emp.id} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--beige-light)' }}>
                                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                                            {emp.name.charAt(0)}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">{emp.name}</p>
                                            <p className="text-xs opacity-70">{emp.role}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Sub-department Transactions */}
                                  <div>
                                    <h4 className="font-medium mb-2 text-sm flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                      <FileText className="w-4 h-4" />
                                      المعاملات النشطة
                                    </h4>
                                    <div className="space-y-2">
                                      {subDept.transactions.map(trans => {
                                        return (
                                          <div key={trans.id} className="flex items-center p-3 rounded" style={{ backgroundColor: 'var(--beige-light)' }}>
                                            <span className="text-sm">{trans.name}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
