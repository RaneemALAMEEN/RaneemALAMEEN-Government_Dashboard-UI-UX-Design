import { Bell, Search, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6" style={{
      backgroundColor: 'white',
      borderColor: 'var(--border)'
    }}>
      {/* Left Side - Icons */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="بحث..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--beige)',
              '--tw-ring-color': 'var(--primary)',
            } as any}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>

        <button
          className="p-2 rounded-lg transition-all hover:shadow-sm relative"
          style={{ backgroundColor: 'var(--beige)' }}
          title="الإشعارات"
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--destructive)' }}
          />
        </button>
      </div>

      {/* Right Side - User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium mb-1">أحمد محمود</p>
          <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>المسؤول التقني</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <User className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
}
