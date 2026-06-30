import { Modal } from '../Modal';
import { Button } from '../../Button/Button';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    variant: 'danger' | 'primary';
    confirmText: string;
    confirmIcon?: React.ReactNode;
    icon?: React.ReactNode;
};

export const ConfirmModal = (props: ConfirmModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <div className={styles.ConfirmModal}>
                {props.icon && (
                    <div
                        className={clsx(
                            styles.ConfirmModal__iconWrapper,
                            styles[`--${props.variant}`]
                        )}
                    >
                        {props.icon}
                    </div>
                )}
                <p className={styles.ConfirmModal__title}>{props.title}</p>
                <p className={styles.ConfirmModal__text}>{props.description}</p>
                <div className={styles.ConfirmModal__buttonsWrapper}>
                    <Button onClick={props.onClose} variant={'outline'}>
                        <p>{t('General.cancel')}</p>
                    </Button>
                    <Button onClick={props.onConfirm} variant={props.variant}>
                        <span className={styles.ConfirmModal__buttonText}>
                            {props?.confirmIcon}
                            <span>{props.confirmText}</span>
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
