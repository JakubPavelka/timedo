import { useState } from 'react';
import { Palette } from 'lucide-react';
import clsx from 'clsx';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { PRESET_COLORS } from '@/data/labelColorData';
import styles from './ColorField.module.scss';

type ColorFieldProps = {
    value: string;
    onChange: (color: string) => void;
    size?: 'sm' | 'md';
};

export const ColorField = ({ size = 'sm', ...props }: ColorFieldProps) => {
    const { t } = useTranslation();
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleSelectPreset = (presetColor: string) => {
        setShowCustomPicker(false);
        props.onChange(presetColor);
    };

    const handleShowCustomPicker = () => setShowCustomPicker(true);

    return (
        <div>
            <div className={styles.ColorField__colorRow}>
                {PRESET_COLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        type={'button'}
                        aria-label={presetColor}
                        aria-pressed={!showCustomPicker && props.value === presetColor}
                        className={clsx(
                            styles.ColorField__colorSwatch,
                            styles[`ColorField__colorSwatch--${size}`],
                            !showCustomPicker &&
                                props.value === presetColor &&
                                styles['ColorField__colorSwatch--selected']
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handleSelectPreset(presetColor)}
                    />
                ))}
                <button
                    type={'button'}
                    aria-label={t('Task.Modal.customColor')}
                    aria-pressed={showCustomPicker}
                    className={clsx(
                        styles.ColorField__colorSwatch,
                        styles[`ColorField__colorSwatch--${size}`],
                        styles.ColorField__customColorButton,
                        showCustomPicker && styles['ColorField__colorSwatch--selected']
                    )}
                    onClick={handleShowCustomPicker}
                >
                    <Palette
                        width={size === 'md' ? 16 : 14}
                        height={size === 'md' ? 16 : 14}
                    />
                </button>
            </div>
            {showCustomPicker && (
                <HexColorPicker
                    color={props.value}
                    onChange={props.onChange}
                    className={styles.ColorField__colorPicker}
                />
            )}
        </div>
    );
};
