import styles from './SectionHeader.module.scss';

type SectionHeaderProps = {
    title: string;
    icon: React.ReactNode;
};

export const SectionHeader = (props: SectionHeaderProps) => (
    <div className={styles.SectionHeader__flexWrapper}>
        <div className={styles.SectionHeader__iconWrapper}>{props.icon}</div>
        <p className={styles.SectionHeader__title}>{props.title}</p>
    </div>
);
