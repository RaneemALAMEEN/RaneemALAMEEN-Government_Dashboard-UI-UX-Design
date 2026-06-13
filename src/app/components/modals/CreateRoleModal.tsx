import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Shield, CheckCircle, Code } from 'lucide-react';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockOrganizations = [
  { id: 1, name: 'مديرية التربية الرئيسية' },
  { id: 2, name: 'مديرية التربية - ريف دمشق' },
  { id: 3, name: 'مديرية التعليم المهني' },
];

const mockDepartments = [
  { id: 1, name: 'الإدارة العامة', orgId: 1 },
  { id: 2, name: 'قسم الشؤون الإدارية', orgId: 1 },
  { id: 5, name: 'قسم التخطيط والمتابعة', orgId: 1 },
  { id: 7, name: 'قسم المناهج', orgId: 2 },
];

export function CreateRoleModal({ isOpen, onClose }: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    organization: '',
    organizationId: '',
    department: '',
    departmentId: '',
  });
  const [camundaKey, setCamundaKey] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredDepartments = formData.organizationId
    ? mockDepartments.filter(d => d.orgId === parseInt(formData.organizationId))
    : [];

  useEffect(() => {
    if (formData.code && formData.organizationId && formData.departmentId) {
      const key = `${formData.code}__ORG${formData.organizationId}__DEPT${formData.departmentId}`;
      setCamundaKey(key);
    } else {
      setCamundaKey('');
    }
  }, [formData.code, formData.organizationId, formData.departmentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الدور مطلوب';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'كود الدور مطلوب';
    }

    if (!formData.organization) {
      newErrors.organization = 'المؤسسة مطلوبة';
    }

    if (!formData.department) {
      newErrors.department = 'القسم مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', code: '', organization: '', organizationId: '', department: '', departmentId: '' });
      setCamundaKey('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', organization: '', organizationId: '', department: '', departmentId: '' });
    setErrors({});
    setIsSuccess(false);
    setCamundaKey('');
    onClose();
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (!formData.code) {
      const suggestedCode = value
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('') + '_ROLE';
      setFormData(prev => ({ ...prev, name: value, code: suggestedCode }));
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء دور جديد" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء الدور بنجاح</h3>
          <p className="opacity-70 text-center mb-4">سيتم تحديث قائمة الأدوار تلقائياً</p>
          {camundaKey && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
              <p className="text-sm opacity-70 mb-2">مفتاح Camunda المولد:</p>
              <p className="font-mono text-sm" style={{ color: 'var(--primary)' }}>{camundaKey}</p>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء دور جديد" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              اسم الدور <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="مثال: مدير الدائرة"
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
              كود الدور <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="MANAGER"
              className={`w-full px-4 py-3 rounded-lg border outline-none font-mono ${errors.code ? 'border-2' : ''}`}
              style={{
                borderColor: errors.code ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.code && (
              <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.code}</p>
            )}
            <p className="mt-2 text-xs opacity-60">سيتم استخدامه في توليد مفتاح Camunda</p>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            المؤسسة <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.organization}
            onChange={(e) => {
              const selectedOrg = mockOrganizations.find(o => o.name === e.target.value);
              setFormData({
                ...formData,
                organization: e.target.value,
                organizationId: selectedOrg?.id.toString() || '',
                department: '',
                departmentId: '',
              });
            }}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.organization ? 'border-2' : ''}`}
            style={{
              borderColor: errors.organization ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر المؤسسة...</option>
            {mockOrganizations.map((org) => (
              <option key={org.id} value={org.name}>{org.name}</option>
            ))}
          </select>
          {errors.organization && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.organization}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            القسم <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => {
              const selectedDept = filteredDepartments.find(d => d.name === e.target.value);
              setFormData({
                ...formData,
                department: e.target.value,
                departmentId: selectedDept?.id.toString() || '',
              });
            }}
            disabled={!formData.organization}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.department ? 'border-2' : ''}`}
            style={{
              borderColor: errors.department ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
              opacity: !formData.organization ? 0.5 : 1,
            }}
          >
            <option value="">اختر القسم...</option>
            {filteredDepartments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.department}</p>
          )}
        </div>

        {camundaKey && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)', border: '2px solid var(--primary)' }}>
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h4 className="font-medium" style={{ color: 'var(--primary)' }}>معاينة مفتاح Camunda</h4>
            </div>
            <div className="p-4 rounded-lg font-mono text-sm break-all" style={{ backgroundColor: 'white' }}>
              {camundaKey}
            </div>
            <p className="text-xs opacity-70 mt-3">سيتم حفظ هذا المفتاح تلقائياً مع الدور</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حفظ الدور
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
