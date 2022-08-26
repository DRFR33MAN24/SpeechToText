import LocalizedStrings from "react-localization";

let loc = new LocalizedStrings({
  en: {},
  ar: {
    delete: "",
    convertedFiles: "",
    failedAttempts: "",
    error: "",
  },
});

loc.setLanguage("ar");
export default loc;
