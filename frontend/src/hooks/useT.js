import { useLocaleStore } from '../store/localeStore';
import { i18nStrings } from '../constants/i18nStrings';

export function useT() {
  const { locale } = useLocaleStore();

  const t = (key) => {
    if (i18nStrings[locale] && i18nStrings[locale][key]) {
      return i18nStrings[locale][key];
    }
    if (i18nStrings['en'] && i18nStrings['en'][key]) {
      return i18nStrings['en'][key];
    }
    return key;
  };

  return t;
}
