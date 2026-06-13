━━━━━━━━━━━━━━━━━━━
⚡ QUICK ACTIONS BEHAVIOR (IMPORTANT UX FLOW)
━━━━━━━━━━━━━━━━━━━

You must now define the FULL USER FLOWS when clicking each Quick Action button in the Dashboard.

These flows must be designed as modal screens or dedicated pages with clean step-by-step UX.

━━━━━━━━━━━━━━━━━━━
⚡ 1- إنشاء مؤسسة (Create Organization Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء مؤسسة":

Open a centered modal or full page form with:

Fields:

* اسم المؤسسة (Arabic text input)
* المؤسسة الأم (Dropdown - optional)
* الموقع (Dropdown or selector)

UX Requirements:

* Simple form (max 3 fields visible at once)
* Clear validation messages in Arabic
* Primary action button: "حفظ المؤسسة"
* Secondary: "إلغاء"

After creation:

* Success state screen (Arabic message)
* Return to Organizations list

━━━━━━━━━━━━━━━━━━━
🏛 2- إنشاء قسم (Create Department Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء قسم":

Open form with hierarchy support.

Fields:

* اسم القسم
* المؤسسة (Required dropdown)
* القسم الأب (Optional dropdown - for hierarchy)
* حالة النشاط (Toggle switch)

UX Requirements:

* Show hierarchy hint: "يمكن ربط هذا القسم بقسم آخر"
* Visual indicator for parent-child relationship
* Clean form layout (no clutter)

After submit:

* Success message
* Update Tree View automatically

━━━━━━━━━━━━━━━━━━━
👤 3- إنشاء دور (Create Role Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء دور":

Open advanced role creation modal.

Fields:

* اسم الدور
* كود الدور (auto-generated suggestion allowed)
* المؤسسة
* القسم
* الحالة

System behavior:

* Automatically generate:
  camunda_group_key format:
  CODE__ORG{ID}__DEPT{ID}

UX Requirements:

* Show preview of generated key before save
* Explain role assignment visually
* Clear hierarchy context

━━━━━━━━━━━━━━━━━━━
🧩 4- إنشاء حقل (Create Field Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء حقل":

Open dynamic field builder UI.

Fields:

* اسم الحقل
* نوع الحقل (Dropdown):

  * نص
  * رقم
  * تاريخ
  * نعم/لا
  * قائمة

━━━━━━━━━━━━━━━━━━━
⚠️ SPECIAL CASE: "قائمة"
━━━━━━━━━━━━━━━━━━━

If user selects "قائمة":

Show dynamic repeater input:

* إضافة خيار
* حذف خيار
* ترتيب الخيارات

Example values:

* NEW
* PENDING
* DONE

UX Requirements:

* Live preview of field structure
* Visual representation of how it will appear in forms

━━━━━━━━━━━━━━━━━━━
📁 5- إنشاء ملف (Create File Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء ملف":

Open upload modal:

Fields:

* اسم الملف
* نوع الملف (Dropdown)
* التصنيف

Upload area:

* Drag & Drop zone
* File type icons preview (PDF / DOCX / Image)

UX Requirements:

* Show upload progress state (UI only)
* File preview card after selection
* Confirmation before save

━━━━━━━━━━━━━━━━━━━
📄 6- إنشاء قالب مستند (Create Template Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء قالب":

Open template upload designer:

Fields:

* اسم القالب
* نوع الملف
* Engine type (Dropdown)
* إعدادات إضافية (config_json UI editor placeholder)

Upload:

* Drag & Drop zone
* File preview panel

UX Requirements:

* Show template preview card
* Indicate supported formats
* Clean structured layout

━━━━━━━━━━━━━━━━━━━
⚙️ 7- إنشاء عملية (BPMN Process Upload Flow)
━━━━━━━━━━━━━━━━━━━

When user clicks "إنشاء عملية":

Open advanced process creation wizard.

Step 1:

* اسم العملية
* نوع العملية (Transaction Type)
* الأولوية
* تاريخ البداية
* تاريخ النهاية (optional)

Step 2:

* رفع ملف BPMN (Drag & Drop)

After upload:
Show visual preview screen:

━━━━━━━━━━━━━━━━━━━
🧭 BPMN VISUALIZATION SCREEN
━━━━━━━━━━━━━━━━━━━

Display:

* Process nodes (steps)
* Flow connections
* Step types:

  * User Task
  * Service Task

Each node contains:

* اسم المرحلة
* نوع المرحلة
* قابلية الربط

━━━━━━━━━━━━━━━━━━━
👤 USER TASK CONFIGURATION PANEL
━━━━━━━━━━━━━━━━━━━

When clicking a step:

Open right-side configuration panel:

Allow linking:

* Role
* Fields (multi-select)
* Files (multi-select)
* Templates (multi-select)

UX Requirements:

* Clean side panel (not modal)
* Instant preview updates
* Clear separation between steps

━━━━━━━━━━━━━━━━━━━
🧠 GLOBAL UX RULES FOR ALL QUICK ACTIONS
━━━━━━━━━━━━━━━━━━━

* Always use Arabic labels only
* RTL alignment everywhere
* Minimal form steps (avoid complexity)
* Use progressive disclosure (show only needed fields)
* Clear success & error states in Arabic
* Soft transitions between steps
* Avoid overwhelming the user

━━━━━━━━━━━━━━━━━━━
🎨 DESIGN CONSISTENCY RULE
━━━━━━━━━━━━━━━━━━━

All quick actions must follow:

* Beige form backgrounds
* Olive primary buttons
* Soft borders
* Large spacing
* Rounded corners
* Calm UI feedback animations

━━━━━━━━━━━━━━━━━━━
🏁 FINAL GOAL
━━━━━━━━━━━━━━━━━━━

Ensure that every Quick Action feels like:

* A guided government workflow assistant
* Not a technical form
* Easy for non-technical employees
* Fast and structured
* Error-resistant UX

This system should behave like a real production governmental ERP system with intelligent, guided workflows.
