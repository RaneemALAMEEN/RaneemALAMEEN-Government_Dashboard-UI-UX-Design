import { useState } from 'react';
import {
  ArrowRight, Eye, ChevronDown, ChevronUp, ArrowDown,
  FileText, Users, Building2, Shield, Clock, CheckCircle2,
  Calendar, Hash, AlertTriangle, Paperclip, BookOpen,
  GitBranch, Send, BarChart2, Monitor, History, X,
  Upload, Filter,
} from 'lucide-react';

// ─── Data Types ───────────────────────────────────────────────────────────────

interface WorkflowStage {
  order: number;
  name: string;
  dept: string;
  section: string;
  role: string;
  exampleEmployee: string;
  actionType: string;
  description: string;
  requiredFields: string[];
  requiredFiles: string[];
  templates: string[];
  transitionConditions: string[];
  expectedDuration: string;
  signatureType: string;
  nextDept: string;
}

interface WorkflowDef {
  typeId: string;
  code: string;
  name: string;
  owner: string;
  category: string;
  categoryColor: string;
  description: string;
  createdDate: string;
  lastModified: string;
  expectedDuration: string;
  stageCount: number;
  templateCount: number;
  status: 'نشط' | 'معلق' | 'قيد المراجعة';
  stages: WorkflowStage[];
  documents: {
    requiredForms: string[];
    requiredFiles: string[];
    usedTemplates: string[];
    pdfForms: string[];
    outputDocuments: string[];
  };
  changeHistory: { date: string; user: string; action: string; detail: string }[];
}

// ─── Shared Stage Templates ───────────────────────────────────────────────────

const commonHrStages: WorkflowStage[] = [
  {
    order: 1,
    name: 'استلام وتسجيل الطلب',
    dept: 'مديرية التربية',
    section: 'شعبة الاستقبال',
    role: 'موظف استقبال',
    exampleEmployee: 'سارة يوسف',
    actionType: 'استلام وتسجيل',
    description: 'استلام الطلب من مقدمه وتسجيله في النظام مع إعطائه رقم تسلسلي، والتحقق الأولي من اكتمال المستندات.',
    requiredFields: ['اسم مقدم الطلب', 'رقم الهوية', 'نوع الطلب', 'تاريخ التقديم'],
    requiredFiles: ['صورة الهوية الوظيفية', 'كتاب الطلب الرسمي'],
    templates: ['نموذج استلام الطلب SY-HR-001'],
    transitionConditions: ['استكمال جميع الحقول الإلزامية', 'تسليم المستندات المطلوبة'],
    expectedDuration: 'يوم عمل واحد',
    signatureType: 'توقيع يدوي من موظف الاستقبال',
    nextDept: 'قسم التدقيق',
  },
  {
    order: 2,
    name: 'التحقق من المستندات',
    dept: 'مديرية التربية',
    section: 'قسم التدقيق',
    role: 'مدقق معاملات',
    exampleEmployee: 'تامر فواز',
    actionType: 'مراجعة وتدقيق',
    description: 'التحقق من صحة وصلاحية جميع الوثائق المقدمة، والتأكد من مطابقتها للمتطلبات الرسمية.',
    requiredFields: ['نتيجة التدقيق', 'الملاحظات'],
    requiredFiles: ['كشف الخدمة'],
    templates: ['نموذج تدقيق المستندات'],
    transitionConditions: ['إقرار المدقق بصحة المستندات', 'عدم وجود نواقص'],
    expectedDuration: '1–2 يوم عمل',
    signatureType: 'توقيع إلكتروني من المدقق',
    nextDept: 'دائرة الموارد البشرية',
  },
  {
    order: 3,
    name: 'المراجعة الإدارية',
    dept: 'دائرة الموارد البشرية',
    section: 'قسم شؤون الموظفين',
    role: 'مراجع أول',
    exampleEmployee: 'حسن كامل',
    actionType: 'مراجعة إدارية',
    description: 'مراجعة الطلب إدارياً والتحقق من استيفائه لكافة المتطلبات القانونية والنظامية.',
    requiredFields: ['ملاحظات المراجع', 'التوصية'],
    requiredFiles: [],
    templates: ['تقرير المراجعة الإدارية'],
    transitionConditions: ['إقرار المراجع بصحة الإجراءات', 'عدم وجود تعارض مع اللوائح'],
    expectedDuration: '2–3 أيام عمل',
    signatureType: 'توقيع إلكتروني من المراجع الأول',
    nextDept: 'مكتب رئيس الدائرة',
  },
  {
    order: 4,
    name: 'اعتماد رئيس الدائرة',
    dept: 'مديرية التربية',
    section: 'مكتب رئيس الدائرة',
    role: 'رئيس الدائرة',
    exampleEmployee: 'محمد العمر',
    actionType: 'اعتماد وتوقيع',
    description: 'مراجعة الملف من قبل رئيس الدائرة واتخاذ القرار النهائي بالموافقة أو الرفض أو الإحالة.',
    requiredFields: ['قرار رئيس الدائرة', 'الملاحظات'],
    requiredFiles: [],
    templates: ['نموذج اعتماد رئيس الدائرة'],
    transitionConditions: ['توقيع رئيس الدائرة الإلكتروني'],
    expectedDuration: '1–2 يوم عمل',
    signatureType: 'توقيع إلكتروني رسمي (eToken)',
    nextDept: 'إصدار القرار',
  },
  {
    order: 5,
    name: 'إصدار القرار وإغلاق المعاملة',
    dept: 'مديرية التربية',
    section: 'قسم الأرشيف والإصدار',
    role: 'موظف أرشيف',
    exampleEmployee: 'باسل حداد',
    actionType: 'إصدار وأرشفة',
    description: 'إصدار القرار الرسمي وتوثيقه وإبلاغ صاحب الطلب وإغلاق المعاملة في النظام.',
    requiredFields: ['رقم القرار', 'تاريخ الإصدار'],
    requiredFiles: ['القرار الموقع'],
    templates: ['نموذج القرار الرسمي', 'إشعار الإبلاغ'],
    transitionConditions: ['إصدار الوثيقة الرسمية', 'أرشفة الملف'],
    expectedDuration: 'يوم عمل واحد',
    signatureType: 'ختم المديرية',
    nextDept: 'مقدم الطلب (إغلاق)',
  },
];

const maintenanceStages: WorkflowStage[] = [
  {
    order: 1, name: 'تقديم طلب الصيانة', dept: 'مدرسة/جهة مقدمة', section: 'إدارة المدرسة', role: 'مدير المدرسة',
    exampleEmployee: 'مدير مدرسة الرازي', actionType: 'تقديم الطلب',
    description: 'تقديم طلب الصيانة مع وصف الأعطال وإرفاق الصور والتقدير التقريبي للتكلفة.',
    requiredFields: ['اسم المدرسة', 'نوع الأعطال', 'التكلفة التقديرية'], requiredFiles: ['صور الأعطال', 'تقرير المدير'],
    templates: ['نموذج طلب صيانة WF-BLD-001'], transitionConditions: ['استكمال المعلومات', 'إرفاق الصور'],
    expectedDuration: 'يوم عمل واحد', signatureType: 'توقيع مدير المدرسة', nextDept: 'دائرة الأبنية',
  },
  {
    order: 2, name: 'الفحص الميداني', dept: 'دائرة الأبنية والصيانة', section: 'فريق الفحص', role: 'مهندس فحص',
    exampleEmployee: 'م. خالد نصر', actionType: 'فحص ميداني',
    description: 'زيارة المدرسة ميدانياً وتوثيق الأعطال وإعداد تقرير الفحص والتكلفة الفعلية.',
    requiredFields: ['نتائج الفحص', 'التكلفة الفعلية', 'الأولوية'], requiredFiles: ['تقرير الفحص', 'صور ميدانية'],
    templates: ['تقرير الفحص الميداني'], transitionConditions: ['انتهاء الفحص', 'إعداد التقرير'],
    expectedDuration: '2–3 أيام عمل', signatureType: 'توقيع المهندس', nextDept: 'قسم الموازنة',
  },
  {
    order: 3, name: 'الموافقة على الموازنة', dept: 'دائرة المالية والتخطيط', section: 'قسم الموازنة', role: 'مسؤول موازنة',
    exampleEmployee: 'ريم درويش', actionType: 'اعتماد الموازنة',
    description: 'مراجعة التكلفة المقدرة والتحقق من توافر الاعتمادات المالية اللازمة للصيانة.',
    requiredFields: ['رقم بند الموازنة', 'المبلغ المعتمد'], requiredFiles: ['التقرير المالي'],
    templates: ['نموذج اعتماد الموازنة'], transitionConditions: ['توافر الاعتمادات', 'موافقة المسؤول المالي'],
    expectedDuration: '3–5 أيام عمل', signatureType: 'توقيع إلكتروني المسؤول المالي', nextDept: 'مكتب رئيس الدائرة',
  },
  {
    order: 4, name: 'اعتماد رئيس الدائرة', dept: 'مديرية التربية', section: 'مكتب رئيس الدائرة', role: 'رئيس الدائرة',
    exampleEmployee: 'محمد العمر', actionType: 'اعتماد نهائي',
    description: 'اعتماد طلب الصيانة وإطلاق الإذن للبدء بتنفيذ أعمال الصيانة.',
    requiredFields: ['القرار', 'ملاحظات الرئيس'], requiredFiles: [],
    templates: ['قرار اعتماد الصيانة'], transitionConditions: ['توقيع رئيس الدائرة'],
    expectedDuration: '1–2 يوم عمل', signatureType: 'توقيع إلكتروني رسمي (eToken)', nextDept: 'فريق التنفيذ',
  },
  {
    order: 5, name: 'تنفيذ الصيانة والإغلاق', dept: 'دائرة الأبنية والصيانة', section: 'فريق التنفيذ', role: 'مشرف أعمال',
    exampleEmployee: 'م. فادي منصور', actionType: 'تنفيذ وإغلاق',
    description: 'تنفيذ أعمال الصيانة، وإعداد محضر الاستلام، وأرشفة المعاملة بعد الانتهاء.',
    requiredFields: ['تاريخ الانتهاء', 'التكلفة الفعلية', 'ملاحظات التنفيذ'], requiredFiles: ['محضر الاستلام', 'صور بعد الإصلاح'],
    templates: ['محضر استلام الأعمال'], transitionConditions: ['توقيع محضر الاستلام من المدرسة'],
    expectedDuration: '7–21 يوم تنفيذ', signatureType: 'توقيع مدير المدرسة + مشرف الأعمال', nextDept: 'أرشيف (إغلاق)',
  },
];

// ─── Workflow Definitions ─────────────────────────────────────────────────────

const workflowDefs: WorkflowDef[] = [
  {
    typeId: 'external-transfer', code: 'WF-HR-001', name: 'نقل خارجي للمدرس', owner: 'دائرة الموارد البشرية',
    category: 'الموارد البشرية', categoryColor: '#054239',
    description: 'يُنظّم هذا النموذج إجراءات نقل المدرسين من مدرسة إلى أخرى خارج نطاق المديرية، ويشمل التحقق الإداري والقانوني حتى إصدار قرار النقل الرسمي.',
    createdDate: '2023-01-15', lastModified: '2024-01-10', expectedDuration: '7–14 يوم عمل',
    stageCount: 5, templateCount: 4, status: 'نشط',
    stages: commonHrStages,
    documents: {
      requiredForms: ['نموذج طلب النقل', 'استمارة بيانات المدرس'],
      requiredFiles: ['صورة الهوية الوظيفية', 'كشف الخدمة', 'كتاب الطلب الرسمي', 'موافقة المدرسة المستقبِلة'],
      usedTemplates: ['قالب طلب النقل الخارجي', 'قالب تقرير المراجعة'],
      pdfForms: ['نموذج WF-HR-001-A', 'نموذج WF-HR-001-B'],
      outputDocuments: ['قرار النقل الرسمي', 'إشعار إبلاغ المدرسة', 'تحديث ملف الموظف'],
    },
    changeHistory: [
      { date: '2024-01-10', user: 'المشرف التقني', action: 'تعديل حقل', detail: 'إضافة حقل "الموقع الجغرافي للمدرسة المستقبِلة"' },
      { date: '2023-09-05', user: 'مدير الموارد البشرية', action: 'تغيير جهة مسؤولة', detail: 'نقل مرحلة التدقيق من شعبة الاستقبال إلى قسم التدقيق المستقل' },
      { date: '2023-06-20', user: 'المشرف التقني', action: 'إضافة مرحلة', detail: 'إضافة مرحلة "التوثيق القانوني" قبل إصدار القرار' },
      { date: '2023-01-15', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' },
    ],
  },
  {
    typeId: 'internal-transfer', code: 'WF-HR-002', name: 'نقل داخلي', owner: 'دائرة الموارد البشرية',
    category: 'الموارد البشرية', categoryColor: '#054239',
    description: 'يُنظّم نقل الموظفين والمدرسين بين الوحدات الإدارية والمدارس ضمن نطاق المديرية.',
    createdDate: '2023-01-15', lastModified: '2023-11-20', expectedDuration: '5–10 أيام عمل',
    stageCount: 5, templateCount: 3, status: 'نشط',
    stages: commonHrStages.map((s, i) => ({ ...s, order: i + 1 })),
    documents: {
      requiredForms: ['نموذج طلب النقل الداخلي'],
      requiredFiles: ['كتاب الطلب', 'صورة الهوية'],
      usedTemplates: ['قالب طلب النقل الداخلي'],
      pdfForms: ['نموذج WF-HR-002'],
      outputDocuments: ['قرار النقل الداخلي'],
    },
    changeHistory: [
      { date: '2023-11-20', user: 'المشرف التقني', action: 'تعديل قالب', detail: 'تحديث قالب القرار الرسمي ليتضمن ختم المديرية' },
      { date: '2023-01-15', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' },
    ],
  },
  {
    typeId: 'maintenance', code: 'WF-BLD-001', name: 'طلب صيانة مدرسة', owner: 'دائرة الأبنية والصيانة',
    category: 'الأبنية والصيانة', categoryColor: '#6b1f2a',
    description: 'يُنظّم استقبال ومعالجة طلبات صيانة المباني المدرسية من الفحص الميداني حتى إتمام التنفيذ.',
    createdDate: '2023-03-10', lastModified: '2024-01-05', expectedDuration: '14–30 يوم عمل',
    stageCount: 5, templateCount: 5, status: 'نشط',
    stages: maintenanceStages,
    documents: {
      requiredForms: ['نموذج طلب الصيانة', 'استمارة الفحص الميداني'],
      requiredFiles: ['صور الأعطال', 'تقرير المدير', 'تقدير التكلفة'],
      usedTemplates: ['قالب طلب الصيانة', 'قالب تقرير الفحص', 'قالب محضر الاستلام'],
      pdfForms: ['نموذج WF-BLD-001-A', 'نموذج WF-BLD-001-B'],
      outputDocuments: ['قرار اعتماد الصيانة', 'محضر استلام الأعمال', 'تقرير إنجاز الصيانة'],
    },
    changeHistory: [
      { date: '2024-01-05', user: 'مدير الأبنية', action: 'تعديل حقل', detail: 'إضافة حقل "سنة بناء المدرسة" كمعيار تصنيف الأولوية' },
      { date: '2023-08-15', user: 'المشرف التقني', action: 'إضافة مرحلة', detail: 'إضافة مرحلة "الموافقة على الموازنة" قبل اعتماد رئيس الدائرة' },
      { date: '2023-03-10', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' },
    ],
  },
  {
    typeId: 'annual-study', code: 'WF-STAT-001', name: 'دراسة إحصائية سنوية', owner: 'دائرة التخطيط والإحصاء',
    category: 'الإحصائيات والدراسات', categoryColor: '#b9a779',
    description: 'يُنظّم إعداد ومراجعة واعتماد التقرير الإحصائي السنوي الشامل لمؤسسات التربية.',
    createdDate: '2023-02-20', lastModified: '2023-12-01', expectedDuration: '10–20 يوم عمل',
    stageCount: 5, templateCount: 6, status: 'نشط',
    stages: [
      { order: 1, name: 'جمع البيانات', dept: 'جميع المدارس', section: 'إدارة المدرسة', role: 'مدير المدرسة', exampleEmployee: 'مديرو المدارس', actionType: 'إدخال بيانات', description: 'جمع البيانات الإحصائية من جميع المدارس وفق الاستمارة الموحدة.', requiredFields: ['عدد الطلاب', 'عدد المدرسين', 'نسب النجاح'], requiredFiles: ['استمارة الإحصاء المعبأة'], templates: ['استمارة الإحصاء الموحدة'], transitionConditions: ['استلام بيانات 90% من المدارس'], expectedDuration: '5–7 أيام', signatureType: 'توقيع مدير المدرسة', nextDept: 'دائرة التخطيط' },
      { order: 2, name: 'تجميع البيانات وتدقيقها', dept: 'دائرة التخطيط', section: 'قسم الإحصاء', role: 'إحصائي', exampleEmployee: 'باسل حداد', actionType: 'تجميع وتدقيق', description: 'تجميع البيانات الواردة وتدقيقها واستكمال البيانات الناقصة.', requiredFields: ['ملاحظات التدقيق', 'نسبة الاكتمال'], requiredFiles: [], templates: ['نموذج تدقيق الإحصاء'], transitionConditions: ['اكتمال البيانات بنسبة 100%'], expectedDuration: '3–5 أيام', signatureType: 'توقيع الإحصائي', nextDept: 'رئيس قسم التخطيط' },
      { order: 3, name: 'مراجعة التقرير', dept: 'دائرة التخطيط', section: 'رئاسة القسم', role: 'رئيس قسم التخطيط', exampleEmployee: 'منى الشيخ', actionType: 'مراجعة', description: 'مراجعة شاملة للتقرير وإجراء التصحيحات والتحليل الإضافي.', requiredFields: ['ملاحظات الرئيس', 'التعديلات المطلوبة'], requiredFiles: [], templates: ['نموذج مراجعة التقرير'], transitionConditions: ['إقرار رئيس القسم بدقة البيانات'], expectedDuration: '2–3 أيام', signatureType: 'توقيع رئيس القسم', nextDept: 'مكتب رئيس الدائرة' },
      { ...commonHrStages[3], order: 4 },
      { ...commonHrStages[4], order: 5, name: 'نشر التقرير وأرشفته', description: 'طباعة ونشر التقرير الإحصائي السنوي وتوزيعه على الجهات المعنية وأرشفته.' },
    ],
    documents: {
      requiredForms: ['استمارة الإحصاء الموحدة', 'استمارة التدقيق'],
      requiredFiles: ['ملفات Excel للبيانات الخام'],
      usedTemplates: ['قالب التقرير الإحصائي السنوي', 'قالب الرسوم البيانية'],
      pdfForms: ['نموذج WF-STAT-001'],
      outputDocuments: ['التقرير الإحصائي السنوي المعتمد', 'الملخص التنفيذي', 'الجداول الإحصائية'],
    },
    changeHistory: [
      { date: '2023-12-01', user: 'رئيس قسم التخطيط', action: 'تعديل حقل', detail: 'إضافة مؤشر نسبة التسرب المدرسي كحقل إلزامي' },
      { date: '2023-02-20', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' },
    ],
  },
  { typeId: 'resignation', code: 'WF-HR-003', name: 'استقالة موظف', owner: 'دائرة الموارد البشرية', category: 'الموارد البشرية', categoryColor: '#054239', description: 'يُنظّم إجراءات قبول استقالة الموظف وإتمام متطلبات براءة الذمة وإغلاق الملف.', createdDate: '2023-01-15', lastModified: '2023-10-12', expectedDuration: '10–20 يوم عمل', stageCount: 5, templateCount: 3, status: 'نشط', stages: commonHrStages, documents: { requiredForms: ['نموذج طلب الاستقالة'], requiredFiles: ['براءة الذمة', 'كتاب الاستقالة', 'صورة الهوية'], usedTemplates: ['قالب قبول الاستقالة'], pdfForms: ['نموذج WF-HR-003'], outputDocuments: ['قرار قبول الاستقالة', 'شهادة الخدمة'] }, changeHistory: [{ date: '2023-01-15', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' }] },
  { typeId: 'ministry-letter', code: 'WF-CORR-001', name: 'كتاب موجه إلى وزارة التربية', owner: 'مكتب رئيس الدائرة', category: 'المراسلات الوزارية', categoryColor: '#988561', description: 'يُنظّم إعداد واعتماد المراسلات الرسمية الصادرة باتجاه الوزارة.', createdDate: '2023-04-01', lastModified: '2024-01-15', expectedDuration: '3–7 أيام عمل', stageCount: 4, templateCount: 2, status: 'نشط', stages: commonHrStages.slice(0, 4), documents: { requiredForms: ['نموذج المراسلة الرسمية'], requiredFiles: ['المرفقات الداعمة'], usedTemplates: ['قالب الكتاب الرسمي الصادر'], pdfForms: ['نموذج WF-CORR-001'], outputDocuments: ['الكتاب الرسمي المعتمد', 'سجل الصادرات'] }, changeHistory: [{ date: '2024-01-15', user: 'مكتب رئيس الدائرة', action: 'تعديل قالب', detail: 'تحديث رأسية الكتاب الرسمي' }, { date: '2023-04-01', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل' }] },
  { typeId: 'tech-support', code: 'WF-IT-001', name: 'طلب دعم تقني', owner: 'وحدة المعلوماتية', category: 'المعلوماتية والدعم التقني', categoryColor: '#428177', description: 'يُنظّم استقبال ومعالجة طلبات الدعم التقني للمدارس والدوائر.', createdDate: '2023-05-10', lastModified: '2023-12-20', expectedDuration: '3–14 يوم عمل', stageCount: 4, templateCount: 2, status: 'نشط', stages: commonHrStages.slice(0, 4), documents: { requiredForms: ['نموذج طلب الدعم التقني'], requiredFiles: ['لقطات الشاشة', 'سجل الأخطاء'], usedTemplates: ['قالب طلب الدعم'], pdfForms: ['نموذج WF-IT-001'], outputDocuments: ['تقرير الدعم التقني', 'محضر الإغلاق'] }, changeHistory: [{ date: '2023-12-20', user: 'مسؤول المعلوماتية', action: 'إضافة حقل', detail: 'إضافة حقل نوع الجهاز المتأثر' }, { date: '2023-05-10', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل' }] },
];

// Fill remaining types with simplified defs
['unpaid-leave', 'end-leave', 'quota-modify', 'teacher-confirm', 'year-results'].forEach((typeId, idx) => {
  const names: Record<string, string> = {
    'unpaid-leave': 'إجازة بلا أجر', 'end-leave': 'إنهاء إجازة', 'quota-modify': 'تعديل نصاب',
    'teacher-confirm': 'تثبيت مدرس', 'year-results': 'إصدار نتائج نهاية العام',
  };
  const codes: Record<string, string> = {
    'unpaid-leave': 'WF-HR-004', 'end-leave': 'WF-HR-005', 'quota-modify': 'WF-HR-006',
    'teacher-confirm': 'WF-HR-007', 'year-results': 'WF-TCH-001',
  };
  workflowDefs.push({
    typeId, code: codes[typeId], name: names[typeId],
    owner: typeId === 'year-results' ? 'دائرة شؤون المدرسين' : 'دائرة الموارد البشرية',
    category: typeId === 'year-results' ? 'شؤون المدرسين' : 'الموارد البشرية',
    categoryColor: typeId === 'year-results' ? '#428177' : '#054239',
    description: `نموذج سير العمل لمعاملة "${names[typeId]}" وفق الأنظمة المعمول بها في مديرية التربية.`,
    createdDate: '2023-01-15', lastModified: '2023-12-01',
    expectedDuration: '5–10 أيام عمل', stageCount: 5, templateCount: 3, status: 'نشط',
    stages: commonHrStages,
    documents: { requiredForms: [`نموذج ${names[typeId]}`], requiredFiles: ['كتاب الطلب', 'صورة الهوية'], usedTemplates: [`قالب ${names[typeId]}`], pdfForms: [`نموذج ${codes[typeId]}`], outputDocuments: ['القرار الرسمي'] },
    changeHistory: [{ date: '2023-01-15', user: 'المشرف التقني', action: 'إنشاء النموذج', detail: 'إنشاء نموذج سير العمل الأولي' }],
  });
});

const statusConfig: Record<string, { bg: string; color: string }> = {
  'نشط':          { bg: 'rgba(66,129,119,0.1)',  color: '#428177' },
  'معلق':         { bg: 'rgba(152,133,97,0.1)',  color: '#988561' },
  'قيد المراجعة': { bg: 'rgba(5,66,57,0.08)',    color: '#054239' },
};

const categoryIcons: Record<string, typeof FileText> = {
  'الموارد البشرية': Users, 'شؤون المدرسين': BookOpen,
  'المراسلات الوزارية': Send, 'الإحصائيات والدراسات': BarChart2,
  'الأبنية والصيانة': Building2, 'المعلوماتية والدعم التقني': Monitor,
};

// ─── Modify Request Modal ─────────────────────────────────────────────────────

function ModifyRequestModal({ wf, onClose }: { wf: WorkflowDef; onClose: () => void }) {
  const [modType, setModType] = useState('');
  const [stageName, setStageName] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => { if (modType && desc && priority) setSent(true); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget && !sent) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" style={{ direction: 'rtl' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}>
              <Send className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 style={{ color: 'var(--primary)' }}>إرسال طلب تعديل</h3>
              <p className="text-xs opacity-50">{wf.name} — {wf.code}</p>
            </div>
          </div>
          {!sent && <button onClick={onClose}><X className="w-4 h-4 opacity-40" /></button>}
        </div>
        <div className="p-5 space-y-4">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-3" style={{ color: '#428177' }} />
              <h3 className="mb-1" style={{ color: 'var(--primary)' }}>تم إرسال الطلب بنجاح</h3>
              <p className="text-sm opacity-60">سيراجع المشرف التقني طلبك في أقرب وقت</p>
              <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}>إغلاق</button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm opacity-70 mb-2 block">نوع التعديل *</label>
                <select value={modType} onChange={(e) => setModType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}>
                  <option value="">اختر نوع التعديل...</option>
                  {['إضافة مرحلة جديدة', 'حذف مرحلة', 'تعديل حقل', 'تغيير جهة مسؤولة', 'تعديل قالب', 'تغيير شروط الانتقال', 'تعديل المدة الزمنية'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm opacity-70 mb-2 block">المرحلة المستهدفة</label>
                <input value={stageName} onChange={(e) => setStageName(e.target.value)}
                  placeholder="اسم المرحلة (اختياري)" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }} />
              </div>
              <div>
                <label className="text-sm opacity-70 mb-2 block">وصف التعديل المطلوب *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
                  placeholder="اشرح التعديل المطلوب بالتفصيل..."
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }} />
              </div>
              <div>
                <label className="text-sm opacity-70 mb-2 block">الأولوية *</label>
                <div className="flex gap-3">
                  {['عالية', 'متوسطة', 'منخفضة'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border flex-1 justify-center"
                      style={{ borderColor: priority === p ? 'rgba(5,66,57,0.4)' : 'var(--border)', backgroundColor: priority === p ? 'rgba(5,66,57,0.04)' : 'var(--beige)' }}>
                      <input type="radio" name="priority" value={p} className="hidden" onChange={() => setPriority(p)} />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm opacity-70 mb-2 block">مرفقات اختيارية</label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"
                  style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(5,66,57,0.02)' }}>
                  <Upload className="w-5 h-5 mx-auto mb-1 opacity-40" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs opacity-50">ارفع مستنداً داعماً</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSend} disabled={!modType || !desc || !priority}
                  className="flex-1 py-3 rounded-xl text-sm disabled:opacity-40 hover:opacity-90 transition-all"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  إرسال الطلب للمشرف التقني
                </button>
                <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm border"
                  style={{ borderColor: 'var(--border)' }}>إلغاء</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function WorkflowDetail({ wf, onBack }: { wf: WorkflowDef; onBack: () => void }) {
  const [expandedStage, setExpandedStage] = useState<number | null>(0);
  const [showModal, setShowModal] = useState(false);
  const Icon = categoryIcons[wf.category] ?? FileText;
  const sc = statusConfig[wf.status];

  return (
    <>
      {showModal && <ModifyRequestModal wf={wf} onClose={() => setShowModal(false)} />}
      <div className="p-8 space-y-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm hover:opacity-70 transition-all" style={{ color: 'var(--primary)' }}>
            <ArrowRight className="w-4 h-4" /> العودة لقائمة النماذج
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all hover:shadow-md"
            style={{ borderColor: 'rgba(5,66,57,0.3)', color: 'var(--primary)', backgroundColor: 'rgba(5,66,57,0.04)' }}>
            <Send className="w-4 h-4" /> إرسال طلب تعديل
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="h-16" style={{ background: `linear-gradient(135deg, ${wf.categoryColor} 0%, ${wf.categoryColor}aa 100%)` }} />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl border-4 flex items-center justify-center shadow-md"
                style={{ backgroundColor: wf.categoryColor, borderColor: 'white' }}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 style={{ color: 'var(--primary)' }}>{wf.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono opacity-60">{wf.code}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>{wf.status}</span>
                </div>
                <p className="text-sm opacity-55">{wf.owner}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-70 mb-5">{wf.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Calendar, label: 'تاريخ الإنشاء',    value: wf.createdDate },
                { icon: Calendar, label: 'آخر تعديل',         value: wf.lastModified },
                { icon: Clock,    label: 'المدة المتوقعة',    value: wf.expectedDuration },
                { icon: Hash,     label: 'عدد المراحل',       value: `${wf.stageCount} مراحل` },
              ].map((m, i) => { const MI = m.icon; return (
                <div key={i} className="flex items-start gap-2">
                  <MI className="w-4 h-4 mt-0.5 opacity-35 shrink-0" />
                  <div><p className="text-xs opacity-50">{m.label}</p><p className="text-sm">{m.value}</p></div>
                </div>
              ); })}
            </div>
          </div>
        </div>

        {/* Workflow Flow Visualization */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="mb-6" style={{ color: 'var(--primary)' }}>مسار سير العمل — نظرة شاملة</h3>
          <div className="flex flex-col items-center gap-0">
            {/* Start node */}
            <div className="w-40 py-2 rounded-full text-center text-sm border-2"
              style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(5,66,57,0.06)', color: 'var(--primary)' }}>
              بداية المعاملة
            </div>
            {wf.stages.map((stage, idx) => (
              <div key={idx} className="flex flex-col items-center w-full max-w-sm">
                <ArrowDown className="w-5 h-5 my-1 opacity-30" style={{ color: 'var(--primary)' }} />
                <div
                  className="w-full rounded-xl border p-3 text-center cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderColor: expandedStage === idx ? `${wf.categoryColor}50` : 'var(--border)',
                    backgroundColor: expandedStage === idx ? `${wf.categoryColor}08` : 'white',
                  }}
                  onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
                      style={{ backgroundColor: wf.categoryColor, color: 'white' }}>{stage.order}</span>
                    <span className="text-sm" style={{ color: 'var(--charcoal-dark)' }}>{stage.name}</span>
                  </div>
                  <p className="text-xs opacity-50">{stage.dept} — {stage.role}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${wf.categoryColor}10`, color: wf.categoryColor }}>{stage.actionType}</span>
                    <span className="text-xs opacity-40">{stage.expectedDuration}</span>
                  </div>
                </div>
              </div>
            ))}
            <ArrowDown className="w-5 h-5 my-1 opacity-30" style={{ color: 'var(--primary)' }} />
            <div className="w-40 py-2 rounded-full text-center text-sm border-2"
              style={{ borderColor: '#428177', backgroundColor: 'rgba(66,129,119,0.08)', color: '#428177' }}>
              إغلاق المعاملة
            </div>
          </div>
        </div>

        {/* Stage Details (Accordion) */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 style={{ color: 'var(--primary)' }}>تفاصيل المراحل</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {wf.stages.map((stage, idx) => {
              const isOpen = expandedStage === idx;
              return (
                <div key={idx}>
                  <button
                    onClick={() => setExpandedStage(isOpen ? null : idx)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-right transition-all hover:bg-gray-50"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                      style={{ backgroundColor: `${wf.categoryColor}12`, color: wf.categoryColor }}>{stage.order}</div>
                    <div className="flex-1">
                      <p className="text-sm">{stage.name}</p>
                      <p className="text-xs opacity-50">{stage.dept} — {stage.role}</p>
                    </div>
                    <span className="text-xs opacity-40 shrink-0">{stage.expectedDuration}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 opacity-40 shrink-0" /> : <ChevronDown className="w-4 h-4 opacity-40 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ backgroundColor: 'rgba(5,66,57,0.015)' }}>
                      {[
                        { label: 'الدائرة المسؤولة', value: stage.dept },
                        { label: 'القسم المسؤول', value: stage.section },
                        { label: 'الدور المطلوب', value: stage.role },
                        { label: 'الموظف المتوقع', value: stage.exampleEmployee },
                        { label: 'نوع الإجراء', value: stage.actionType },
                        { label: 'نوع التوقيع', value: stage.signatureType },
                        { label: 'الجهة التالية', value: stage.nextDept },
                        { label: 'المدة الزمنية', value: stage.expectedDuration },
                      ].map((f) => (
                        <div key={f.label} className="p-3 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid var(--border)` }}>
                          <p className="text-xs opacity-50 mb-0.5">{f.label}</p>
                          <p>{f.value}</p>
                        </div>
                      ))}
                      <div className="col-span-full p-3 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}>
                        <p className="text-xs opacity-50 mb-1">الوصف</p>
                        <p className="opacity-70 leading-relaxed">{stage.description}</p>
                      </div>
                      {stage.requiredFields.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}>
                          <p className="text-xs opacity-50 mb-2">الحقول المطلوبة</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.requiredFields.map(f => <span key={f} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(5,66,57,0.06)', color: 'var(--primary)' }}>{f}</span>)}
                          </div>
                        </div>
                      )}
                      {stage.requiredFiles.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}>
                          <p className="text-xs opacity-50 mb-2">الملفات المطلوبة</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.requiredFiles.map(f => <span key={f} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(152,133,97,0.1)', color: '#988561' }}>{f}</span>)}
                          </div>
                        </div>
                      )}
                      {stage.transitionConditions.length > 0 && (
                        <div className="col-span-full p-3 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}>
                          <p className="text-xs opacity-50 mb-2">شروط الانتقال للمرحلة التالية</p>
                          {stage.transitionConditions.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#428177' }} />
                              <span className="text-xs opacity-70">{c}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Documents & Templates */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="mb-5" style={{ color: 'var(--primary)' }}>المستندات والنماذج</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'النماذج المطلوبة',      items: wf.documents.requiredForms,    color: '#054239' },
              { title: 'الملفات المطلوبة',      items: wf.documents.requiredFiles,    color: '#988561' },
              { title: 'القوالب المستخدمة',     items: wf.documents.usedTemplates,    color: '#428177' },
              { title: 'نماذج PDF المرتبطة',   items: wf.documents.pdfForms,         color: '#6b1f2a' },
              { title: 'المستندات الناتجة',     items: wf.documents.outputDocuments,  color: '#b9a779' },
            ].map((sec) => (
              <div key={sec.title} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--beige)' }}>
                <p className="text-xs mb-3" style={{ color: sec.color }}>{sec.title}</p>
                {sec.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 mb-1.5 last:mb-0">
                    <Paperclip className="w-3 h-3 shrink-0" style={{ color: sec.color }} />
                    <span className="text-xs opacity-70">{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Change History */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <History className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h3 style={{ color: 'var(--primary)' }}>سجل التعديلات</h3>
          </div>
          <div className="relative">
            {wf.changeHistory.map((entry, idx) => (
              <div key={idx} className="flex gap-4 pb-5 last:pb-0 relative">
                {idx < wf.changeHistory.length - 1 && (
                  <div className="absolute top-6 right-[11px] w-0.5 bottom-0" style={{ backgroundColor: 'var(--border)' }} />
                )}
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{ backgroundColor: 'rgba(5,66,57,0.08)' }}>
                  <GitBranch className="w-3 h-3" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm">{entry.action}</span>
                    <span className="text-xs opacity-40">{entry.date}</span>
                  </div>
                  <p className="text-xs opacity-55 mb-0.5">{entry.detail}</p>
                  <p className="text-xs opacity-35">بواسطة: {entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function WorkflowManagement() {
  const [selectedWf, setSelectedWf] = useState<WorkflowDef | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('الكل');

  if (selectedWf) return <WorkflowDetail wf={selectedWf} onBack={() => setSelectedWf(null)} />;

  const cats = ['الكل', 'الموارد البشرية', 'شؤون المدرسين', 'المراسلات الوزارية', 'الإحصائيات والدراسات', 'الأبنية والصيانة', 'المعلوماتية والدعم التقني'];

  const filtered = workflowDefs.filter((w) => {
    const matchCat = filterCat === 'الكل' || w.category === filterCat;
    const matchSearch = w.name.includes(search) || w.code.includes(search) || w.owner.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl mb-1" style={{ color: 'var(--primary)' }}>إدارة نماذج المعاملات</h1>
        <p className="text-sm opacity-60">عرض تعريفات ومسارات سير العمل لجميع أنواع المعاملات — للاطلاع فقط</p>
      </div>

      {/* Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(5,66,57,0.03)', borderColor: 'rgba(5,66,57,0.15)' }}>
        <Shield className="w-5 h-5 shrink-0" style={{ color: 'var(--primary)' }} />
        <p className="text-sm opacity-70">هذه الصفحة للاطلاع فقط. لطلب أي تعديل، استخدم زر "إرسال طلب تعديل" ضمن تفاصيل أي نموذج.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي النماذج',     value: workflowDefs.length,                             color: '#054239' },
          { label: 'نماذج نشطة',         value: workflowDefs.filter(w => w.status === 'نشط').length, color: '#428177' },
          { label: 'قيد المراجعة',       value: workflowDefs.filter(w => w.status === 'قيد المراجعة').length, color: '#988561' },
          { label: 'إجمالي المراحل',     value: workflowDefs.reduce((s, w) => s + w.stageCount, 0), color: '#b9a779' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <p className="text-2xl mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs opacity-60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Category */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <input type="text" placeholder="بحث باسم النموذج أو الرمز أو الجهة..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'white' }} />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--beige)' }}>
              {['اسم المعاملة', 'الرمز', 'الجهة المالكة', 'عدد المراحل', 'آخر تحديث', 'الحالة', 'عرض التفاصيل'].map((col) => (
                <th key={col} className="px-5 py-3 text-right text-xs opacity-60">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((wf) => {
              const Icon = categoryIcons[wf.category] ?? FileText;
              const sc = statusConfig[wf.status];
              return (
                <tr key={wf.typeId} className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }} onClick={() => setSelectedWf(wf)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${wf.categoryColor}10` }}>
                        <Icon className="w-4 h-4" style={{ color: wf.categoryColor }} />
                      </div>
                      <div>
                        <p className="text-sm">{wf.name}</p>
                        <p className="text-xs opacity-40">{wf.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm opacity-60">{wf.code}</td>
                  <td className="px-5 py-4 text-sm opacity-70">{wf.owner}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-mono" style={{ color: 'var(--primary)' }}>{wf.stageCount}</span>
                  </td>
                  <td className="px-5 py-4 text-sm opacity-55">{wf.lastModified}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>{wf.status}</span>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedWf(wf)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:shadow-sm"
                      style={{ backgroundColor: 'var(--beige)', color: 'var(--primary)' }}>
                      <Eye className="w-3.5 h-3.5" /> عرض التفاصيل
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center opacity-40">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
