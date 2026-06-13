import { Settings, Briefcase, ArrowLeft, Shield, Users } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'manager') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--background)', direction: 'rtl' }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Shield className="w-8 h-8" style={{ color: 'white' }} />
        </div>
        <h1 className="text-3xl mb-2" style={{ color: 'var(--primary)' }}>
          مديرية التربية – ريف دمشق
        </h1>
        <p className="opacity-60" style={{ color: 'var(--charcoal-dark)' }}>
          النظام الإلكتروني لإدارة المعاملات الحكومية
        </p>
        <div
          className="mt-3 px-4 py-1 rounded-full inline-block text-sm"
          style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
        >
          اختر نوع الدخول المناسب لصلاحياتك
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* Admin Card */}
        <button
          onClick={() => onSelectRole('admin')}
          className="group relative bg-white rounded-2xl p-8 border text-right transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all"
            style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}
          >
            <Settings className="w-7 h-7" style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-xl mb-2" style={{ color: 'var(--primary)' }}>
            المسؤول التقني
          </h2>
          <p className="text-sm opacity-60 leading-relaxed mb-6" style={{ color: 'var(--charcoal-dark)' }}>
            إدارة المؤسسات، الأقسام، الأدوار، الحقول، القوالب، وسير العمل. صلاحيات النظام الكاملة.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['إدارة النظام', 'الأقسام', 'الأدوار', 'القوالب'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'rgba(5,66,57,0.06)', color: 'var(--primary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--primary)' }}
          >
            <span>دخول كمسؤول تقني</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          {/* Active indicator bar */}
          <div
            className="absolute bottom-0 right-0 left-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          />
        </button>

        {/* Manager Card */}
        <button
          onClick={() => onSelectRole('manager')}
          className="group relative rounded-2xl p-8 border text-right transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--primary)',
            borderColor: 'var(--forest-dark)',
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Users className="w-7 h-7" style={{ color: 'white' }} />
          </div>
          <h2 className="text-xl mb-2" style={{ color: 'white' }}>
            رئيس الدائرة
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            متابعة المعاملات، اتخاذ القرارات الإدارية، مراقبة أداء الموظفين، والإشراف على سير العمل.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['المعاملات', 'الموظفين', 'الشكاوى', 'التقارير'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <span>دخول كرئيس دائرة</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          {/* Subtle shimmer */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)' }}
          />
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm opacity-40" style={{ color: 'var(--charcoal-dark)' }}>
        النظام الإلكتروني لإدارة المعاملات · الإصدار 2.0
      </p>
    </div>
  );
}
