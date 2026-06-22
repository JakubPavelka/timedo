import { Moon, Sun } from 'lucide-react';
import styles from './ThemeSwitch.module.scss';
import { useTheme } from '../../../hooks/useTheme';
import clsx from 'clsx';

export const ThemeSwitch = () => {
    const theme = useTheme((s) => s.theme);
    const toggleTheme = useTheme((s) => s.toggleTheme);

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className={clsx(
                styles.ThemeSwitch,
                theme === 'dark'
                    ? styles.ThemeSwitch__dark
                    : styles.ThemeSwitch__light
            )}
        >
            {theme === 'dark' ? (
                <Sun className={styles.ThemeSwitch__iconDark} />
            ) : (
                <Moon className={styles.ThemeSwitch__iconLight} />
            )}
        </button>
    );
};
