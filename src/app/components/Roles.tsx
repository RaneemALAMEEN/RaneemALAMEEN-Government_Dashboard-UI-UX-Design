import { useState } from 'react';
import { Shield, Plus, Edit, Trash2, Code } from 'lucide-react';
import { CreateRoleModal } from './modals/CreateRoleModal';

const mockRoles = [
  {
    id: 1,
    name: 'مدير الدائرة',
    code: 'DEPARTMENT_DIRECTOR',
    organization: 'مديرية التربية الرئيسية',
    department: 'الإدارة العامة',
    camundaKey: 'DEPARTMENT_DIRECTOR__ORG1__DEPT1',
  },
  {
    id: 2,
    name: 'موظف استقبال',
    code: 'RECEPTION_EMPLOYEE',
    organization: 'مديرية التربية الرئيسية',
    department: 'قسم الشؤون الإدارية',
    camundaKey: 'RECEPTION_EMPLOYEE__ORG1__DEPT2',
  },
  {
    id: 3,
    name: 'مدقق بيانات',
    code: 'DATA_AUDITOR',
    organization: 'مديرية التربية الرئيسية',
    department: 'قسم التخطيط والمتابعة',
    camundaKey: 'DATA_AUDITOR__ORG1__DEPT5',
  },
  {
    id: 4,
    name: 'مسؤول الموارد البشرية',
    code: 'HR_MANAGER',
    organization: 'مديرية التربية الرئيسية',
    department: 'وحدة الموارد البشرية',
    camundaKey: 'HR_MANAGER__ORG1__DEPT3',
  },
];

export function Roles() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
            <Shield className="w-8 h-8" />
            إدارة الأدوار
          </h1>
          <p className="opacity-70">تحديد الأدوار والصلاحيات الوظيفية</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <Plus className="w-5 h-5" />
          إنشاء دور جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{role.name}</h3>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 opacity-50" />
                    <span className="text-sm opacity-70 font-mono">{role.code}</span>
                  </div>
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

            <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="text-sm opacity-60 mb-1">المؤسسة</div>
                <div className="font-medium">{role.organization}</div>
              </div>

              <div>
                <div className="text-sm opacity-60 mb-1">القسم</div>
                <div className="font-medium">{role.department}</div>
              </div>

              <div>
                <div className="text-sm opacity-60 mb-1">مفتاح Camunda</div>
                <div
                  className="font-mono text-sm p-2 rounded"
                  style={{ backgroundColor: 'var(--beige-light)' }}
                >
                  {role.camundaKey}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
