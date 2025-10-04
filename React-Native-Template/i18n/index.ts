import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translationTr from '@/i18n/locales/tr-TR/translation.json';
import translationEn from '@/i18n/locales/en-US/translation.json';
import translationEs from '@/i18n/locales/es-ES/translation.json';
import translationDe from '@/i18n/locales/de-DE/translation.json';
import { getString, setString, STORAGE_KEYS } from '@/utils/storage';

const resources = {
  tr: { translation: translationTr },
  en: { translation: translationEn },
  de: { translation: translationDe },
  es: { translation: translationEs },
};

const getStoredLanguage = (): string | undefined => {
  return getString(STORAGE_KEYS.LANGUAGE);
};

const setStoredLanguage = (language: string): void => {
  setString(STORAGE_KEYS.LANGUAGE, language);
};

const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();
  return locales && locales.length > 0 ? locales[0].languageCode || 'en' : 'en';
};

const initI18n = async (): Promise<void> => {
  try {
    let language = getStoredLanguage();
    if (!language) {
      language = getDeviceLanguage();
      setStoredLanguage(language);
    }
    await i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error('Error initializing i18n', error);
  }
};

initI18n();

export default i18n;
