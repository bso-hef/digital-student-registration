"use client";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import DE from "../../locales/de.json";
import EN from "../../locales/en.json";
import { changeApplicationLocale } from "../../store/actions/uiActions";
import { store } from "../../store/store";

const resources = {
  en: { translation: EN },
  "en-US": { translation: EN },
  "en-GB": { translation: EN },
  de: { translation: DE },
  "de-DE": { translation: DE },
  "de-AT": { translation: DE },
  "de-CH": { translation: DE },
};

const detection = {
  order: [
    "localStorage",
    "navigator",
    "querystring",
    "cookie",
    "sessionStorage",
    "htmlTag",
    "path",
    "subdomain",
  ],

  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  caches: ["localStorage", "cookie"],
  excludeCacheFor: ["cimode"],

  cookieMinutes: 10,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection,

    fallbackLng: "en",
    supportedLngs: ["en", "en-US", "en-GB", "de", "de-DE", "de-AT", "de-CH"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

i18n.on("languageChanged", (lng) => {
  store.dispatch(changeApplicationLocale(lng));
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
