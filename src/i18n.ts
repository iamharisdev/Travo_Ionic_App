import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation JSON files
import enTranslation from "./locales/en.json";
import ptTranslation from "./locales/pt.json";

const systemLang = (navigator.language).split('-')[0];

// Supported languages
const supportedLangs = ['en', 'pt'];
console.log("systemLang : ", systemLang)
// Get saved language or fallback to system language
const selectedLang = localStorage.getItem("language") || (supportedLangs.includes(systemLang) ? systemLang : "en");

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptTranslation },
    },
    lng: selectedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
