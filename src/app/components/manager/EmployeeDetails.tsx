import { useState } from 'react';
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Star,
  MessageSquare,
  LogIn,
  ArrowLeftRight,
  XCircle,
  Edit3,
  Briefcase,
  Award,
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  dept: string;
  active: number;
  completed: number;
  pending: number;
  load: number;
  status: string;
}

interface EmployeeDetailsProps {
  employee: Employee;
  onBack: () => void;
}

// Extended mock data keyed by employee id
const extendedData: Record<number, {
  empNumber: string;
  email: string;
  phone: string;
  manager: string;
  joinDate: string;
  serviceDuration: string;
  lastLogin: string;
  accountCreated: string;
  permissions: string[];
  delayed: number;
  completionRate: number;
  avgTime: string;
  deptAvgTime: string;
  monthlyTxns: number[];
  assignedTxns: { id: string; type: string; received: string; priority: string; status: string; days: number; late: boolean }[];
  completedTxns: { id: string; type: string; completedDate: string; duration: string; result: string }[];
  activityLog: { date: string; time: string; type: string; action: string; color: string }[];
  leaveUsed: number;
  leaveRemaining: number;
  lastLeave: string;
  absenceDays: number;
  attendanceDays: number;
  notes: { author: string; date: string; text: string; type: 'note' | 'alert' | 'review' }[];
}> = {
  1: {
    empNumber: 'EMP-2019-001',
    email: 'h.kamel@edu.gov.sy',
    phone: '+963 11 234 5678',
    manager: 'محمد العمر',
    joinDate: '2019-09-01',
    serviceDuration: '4 سنوات و 4 أشهر',
    lastLogin: '2024-01-31 08:42',
    accountCreated: '2019-09-01',
    permissions: ['استلام المعاملات', 'مراجعة المستندات', 'إحالة للرئيس', 'إنشاء التقارير'],
    delayed: 2,
    completionRate: 88,
    avgTime: '1.8 يوم',
    deptAvgTime: '2.4 يوم',
    monthlyTxns: [18, 22, 19, 25, 23, 20],
    assignedTxns: [
      { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية', received: '2024-01-29', priority: 'عالية', status: 'قيد المراجعة', days: 2, late: false },
      { id: 'TXN-2024-436', type: 'شهادة خدمة', received: '2024-01-27', priority: 'عادية', status: 'قيد المعالجة', days: 4, late: false },
      { id: 'TXN-2024-430', type: 'مراسلة رسمية', received: '2024-01-22', priority: 'عالية', status: 'متأخرة', days: 9, late: true },
      { id: 'TXN-2024-428', type: 'طلب وثيقة رسمية', received: '2024-01-20', priority: 'عادية', status: 'قيد المراجعة', days: 11, late: true },
    ],
    completedTxns: [
      { id: 'TXN-2024-425', type: 'طلب إجازة', completedDate: '2024-01-28', duration: '1.5 يوم', result: 'تمت الموافقة' },
      { id: 'TXN-2024-418', type: 'مراسلة رسمية', completedDate: '2024-01-25', duration: '0.8 يوم', result: 'تمت المعالجة' },
      { id: 'TXN-2024-412', type: 'طلب وثيقة رسمية', completedDate: '2024-01-23', duration: '2.1 يوم', result: 'تمت الموافقة' },
    ],
    activityLog: [
      { date: '2024-01-31', time: '08:42', type: 'login', action: 'تسجيل دخول للنظام', color: '#428177' },
      { date: '2024-01-30', time: '14:20', type: 'transfer', action: 'تحويل معاملة TXN-2024-440 إلى المراجعة القانونية', color: '#988561' },
      { date: '2024-01-30', time: '11:05', type: 'approve', action: 'الموافقة على معاملة TXN-2024-425', color: '#054239' },
      { date: '2024-01-29', time: '09:30', action: 'استلام معاملة TXN-2024-441', type: 'receive', color: '#428177' },
      { date: '2024-01-28', time: '15:50', type: 'login', action: 'تسجيل دخول للنظام', color: '#428177' },
      { date: '2024-01-27', time: '10:15', type: 'reject', action: 'رفض معاملة TXN-2024-415 — مستندات ناقصة', color: '#6b1f2a' },
      { date: '2024-01-26', time: '08:00', type: 'update', action: 'تحديث بيانات معاملة TXN-2024-410', color: '#988561' },
    ],
    leaveUsed: 8,
    leaveRemaining: 22,
    lastLeave: '2023-12-24 إلى 2023-12-28',
    absenceDays: 2,
    attendanceDays: 21,
    notes: [
      { author: 'محمد العمر', date: '2024-01-15', text: 'الموظف يُظهر أداءً متميزاً في معالجة الوثائق الرسمية. يوصى بمنحه صلاحيات مراجعة إضافية.', type: 'review' },
      { author: 'محمد العمر', date: '2023-11-20', text: 'تنبيه: تأخر في معالجة مجموعة من المعاملات خلال أكتوبر بسبب الضغط الزائد. يُطلب منه إشعاري عند ارتفاع الحمل.', type: 'alert' },
    ],
  },
  2: {
    empNumber: 'EMP-2020-007',
    email: 's.yousef@edu.gov.sy',
    phone: '+963 11 234 9012',
    manager: 'محمد العمر',
    joinDate: '2020-03-15',
    serviceDuration: '3 سنوات و 10 أشهر',
    lastLogin: '2024-01-31 09:10',
    accountCreated: '2020-03-15',
    permissions: ['استلام المعاملات', 'تسجيل الطلبات', 'إحالة للمراجعة'],
    delayed: 0,
    completionRate: 95,
    avgTime: '0.9 يوم',
    deptAvgTime: '2.4 يوم',
    monthlyTxns: [28, 30, 27, 32, 31, 29],
    assignedTxns: [
      { id: 'TXN-2024-443', type: 'طلب وثيقة رسمية', received: '2024-01-31', priority: 'عادية', status: 'قيد المعالجة', days: 0, late: false },
      { id: 'TXN-2024-442', type: 'شهادة خدمة', received: '2024-01-31', priority: 'عادية', status: 'قيد المعالجة', days: 0, late: false },
    ],
    completedTxns: [
      { id: 'TXN-2024-439', type: 'طلب إجازة', completedDate: '2024-01-30', duration: '0.5 يوم', result: 'تمت الموافقة' },
      { id: 'TXN-2024-433', type: 'مراسلة رسمية', completedDate: '2024-01-28', duration: '1.2 يوم', result: 'تمت المعالجة' },
    ],
    activityLog: [
      { date: '2024-01-31', time: '09:10', type: 'login', action: 'تسجيل دخول للنظام', color: '#428177' },
      { date: '2024-01-31', time: '09:25', type: 'receive', action: 'استلام معاملة TXN-2024-443', color: '#428177' },
      { date: '2024-01-30', time: '14:00', type: 'approve', action: 'إنجاز معاملة TXN-2024-439', color: '#054239' },
    ],
    leaveUsed: 3,
    leaveRemaining: 27,
    lastLeave: '2023-08-10 إلى 2023-08-12',
    absenceDays: 0,
    attendanceDays: 23,
    notes: [
      { author: 'محمد العمر', date: '2024-01-10', text: 'أداء ممتاز وسرعة عالية في الاستجابة. موظفة متميزة تستحق التقدير.', type: 'review' },
    ],
  },
};

// Fallback data for employees without extended data
function getExtended(id: number) {
  return extendedData[id] ?? extendedData[1];
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  'نشط': { bg: 'rgba(66,129,119,0.1)', color: '#428177', label: 'نشط' },
  'غير نشط': { bg: 'rgba(107,31,42,0.08)', color: '#6b1f2a', label: 'غير نشط' },
  'مثقل': { bg: 'rgba(152,133,97,0.1)', color: '#988561', label: 'مثقل بالعمل' },
  'بإجازة': { bg: 'rgba(185,167,121,0.15)', color: '#988561', label: 'بإجازة' },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  'عالية': { color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
  'عادية': { color: '#988561', bg: 'rgba(152,133,97,0.08)' },
  'منخفضة': { color: '#428177', bg: 'rgba(66,129,119,0.08)' },
};

const activityIconMap: Record<string, typeof LogIn> = {
  login: LogIn,
  transfer: ArrowLeftRight,
  approve: CheckCircle2,
  receive: FileText,
  reject: XCircle,
  update: Edit3,
};

function LoadBadge({ load }: { load: number }) {
  if (load >= 85) return (
    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}>
      ضغط مرتفع
    </span>
  );
  if (load >= 55) return (
    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(152,133,97,0.1)', color: '#988561' }}>
      ضغط متوسط
    </span>
  );
  return (
    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(66,129,119,0.1)', color: '#428177' }}>
      ضغط منخفض
    </span>
  );
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
      <div
        className="h-2 rounded-full transition-all"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function EmployeeDetails({ employee, onBack }: EmployeeDetailsProps) {
  const ext = getExtended(employee.id);
  const sc = statusConfig[employee.status] || statusConfig['نشط'];
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'system'>('info');

  const overviewCards = [
    { label: 'المعاملات المستلمة', value: employee.active + employee.completed + employee.pending, icon: FileText, color: '#054239', bg: 'rgba(5,66,57,0.08)' },
    { label: 'المعاملات المنجزة', value: employee.completed, icon: CheckCircle2, color: '#428177', bg: 'rgba(66,129,119,0.08)' },
    { label: 'قيد المعالجة', value: employee.active, icon: Clock, color: '#988561', bg: 'rgba(152,133,97,0.08)' },
    { label: 'معاملات متأخرة', value: ext.delayed, icon: AlertTriangle, color: '#6b1f2a', bg: 'rgba(107,31,42,0.08)' },
    { label: 'معدل الإنجاز', value: `${ext.completionRate}%`, icon: TrendingUp, color: '#054239', bg: 'rgba(5,66,57,0.08)' },
    { label: 'متوسط زمن المعالجة', value: ext.avgTime, icon: BarChart2, color: '#b9a779', bg: 'rgba(185,167,121,0.1)' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
        style={{ color: 'var(--primary)' }}
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى قائمة الموظفين
      </button>

      {/* ─────────────────── HEADER SECTION ─────────────────── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        {/* Banner */}
        <div
          className="h-24"
          style={{ background: 'linear-gradient(135deg, #054239 0%, #428177 100%)' }}
        />
        <div className="px-8 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-5">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-2xl shadow-md"
              style={{
                backgroundColor: 'var(--primary)',
                borderColor: 'white',
                color: 'white',
              }}
            >
              {employee.name[0]}
            </div>
            {/* Status + Load */}
            <div className="flex items-center gap-3 mt-14">
              <LoadBadge load={employee.load} />
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{ backgroundColor: sc.bg, color: sc.color }}
              >
                {sc.label}
              </span>
            </div>
          </div>

          {/* Name + Role */}
          <div className="mb-5">
            <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>
              {employee.name}
            </h1>
            <p className="opacity-60 mb-2">{employee.role}</p>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 opacity-40" />
              <span className="text-sm opacity-60">{employee.dept}</span>
            </div>
          </div>

          {/* Meta Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            {[
              { icon: Award, label: 'رقم الموظف', value: ext.empNumber },
              { icon: Calendar, label: 'تاريخ الانضمام', value: ext.joinDate },
              { icon: Clock, label: 'مدة الخدمة', value: ext.serviceDuration },
              { icon: LogIn, label: 'آخر تسجيل دخول', value: ext.lastLogin },
            ].map((meta, idx) => {
              const Icon = meta.icon;
              return (
                <div key={idx} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 mt-0.5 opacity-40 shrink-0" />
                  <div>
                    <p className="text-xs opacity-50 mb-0.5">{meta.label}</p>
                    <p className="text-sm">{meta.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────── OVERVIEW CARDS ─────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-4 border shadow-sm text-center" style={{ borderColor: 'var(--border)' }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: card.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-xl mb-0.5" style={{ color: card.color }}>{card.value}</p>
              <p className="text-xs opacity-50 leading-tight">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ─────────────────── MAIN GRID ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5">

          {/* Employee Information */}
          <div className="bg-white rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveTab('info')}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: activeTab === 'info' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'info' ? 'white' : 'var(--charcoal-medium)',
                }}
              >
                البيانات الأساسية
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: activeTab === 'system' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'system' ? 'white' : 'var(--charcoal-medium)',
                }}
              >
                بيانات النظام
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'info' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: User, label: 'الاسم الكامل', value: employee.name },
                    { icon: Award, label: 'رقم الموظف', value: ext.empNumber },
                    { icon: Mail, label: 'البريد الإلكتروني', value: ext.email },
                    { icon: Phone, label: 'رقم الهاتف', value: ext.phone },
                    { icon: Building2, label: 'القسم / الدائرة', value: employee.dept },
                    { icon: Briefcase, label: 'المنصب الوظيفي', value: employee.role },
                    { icon: User, label: 'المدير المباشر', value: ext.manager },
                    { icon: Calendar, label: 'تاريخ التعيين', value: ext.joinDate },
                  ].map((field, idx) => {
                    const Icon = field.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                        <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                        <div>
                          <p className="text-xs opacity-50 mb-0.5">{field.label}</p>
                          <p className="text-sm">{field.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: LogIn, label: 'آخر تسجيل دخول', value: ext.lastLogin },
                      { icon: Calendar, label: 'تاريخ إنشاء الحساب', value: ext.accountCreated },
                      { icon: Shield, label: 'الدور الوظيفي', value: employee.role },
                    ].map((field, idx) => {
                      const Icon = field.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--beige)' }}>
                          <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                          <div>
                            <p className="text-xs opacity-50 mb-0.5">{field.label}</p>
                            <p className="text-sm">{field.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-3">الصلاحيات الممنوحة</p>
                    <div className="flex flex-wrap gap-2">
                      {ext.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: 'rgba(5,66,57,0.06)', color: 'var(--primary)' }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Transactions */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 style={{ color: 'var(--primary)' }}>المعاملات المسندة حالياً</h3>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(5,66,57,0.08)', color: 'var(--primary)' }}
              >
                {ext.assignedTxns.length} معاملة
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--beige)' }}>
                  {['رقم المعاملة', 'النوع', 'تاريخ الاستلام', 'الأولوية', 'الحالة', 'الأيام'].map((col) => (
                    <th key={col} className="px-4 py-3 text-right text-xs opacity-60">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ext.assignedTxns.map((tx, idx) => {
                  const pc = priorityConfig[tx.priority] || priorityConfig['عادية'];
                  return (
                    <tr
                      key={idx}
                      className="border-b transition-colors hover:bg-gray-50"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: tx.late ? 'rgba(107,31,42,0.025)' : undefined,
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</span>
                          {tx.late && (
                            <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#6b1f2a' }} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm opacity-70">{tx.type}</td>
                      <td className="px-4 py-3 text-sm opacity-60">{tx.received}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: pc.bg, color: pc.color }}>
                          {tx.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: tx.late ? 'rgba(107,31,42,0.08)' : 'rgba(152,133,97,0.08)',
                            color: tx.late ? '#6b1f2a' : '#988561',
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: tx.late ? '#6b1f2a' : undefined }}>
                        {tx.days > 0 ? `${tx.days} يوم` : 'اليوم'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Completed Transactions */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 style={{ color: 'var(--primary)' }}>آخر المعاملات المنجزة</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {ext.completedTxns.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(66,129,119,0.08)' }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#428177' }} />
                    </div>
                    <div>
                      <p className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{tx.id}</p>
                      <p className="text-xs opacity-50">{tx.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{tx.result}</p>
                    <div className="flex items-center gap-3 text-xs opacity-50 mt-0.5">
                      <span>{tx.completedDate}</span>
                      <span>•</span>
                      <span>مدة الإنجاز: {tx.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h3 className="mb-5" style={{ color: 'var(--primary)' }}>سجل النشاط (Audit Trail)</h3>
            <div className="relative">
              {ext.activityLog.map((entry, idx) => {
                const Icon = activityIconMap[entry.type] || FileText;
                return (
                  <div key={idx} className="flex gap-4 pb-5 last:pb-0 relative">
                    {idx < ext.activityLog.length - 1 && (
                      <div
                        className="absolute top-6 right-[11px] w-0.5 bottom-0"
                        style={{ backgroundColor: 'var(--border)' }}
                      />
                    )}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-0.5"
                      style={{ backgroundColor: `${entry.color}15` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: entry.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-0.5">{entry.action}</p>
                      <div className="flex items-center gap-2 text-xs opacity-40">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span>{entry.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">

          {/* Performance Analytics */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h3 style={{ color: 'var(--primary)' }}>مؤشرات الأداء</h3>
            </div>

            {/* Completion Rate */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="opacity-60">معدل الإنجاز</span>
                <span style={{ color: ext.completionRate >= 85 ? '#428177' : '#988561' }}>
                  {ext.completionRate}%
                </span>
              </div>
              <MiniBar value={ext.completionRate} color={ext.completionRate >= 85 ? '#428177' : '#988561'} />
              <p className="text-xs mt-1 opacity-40">متوسط القسم: 78%</p>
            </div>

            {/* Avg time vs dept */}
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--beige)' }}>
              <p className="text-xs opacity-50 mb-1">متوسط زمن المعالجة</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl" style={{ color: 'var(--primary)' }}>{ext.avgTime}</span>
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-40">متوسط القسم</p>
                  <p className="text-sm opacity-60">{ext.deptAvgTime}</p>
                </div>
              </div>
              <div
                className="mt-2 flex items-center gap-1 text-xs"
                style={{ color: ext.avgTime < ext.deptAvgTime ? '#428177' : '#6b1f2a' }}
              >
                {ext.avgTime < ext.deptAvgTime ? (
                  <><TrendingDown className="w-3.5 h-3.5" /> أفضل من المتوسط</>
                ) : (
                  <><TrendingUp className="w-3.5 h-3.5" /> يحتاج تحسيناً</>
                )}
              </div>
            </div>

            {/* Monthly chart (visual bars) */}
            <div>
              <p className="text-xs opacity-50 mb-3">المعاملات الشهرية (آخر 6 أشهر)</p>
              <div className="flex items-end gap-1.5 h-16">
                {ext.monthlyTxns.map((val, idx) => {
                  const maxVal = Math.max(...ext.monthlyTxns);
                  const heightPct = (val / maxVal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: idx === ext.monthlyTxns.length - 1 ? 'var(--primary)' : 'rgba(5,66,57,0.2)',
                        }}
                      />
                      <span className="text-xs opacity-40">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Workload Distribution */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--primary)' }}>حجم العمل الحالي</h3>
              <LoadBadge load={employee.load} />
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="opacity-60">نسبة الحمل</span>
                <span
                  style={{
                    color: employee.load >= 85 ? '#6b1f2a' : employee.load >= 55 ? '#988561' : '#428177',
                  }}
                >
                  {employee.load}%
                </span>
              </div>
              <MiniBar
                value={employee.load}
                color={employee.load >= 85 ? '#6b1f2a' : employee.load >= 55 ? '#988561' : '#428177'}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="opacity-60">معاملات مفتوحة</span>
                <span style={{ color: 'var(--primary)' }}>{employee.active}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="opacity-60">معاملات معلقة</span>
                <span style={{ color: '#988561' }}>{employee.pending}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="opacity-60">معاملات متأخرة</span>
                <span style={{ color: '#6b1f2a' }}>{ext.delayed}</span>
              </div>
            </div>

            {employee.load >= 80 && (
              <div
                className="mt-4 p-3 rounded-lg text-xs flex items-start gap-2 border-r-2"
                style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderRightColor: '#6b1f2a', color: '#6b1f2a' }}
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                الموظف يعمل بطاقة عالية — يُنصح بتوزيع بعض المعاملات
              </div>
            )}
          </div>

          {/* Leave & Attendance */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <h3 className="mb-4" style={{ color: 'var(--primary)' }}>الإجازات والحضور</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'إجازات مستخدمة', value: ext.leaveUsed, color: '#988561' },
                { label: 'إجازات متبقية', value: ext.leaveRemaining, color: '#428177' },
                { label: 'أيام حضور', value: ext.attendanceDays, color: '#054239' },
                { label: 'أيام غياب', value: ext.absenceDays, color: '#6b1f2a' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg text-center"
                  style={{ backgroundColor: `${s.color}08` }}
                >
                  <p className="text-xl mb-0.5" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs opacity-60">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Leave bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 opacity-50">
                <span>رصيد الإجازة ({ext.leaveUsed + ext.leaveRemaining} يوم)</span>
                <span>{Math.round((ext.leaveUsed / (ext.leaveUsed + ext.leaveRemaining)) * 100)}% مستخدم</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(ext.leaveUsed / (ext.leaveUsed + ext.leaveRemaining)) * 100}%`,
                    backgroundColor: '#988561',
                  }}
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-xs opacity-50" style={{ borderColor: 'var(--border)' }}>
              <span>آخر إجازة: </span>
              <span>{ext.lastLeave}</span>
            </div>
          </div>

          {/* Notes & Manager Remarks */}
          <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h3 style={{ color: 'var(--primary)' }}>ملاحظات رئيس الدائرة</h3>
            </div>

            <div className="space-y-3 mb-4">
              {ext.notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border-r-2"
                  style={{
                    backgroundColor:
                      note.type === 'alert' ? 'rgba(107,31,42,0.04)' :
                      note.type === 'review' ? 'rgba(5,66,57,0.04)' : 'var(--beige)',
                    borderRightColor:
                      note.type === 'alert' ? '#6b1f2a' :
                      note.type === 'review' ? 'var(--primary)' : '#988561',
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: 'var(--primary)' }}>{note.author}</span>
                    <span className="text-xs opacity-40">{note.date}</span>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">{note.text}</p>
                </div>
              ))}
            </div>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
              placeholder="أضف ملاحظة إدارية..."
              className="w-full p-3 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
            />
            {noteText && (
              <button
                className="mt-2 w-full py-2 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                onClick={() => setNoteText('')}
              >
                حفظ الملاحظة
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
