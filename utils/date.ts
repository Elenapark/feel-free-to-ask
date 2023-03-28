import { format, register } from 'timeago.js';
import KoLocale from 'timeago.js/lib/lang/ko';

register('ko', KoLocale);

export default function formatAgo(date: string, lang = 'en_US') {
  return format(date, lang);
}
