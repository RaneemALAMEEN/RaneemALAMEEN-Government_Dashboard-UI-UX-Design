export interface ManagerTransaction {
  id: string;
  type: string;
  requester: string;
  dept: string;
  date: string;
  status: string;
  priority: string;
  urgent: boolean;
  assignee: string | null;
}

export const initialTransactions: ManagerTransaction[] = [
  { id: 'TXN-2024-441', type: 'طلب وثيقة رسمية', requester: 'خالد أحمد مطر', dept: 'الشؤون الإدارية', date: '2024-01-29', status: 'بانتظار المعالجة', priority: 'عالية', urgent: true, assignee: null },
  { id: 'TXN-2024-439', type: 'طلب إجازة', requester: 'محمود السيد علي', dept: 'التعليم الأساسي', date: '2024-01-30', status: 'قيد المعالجة', priority: 'عالية', urgent: true, assignee: 'محمد العمر' },
  { id: 'TXN-2024-435', type: 'نقل موظف', requester: 'ليلى عمران', dept: 'الموارد البشرية', date: '2024-01-28', status: 'بانتظار توقيعي', priority: 'عادية', urgent: false, assignee: null },
  { id: 'TXN-2024-432', type: 'تثبيت مدرس', requester: 'سامر حسين', dept: 'التعليم الأساسي', date: '2024-01-27', status: 'بانتظار توقيعي', priority: 'عادية', urgent: false, assignee: null },
  { id: 'TXN-2024-428', type: 'طلب صيانة مدرسة', requester: 'مديرية الأبنية', dept: 'الأبنية والصيانة', date: '2024-01-25', status: 'بانتظار توقيعي', priority: 'عالية', urgent: false, assignee: null },
  { id: 'TXN-2024-420', type: 'مراسلة رسمية', requester: 'وحدة التخطيط', dept: 'التخطيط', date: '2024-01-22', status: 'منجزة', priority: 'عادية', urgent: false, assignee: 'محمد العمر' },
  { id: 'TXN-2024-415', type: 'طلب وثيقة رسمية', requester: 'ناجي سليم', dept: 'الشؤون الإدارية', date: '2024-01-20', status: 'تم الرفض', priority: 'منخفضة', urgent: false, assignee: null },
];
