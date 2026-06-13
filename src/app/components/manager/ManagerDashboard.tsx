import { useState } from 'react';
import {
  PenSquare,
  Zap,
  CheckCircle2,
  Inbox,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  Eye,
  Send,
  ChevronLeft,
  FileText,
  Bell,
  Users,
  Timer,
} from 'lucide-react';
import { RejectModal } from './modals/RejectModal';
import { TransferModal } from './modals/TransferModal';
import { SuccessModal } from './modals/SuccessModal';

const kpis = [
  {
    label: 'بانتظار توقيعك',
    value: '12',
    icon: PenSquare,
    color: '#054239',
    bg: 'rgba(5,66,57,0.08)',
    change: '+3 منذ أمس',
    changeUp: true,
  },
  {
    label: 'معاملات مستعجلة',
    value: '5',
    icon: Zap,
    color: '#6b1f2a',
    bg: 'rgba(107,31,42,0.08)',
    change: '+2 هذا الصباح',
    changeUp: true,
  },
  {
    label: 'تم إنجازها اليوم',
    value: '28',
    icon: CheckCircle2,
    color: '#428177',
    bg: 'rgba(66,129,119,0.08)',
    change: '↑ 14% عن أمس',
    changeUp: true,
  },
  {
    label: 'إجمالي الوارد اليوم',
    value: '41',
    icon: Inbox,
    color: '#988561',
    bg: 'rgba(152,133,97,0.08)',
    change: 'معدل طبيعي',
    changeUp: null,
  },
];

const transactions = [
  { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية', requester: 'خالد أحمد مطر', date: '2024-01-31', status: 'بانتظار التوقيع', urgent: true },
  { id: 'TXN-2024-440', type: 'نقل موظف', requester: 'سلمى يوسف', date: '2024-01-31', status: 'قيد التنفيذ', urgent: false },
  { id: 'TXN-2024-439', type: 'طلب إجازة', requester: 'محمود السيد', date: '2024-01-30', status: 'بانتظار التوقيع', urgent: true },
  { id: 'TXN-2024-438', type: 'مراسلة رسمية', requester: 'نور الدين حسن', date: '2024-01-30', status: 'منجز', urgent: false },
  { id: 'TXN-2024-437', type: 'طلب وثيقة رسمية', requester: 'رنا خليل', date: '2024-01-29', status: 'مرفوض', urgent: false },
];

const alerts = [
  { type: 'delay', text: 'تأخير في معالجة 8 معاملات أكثر من 3 أيام', severity: 'high' },
  { type: 'congestion', text: 'ازدحام في دائرة الشؤون الإدارية (17 معاملة معلقة)', severity: 'medium' },
  { type: 'inactive', text: 'الموظف كريم منصور لم يُنجز أي معاملة منذ يومين', severity: 'medium' },
  { type: 'stuck', text: '3 معاملات متوقفة في مرحلة المراجعة القانونية', severity: 'high' },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  'بانتظار التوقيع': { bg: 'rgba(5,66,57,0.08)', color: '#002623' },
  'قيد التنفيذ': { bg: 'rgba(152,133,97,0.1)', color: '#988561' },
  'منجز': { bg: 'rgba(66,129,119,0.1)', color: '#054239' },
  'مرفوض': { bg: 'rgba(107,31,42,0.08)', color: '#6b1f2a' },
};

const severityConfig: Record<string, { border: string; iconColor: string; bg: string }> = {
  high: { border: '#6b1f2a', iconColor: '#6b1f2a', bg: 'rgba(107,31,42,0.05)' },
  medium: { border: '#988561', iconColor: '#988561', bg: 'rgba(152,133,97,0.05)' },
};

export function ManagerDashboard() {
  const [showReject, setShowReject] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSign = () => {
    setSuccessMessage('تم التوقيع على المعاملة بنجاح');
    setShowSuccess(true);
  };

  const handleTransferSuccess = () => {
    setShowTransfer(false);
    setSuccessMessage('تم تحويل المعاملة بنجاح');
    setShowSuccess(true);
  };

  const handleRejectSuccess = () => {
    setShowReject(false);
    setSuccessMessage('تم رفض المعاملة وإشعار مقدم الطلب');
    setShowSuccess(true);
  };

  return (
    <>
      <RejectModal isOpen={showReject} onClose={() => setShowReject(false)} onConfirm={handleRejectSuccess} />
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} onConfirm={handleTransferSuccess} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />

      <div className="p-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>
            لوحة رئيس الدائرة
          </h1>
          <p className="opacity-60 text-sm">الأحد، 31 يناير 2024 — نظرة شاملة على معاملات الدائرة</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg" style={{ backgroundColor: kpi.bg }}>
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <span className="text-4xl" style={{ color: 'var(--primary)' }}>{kpi.value}</span>
                </div>
                <p className="text-sm opacity-70 mb-1">{kpi.label}</p>
                <p
                  className="text-xs"
                  style={{
                    color: kpi.changeUp === true ? '#428177' : kpi.changeUp === false ? '#6b1f2a' : '#988561',
                  }}
                >
                  {kpi.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Analytics Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Trends */}
          <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h3 style={{ color: 'var(--primary)' }}>مؤشرات الأسبوع</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'المعاملات الواردة', value: '+18%', up: true, sub: 'مقارنة بالأسبوع الماضي' },
                { label: 'معدل الإنجاز', value: '+7%', up: true, sub: 'تحسن ملحوظ' },
                { label: 'المعاملات المرفوضة', value: '-3%', up: false, sub: 'انخفاض إيجابي' },
                { label: 'متوسط وقت الاستجابة', value: '+12%', up: false, sub: 'يحتاج مراجعة' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm">{item.label}</p>
                    <p className="text-xs opacity-50">{item.sub}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.up ? (
                      <TrendingUp className="w-4 h-4" style={{ color: '#428177' }} />
                    ) : (
                      <TrendingDown className="w-4 h-4" style={{ color: '#6b1f2a' }} />
                    )}
                    <span style={{ color: item.up ? '#428177' : '#6b1f2a' }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Insight */}
          <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Timer className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h3 style={{ color: 'var(--primary)' }}>تحليل وقت الإنجاز</h3>
            </div>

            <div className="text-center py-4 mb-4">
              <div className="text-5xl mb-1" style={{ color: 'var(--primary)' }}>2.4</div>
              <div className="text-sm opacity-60">يوم — متوسط إنجاز المعاملة</div>
              <div
                className="mt-2 inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(66,129,119,0.1)', color: '#428177' }}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                أفضل بـ 0.6 يوم عن الشهر الماضي
              </div>
            </div>

            <div className="space-y-3">
              {[
                { stage: 'استلام وتسجيل', time: '0.3 يوم', pct: 12 },
                { stage: 'مراجعة أولية', time: '0.7 يوم', pct: 29 },
                { stage: 'اعتماد رئيس الدائرة', time: '1.1 يوم', pct: 45 },
                { stage: 'إصدار القرار', time: '0.3 يوم', pct: 12 },
              ].map((s, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1 opacity-70">
                    <span>{s.stage}</span>
                    <span>{s.time}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${s.pct}%`, backgroundColor: 'var(--primary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottleneck Alert */}
          <div
            className="rounded-xl p-6 border shadow-sm"
            style={{ backgroundColor: 'rgba(107,31,42,0.04)', borderColor: 'rgba(107,31,42,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" style={{ color: '#6b1f2a' }} />
              <h3 style={{ color: '#6b1f2a' }}>تنبيه: عنق الزجاجة</h3>
            </div>
            <p className="text-xs opacity-60 mb-5">المراحل الأكثر تعطيلاً في النظام حالياً</p>

            <div className="space-y-3">
              {[
                { stage: 'مراجعة الشؤون القانونية', delay: '4.2 يوم', count: 8, severity: 'critical' },
                { stage: 'توقيع رئيس الدائرة', delay: '2.1 يوم', count: 12, severity: 'high' },
                { stage: 'المصادقة النهائية', delay: '1.8 يوم', count: 5, severity: 'medium' },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: 'white',
                    borderColor: b.severity === 'critical' ? 'rgba(107,31,42,0.3)' : 'var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{b.stage}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: b.severity === 'critical' ? 'rgba(107,31,42,0.1)' : 'rgba(152,133,97,0.1)',
                        color: b.severity === 'critical' ? '#6b1f2a' : '#988561',
                      }}
                    >
                      {b.count} معاملة
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-60">
                    <Clock className="w-3 h-3" />
                    متوسط تأخير: {b.delay}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-4 w-full py-2 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#6b1f2a', color: 'white' }}
            >
              عرض تقرير تفصيلي
            </button>
          </div>
        </div>

        {/* Latest Transactions + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Transactions Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 style={{ color: 'var(--primary)' }}>آخر المعاملات</h3>
              <button
                className="text-sm flex items-center gap-1 transition-all hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                عرض الكل
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--beige)' }}>
                    {['رقم المعاملة', 'النوع', 'مقدم الطلب', 'التاريخ', 'الحالة', 'إجراء'].map((col) => (
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
                  {transactions.map((tx, idx) => {
                    const sc = statusConfig[tx.status] || { bg: '#eee', color: '#333' };
                    return (
                      <tr
                        key={idx}
                        className="border-b transition-colors hover:bg-gray-50"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>
                              {tx.id}
                            </span>
                            {tx.urgent && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: 'rgba(107,31,42,0.1)', color: '#6b1f2a' }}
                              >
                                مستعجل
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm opacity-80">{tx.type}</td>
                        <td className="px-4 py-3 text-sm">{tx.requester}</td>
                        <td className="px-4 py-3 text-sm opacity-60">{tx.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: sc.bg, color: sc.color }}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                              style={{ backgroundColor: 'var(--beige)' }}
                              title="عرض"
                            >
                              <Eye className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                            </button>
                            {tx.status === 'بانتظار التوقيع' && (
                              <button
                                onClick={handleSign}
                                className="p-1.5 rounded-lg transition-all hover:shadow-sm"
                                style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}
                                title="توقيع"
                              >
                                <PenSquare className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4" style={{ color: 'var(--primary)' }}>إجراءات سريعة</h3>
              <div className="space-y-3">
                {[
                  { label: 'تحويل معاملة', icon: ArrowLeftRight, action: () => setShowTransfer(true), color: 'var(--primary)' },
                  { label: 'توقيع معاملة', icon: PenSquare, action: handleSign, color: '#428177' },
                  { label: 'تصعيد معاملة', icon: Send, action: () => {}, color: '#988561' },
                  { label: 'عرض سريع', icon: Eye, action: () => {}, color: 'var(--charcoal-medium)' },
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all hover:shadow-md"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: action.color }} />
                      </div>
                      <span className="text-sm">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Alerts Preview */}
            <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4" style={{ color: 'var(--umber-light)' }} />
                <h3 style={{ color: 'var(--primary)' }}>التنبيهات التشغيلية</h3>
              </div>
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert, idx) => {
                  const sc = severityConfig[alert.severity];
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border-r-2 text-sm"
                      style={{
                        backgroundColor: sc.bg,
                        borderRightColor: sc.border,
                        color: 'var(--charcoal-dark)',
                      }}
                    >
                      {alert.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
