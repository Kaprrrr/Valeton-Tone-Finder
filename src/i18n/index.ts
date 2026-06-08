import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en';
import es from './translations/es';
import de from './translations/de';
import fr from './translations/fr';
import pt from './translations/pt';

const LANGUAGE_KEY = '@app_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

const i18n = new I18n({
  en,
  es,
  de,
  fr,
  pt,
});

// Set default locale from device
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Get device locale and extract language code
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.locale = SUPPORTED_LANGUAGES.some(l => l.code === deviceLocale) ? deviceLocale : 'en';

// Load saved language preference
export async function loadSavedLanguage(): Promise<string> {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
      i18n.locale = savedLang;
      return savedLang;
    }
  } catch (error) {
    console.warn('Failed to load saved language:', error);
  }
  return i18n.locale;
}

// Save language preference
export async function setLanguage(languageCode: string): Promise<void> {
  if (SUPPORTED_LANGUAGES.some(l => l.code === languageCode)) {
    i18n.locale = languageCode;
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }
}

// Get current language
export function getCurrentLanguage(): string {
  return i18n.locale;
}

// Translation function
export function t(key: string, options?: object): string {
  return i18n.t(key, options);
}

export default i18n;
