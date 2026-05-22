import { useLocaleStore } from '../store/localeStore';

export function useLocale() {
  const { locale, setLocale } = useLocaleStore();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  return {
    locale,
    setLocale,
    toggleLocale
  };
}
