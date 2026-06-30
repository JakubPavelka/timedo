import clsx from 'clsx';
import styles from './SectionHeader.module.scss';

type SectionHeaderProps = {
    title: string;
    icon: React.ReactNode;
    className?: string;
};

export const SectionHeader = (props: SectionHeaderProps) => (
    <div className={clsx(styles.SectionHeader__flexWrapper, props.className)}>
        <div className={styles.SectionHeader__iconWrapper}>{props.icon}</div>
        <p className={styles.SectionHeader__title}>{props.title}</p>
    </div>
);
