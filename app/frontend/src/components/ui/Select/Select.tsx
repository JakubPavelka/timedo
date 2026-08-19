import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Pill } from '@/components/ui/Pill/Pill';
import clsx from 'clsx';
import styles from './Select.module.scss';

export type SelectOption = {
    value: string;
    label: string;
    color?: string;
    icon?: React.ReactNode;
};

type SelectBaseProps = {
    options: SelectOption[];
    placeholder?: string;
    id?: string;
    translatedLabel?: boolean;
    footer?: React.ReactNode;
};

type SingleSelectProps = SelectBaseProps & {
    multiple?: false;
    value?: string;
    onChange: (value: string) => void;
    onClear?: () => void;
};

type MultiSelectProps = SelectBaseProps & {
    multiple: true;
    value?: string[];
    onChange: (value: string[]) => void;
    onClear?: () => void;
};

type SelectProps = SingleSelectProps | MultiSelectProps;

export const Select = (props: SelectProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = !props.multiple
        ? props.options.find((option) => option.value === props.value)
        : undefined;
    const selectedOptions = props.multiple
        ? props.options.filter((option) => props.value?.includes(option.value))
        : [];
    const hasSelection = props.multiple ? selectedOptions.length > 0 : !!selectedOption;
    const canClear = props.multiple ? hasSelection : props.onClear && hasSelection;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        if (props.multiple) {
            const current = props.value ?? [];
            const next = current.includes(optionValue)
                ? current.filter((value) => value !== optionValue)
                : [...current, optionValue];
            props.onChange(next);
            return;
        }

        props.onChange(optionValue);
        setIsOpen(false);
    };

    const handleToggle = () => setIsOpen((prev) => !prev);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (props.multiple) {
            if (props.onClear) {
                props.onClear();
            } else {
                props.onChange([]);
            }
        } else {
            props.onClear?.();
        }

        setIsOpen(false);
    };

    return (
        <div className={styles.Select} ref={wrapperRef}>
            <button
                id={props.id}
                type={'button'}
                className={clsx(
                    styles.Select__trigger,
                    props.multiple &&
                        selectedOptions.length > 0 &&
                        styles['Select__trigger--hasPills']
                )}
                onClick={handleToggle}
                aria-haspopup={'listbox'}
                aria-expanded={isOpen}
            >
                <span className={styles.Select__triggerContent}>
                    {props.multiple ? (
                        selectedOptions.length > 0 ? (
                            <span className={styles.Select__pills}>
                                {selectedOptions.map((option) => (
                                    <Pill
                                        key={option.value}
                                        variant={'colored'}
                                        color={option.color}
                                    >
                                        {props.translatedLabel
                                            ? t(option.label)
                                            : option.label}
                                    </Pill>
                                ))}
                            </span>
                        ) : (
                            <span
                                className={clsx(
                                    styles.Select__label,
                                    styles['Select__label--placeholder']
                                )}
                            >
                                {props.placeholder}
                            </span>
                        )
                    ) : (
                        <>
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
                        </>
                    )}
                </span>
                <span className={styles.Select__actions}>
                    {canClear && (
                        <span
                            className={styles.Select__clear}
                            onClick={handleClear}
                            role={'button'}
                            aria-label={'clear'}
                        >
                            <X width={14} height={14} />
                        </span>
                    )}
                    <ChevronDown
                        width={16}
                        height={16}
                        className={clsx(
                            styles.Select__chevron,
                            isOpen && styles['Select__chevron--open']
                        )}
                    />
                </span>
            </button>
            {isOpen && (
                <ul className={styles.Select__menu} role={'listbox'}>
                    {props.options.map((option) => {
                        const isSelected = props.multiple
                            ? (props.value ?? []).includes(option.value)
                            : option.value === props.value;

                        return (
                            <li
                                key={option.value}
                                role={'option'}
                                aria-selected={isSelected}
                                className={clsx(
                                    styles.Select__option,
                                    isSelected && styles['Select__option--selected']
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
                        );
                    })}
                    {props.footer}
                </ul>
            )}
        </div>
    );
};
