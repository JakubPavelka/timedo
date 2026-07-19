import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import styles from './Select.module.scss';
import { useTranslation } from 'react-i18next';

export type SelectOption = {
    value: string;
    label: string;
    color?: string;
    icon?: ReactNode;
};

type SelectProps = {
    options: SelectOption[];
    onChange: (value: string) => void;
    value?: string;
    placeholder?: string;
    id?: string;
    translatedLabel?: boolean;
};

export const Select = (props: SelectProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = props.options.find(
        (option) => option.value === props.value
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) =>
            e.key === 'Escape' && setIsOpen(false);

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        props.onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={styles.Select} ref={wrapperRef}>
            <button
                id={props.id}
                type={'button'}
                className={styles.Select__trigger}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup={'listbox'}
                aria-expanded={isOpen}
            >
                <span className={styles.Select__triggerContent}>
                    {selectedOption?.icon ??
                        (selectedOption?.color && (
                            <span
                                className={styles.Select__dot}
                                style={{
                                    backgroundColor: selectedOption.color,
                                }}
                            />
                        ))}
                    <span
                        className={clsx(
                            styles.Select__label,
                            !selectedOption &&
                                styles['Select__label--placeholder']
                        )}
                    >
                        {selectedOption
                            ? props.translatedLabel
                                ? t(selectedOption.label)
                                : selectedOption.label
                            : props.placeholder}
                    </span>
                </span>
                <ChevronDown
                    width={16}
                    height={16}
                    className={clsx(
                        styles.Select__chevron,
                        isOpen && styles['Select__chevron--open']
                    )}
                />
            </button>
            {isOpen && (
                <ul className={styles.Select__menu} role={'listbox'}>
                    {props.options.map((option) => (
                        <li
                            key={option.value}
                            role={'option'}
                            aria-selected={option.value === props.value}
                            className={clsx(
                                styles.Select__option,
                                option.value === props.value &&
                                    styles['Select__option--selected']
                            )}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.icon ??
                                (option.color && (
                                    <span
                                        className={styles.Select__dot}
                                        style={{
                                            backgroundColor: option.color,
                                        }}
                                    />
                                ))}
                            <span>
                                {props.translatedLabel
                                    ? t(option.label)
                                    : option.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
