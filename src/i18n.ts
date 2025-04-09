import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation JSON files
import enTranslation from "./locales/en.json";
import ptTranslation from "./locales/pt.json";

i18n
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptTranslation },
    },
    lng: localStorage.getItem("language") || "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
