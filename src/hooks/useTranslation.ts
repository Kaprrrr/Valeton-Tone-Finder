import { useState, useEffect, useCallback } from 'react';
import i18n, { loadSavedLanguage, setLanguage as setI18nLanguage, SUPPORTED_LANGUAGES } from '../i18n';

export function useTranslation() {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    // Load saved language on mount
    loadSavedLanguage().then(savedLocale => {
      setLocale(savedLocale);
    });
  }, []);

  const t = useCallback((key: string, options?: object): string => {
    return i18n.t(key, options);
  }, [locale]); // Re-create when locale changes

  const setLanguage = useCallback(async (languageCode: string) => {
    await setI18nLanguage(languageCode);
    setLocale(languageCode);
  }, []);

  return {
    t,
    locale,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
