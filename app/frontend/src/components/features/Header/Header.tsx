import { useTranslation } from 'react-i18next';
import { useRouterState } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch/ThemeSwitch';
import { Button } from '@/components/ui/Button/Button';
import { NewTaskDialog } from '@/components/features/Task/NewTaskDialog/NewTaskDialog';
import { useNewTaskModal } from '@/hooks/useNewTaskModal';
import { HeaderActiveTimer } from './HeaderActiveTimer/HeaderActiveTimer';
import styles from './Header.module.scss';

type HeaderProps = {
    title: string;
};

export const Header = (props: HeaderProps) => {
    const { t } = useTranslation();
    const { isOpen, openModal, closeModal, handleCreateTask } = useNewTaskModal();
    const routeId = useRouterState({ select: (s) => s.matches.at(-1)?.routeId });
    const isOnTasksPage = routeId === '/dashboard/tasks/';

    return (
        <div className={styles.Header}>
            <h2 className={styles.Header__title}>{props.title}</h2>
            <div className={styles.Header__rightSide}>
                <HeaderActiveTimer />
                <ThemeSwitch />
                {!isOnTasksPage && (
                    <Button onClick={openModal}>
                        <span className={styles.Header__buttonWrapper}>
                            <Plus width={16} height={16} />
                            <span>{t('Task.newTask')}</span>
                        </span>
                    </Button>
                )}
            </div>
            <NewTaskDialog
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={handleCreateTask}
            />
        </div>
    );
};
