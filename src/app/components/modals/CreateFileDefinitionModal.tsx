import { useState } from 'react';
import { Modal } from './Modal';
import { FileText, CheckCircle } from 'lucide-react';

interface CreateFileDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fileTypes = [
  { value: 'PDF', label: 'PDF' },
  { value: 'DOCX', label: 'DOCX' },
  { value: 'JPG', label: 'JPG' },
  { value: 'PNG', label: 'PNG' },
];

const fileCategories = [
  { value: 'citizen-documents', label: 'وثائق للمواطن' },
  { value: 'administrative-documents', label: 'وثائق إدارية' },
  { value: 'identity-documents', label: 'وثائق الهوية' },
  { value: 'certificates', label: 'شهادات وإفادات' },
  { value: 'school-files', label: 'ملفات مدرسية' },
  { value: 'legal-documents', label: 'مستندات قانونية' },
  { value: 'financial-documents', label: 'وثائق مالية' },
  { value: 'technical-documents', label: 'مستندات تقنية' },
  { value: 'other', label: 'أخرى' },
];

export function CreateFileDefinitionModal({ isOpen, onClose }: CreateFileDefinitionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الملف مطلوب';
    }

    if (!formData.type) {
      newErrors.type = 'نوع الملف مطلوب';
    }

    if (!formData.category) {
      newErrors.category = 'التصنيف مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', type: '', category: '' });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', type: '', category: '' });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء ملف جديد" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء الملف بنجاح</h3>
          <p className="opacity-70 text-center">يمكنك الآن استخدام هذا الملف في المعاملات</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء تعريف ملف جديد" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'var(--beige-light)' }}>
          <FileText className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--primary)' }}>تعريف ملف قابل لإعادة الاستخدام</p>
            <p className="text-sm opacity-70">هذا ليس رفع ملف فعلي، بل تعريف لنوع ملف يمكن طلبه في المعاملات</p>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            اسم الملف <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: نموذج طلب وثيقة رسمية"
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
            نوع الملف <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.type ? 'border-2' : ''}`}
            style={{
              borderColor: errors.type ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر نوع الملف...</option>
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.type}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            التصنيف <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.category ? 'border-2' : ''}`}
            style={{
              borderColor: errors.category ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر التصنيف...</option>
            {fileCategories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.category}</p>
          )}
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
          <h4 className="font-medium mb-3" style={{ color: 'var(--primary)' }}>معاينة التعريف</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'white' }}>
              <span className="opacity-70">اسم الملف</span>
              <span className="font-medium">{formData.name || '-'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'white' }}>
              <span className="opacity-70">نوع الملف</span>
              <span className="font-medium">{formData.type || '-'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'white' }}>
              <span className="opacity-70">التصنيف</span>
              <span className="font-medium">
                {formData.category ? fileCategories.find(c => c.value === formData.category)?.label : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حفظ التعريف
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
