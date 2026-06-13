import { Settings as SettingsIcon, Bell, Lock, Palette, Globe } from 'lucide-react';

const settingsSections = [
  {
    title: 'الإشعارات',
    icon: Bell,
    description: 'إدارة إعدادات الإشعارات والتنبيهات',
  },
  {
    title: 'الأمان والخصوصية',
    icon: Lock,
    description: 'إعدادات الأمان وحماية البيانات',
  },
  {
    title: 'المظهر',
    icon: Palette,
    description: 'تخصيص ألوان ومظهر النظام',
  },
  {
    title: 'اللغة والمنطقة',
    icon: Globe,
    description: 'إعدادات اللغة والتوقيت',
  },
];

export function Settings() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl mb-2 flex items-center gap-3" style={{ color: 'var(--primary)' }}>
          <SettingsIcon className="w-8 h-8" />
          الإعدادات
        </h1>
        <p className="opacity-70">إدارة إعدادات النظام والتفضيلات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{section.title}</h3>
                  <p className="text-sm opacity-70">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h2 className="mb-4" style={{ color: 'var(--primary)' }}>معلومات النظام</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="opacity-70">اسم النظام</span>
            <span className="font-medium">النظام الإلكتروني - مديرية التربية</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="opacity-70">الإصدار</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="opacity-70">آخر تحديث</span>
            <span className="font-medium">2026-05-09</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="opacity-70">الترخيص</span>
            <span className="font-medium">وزارة التربية - الجمهورية العربية السورية</span>
          </div>
        </div>
      </div>
    </div>
  );
}
