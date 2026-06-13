import { useState } from 'react';
import { Modal } from './Modal';
import { Folders, CheckCircle, Info } from 'lucide-react';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockOrganizations = [
  'مديرية التربية الرئيسية',
  'مديرية التربية - ريف دمشق',
  'مديرية التعليم المهني',
];

const mockParentDepartments = [
  'الإدارة العامة',
  'قسم الشؤون الإدارية',
  'الإدارة التعليمية',
  'قسم التخطيط والمتابعة',
];

export function CreateDepartmentModal({ isOpen, onClose }: CreateDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    parent: '',
    active: true,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم القسم مطلوب';
    }

    if (!formData.organization) {
      newErrors.organization = 'المؤسسة مطلوبة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', organization: '', parent: '', active: true });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', organization: '', parent: '', active: true });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء قسم جديد" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء القسم بنجاح</h3>
          <p className="opacity-70 text-center">سيتم تحديث الهيكل التنظيمي تلقائياً</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء قسم جديد" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7A8F4D15', borderRight: '4px solid var(--primary)' }}>
          <Info className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--primary)' }}>دعم الهيكل الهرمي</p>
            <p className="text-sm opacity-70">يمكن ربط هذا القسم بقسم آخر لإنشاء تسلسل هرمي</p>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            اسم القسم <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم القسم..."
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.name ? 'border-2' : ''}`}
            style={{
              borderColor: errors.name ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          />
          {errors.name && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            المؤسسة <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.organization ? 'border-2' : ''}`}
            style={{
              borderColor: errors.organization ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر المؤسسة...</option>
            {mockOrganizations.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
          {errors.organization && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.organization}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">القسم الأب (اختياري)</label>
          <select
            value={formData.parent}
            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">لا يوجد (قسم رئيسي)</option>
            {mockParentDepartments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {formData.parent && (
            <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--beige-light)' }}>
              <Folders className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="text-sm">
                سيتم إنشاء القسم تحت: <strong>{formData.parent}</strong>
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--beige-light)' }}>
            <span className="font-medium">حالة النشاط</span>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">{formData.active ? 'نشط' : 'غير نشط'}</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`relative w-14 h-7 rounded-full transition-all ${formData.active ? 'bg-[var(--success)]' : 'bg-gray-300'}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    formData.active ? 'left-1' : 'right-1'
                  }`}
                />
              </button>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حفظ القسم
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
