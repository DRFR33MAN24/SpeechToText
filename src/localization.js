import LocalizedStrings from "react-localization";

let loc = new LocalizedStrings({
  en: {},
  ar: {
    employees: "الموظفين",
    addEmployee: "اضافة موظف",
    settings: "الاعدادات",
    EmployeesPage: "صفحة الموظفين",
    EmployeeName: "اسم الموظف",
    nationality: "الجنسية",
    phoneNumber: "رقم الهاتف",
    personalId: "صورة شخصية",
    dragUploadFile: "اضغط او اسحب لاضافة صورة",
    employee: "موظف",
    employeeType: "نوع الموظف",
    choose: "اختر",
    manager: "مدير",
    save: "حفظ",
    cancel: "الغاء",
    id: "الرقم",
    syrian: "سوري",
    american: "امريكي",
    password: 'كلمة المرور',
    jobContract: 'عقد العمل',
    registerDate: 'تاريخ التسجيل',
    mainPage: "الصفحة الرئيسية",
    managersSection: "قسم المدراء",
    employeeSection: "قسم الموظفين",
    logout: "تسجيل الخروج",
    clients: "العملاء",
    shippings: "الشحنات",


  }
});

loc.setLanguage("ar");
export default loc;
