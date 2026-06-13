import { useState } from 'react';
import {
  ArrowRight, Search,
  Users, BookOpen, Send, BarChart2, Building2, Monitor, FileText,
  ChevronLeft,
} from 'lucide-react';
import { transactionConfigs, categories } from './transactionConfigs';

const categoryIcons: Record<string, typeof FileText> = {
  'الموارد البشرية': Users,
  'شؤون المدرسين': BookOpen,
  'المراسلات الوزارية': Send,
  'الإحصائيات والدراسات': BarChart2,
  'الأبنية والصيانة': Building2,
  'المعلوماتية والدعم التقني': Monitor,
};

const typeDescriptions: Record<string, string> = {
  'external-transfer': 'طلب نقل مدرس من مدرسة إلى أخرى خارج نطاق المديرية مع إرفاق الوثائق اللازمة',
  'internal-transfer': 'طلب نقل موظف أو مدرس بين الوحدات الإدارية داخل المديرية',
  'resignation': 'تقديم طلب الاستقالة الرسمي مع المستندات الداعمة واستيفاء متطلبات براءة الذمة',
  'unpaid-leave': 'طلب إجازة مطولة بدون راتب لأسباب دراسية أو شخصية أو عائلية',
  'end-leave': 'إشعار رسمي بالعودة إلى العمل من الإجازة قبل موعدها أو في نهايتها',
  'quota-modify': 'طلب تغيير عدد الحصص الدراسية الأسبوعية للمدرس مع المبررات',
  'teacher-confirm': 'طلب تحويل مدرس متعاقد إلى ملاك رسمي بعد انتهاء فترة التجربة',
  'year-results': 'رفع وتسجيل نتائج الامتحانات النهائية ومؤشرات نجاح الطلاب رسمياً',
  'ministry-letter': 'إعداد مراسلة رسمية موجهة إلى وزارة التربية مع إمكانية إرفاق مستندات',
  'annual-study': 'إعداد وتقديم التقرير الإحصائي السنوي الشامل للمؤسسة التربوية',
  'maintenance': 'تقديم طلب صيانة مع وصف تفصيلي للأعطال وصور توضيحية وتقدير التكلفة',
  'tech-support': 'طلب دعم تقني للأجهزة أو البرامج أو الشبكات أو تدريب الموظفين',
};

interface TransactionTypeSelectorProps {
  onSelectType: (typeId: string) => void;
  onBack: () => void;
}

export function TransactionTypeSelector({ onSelectType, onBack }: TransactionTypeSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  const allTypes = Object.values(transactionConfigs);

  const filtered = allTypes.filter((t) => {
    const matchCat = activeCategory === 'الكل' || t.category === activeCategory;
    const matchSearch = t.name.includes(search) || t.category.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
        style={{ color: 'var(--primary)' }}
      >
        <ArrowRight className="w-4 h-4" />
        العودة لمركز المعاملات
      </button>

      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>اختر نوع المعاملة</h1>
        <p className="text-sm opacity-60">اختر التصنيف ثم نوع المعاملة التي تريد إنشاءها</p>
      </div>

      {/* Search + Category filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في أنواع المعاملات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] ?? FileText;
            const isActive = activeCategory === cat;
            const catColor = allTypes.find((t) => t.category === cat)?.categoryColor ?? 'var(--primary)';
            const count = cat === 'الكل' ? allTypes.length : allTypes.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  backgroundColor: isActive
                    ? (cat === 'الكل' ? 'var(--primary)' : `${catColor}15`)
                    : 'white',
                  color: isActive
                    ? (cat === 'الكل' ? 'white' : catColor)
                    : 'var(--charcoal-medium)',
                  border: `1px solid ${isActive && cat !== 'الكل' ? `${catColor}30` : 'var(--border)'}`,
                }}
              >
                {cat !== 'الكل' && <Icon className="w-3.5 h-3.5" />}
                {cat}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center opacity-40">
          <FileText className="w-10 h-10 mx-auto mb-3" />
          <p>لا توجد أنواع معاملات تطابق البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((type) => {
            const Icon = categoryIcons[type.category] ?? FileText;
            return (
              <button
                key={type.typeId}
                onClick={() => onSelectType(type.typeId)}
                className="group relative bg-white rounded-2xl p-5 border text-right transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Top */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                    style={{ backgroundColor: `${type.categoryColor}12` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: type.categoryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="leading-snug" style={{ color: 'var(--charcoal-dark)' }}>
                      {type.name}
                    </h4>
                  </div>
                </div>

                {/* Steps Count */}
                <div className="flex items-center gap-2 mb-4">
                  {type.steps.map((_, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-1 rounded-full"
                      style={{ backgroundColor: `${type.categoryColor}20` }}
                    />
                  ))}
                  <span className="text-xs opacity-40 shrink-0">{type.steps.length} خطوات</span>
                </div>

                {/* Action */}
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="text-sm" style={{ color: type.categoryColor }}>
                    إنشاء هذه المعاملة
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:translate-x-[-4px]"
                    style={{ backgroundColor: `${type.categoryColor}10` }}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: type.categoryColor }} />
                  </div>
                </div>

                {/* Hover border accent */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ border: `2px solid ${type.categoryColor}25` }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
