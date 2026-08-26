import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import styles from './TaskDetailTimeTrackingOff.module.scss';

type TaskDetailTimeTrackingOffProps = {
    onClick: () => void;
};

export const TaskDetailTimeTrackingOff = (props: TaskDetailTimeTrackingOffProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.TaskDetailTimeTrackingOff}>
            <div className={styles.TaskDetailTimeTrackingOff__icon}>
                <Timer width={18} height={18} />
            </div>
            <p className={styles.TaskDetailTimeTrackingOff__text}>
                {t('TaskDetail.RightSide.timeTrackOff')}
            </p>
            <Button variant={'outline'} onClick={props.onClick} fullWidth>
                {t('TaskDetail.RightSide.turnOn')}
            </Button>
        </div>
    );
};
