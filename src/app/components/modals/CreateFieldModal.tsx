import { useState } from 'react';
import { Modal } from './Modal';
import { Database, CheckCircle, Plus, X, GripVertical } from 'lucide-react';

interface CreateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldTypes = [
  { value: 'text', label: 'نص' },
  { value: 'number', label: 'رقم' },
  { value: 'date', label: 'تاريخ' },
  { value: 'boolean', label: 'نعم/لا' },
  { value: 'list', label: 'قائمة' },
];

export function CreateFieldModal({ isOpen, onClose }: CreateFieldModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    required: false,
  });
  const [listOptions, setListOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الحقل مطلوب';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'كود الحقل مطلوب';
    }

    if (!formData.type) {
      newErrors.type = 'نوع الحقل مطلوب';
    }

    if (formData.type === 'list' && listOptions.length === 0) {
      newErrors.options = 'يجب إضافة خيار واحد على الأقل';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', code: '', type: '', required: false });
      setListOptions([]);
      setNewOption('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', type: '', required: false });
    setListOptions([]);
    setNewOption('');
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (!formData.code) {
      const suggestedCode = value
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
      setFormData(prev => ({ ...prev, name: value, code: suggestedCode }));
    }
  };

  const addOption = () => {
    if (newOption.trim() && !listOptions.includes(newOption.trim())) {
      setListOptions([...listOptions, newOption.trim()]);
      setNewOption('');
      setErrors({ ...errors, options: '' });
    }
  };

  const removeOption = (index: number) => {
    setListOptions(listOptions.filter((_, i) => i !== index));
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...listOptions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newOptions.length) {
      [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
      setListOptions(newOptions);
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء حقل جديد" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم إنشاء الحقل بنجاح</h3>
          <p className="opacity-70 text-center">يمكنك الآن استخدام هذا الحقل في النماذج والعمليات</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إنشاء حقل ديناميكي جديد" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              اسم الحقل <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="مثال: اسم الموظف"
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
              كود الحقل <span style={{ color: 'var(--destructive)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
              placeholder="employee_name"
              className={`w-full px-4 py-3 rounded-lg border outline-none font-mono ${errors.code ? 'border-2' : ''}`}
              style={{
                borderColor: errors.code ? 'var(--destructive)' : 'var(--border)',
                backgroundColor: 'white',
              }}
            />
            {errors.code && (
              <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.code}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">
            نوع الحقل <span style={{ color: 'var(--destructive)' }}>*</span>
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
            <option value="">اختر نوع الحقل...</option>
            {fieldTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.type}</p>
          )}
        </div>

        {formData.type === 'list' && (
          <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: 'var(--beige-light)', border: '2px dashed var(--primary)' }}>
            <h4 className="font-medium" style={{ color: 'var(--primary)' }}>إدارة خيارات القائمة</h4>

            <div className="flex gap-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                placeholder="أضف خيار جديد..."
                className="flex-1 px-4 py-3 rounded-lg border outline-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
              />
              <button
                type="button"
                onClick={addOption}
                className="px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {errors.options && (
              <p className="text-sm" style={{ color: 'var(--destructive)' }}>{errors.options}</p>
            )}

            {listOptions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm opacity-70">الخيارات ({listOptions.length}):</p>
                <div className="space-y-2">
                  {listOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}
                    >
                      <button
                        type="button"
                        className="cursor-move p-1"
                        title="سحب لإعادة الترتيب"
                      >
                        <GripVertical className="w-4 h-4 opacity-40" />
                      </button>
                      <span className="flex-1">{option}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveOption(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-opacity-50 disabled:opacity-30"
                          style={{ backgroundColor: 'var(--beige)' }}
                          title="تحريك للأعلى"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveOption(index, 'down')}
                          disabled={index === listOptions.length - 1}
                          className="p-1 rounded hover:bg-opacity-50 disabled:opacity-30"
                          style={{ backgroundColor: 'var(--beige)' }}
                          title="تحريك للأسفل"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-1 rounded hover:bg-opacity-50"
                          style={{ backgroundColor: '#FEE' }}
                          title="حذف"
                        >
                          <X className="w-4 h-4" style={{ color: 'var(--destructive)' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--beige-light)' }}>
            <span className="font-medium">حقل إلزامي</span>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">{formData.required ? 'نعم' : 'لا'}</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, required: !formData.required })}
                className={`relative w-14 h-7 rounded-full transition-all ${formData.required ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    formData.required ? 'left-1' : 'right-1'
                  }`}
                />
              </button>
            </div>
          </label>
        </div>

        {formData.type && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)' }}>
            <h4 className="font-medium mb-3" style={{ color: 'var(--primary)' }}>معاينة الحقل</h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
              <label className="block mb-2">{formData.name || 'اسم الحقل'} {formData.required && <span style={{ color: 'var(--destructive)' }}>*</span>}</label>
              {formData.type === 'text' && (
                <input type="text" placeholder="نص..." className="w-full px-4 py-2 rounded border" disabled />
              )}
              {formData.type === 'number' && (
                <input type="number" placeholder="0" className="w-full px-4 py-2 rounded border" disabled />
              )}
              {formData.type === 'date' && (
                <input type="date" className="w-full px-4 py-2 rounded border" disabled />
              )}
              {formData.type === 'boolean' && (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preview" disabled /> نعم
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preview" disabled /> لا
                  </label>
                </div>
              )}
              {formData.type === 'list' && (
                <select className="w-full px-4 py-2 rounded border" disabled>
                  <option>اختر...</option>
                  {listOptions.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            حفظ الحقل
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
