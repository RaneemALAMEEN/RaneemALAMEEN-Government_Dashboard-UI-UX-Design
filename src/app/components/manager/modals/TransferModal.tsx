import { useState } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const departments = [
  'الشؤون الإدارية',
  'الموارد البشرية',
  'الشؤون القانونية',
  'التعليم الأساسي',
  'التخطيط والمتابعة',
  'الإدارة العامة',
];

const employees = [
  { name: 'حسن كامل', dept: 'الشؤون الإدارية', load: 85 },
  { name: 'سارة يوسف', dept: 'الإدارة العامة', load: 60 },
  { name: 'كريم منصور', dept: 'الشؤون القانونية', load: 15 },
  { name: 'ريم درويش', dept: 'التعليم الأساسي', load: 70 },
  { name: 'تامر فواز', dept: 'الشؤون الإدارية', load: 35 },
];

export function TransferModal({ isOpen, onClose, onConfirm }: TransferModalProps) {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const filteredEmps = selectedDept
    ? employees.filter((e) => e.dept === selectedDept)
    : employees;

  const handleConfirm = () => {
    setSelectedDept('');
    setSelectedEmp('');
    setNote('');
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ direction: 'rtl' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}>
              <ArrowLeftRight className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)' }}>تحويل المعاملة</h3>
              <p className="text-xs opacity-60">حدد الجهة المستلمة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:bg-gray-100">
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm mb-2 block opacity-70">الدائرة المستلمة</label>
            <select
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setSelectedEmp(''); }}
              className="w-full p-3 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
            >
              <option value="">اختر الدائرة...</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm mb-2 block opacity-70">الموظف المسؤول (اختياري)</label>
            <div className="space-y-2">
              {filteredEmps.map((emp) => (
                <label
                  key={emp.name}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all"
                  style={{
                    borderColor: selectedEmp === emp.name ? 'rgba(5,66,57,0.4)' : 'var(--border)',
                    backgroundColor: selectedEmp === emp.name ? 'rgba(5,66,57,0.04)' : 'var(--beige)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 shrink-0"
                      style={{
                        borderColor: selectedEmp === emp.name ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: selectedEmp === emp.name ? 'var(--primary)' : 'transparent',
                      }}
                    />
                    <input
                      type="radio"
                      name="employee"
                      value={emp.name}
                      className="hidden"
                      onChange={() => setSelectedEmp(emp.name)}
                    />
                    <div>
                      <p className="text-sm">{emp.name}</p>
                      <p className="text-xs opacity-50">{emp.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${emp.load}%`,
                          backgroundColor: emp.load >= 85 ? '#6b1f2a' : emp.load >= 60 ? '#988561' : '#428177',
                        }}
                      />
                    </div>
                    <span className="text-xs opacity-50">{emp.load}%</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block opacity-70">سبب التحويل</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="اذكر سبب التحويل..."
              className="w-full p-3 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleConfirm}
            disabled={!selectedDept}
            className="flex-1 py-2.5 rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            تأكيد التحويل
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm border transition-all hover:bg-gray-50"
            style={{ borderColor: 'var(--border)' }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
