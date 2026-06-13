import { useState } from 'react';
import {
  Search,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const employees = [
  { id: 1, name: 'حسن كامل محمود', role: 'مراجع أول', dept: 'الشؤون الإدارية', active: 7, completed: 23, pending: 3, load: 85, status: 'نشط' },
  { id: 2, name: 'سارة يوسف', role: 'موظفة استقبال', dept: 'الإدارة العامة', active: 4, completed: 31, pending: 1, load: 60, status: 'نشط' },
  { id: 3, name: 'كريم منصور', role: 'مراجع', dept: 'الشؤون القانونية', active: 0, completed: 8, pending: 2, load: 15, status: 'غير نشط' },
  { id: 4, name: 'منى الشيخ', role: 'مشرفة', dept: 'الموارد البشرية', active: 9, completed: 18, pending: 5, load: 95, status: 'مثقل' },
  { id: 5, name: 'تامر فواز', role: 'موظف أرشيف', dept: 'الشؤون الإدارية', active: 2, completed: 15, pending: 0, load: 35, status: 'نشط' },
  { id: 6, name: 'ريم درويش', role: 'مراجعة', dept: 'التعليم الأساسي', active: 6, completed: 20, pending: 4, load: 70, status: 'نشط' },
  { id: 7, name: 'باسل حداد', role: 'موظف متابعة', dept: 'التخطيط', active: 1, completed: 5, pending: 6, load: 45, status: 'نشط' },
];

const deptWorkload = [
  { dept: 'الشؤون الإدارية', total: 28, done: 12, pct: 75 },
  { dept: 'الموارد البشرية', total: 19, done: 8, pct: 90 },
  { dept: 'الشؤون القانونية', total: 14, done: 3, pct: 35 },
  { dept: 'التعليم الأساسي', total: 22, done: 14, pct: 55 },
  { dept: 'التخطيط', total: 9, done: 4, pct: 40 },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'نشط': { bg: 'rgba(66,129,119,0.1)', color: '#428177' },
  'غير نشط': { bg: 'rgba(107,31,42,0.08)', color: '#6b1f2a' },
  'مثقل': { bg: 'rgba(152,133,97,0.1)', color: '#988561' },
};

function LoadBar({ value }: { value: number }) {
  const color = value >= 85 ? '#6b1f2a' : value >= 60 ? '#988561' : '#428177';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs w-8 text-left" style={{ color }}>{value}%</span>
    </div>
  );
}

interface ManagerEmployeesProps {
  onViewEmployee: (employee: typeof employees[0]) => void;
}

export function ManagerEmployees({ onViewEmployee }: ManagerEmployeesProps) {
  const [search, setSearch] = useState('');

  const filtered = employees.filter(
    (e) => e.name.includes(search) || e.role.includes(search) || e.dept.includes(search)
  );

  const totalActive = employees.reduce((s, e) => s + e.active, 0);
  const totalCompleted = employees.reduce((s, e) => s + e.completed, 0);
  const overloaded = employees.filter((e) => e.load >= 85).length;
  const inactive = employees.filter((e) => e.load <= 20).length;

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>الموظفين</h1>
        <p className="text-sm opacity-60">{employees.length} موظف في الدائرة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'معاملات نشطة', value: totalActive, icon: Clock, color: '#054239', bg: 'rgba(5,66,57,0.08)' },
          { label: 'منجزة هذا الشهر', value: totalCompleted, icon: CheckCircle2, color: '#428177', bg: 'rgba(66,129,119,0.08)' },
          { label: 'موظفون مثقلون', value: overloaded, icon: TrendingUp, color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
          { label: 'موظفون غير نشطين', value: inactive, icon: TrendingDown, color: '#988561', bg: 'rgba(152,133,97,0.08)' },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: s.bg }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <span className="text-3xl" style={{ color: s.color }}>{s.value}</span>
              </div>
              <p className="text-sm opacity-60">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث في الموظفين..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--beige)' }}>
                  {['الموظف', 'الدور', 'المعاملات النشطة', 'المنجزة', 'عبء العمل', 'الحالة'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-right text-xs opacity-60"
                      style={{ color: 'var(--charcoal-dark)' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => {
                  const sc = statusConfig[emp.status] || { bg: '#eee', color: '#333' };
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onViewEmployee(emp)}
                      className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                            style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
                          >
                            {emp.name[0]}
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--primary)' }}>{emp.name}</p>
                            <p className="text-xs opacity-50">{emp.dept}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm opacity-70">{emp.role}</td>
                      <td className="px-4 py-3 text-sm font-mono text-center" style={{ color: 'var(--primary)' }}>{emp.active}</td>
                      <td className="px-4 py-3 text-sm font-mono text-center opacity-60">{emp.completed}</td>
                      <td className="px-4 py-3 w-32">
                        <LoadBar value={emp.load} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workload Distribution */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h3 style={{ color: 'var(--primary)' }}>توزيع الأحمال بالدوائر</h3>
            </div>
            <div className="space-y-4">
              {deptWorkload.map((d, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{d.dept}</span>
                    <span className="opacity-50 text-xs">{d.done}/{d.total}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${d.pct}%`,
                        backgroundColor: d.pct >= 85 ? '#6b1f2a' : d.pct >= 60 ? '#988561' : 'var(--primary)',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className="text-xs"
                      style={{
                        color: d.pct >= 85 ? '#6b1f2a' : d.pct >= 60 ? '#988561' : '#428177',
                      }}
                    >
                      {d.pct >= 85 ? '⚠ ضغط عالٍ' : d.pct >= 60 ? '○ متوسط' : '✓ طبيعي'}
                    </span>
                    <span className="text-xs opacity-40">{d.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workload alerts */}
          <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h4 className="mb-3" style={{ color: 'var(--primary)' }}>توصيات توزيع العمل</h4>
            <div className="space-y-2 text-sm">
              <div
                className="p-3 rounded-lg border-r-2"
                style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderRightColor: '#6b1f2a' }}
              >
                منى الشيخ مثقلة بالعمل — يُنصح بتحويل بعض معاملاتها
              </div>
              <div
                className="p-3 rounded-lg border-r-2"
                style={{ backgroundColor: 'rgba(152,133,97,0.05)', borderRightColor: '#988561' }}
              >
                كريم منصور غير نشط — يمكن توجيه معاملات إليه
              </div>
              <div
                className="p-3 rounded-lg border-r-2"
                style={{ backgroundColor: 'rgba(66,129,119,0.05)', borderRightColor: '#428177' }}
              >
                تامر فواز لديه طاقة إضافية — مناسب لمعاملات إضافية
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
