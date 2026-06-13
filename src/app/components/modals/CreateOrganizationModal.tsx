import { useState } from 'react';
import { Modal } from './Modal';
import { Building2, CheckCircle } from 'lucide-react';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockParentOrganizations = [
  'مديرية التربية الرئيسية',
  'مديرية التربية - ريف دمشق',
  'مديرية التعليم المهني',
];

const mockLocations = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'اللاذقية',
];

export function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    parent: '',
    location: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المؤسسة مطلوب';
    }

    if (!formData.location) {
      newErrors.location = 'الموقع مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', parent: '', location: '' });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', parent: '', location: '' });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء مؤسسة جديدة" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء المؤسسة بنجاح</h3>
          <p className="opacity-70 text-center">سيتم تحديث قائمة المؤسسات تلقائياً</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء مؤسسة جديدة" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            <p className="opacity-70">قم بإدخال بيانات المؤسسة الجديدة</p>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            اسم المؤسسة <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم المؤسسة..."
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.name ? 'border-2' : ''}`}
            style={{
              borderColor: errors.name ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
              '--tw-ring-color': 'var(--primary)',
            } as any}
          />
          {errors.name && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">المؤسسة الأم (اختياري)</label>
          <select
            value={formData.parent}
            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">لا يوجد (مؤسسة رئيسية)</option>
            {mockParentOrganizations.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            الموقع <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.location ? 'border-2' : ''}`}
            style={{
              borderColor: errors.location ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر الموقع...</option>
            {mockLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.location}</p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حفظ المؤسسة
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 rounded-lg transition-all"
            style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
}
