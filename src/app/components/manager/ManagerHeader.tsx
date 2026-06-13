import { Bell, Search, User, ChevronDown } from 'lucide-react';

export function ManagerHeader() {
  return (
    <header
      className="h-16 border-b flex items-center justify-between px-6"
      style={{ backgroundColor: 'white', borderColor: 'var(--border)' }}
    >
      {/* Left – Search + Bell */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="بحث في المعاملات..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--beige)',
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>

        <button
          className="p-2 rounded-lg transition-all hover:shadow-sm relative"
          style={{ backgroundColor: 'var(--beige)' }}
          title="الإشعارات"
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--umber-light)' }}
          />
        </button>
      </div>

      {/* Right – User */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-sm">محمد العمر</p>
          <p className="text-xs" style={{ color: 'var(--primary)' }}>
            رئيس الدائرة
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          <User className="w-5 h-5" />
        </div>
        <ChevronDown className="w-4 h-4 opacity-40" />
      </div>
    </header>
  );
}
