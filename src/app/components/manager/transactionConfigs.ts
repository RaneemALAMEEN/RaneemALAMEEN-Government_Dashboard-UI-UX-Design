export type FieldType = 'text' | 'textarea' | 'date' | 'dropdown' | 'radio' | 'checklist' | 'file' | 'multifile' | 'number';
export type StepType = 'form' | 'review' | 'pdf' | 'signature';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  cols?: 1 | 2;
}

export interface FormStep {
  id: string;
  title: string;
  subtitle: string;
  stepType: StepType;
  fields?: FormField[];
}

export interface TransactionConfig {
  typeId: string;
  name: string;
  category: string;
  categoryColor: string;
  steps: FormStep[];
}

// ─── Shared field libraries ───────────────────────────────────────────────────

const employeeFields: FormField[] = [
  { id: 'emp-name', label: 'اسم الموظف الكامل', type: 'text', required: true, placeholder: 'الاسم الرباعي', cols: 2 },
  { id: 'emp-id', label: 'رقم الموظف', type: 'text', required: true, placeholder: 'EMP-XXXX' },
  { id: 'emp-dept', label: 'الدائرة / الجهة', type: 'dropdown', required: true, options: ['الشؤون الإدارية', 'الموارد البشرية', 'الشؤون القانونية', 'التعليم الأساسي', 'التخطيط'] },
];

const docFields: FormField[] = [
  { id: 'doc-request', label: 'كتاب الطلب الرسمي', type: 'file', required: true, hint: 'PDF أو Word — بحد أقصى 5MB' },
  { id: 'doc-id', label: 'صورة الهوية الوظيفية', type: 'file', required: true, hint: 'صورة واضحة' },
  { id: 'doc-confirm', label: 'تأكيد المستندات', type: 'checklist', required: true, options: ['البيانات المدخلة صحيحة ودقيقة', 'المستندات واضحة ومقروءة', 'الطلب مقدم ضمن المدة القانونية'] },
];

const reviewStep: FormStep = {
  id: 'review',
  title: 'مراجعة البيانات',
  subtitle: 'تحقق من صحة جميع البيانات قبل المتابعة',
  stepType: 'review',
};

const pdfStep: FormStep = {
  id: 'pdf',
  title: 'توليد PDF',
  subtitle: 'إنشاء المستند الرسمي للمعاملة',
  stepType: 'pdf',
};

const signatureStep: FormStep = {
  id: 'signature',
  title: 'التوقيع الإلكتروني',
  subtitle: 'وقّع المعاملة إلكترونياً لإتمام الإرسال',
  stepType: 'signature',
};

// ─── Transaction Configurations ──────────────────────────────────────────────

export const transactionConfigs: Record<string, TransactionConfig> = {

  'external-transfer': {
    typeId: 'external-transfer',
    name: 'نقل خارجي للمدرس',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'البيانات الأساسية',
        subtitle: 'أدخل بيانات المدرس المراد نقله خارجياً',
        stepType: 'form',
        fields: [
          { id: 'teacher-name', label: 'اسم المدرس الكامل', type: 'text', required: true, placeholder: 'الاسم الرباعي', cols: 2 },
          { id: 'teacher-id', label: 'رقم الموظف', type: 'text', required: true, placeholder: 'EMP-XXXX' },
          { id: 'current-school', label: 'المدرسة الحالية', type: 'dropdown', required: true, options: ['مدرسة الرازي', 'مدرسة ابن سينا', 'مدرسة العروبة', 'ثانوية الفرات', 'ثانوية خالد بن الوليد'] },
          { id: 'subject', label: 'المادة التعليمية', type: 'dropdown', required: true, options: ['رياضيات', 'عربي', 'إنجليزي', 'فيزياء', 'كيمياء', 'تاريخ', 'جغرافيا', 'تربية إسلامية'] },
          { id: 'destination-school', label: 'المدرسة المنقول إليها', type: 'text', required: true, placeholder: 'اسم المدرسة المستقبِلة', cols: 2 },
          { id: 'transfer-reason', label: 'سبب النقل', type: 'radio', required: true, options: ['نقل بطلب شخصي', 'نقل لاحتياج وظيفي', 'نقل بقرار إداري', 'نقل بسبب ظروف صحية'] },
          { id: 'transfer-date', label: 'تاريخ النقل المطلوب', type: 'date', required: true },
          { id: 'notes', label: 'ملاحظات إضافية', type: 'textarea', placeholder: 'أي معلومات إضافية تدعم طلب النقل...', cols: 2 },
        ],
      },
      {
        id: 'documents',
        title: 'الوثائق المطلوبة',
        subtitle: 'ارفع المستندات اللازمة لإتمام طلب النقل',
        stepType: 'form',
        fields: [
          ...docFields,
          { id: 'doc-service', label: 'كشف الخدمة', type: 'file', required: true, hint: 'صادر حديثاً من الجهة المختصة' },
          { id: 'doc-agreement', label: 'موافقة المدرسة المستقبِلة', type: 'file', hint: 'إن وُجدت — اختياري' },
        ],
      },
      reviewStep,
      pdfStep,
      signatureStep,
    ],
  },

  'internal-transfer': {
    typeId: 'internal-transfer',
    name: 'نقل داخلي',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات الموظف',
        subtitle: 'أدخل بيانات الموظف المراد نقله داخلياً',
        stepType: 'form',
        fields: [
          ...employeeFields,
          { id: 'current-position', label: 'الموقع الحالي', type: 'text', required: true, placeholder: 'المدرسة أو الوحدة الحالية' },
          { id: 'new-position', label: 'الموقع الجديد', type: 'text', required: true, placeholder: 'المدرسة أو الوحدة المستهدفة' },
          { id: 'reason', label: 'سبب النقل الداخلي', type: 'radio', required: true, options: ['إعادة هيكلة', 'طلب شخصي', 'احتياج إداري', 'تطوير مهني'] },
          { id: 'effective-date', label: 'تاريخ السريان', type: 'date', required: true },
        ],
      },
      { id: 'docs', title: 'الوثائق المطلوبة', subtitle: 'ارفع المستندات الداعمة', stepType: 'form', fields: docFields },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'resignation': {
    typeId: 'resignation',
    name: 'استقالة موظف',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات الموظف',
        subtitle: 'أدخل بيانات الموظف المقدِّم للاستقالة',
        stepType: 'form',
        fields: [
          ...employeeFields,
          { id: 'position', label: 'المنصب الوظيفي', type: 'text', required: true, placeholder: 'اسم المنصب الحالي' },
          { id: 'resignation-date', label: 'تاريخ تقديم الاستقالة', type: 'date', required: true },
          { id: 'last-day', label: 'آخر يوم عمل', type: 'date', required: true },
          { id: 'reason', label: 'سبب الاستقالة', type: 'radio', required: true, options: ['ظروف صحية', 'ظروف عائلية', 'الالتحاق بعمل آخر', 'انتهاء العقد', 'سبب آخر'] },
          { id: 'reason-details', label: 'تفاصيل إضافية', type: 'textarea', placeholder: 'شرح مختصر للسبب...', cols: 2 },
        ],
      },
      { id: 'docs', title: 'الوثائق المطلوبة', subtitle: 'المستندات اللازمة للاستقالة', stepType: 'form', fields: [...docFields, { id: 'clearance', label: 'براءة الذمة المالية', type: 'file', hint: 'من قسم الحسابات' }] },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'unpaid-leave': {
    typeId: 'unpaid-leave',
    name: 'إجازة بلا أجر',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات الموظف',
        subtitle: 'أدخل بيانات طالب إجازة بلا أجر',
        stepType: 'form',
        fields: [
          ...employeeFields,
          { id: 'leave-start', label: 'تاريخ بداية الإجازة', type: 'date', required: true },
          { id: 'leave-end', label: 'تاريخ نهاية الإجازة', type: 'date', required: true },
          { id: 'reason', label: 'سبب الإجازة', type: 'radio', required: true, options: ['دراسة خارجية', 'مرافقة زوج/زوجة', 'ظروف صحية', 'ظروف عائلية', 'أسباب شخصية'] },
          { id: 'country', label: 'البلد (إن كان خارجياً)', type: 'text', placeholder: 'اسم البلد' },
          { id: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'أي تفاصيل إضافية...', cols: 2 },
        ],
      },
      { id: 'docs', title: 'الوثائق المطلوبة', subtitle: 'مستندات داعمة للطلب', stepType: 'form', fields: docFields },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'end-leave': {
    typeId: 'end-leave',
    name: 'إنهاء إجازة',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات الإنهاء',
        subtitle: 'أدخل بيانات الموظف ومعلومات إنهاء إجازته',
        stepType: 'form',
        fields: [
          ...employeeFields,
          { id: 'leave-type', label: 'نوع الإجازة المنتهية', type: 'dropdown', required: true, options: ['إجازة بلا أجر', 'إجازة مرضية', 'إجازة أمومة', 'إجازة دراسية'] },
          { id: 'original-end', label: 'تاريخ انتهاء الإجازة الأصلي', type: 'date', required: true },
          { id: 'return-date', label: 'تاريخ العودة الفعلي', type: 'date', required: true },
          { id: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'أي ملاحظات إضافية...', cols: 2 },
        ],
      },
      { id: 'docs', title: 'المستندات', subtitle: 'وثائق إنهاء الإجازة', stepType: 'form', fields: docFields },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'quota-modify': {
    typeId: 'quota-modify',
    name: 'تعديل نصاب',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات التعديل',
        subtitle: 'أدخل تفاصيل تعديل النصاب الدراسي',
        stepType: 'form',
        fields: [
          ...employeeFields,
          { id: 'school', label: 'المدرسة', type: 'text', required: true, placeholder: 'اسم المدرسة' },
          { id: 'subject', label: 'المادة', type: 'dropdown', required: true, options: ['رياضيات', 'عربي', 'إنجليزي', 'فيزياء', 'كيمياء', 'تاريخ', 'جغرافيا'] },
          { id: 'current-quota', label: 'النصاب الحالي (حصة/أسبوع)', type: 'number', required: true, placeholder: '18' },
          { id: 'new-quota', label: 'النصاب المقترح', type: 'number', required: true, placeholder: '24' },
          { id: 'reason', label: 'مبرر التعديل', type: 'textarea', required: true, placeholder: 'اشرح سبب طلب التعديل...', cols: 2 },
        ],
      },
      { id: 'docs', title: 'المستندات', subtitle: 'وثائق داعمة لطلب تعديل النصاب', stepType: 'form', fields: docFields },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'teacher-confirm': {
    typeId: 'teacher-confirm',
    name: 'تثبيت مدرس',
    category: 'الموارد البشرية',
    categoryColor: '#054239',
    steps: [
      {
        id: 'basic',
        title: 'بيانات المدرس',
        subtitle: 'أدخل بيانات المدرس المطلوب تثبيته',
        stepType: 'form',
        fields: [
          { id: 'teacher-name', label: 'اسم المدرس الكامل', type: 'text', required: true, placeholder: 'الاسم الرباعي', cols: 2 },
          { id: 'teacher-id', label: 'رقم الموظف', type: 'text', required: true },
          { id: 'school', label: 'المدرسة', type: 'dropdown', required: true, options: ['مدرسة الرازي', 'مدرسة ابن سينا', 'مدرسة العروبة', 'ثانوية الفرات'] },
          { id: 'subject', label: 'المادة', type: 'dropdown', required: true, options: ['رياضيات', 'عربي', 'إنجليزي', 'فيزياء', 'كيمياء', 'تاريخ', 'جغرافيا'] },
          { id: 'trial-start', label: 'تاريخ بداية فترة التجربة', type: 'date', required: true },
          { id: 'trial-end', label: 'تاريخ انتهاء فترة التجربة', type: 'date', required: true },
          { id: 'evaluation', label: 'تقييم الأداء', type: 'radio', required: true, options: ['ممتاز', 'جيد جداً', 'جيد', 'مقبول'] },
          { id: 'recommendation', label: 'توصية رئيس الدائرة', type: 'textarea', required: true, placeholder: 'توصية مفصلة حول التثبيت...', cols: 2 },
        ],
      },
      { id: 'docs', title: 'المستندات والمؤهلات', subtitle: 'ارفع المستندات والشهادات العلمية', stepType: 'form',
        fields: [
          { id: 'degree', label: 'الشهادة العلمية', type: 'file', required: true, hint: 'الشهادة الجامعية أو ما يعادلها' },
          ...docFields,
        ],
      },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'year-results': {
    typeId: 'year-results',
    name: 'إصدار نتائج نهاية العام',
    category: 'شؤون المدرسين',
    categoryColor: '#428177',
    steps: [
      {
        id: 'school-info',
        title: 'بيانات المدرسة',
        subtitle: 'أدخل بيانات المدرسة وفترة الامتحانات',
        stepType: 'form',
        fields: [
          { id: 'school-name', label: 'اسم المدرسة', type: 'dropdown', required: true, options: ['مدرسة الرازي الأساسية', 'مدرسة ابن سينا الثانوية', 'مدرسة العروبة الأساسية', 'ثانوية الفرات'] },
          { id: 'academic-year', label: 'العام الدراسي', type: 'dropdown', required: true, options: ['2023–2024', '2022–2023', '2021–2022'] },
          { id: 'grade', label: 'الصف الدراسي', type: 'dropdown', required: true, options: ['الصف التاسع', 'البكالوريا العلمي', 'البكالوريا الأدبي'] },
          { id: 'student-count', label: 'عدد الطلاب الكلي', type: 'number', required: true, placeholder: '120' },
          { id: 'exam-date', label: 'تاريخ الامتحان', type: 'date', required: true },
          { id: 'principal', label: 'مدير المدرسة', type: 'text', required: true, placeholder: 'الاسم الكامل' },
        ],
      },
      {
        id: 'results',
        title: 'إدخال النتائج',
        subtitle: 'أدخل إجمالي نتائج الطلاب',
        stepType: 'form',
        fields: [
          { id: 'passed', label: 'عدد الناجحين', type: 'number', required: true, placeholder: '98' },
          { id: 'failed', label: 'عدد الراسبين', type: 'number', required: true, placeholder: '22' },
          { id: 'absent', label: 'عدد الغائبين', type: 'number', required: true, placeholder: '3' },
          { id: 'top-score', label: 'أعلى علامة', type: 'number', required: true, placeholder: '596' },
          { id: 'avg-score', label: 'المعدل العام', type: 'number', required: true, placeholder: '472.5' },
          { id: 'results-file', label: 'ملف النتائج التفصيلية', type: 'file', required: true, hint: 'Excel أو CSV' },
          { id: 'notes', label: 'ملاحظات عامة', type: 'textarea', placeholder: 'أي ملاحظات على دورة الامتحانات...', cols: 2 },
        ],
      },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'ministry-letter': {
    typeId: 'ministry-letter',
    name: 'كتاب موجه إلى وزارة التربية',
    category: 'المراسلات الوزارية',
    categoryColor: '#988561',
    steps: [
      {
        id: 'sender-info',
        title: 'بيانات المُرسِل',
        subtitle: 'أدخل معلومات الجهة المرسِلة',
        stepType: 'form',
        fields: [
          { id: 'sender-name', label: 'اسم رئيس الدائرة', type: 'text', required: true, placeholder: 'الاسم الكامل', cols: 2 },
          { id: 'dept', label: 'الدائرة / الجهة', type: 'dropdown', required: true, options: ['مديرية تربية ريف دمشق', 'مديرية تربية دمشق', 'مديرية تربية حلب'] },
          { id: 'ref-number', label: 'رقم المرجع', type: 'text', placeholder: 'رقم القيد الداخلي' },
          { id: 'letter-date', label: 'تاريخ الكتاب', type: 'date', required: true },
        ],
      },
      {
        id: 'letter-content',
        title: 'موضوع الكتاب',
        subtitle: 'أدخل موضوع وتفاصيل الكتاب الرسمي',
        stepType: 'form',
        fields: [
          { id: 'subject', label: 'موضوع الكتاب', type: 'text', required: true, placeholder: 'عنوان واضح ومختصر', cols: 2 },
          { id: 'urgency', label: 'درجة الاستعجال', type: 'radio', required: true, options: ['عادي', 'مستعجل', 'عاجل جداً'] },
          { id: 'body', label: 'نص الكتاب', type: 'textarea', required: true, placeholder: 'بسم الله الرحمن الرحيم...\n\nإلى معالي وزير التربية...', cols: 2 },
          { id: 'attachments', label: 'المرفقات', type: 'multifile', hint: 'وثائق مرفقة بالكتاب — اختياري' },
        ],
      },
      reviewStep, pdfStep, signatureStep,
    ],
  },

  'annual-study': {
    typeId: 'annual-study',
    name: 'دراسة إحصائية سنوية',
    category: 'الإحصائيات والدراسات',
    categoryColor: '#b9a779',
    steps: [
      {
        id: 'period',
        title: 'اختيار الفترة',
        subtitle: 'حدد الفترة الزمنية للدراسة الإحصائية',
        stepType: 'form',
        fields: [
          { id: 'academic-year', label: 'العام الدراسي', type: 'dropdown', required: true, options: ['2023–2024', '2022–2023', '2021–2022', '2020–2021'] },
          { id: 'start-date', label: 'بداية الفترة', type: 'date', required: true },
          { id: 'end-date', label: 'نهاية الفترة', type: 'date', required: true },
          { id: 'scope', label: 'نطاق الدراسة', type: 'radio', required: true, options: ['جميع المدارس', 'الإعداديات والثانويات فقط', 'المدارس الأساسية فقط', 'نطاق جغرافي محدد'] },
          { id: 'study-type', label: 'نوع الدراسة', type: 'checklist', options: ['الكثافات الصفية', 'نسب النجاح والرسوب', 'الكوادر التدريسية', 'الأبنية المدرسية', 'التجهيزات والمعدات'] },
        ],
      },
      {
        id: 'indicators',
        title: 'إدخال المؤشرات',
        subtitle: 'أدخل البيانات الإحصائية الرئيسية',
        stepType: 'form',
        fields: [
          { id: 'schools-count', label: 'عدد المدارس الكلي', type: 'number', required: true, placeholder: '248' },
          { id: 'students-count', label: 'عدد الطلاب الكلي', type: 'number', required: true, placeholder: '52400' },
          { id: 'teachers-count', label: 'عدد المدرسين', type: 'number', required: true, placeholder: '3120' },
          { id: 'classes-count', label: 'عدد الشعب الدراسية', type: 'number', required: true, placeholder: '1840' },
          { id: 'pass-rate', label: 'نسبة النجاح الإجمالية (%)', type: 'number', required: true, placeholder: '78.5' },
          { id: 'dropout-rate', label: 'نسبة التسرب المدرسي (%)', type: 'number', required: true, placeholder: '4.2' },
          { id: 'data-file', label: 'ملف البيانات التفصيلية', type: 'file', required: true, hint: 'Excel أو CSV' },
          { id: 'notes', label: 'ملاحظات تحليلية', type: 'textarea', placeholder: 'تحليل مختصر للبيانات...', cols: 2 },
        ],
      },
      {
        id: 'review-data',
        title: 'مراجعة البيانات',
        subtitle: 'تحقق من دقة المؤشرات المدخلة',
        stepType: 'review',
      },
      {
        id: 'generate-report',
        title: 'إنشاء التقرير',
        subtitle: 'توليد التقرير الإحصائي الرسمي',
        stepType: 'pdf',
      },
      signatureStep,
    ],
  },

  'maintenance': {
    typeId: 'maintenance',
    name: 'طلب صيانة مدرسة',
    category: 'الأبنية والصيانة',
    categoryColor: '#6b1f2a',
    steps: [
      {
        id: 'school-info',
        title: 'معلومات المدرسة',
        subtitle: 'أدخل بيانات المدرسة المطلوب صيانتها',
        stepType: 'form',
        fields: [
          { id: 'school-name', label: 'اسم المدرسة', type: 'text', required: true, placeholder: 'الاسم الرسمي للمدرسة', cols: 2 },
          { id: 'area', label: 'المنطقة', type: 'dropdown', required: true, options: ['دمشق', 'ريف دمشق', 'يبرود', 'النبك', 'القلمون', 'الغوطة الشرقية'] },
          { id: 'principal-name', label: 'اسم مدير المدرسة', type: 'text', required: true, placeholder: 'الاسم الكامل' },
          { id: 'principal-phone', label: 'رقم هاتف المدير', type: 'text', required: true, placeholder: '09XXXXXXXX' },
          { id: 'school-type', label: 'نوع المدرسة', type: 'radio', required: true, options: ['أساسية', 'إعدادية', 'ثانوية', 'مهنية'] },
          { id: 'build-year', label: 'سنة بناء المدرسة', type: 'number', placeholder: '1985' },
        ],
      },
      {
        id: 'defects',
        title: 'وصف الأعطال',
        subtitle: 'حدد نوع الأعطال ووصفها بدقة',
        stepType: 'form',
        fields: [
          { id: 'defect-types', label: 'أنواع الأعطال', type: 'checklist', required: true, options: ['شبكة الكهرباء', 'شبكة المياه والصرف الصحي', 'الأسقف والجدران', 'النوافذ والأبواب', 'الأرضيات والسيراميك', 'دورات المياه', 'البنية التحتية الخارجية', 'تجهيزات المختبر'] },
          { id: 'description', label: 'وصف تفصيلي للأعطال', type: 'textarea', required: true, placeholder: 'اشرح حالة كل عطل بدقة، الموقع داخل المدرسة، ومدى خطورته...', cols: 2 },
          { id: 'urgency', label: 'مستوى الاستعجال', type: 'radio', required: true, options: ['طارئ — يؤثر على سلامة الطلاب', 'عاجل — يعيق العملية التعليمية', 'عادي — صيانة دورية'] },
        ],
      },
      {
        id: 'photos',
        title: 'رفع الصور',
        subtitle: 'ارفع صوراً توضيحية للأعطال',
        stepType: 'form',
        fields: [
          { id: 'defect-photos', label: 'صور الأعطال', type: 'multifile', required: true, hint: 'JPG أو PNG — بحد أقصى 10MB للصورة — يمكن رفع عدة صور', cols: 2 },
          { id: 'overview-photo', label: 'صورة عامة للمبنى', type: 'file', hint: 'صورة خارجية شاملة للمدرسة' },
        ],
      },
      {
        id: 'estimate',
        title: 'تقدير الاحتياج',
        subtitle: 'قدّر التكلفة والمواد المطلوبة',
        stepType: 'form',
        fields: [
          { id: 'cost-estimate', label: 'التكلفة التقديرية (ليرة سورية)', type: 'number', required: true, placeholder: '5000000' },
          { id: 'duration', label: 'مدة التنفيذ المتوقعة', type: 'dropdown', required: true, options: ['أسبوع واحد', 'أسبوعان', 'شهر', 'شهران', 'أكثر من شهرين'] },
          { id: 'contractor', label: 'اقتراح مقاول', type: 'text', placeholder: 'اسم المقاول المقترح (إن وُجد)' },
          { id: 'materials', label: 'المواد المطلوبة', type: 'textarea', placeholder: 'قائمة المواد والكميات...', cols: 2 },
          { id: 'estimate-doc', label: 'وثيقة تقدير رسمية', type: 'file', hint: 'ورقة تقدير موقعة من المدير' },
        ],
      },
      { ...signatureStep, title: 'اعتماد الطلب', subtitle: 'اعتمد طلب الصيانة بتوقيعك الإلكتروني' },
    ],
  },

  'tech-support': {
    typeId: 'tech-support',
    name: 'طلب دعم تقني',
    category: 'المعلوماتية والدعم التقني',
    categoryColor: '#428177',
    steps: [
      {
        id: 'requester-info',
        title: 'بيانات الجهة الطالبة',
        subtitle: 'أدخل معلومات الجهة التي تحتاج للدعم التقني',
        stepType: 'form',
        fields: [
          { id: 'school-name', label: 'اسم المدرسة / الجهة', type: 'text', required: true, placeholder: 'الاسم الرسمي', cols: 2 },
          { id: 'contact-name', label: 'اسم المسؤول', type: 'text', required: true, placeholder: 'الاسم الكامل' },
          { id: 'contact-phone', label: 'رقم الهاتف', type: 'text', required: true, placeholder: '09XXXXXXXX' },
          { id: 'device-count', label: 'عدد الأجهزة المتأثرة', type: 'number', placeholder: '5' },
          { id: 'support-type', label: 'نوع الدعم المطلوب', type: 'radio', required: true, options: ['إصلاح أعطال أجهزة', 'تنصيب برامج', 'إعداد شبكة', 'تدريب موظفين', 'أمن معلومات'] },
        ],
      },
      {
        id: 'problem-desc',
        title: 'وصف المشكلة',
        subtitle: 'اشرح المشكلة التقنية بالتفصيل',
        stepType: 'form',
        fields: [
          { id: 'problem', label: 'وصف المشكلة', type: 'textarea', required: true, placeholder: 'اشرح المشكلة بدقة، متى ظهرت، ما الأعراض، ما تأثيرها...', cols: 2 },
          { id: 'urgency', label: 'درجة الاستعجال', type: 'radio', required: true, options: ['طارئ — يؤثر على العمل الإداري الفوري', 'عاجل — يعيق الإنتاجية', 'عادي — يمكن الانتظار'] },
          { id: 'screenshots', label: 'صور / لقطات شاشة', type: 'multifile', hint: 'ارفع لقطات شاشة توضيحية' },
          { id: 'error-log', label: 'سجل الأخطاء', type: 'file', hint: 'Log file إن وُجد — اختياري' },
        ],
      },
      reviewStep, pdfStep, signatureStep,
    ],
  },
};

// ─── Transactions list (for the table in TransactionCenter) ──────────────────

export interface TransactionRow {
  id: string;
  typeId: string;
  name: string;
  category: string;
  categoryColor: string;
  date: string;
  status: 'قيد الانتظار' | 'قيد المعالجة' | 'منجزة' | 'مسودة' | 'مرفوضة';
}

export const transactionRows: TransactionRow[] = [
  { id: 'TXN-2024-101', typeId: 'external-transfer', name: 'نقل خارجي للمدرس', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-25', status: 'قيد الانتظار' },
  { id: 'TXN-2024-102', typeId: 'internal-transfer', name: 'نقل داخلي', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-26', status: 'قيد المعالجة' },
  { id: 'TXN-2024-103', typeId: 'resignation', name: 'استقالة موظف', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-27', status: 'قيد الانتظار' },
  { id: 'TXN-2024-104', typeId: 'unpaid-leave', name: 'إجازة بلا أجر', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-28', status: 'منجزة' },
  { id: 'TXN-2024-105', typeId: 'end-leave', name: 'إنهاء إجازة', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-29', status: 'قيد الانتظار' },
  { id: 'TXN-2024-106', typeId: 'quota-modify', name: 'تعديل نصاب', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-30', status: 'قيد المعالجة' },
  { id: 'TXN-2024-107', typeId: 'teacher-confirm', name: 'تثبيت مدرس', category: 'الموارد البشرية', categoryColor: '#054239', date: '2024-01-31', status: 'قيد الانتظار' },
  { id: 'TXN-2024-108', typeId: 'year-results', name: 'إصدار نتائج نهاية العام', category: 'شؤون المدرسين', categoryColor: '#428177', date: '2024-01-20', status: 'منجزة' },
  { id: 'TXN-2024-109', typeId: 'ministry-letter', name: 'كتاب موجه إلى وزارة التربية', category: 'المراسلات الوزارية', categoryColor: '#988561', date: '2024-01-22', status: 'قيد المعالجة' },
  { id: 'TXN-2024-110', typeId: 'annual-study', name: 'دراسة إحصائية سنوية', category: 'الإحصائيات والدراسات', categoryColor: '#b9a779', date: '2024-01-15', status: 'قيد الانتظار' },
  { id: 'TXN-2024-111', typeId: 'maintenance', name: 'طلب صيانة مدرسة', category: 'الأبنية والصيانة', categoryColor: '#6b1f2a', date: '2024-01-18', status: 'قيد المعالجة' },
  { id: 'TXN-2024-112', typeId: 'tech-support', name: 'طلب دعم تقني', category: 'المعلوماتية والدعم التقني', categoryColor: '#428177', date: '2024-01-24', status: 'منجزة' },
];

export const categories = [
  'الكل',
  'الموارد البشرية',
  'شؤون المدرسين',
  'المراسلات الوزارية',
  'الإحصائيات والدراسات',
  'الأبنية والصيانة',
  'المعلوماتية والدعم التقني',
];
