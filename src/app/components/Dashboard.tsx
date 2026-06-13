import { useState } from 'react';
import { Building2, Folders, Shield, Database, FileText, FileCheck, GitBranch } from 'lucide-react';
import { CreateOrganizationModal } from './modals/CreateOrganizationModal';
import { CreateDepartmentModal } from './modals/CreateDepartmentModal';
import { CreateRoleModal } from './modals/CreateRoleModal';
import { CreateFieldModal } from './modals/CreateFieldModal';
import { CreateProcessModal } from './modals/CreateProcessModal';

const statsCards = [
  { label: 'عدد المؤسسات', value: '15', icon: Building2, color: '#054239' },
  { label: 'عدد الأقسام', value: '47', icon: Folders, color: '#428177' },
  { label: 'عدد الأدوار', value: '23', icon: Shield, color: '#b9a779' },
  { label: 'عدد الحقول', value: '89', icon: Database, color: '#054239' },
  { label: 'عدد الملفات', value: '234', icon: FileText, color: '#988561' },
  { label: 'عدد القوالب', value: '12', icon: FileCheck, color: '#428177' },
  { label: 'عدد المعاملات', value: '8', icon: GitBranch, color: '#054239' },
];

const recentActivities = [
  { title: 'تم إنشاء مؤسسة جديدة', desc: 'مديرية التربية - منطقة القدم', time: 'منذ ساعتين' },
  { title: 'تم اعتماد معاملة', desc: 'طلب وثيقة رسمية - رقم 2341', time: 'منذ 3 ساعات' },
  { title: 'تم تعديل عملية', desc: 'عملية اعتماد المستندات', time: 'منذ 5 ساعات' },
  { title: 'تم إضافة دور جديد', desc: 'مدقق البيانات', time: 'منذ يوم واحد' },
];

export function Dashboard() {
  const [modals, setModals] = useState({
    organization: false,
    department: false,
    role: false,
    field: false,
    process: false,
  });

  const openModal = (type: keyof typeof modals) => {
    setModals({ ...modals, [type]: true });
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals({ ...modals, [type]: false });
  };

  return (
    <>
      <CreateOrganizationModal isOpen={modals.organization} onClose={() => closeModal('organization')} />
      <CreateDepartmentModal isOpen={modals.department} onClose={() => closeModal('department')} />
      <CreateRoleModal isOpen={modals.role} onClose={() => closeModal('role')} />
      <CreateFieldModal isOpen={modals.field} onClose={() => closeModal('field')} />
      <CreateProcessModal isOpen={modals.process} onClose={() => closeModal('process')} />
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl mb-2" style={{ color: 'var(--primary)' }}>لوحة التحكم الرئيسية</h1>
        <p className="opacity-70">نظرة شاملة على النظام الإلكتروني</p>
      </div>

      {/* Quick Actions - Moved to top */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h2 className="mb-6 text-xl" style={{ color: 'var(--primary)' }}>إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => openModal('organization')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
              }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-medium">إنشاء مؤسسة</span>
            </button>

            <button
              onClick={() => openModal('department')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
              }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Folders className="w-5 h-5" />
              </div>
              <span className="font-medium">إنشاء قسم</span>
            </button>

            <button
              onClick={() => openModal('role')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
              }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-medium">إنشاء دور</span>
            </button>

            <button
              onClick={() => openModal('field')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
              }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <Database className="w-5 h-5" />
              </div>
              <span className="font-medium">إنشاء حقل</span>
            </button>

            <button
              onClick={() => openModal('process')}
              className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--beige-light)',
              }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <GitBranch className="w-5 h-5" />
              </div>
              <span className="font-medium">إنشاء معاملة</span>
            </button>
          </div>
        </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
                  {stat.value}
                </div>
              </div>
              <p className="opacity-70">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h2 className="mb-4" style={{ color: 'var(--primary)' }}>آخر النشاطات</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-1">
                  <p className="font-medium mb-1">{activity.title}</p>
                  <p className="text-sm opacity-70">{activity.desc}</p>
                </div>
                <div className="text-sm opacity-60 whitespace-nowrap">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
