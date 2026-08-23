import { Modal } from '@/components/ui/Modal/Modal';
import { NewTaskModal } from '@/components/features/Task/NewTaskModal/NewTaskModal';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';

type NewTaskDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskData) => void;
};

export const NewTaskDialog = (props: NewTaskDialogProps) => {
    if (!props.isOpen) {
        return null;
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} closeOnOverlayClick={false}>
            <NewTaskModal onSubmit={props.onSubmit} onClose={props.onClose} />
        </Modal>
    );
};
