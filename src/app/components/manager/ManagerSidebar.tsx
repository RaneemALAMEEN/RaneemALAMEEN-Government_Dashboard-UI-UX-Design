import {
  Home,
  Users,
  MessageSquare,
  LogOut,
  Layers,
  Edit3,
  Inbox,
  Building2,
  BookOpen,
} from 'lucide-react';

interface ManagerSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onExit: () => void;
}

const menuItems = [
  // ── Main ──────────────────────────────────────────────────────────────────
  { id: 'manager-dashboard',           label: 'الرئيسية',              icon: Home,       group: 'main' },
  // ── Transactions ──────────────────────────────────────────────────────────
  { id: 'manager-my-transactions',     label: 'معاملاتي',              icon: Inbox,      group: 'txn',   badge: '5' },
  { id: 'manager-transaction-center',  label: 'المعاملات الداخلية',    icon: Layers,     group: 'txn',   badge: '12' },
  { id: 'manager-dept-transactions',   label: 'معاملات الدائرة',       icon: Building2,  group: 'txn' },
  { id: 'manager-drafts',              label: 'مسوداتي',               icon: Edit3,      group: 'txn',   badge: '4' },
  // ── Admin ─────────────────────────────────────────────────────────────────
  { id: 'manager-employees',           label: 'الموظفين',              icon: Users,         group: 'admin' },
  { id: 'manager-complaints',          label: 'الشكاوى',               icon: MessageSquare, group: 'admin' },
  { id: 'manager-workflow-management', label: 'إدارة نماذج المعاملات', icon: BookOpen,      group: 'admin' },
];

export function ManagerSidebar({ currentPage, onPageChange, onExit }: ManagerSidebarProps) {
  return (
    <div
      className="w-64 h-screen flex flex-col border-l"
      style={{ backgroundColor: 'white', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl mb-1" style={{ color: 'var(--primary)' }}>
          مديرية التربية
        </h1>
        <p className="text-sm" style={{ color: 'var(--accent)' }}>ريف دمشق</p>
        <div
          className="mt-2 px-2 py-0.5 rounded text-xs inline-block"
          style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
        >
          رئيس الدائرة
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const prevGroup = idx > 0 ? menuItems[idx - 1].group : null;
          const showDivider = prevGroup && prevGroup !== item.group;
          return (
            <div key={item.id}>
              {showDivider && (
                <div className="my-2 mx-2 h-px" style={{ backgroundColor: 'var(--border)' }} />
              )}
              <button
                onClick={() => onPageChange(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? 'rgba(237,235,224,0.8)' : 'transparent',
                  color: isActive ? '#002623' : 'var(--charcoal-dark)',
                  fontWeight: isActive ? '500' : '400',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? 'var(--primary)' : 'var(--charcoal-medium)' }}
                />
                <span className="flex-1 text-right text-sm">{item.label}</span>
                {item.badge && !isActive && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Exit */}
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
