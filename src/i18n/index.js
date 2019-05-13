import I18n from 'react-native-i18n';
import en from './locales/en';
import vi from './locales/vi';
import ar from './locales/ar';

I18n.fallbacks = true;

I18n.translations = {
  en,
  vi,
  ar
};

I18n.defaultLocale = "en";
I18n.locale = "en";

export default I18n;