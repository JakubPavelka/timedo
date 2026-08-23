import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCreateTask } from '@/hooks/api/useTask';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';

export const useNewTaskModal = () => {
    const { t } = useTranslation();
    const { mutate: createTask } = useCreateTask();
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleCreateTask = (data: TaskData) => {
        return createTask(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createSuccess'));
                setIsOpen(false);
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Task.Modal.createError', t)),
        });
    };

    return { isOpen, openModal, closeModal, handleCreateTask };
};
