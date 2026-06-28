import { useEffect, useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            ref={overlayRef}
            className={styles.Modal}
            onClick={handleOverlayClick}
            role={'dialog'}
            aria-modal={'true'}
        >
            {children}
        </div>,
        document.body
    );
};
