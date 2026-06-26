import { ThemeSwitch } from '@/components/ui/ThemeSwitch/ThemeSwitch';
import styles from './Header.module.scss';

type HeaderProps = {
    title: string;
};

export const Header = (props: HeaderProps) => (
    <div className={styles.Header}>
        <h2 className={styles.Header__title}>{props.title}</h2>
        <ThemeSwitch />
    </div>
);
