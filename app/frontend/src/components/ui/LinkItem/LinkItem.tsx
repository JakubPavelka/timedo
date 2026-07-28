import { ExternalLink } from 'lucide-react';
import styles from './LinkItem.module.scss';

type LinkItemProps = {
    link: string;
    label: string;
};

export const LinkItem = (props: LinkItemProps) => (
    <a
        href={props.link}
        rel={'noopener noreferrer'}
        target={'_blank'}
        className={styles.LinkItem}
    >
        <span className={styles.LinkItem__leftWrapper}>
            <ExternalLink width={16} height={16} className={styles.LinkItem__icon} />
            <span className={styles.LinkItem__label}>{props.label}</span>
        </span>
        <span className={styles.LinkItem__link}>{props.link}</span>
    </a>
);
