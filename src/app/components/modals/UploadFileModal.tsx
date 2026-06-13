import { useState } from 'react';
import { Modal } from './Modal';
import { FileText, CheckCircle, Upload, FileImage, File as FileIcon } from 'lucide-react';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadFileModal({ isOpen, onClose }: UploadFileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    fileType: '',
    file: null as File | null,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الملف مطلوب';
    }

    if (!formData.fileType) {
      newErrors.fileType = 'نوع الملف مطلوب';
    }

    if (!formData.file) {
      newErrors.file = 'يجب اختيار ملف للرفع';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', fileType: '', file: null });
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({ name: '', fileType: '', file: null });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file, name: formData.name || file.name });
      setErrors({ ...errors, file: '' });
    }
  };

  const getFileIcon = () => {
    if (!formData.file) return FileIcon;

    const fileType = formData.file.type;
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType === 'application/pdf') return FileText;
    return FileIcon;
  };

  const Icon = getFileIcon();

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="رفع ملف جديد" size="md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#42817715' }}>
            <CheckCircle className="w-16 h-16" style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-2xl mb-2" style={{ color: 'var(--success)' }}>تم رفع الملف بنجاح</h3>
          <p className="opacity-70 text-center">سيظهر الملف في قائمة الملفات</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="رفع ملف جديد" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'var(--beige-light)' }}>
          <FileText className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--primary)' }}>إدارة الملفات</p>
            <p className="text-sm opacity-70">الملفات المرفوعة ستكون متاحة للاستخدام في العمليات والمعاملات</p>
          </div>
        </div>

        <div>
          <label className="block mb-2">
            رفع الملف <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all hover:border-solid ${
              errors.file ? 'border-2' : ''
            }`}
            style={{ borderColor: errors.file ? 'var(--destructive)' : 'var(--border)' }}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--beige)' }}>
                <Upload className="w-8 h-8" style={{ color: 'var(--primary)' }} />
              </div>
              <h4 className="mb-2" style={{ color: 'var(--primary)' }}>اسحب وأفلت الملف هنا</h4>
              <p className="text-sm opacity-70 mb-2">أو انقر للاختيار من جهازك</p>
              <p className="text-xs opacity-60">الصيغ المدعومة: PDF, صور, مستندات</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {errors.file && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.file}</p>
          )}
        </div>

        {formData.file && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--beige-light)', border: '2px solid var(--success)' }}>
            <p className="text-sm opacity-70 mb-3">معاينة الملف</p>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                <Icon className="w-8 h-8" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">{formData.file.name}</p>
                <div className="flex items-center gap-3 text-sm opacity-70">
                  <span>الحجم: {(formData.file.size / 1024).toFixed(2)} KB</span>
                  <span>•</span>
                  <span>النوع: {formData.file.type || 'غير محدد'}</span>
                </div>
              </div>
              <CheckCircle className="w-6 h-6" style={{ color: 'var(--success)' }} />
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2">
            اسم الملف <span style={{ color: 'var(--destructive)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم الملف..."
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
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${errors.fileType ? 'border-2' : ''}`}
            style={{
              borderColor: errors.fileType ? 'var(--destructive)' : 'var(--border)',
              backgroundColor: 'white',
            }}
          >
            <option value="">اختر نوع الملف...</option>
            <option value="citizen-documents">وثائق للمواطن</option>
            <option value="administrative-documents">وثائق إدارية</option>
            <option value="identity-documents">وثائق الهوية</option>
            <option value="certificates">شهادات</option>
            <option value="other">أخرى</option>
          </select>
          {errors.fileType && (
            <p className="mt-2 text-sm" style={{ color: 'var(--destructive)' }}>{errors.fileType}</p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            رفع الملف
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
