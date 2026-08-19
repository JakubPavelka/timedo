import { useState } from 'react';
import type { ZodType } from 'zod';

type UseEditableFieldParams<T> = {
    value: T;
    schema: ZodType<T>;
};

export const useEditableField = <T>({ value, schema }: UseEditableFieldParams<T>) => {
    const [draft, setDraft] = useState<T>(value);
    const [error, setError] = useState<string>();
    const [isEditing, setIsEditing] = useState(false);

    const startEditing = () => {
        setDraft(value);
        setError(undefined);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setError(undefined);
    };

    const stopEditing = () => setIsEditing(false);

    const validate = (): T | undefined => {
        const candidate = typeof draft === 'string' ? (draft.trim() as T) : draft;
        const result = schema.safeParse(candidate);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return undefined;
        }
        setError(undefined);
        return result.data;
    };

    return {
        isEditing,
        draft,
        setDraft,
        error,
        startEditing,
        cancelEditing,
        stopEditing,
        validate,
    };
};
