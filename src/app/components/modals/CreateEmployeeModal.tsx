import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, CheckCircle, Copy, Printer } from 'lucide-react';

interface CreateEmployeeModalProps {
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
  { id: 8, name: 'قسم الامتحانات', orgId: 2 },
];

const mockRoles = [
  { id: 1, name: 'مدير الدائرة', deptId: 1 },
  { id: 2, name: 'موظف استقبال', deptId: 2 },
  { id: 3, name: 'مدقق بيانات', deptId: 5 },
  { id: 4, name: 'مدرس', deptId: 7 },
  { id: 5, name: 'مراقب امتحانات', deptId: 8 },
];

export function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    organizationId: '',
    departmentId: '',
    roleId: '',
  });

  const [filteredDepartments, setFilteredDepartments] = useState(mockDepartments);
  const [filteredRoles, setFilteredRoles] = useState(mockRoles);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.organizationId) {
      const filtered = mockDepartments.filter(d => d.orgId === parseInt(formData.organizationId));
      setFilteredDepartments(filtered);
      setFormData(prev => ({ ...prev, departmentId: '', roleId: '' }));
    } else {
      setFilteredDepartments([]);
    }
  }, [formData.organizationId]);

  useEffect(() => {
    if (formData.departmentId) {
      const filtered = mockRoles.filter(r => r.deptId === parseInt(formData.departmentId));
      setFilteredRoles(filtered);
      setFormData(prev => ({ ...prev, roleId: '' }));
    } else {
      setFilteredRoles([]);
    }
  }, [formData.departmentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'اسم المستخدم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    if (!formData.organizationId) newErrors.organizationId = 'المؤسسة مطلوبة';
    if (!formData.departmentId) newErrors.departmentId = 'القسم مطلوب';
    if (!formData.roleId) newErrors.roleId = 'الدور مطلوب';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setGeneratedCredentials({
      username: formData.username,
      password: formData.password,
    });
    setIsSuccess(true);
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      organizationId: '',
      departmentId: '',
      roleId: '',
    });
    setErrors({});
    setIsSuccess(false);
    setGeneratedCredentials({ username: '', password: '' });
    onClose();
  };

  const copyCredentials = () => {
    const text = `اسم المستخدم: ${generatedCredentials.username}\nكلمة المرور: ${generatedCredentials.password}`;
    navigator.clipboard.writeText(text);
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="تم إنشاء حساب الموظف" size="md">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
              <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
            </div>
            <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء حساب الموظف بنجاح</h3>
            <p className="opacity-70 text-center mb-6">يرجى تسليم بيانات الدخول التالية للموظف</p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)', border: '2px solid var(--primary)' }}>
            <h4 className="font-medium mb-4" style={{ color: 'var(--primary)' }}>بيانات الدخول</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'white' }}>
                <span className="opacity-70">اسم المستخدم:</span>
                <span className="font-mono font-medium">{generatedCredentials.username}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'white' }}>
                <span className="opacity-70">كلمة المرور:</span>
                <span className="font-mono font-medium">{generatedCredentials.password}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyCredentials}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <Copy className="w-5 h-5" />
              نسخ البيانات
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              <Printer className="w-5 h-5" />
              طباعة البيانات
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full px-6 py-3 rounded-lg transition-all"
            style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}
          >
            إغلاق
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء موظف جديد" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'var(--beige-light)' }}>
          <User className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--primary)' }}>إنشاء حساب موظف جديد</p>
            <p className="text-sm opacity-70">قم بإدخال بيانات الموظف وتعيينه للمؤسسة والقسم والدور المناسب</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              اسم المستخدم <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="مثال: ahmad.mahmoud"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.username ? 'border-2' : ''}`}
              style={{
                borderColor: errors.username ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.username && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.username}</p>}
          </div>

          <div>
            <label className="block mb-2">
              البريد الإلكتروني <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@edu.sy"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.email ? 'border-2' : ''}`}
              style={{
                borderColor: errors.email ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.email && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-2">
              رقم الهاتف <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09xxxxxxxx"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.phone ? 'border-2' : ''}`}
              style={{
                borderColor: errors.phone ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.phone && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.phone}</p>}
          </div>

          <div>
            <label className="block mb-2">
              كلمة المرور <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.password ? 'border-2' : ''}`}
              style={{
                borderColor: errors.password ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.password && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.password}</p>}
          </div>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <h4 className="font-medium mb-4" style={{ color: 'var(--primary)' }}>التعيين الإداري</h4>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">
                المؤسسة <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <select
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.organizationId ? 'border-2' : ''}`}
                style={{
                  borderColor: errors.organizationId ? 'var(--destructive)' : 'var(--border)',
                  backgroundColor: 'white',
                }}
              >
                <option value="">اختر المؤسسة...</option>
                {mockOrganizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              {errors.organizationId && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.organizationId}</p>}
            </div>

            <div>
              <label className="block mb-2">
                القسم / الدائرة <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                disabled={!formData.organizationId}
                className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.departmentId ? 'border-2' : ''}`}
                style={{
                  borderColor: errors.departmentId ? 'var(--destructive)' : 'var(--border)',
                  backgroundColor: 'white',
                  opacity: !formData.organizationId ? 0.5 : 1,
                }}
              >
                <option value="">اختر القسم...</option>
                {filteredDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.departmentId}</p>}
              {!formData.organizationId && (
                <p className="mt-2 text-sm opacity-60">اختر المؤسسة أولاً لعرض الأقسام</p>
              )}
            </div>

            <div>
              <label className="block mb-2">
                الدور <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                disabled={!formData.departmentId}
                className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.roleId ? 'border-2' : ''}`}
                style={{
                  borderColor: errors.roleId ? 'var(--destructive)' : 'var(--border)',
                  backgroundColor: 'white',
                  opacity: !formData.departmentId ? 0.5 : 1,
                }}
              >
                <option value="">اختر الدور...</option>
                {filteredRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.roleId && <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.roleId}</p>}
              {!formData.departmentId && (
                <p className="mt-2 text-sm opacity-60">اختر القسم أولاً لعرض الأدوار المتاحة</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            إنشاء حساب الموظف
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
