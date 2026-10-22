import clsx from 'clsx';
import styles from './SectionHeader.module.scss';

type SectionHeaderProps = {
    title: string;
    description?: string;
    className?: string;
};

export const SectionHeader = (props: SectionHeaderProps) => (
    <div className={clsx(styles.SectionHeader__flexWrapper, props.className)}>
        <p className={styles.SectionHeader__title}>{props.title}</p>
        {props.description && (
            <p className={styles.SectionHeader__description}>{props.description}</p>
        )}
    </div>
);
