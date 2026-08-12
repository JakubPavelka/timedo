import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { TaskDetailLinkItem } from './TaskDetailLinkItem';
import styles from './TaskDetailLink.module.scss';

type TaskDetailLinkProps = {
    links: { id: string; label: string; url: string }[];
    taskId: string;
};

export const TaskDetailLink = (props: TaskDetailLinkProps) => {
    const { t } = useTranslation();

    return (
        <div>
            {props.links.length > 0 && (
                <div className={styles.TaskDetailLink__linksWrapper}>
                    {props.links.map((link) => (
                        <TaskDetailLinkItem
                            key={link.id}
                            link={link}
                            allLinks={props.links}
                            taskId={props.taskId}
                        />
                    ))}
                </div>
            )}
            <div id={'links'} className={styles.TaskDetailLink__addLinkWrapper}>
                <p>{t('Task.Modal.addLink')}</p>
                <Plus width={16} height={16} />
            </div>
        </div>
    );
};
