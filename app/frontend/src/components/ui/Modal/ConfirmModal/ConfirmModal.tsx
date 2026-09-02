import { useState, type ChangeEvent } from 'react';
import { Modal } from '../Modal';
import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';
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
    confirmationWord?: string;
    confirmationLabel?: string;
};

export const ConfirmModal = (props: ConfirmModalProps) => {
    const { t } = useTranslation();
    const [confirmationInput, setConfirmationInput] = useState('');
    const [prevIsOpen, setPrevIsOpen] = useState(props.isOpen);

    if (props.isOpen !== prevIsOpen) {
        setPrevIsOpen(props.isOpen);
        setConfirmationInput('');
    }

    const handleConfirmationInputChange = (e: ChangeEvent<HTMLInputElement>) =>
        setConfirmationInput(e.target.value);

    const isConfirmDisabled =
        props.confirmationWord !== undefined &&
        confirmationInput !== props.confirmationWord;

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
                {props.confirmationWord && (
                    <div className={styles.ConfirmModal__confirmationWrapper}>
                        {props.confirmationLabel && (
                            <label className={styles.ConfirmModal__confirmationLabel}>
                                {props.confirmationLabel}
                            </label>
                        )}
                        <Input
                            value={confirmationInput}
                            onChange={handleConfirmationInputChange}
                            placeholder={props.confirmationWord}
                            autoComplete={'off'}
                            autoCorrect={'off'}
                            autoCapitalize={'off'}
                            spellCheck={false}
                        />
                    </div>
                )}
                <div className={styles.ConfirmModal__buttonsWrapper}>
                    <Button onClick={props.onClose} variant={'outline'}>
                        <p>{t('General.cancel')}</p>
                    </Button>
                    <Button
                        onClick={props.onConfirm}
                        variant={props.variant}
                        disabled={isConfirmDisabled}
                    >
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
