import type { TFunction } from 'i18next';
import { ApiError } from '@/api/ApiError';

export const getErrorMessage = (err: unknown, fallbackKey: string, t: TFunction) =>
    err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
        ? t(`BackendErrors.${err.code}`)
        : t(fallbackKey);
