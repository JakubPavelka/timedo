import { DateTime } from 'luxon';

export const toLocalDateTime = (iso: string, locale: string) =>
    DateTime.fromISO(iso, { locale, zone: 'local' });
