import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import styles from './LinkItem.module.scss';

type LinkItemProps = {
    url: string;
    label: string;
    className?: string;
};

export const LinkItem = (props: LinkItemProps) => (
    <a
        href={props.url}
        rel={'noopener noreferrer'}
        target={'_blank'}
        className={clsx(styles.LinkItem, props.className)}
    >
        <span className={styles.LinkItem__leftWrapper}>
            <ExternalLink width={16} height={16} className={styles.LinkItem__icon} />
            <span className={styles.LinkItem__label}>{props.label}</span>
        </span>
        <span className={styles.LinkItem__link}>{props.url}</span>
    </a>
);
