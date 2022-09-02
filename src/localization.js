import LocalizedStrings from "react-localization";

let loc = new LocalizedStrings({
  en: {
    open_out_dir:"Open directory",
    delete: "Delete",
    convertedFiles: "Converted Files",
    failedAttempts: "Failed Attempts",
    error: "Error",
    speech_language: "Speech Language",
    arabic: "Arabic",
    english: "English",
    conversion_engine: "Conversion Engine",
    interface_language: "Interface Language",
    choose_output_directory: "Choose output directory",
    enter_wit_api_key: "Enter wit.ai API key",
    enter_google_api_key: "Enter Google API key",
    save: "Save",
    add: "Add",
    clear: "Delete",
    drag_and_drop_or_click_select_button:
      "Drag and drop or click select button",
    drop_files_here: "Drop files here",
    start: "Start",
    stop: "Stop",
    files: "Files",
    estimated_time: "Estimated time",
    hour: "Hr",
    min: "Min",
    network: "Network",
    requests: "Requests",
    split_audio_files: "Split audio files",
    upload_to_server: "Upload to server",
  },
  ar: {
    open_out_dir:"Open directory",
    delete: "",
    convertedFiles: "",
    failedAttempts: "",
    error: "",
    speech_language: "لغة التحويل",
    arabic: "عربي",
    english: "انكليزي",
    conversion_engine: "محرك التحويل",
    interface_language: "لغة الواجهة",
    choose_output_directory: "اختر مجلد الاخراج",
    enter_wit_api_key: "ادخل مفتاح تحقق wit.ai",
    enter_google_api_key: "ادخل مفتاح تحقق Google",
    save: "حفظ",
    add: "اضافة",
    clear: "مسح",
    drag_and_drop_or_click_select_button:
      "اسحب والق الملفات هنا او اضغط زر الاختيار",
    drop_files_here: "الق الملفات هنا",
    start: "ابدأ",
    stop: "ايقاف",
    files: "الملفات",
    estimated_time: "الوقت المقدر",
    hour: "ساعة",
    min: "دقيقة",
    network: "الشبكة",
    requests: "الطلبات",
    split_audio_files: "تقسيم الى مقاطع صوتية",
    upload_to_server: "الرفع الى المخدم",
  },
});

loc.setLanguage("ar");
export default loc;
