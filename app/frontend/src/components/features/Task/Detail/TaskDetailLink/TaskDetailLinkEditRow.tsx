import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import styles from './TaskDetailLink.module.scss';

type LinkDraft = {
    label: string;
    url: string;
};

type TaskDetailLinkEditRowProps = {
    draft: LinkDraft;
    isPending: boolean;
    onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    onSubmit: () => void;
    error?: string;
};

export const TaskDetailLinkEditRow = (props: TaskDetailLinkEditRowProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className={styles.TaskDetailLink__editInputs}>
                <Input
                    className={styles.TaskDetailLink__editInput}
                    value={props.draft.label}
                    onChange={props.onLabelChange}
                    onKeyDown={props.onKeyDown}
                    placeholder={t('Task.Modal.linkName')}
                    variant={'filled'}
                    disabled={props.isPending}
                    autoFocus
                />
                <Input
                    className={styles.TaskDetailLink__editInput}
                    value={props.draft.url}
                    onChange={props.onUrlChange}
                    onKeyDown={props.onKeyDown}
                    placeholder={t('Task.Modal.linkUrl')}
                    variant={'filled'}
                    disabled={props.isPending}
                />
                <X
                    className={styles.TaskDetailLink__actionIcon}
                    onClick={props.onCancel}
                    width={18}
                    height={18}
                />
                <Check
                    className={styles.TaskDetailLink__actionIcon}
                    onClick={props.onSubmit}
                    width={18}
                    height={18}
                />
            </div>
            {props.error && (
                <p className={styles.TaskDetailLink__error}>{t(props.error)}</p>
            )}
        </div>
    );
};
