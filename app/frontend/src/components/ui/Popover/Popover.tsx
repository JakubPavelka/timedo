import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    type ReactNode,
    type Ref,
} from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import styles from './Popover.module.scss';

type PopoverProps = {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right' | 'middle';
    ref?: Ref<PopoverHandle>;
    onOpenChange?: (isOpen: boolean) => void;
};

export type PopoverHandle = {
    close: () => void;
};

const panelAnimation = {
    initial: { opacity: 0, scale: 0.95, y: -4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -4 },
    transition: { duration: 0.15 },
};

export const Popover = ({
    trigger,
    children,
    align = 'left',
    ref,
    onOpenChange,
}: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const updateOpen = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange]
    );

    useImperativeHandle(ref, () => ({
        close: () => updateOpen(false),
    }));

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                updateOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && updateOpen(false);

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, updateOpen]);

    const handleToggle = () => updateOpen(!isOpen);

    return (
        <div className={styles.Popover} ref={wrapperRef}>
            <div className={styles.Popover__trigger} onClick={handleToggle}>
                {trigger}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <div
                        className={clsx(
                            styles.Popover__content,
                            styles[`Popover__content--${align}`]
                        )}
                    >
                        <motion.div
                            className={clsx(
                                styles.Popover__panel,
                                styles[`Popover__panel--${align}`]
                            )}
                            {...panelAnimation}
                        >
                            {children}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
