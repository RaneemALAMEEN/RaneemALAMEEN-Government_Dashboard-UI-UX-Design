import { Home, Building2, Folders, Shield, Database, FileText, FileCheck, GitBranch, Users, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onExit: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home },
  { id: 'organizations', label: 'المؤسسات', icon: Building2 },
  { id: 'departments', label: 'الأقسام والدوائر', icon: Folders },
  { id: 'roles', label: 'الأدوار', icon: Shield },
  { id: 'fields-and-files', label: 'الحقول والملفات', icon: Database },
  { id: 'templates', label: 'قوالب المستندات', icon: FileCheck },
  { id: 'processes', label: 'المعاملات', icon: GitBranch },
  { id: 'employees', label: 'الموظفين', icon: Users },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, onExit }: SidebarProps) {
  return (
    <div className="w-64 h-screen flex flex-col border-l" style={{ backgroundColor: 'white', borderColor: 'var(--border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
          مديرية التربية
        </h1>
        <p className="text-sm" style={{ color: 'var(--accent)' }}>
          ريف دمشق
        </p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(237, 235, 224, 0.6)' : 'transparent',
                color: isActive ? '#002623' : 'var(--charcoal-dark)',
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-50"
          style={{ color: 'var(--umber-light)' }}
        >
          <LogOut className="w-5 h-5" />
          <span>تغيير الدور</span>
        </button>
      </div>
    </div>
  );
}
