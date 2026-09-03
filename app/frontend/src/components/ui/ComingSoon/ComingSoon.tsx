import { Construction } from 'lucide-react';
import styles from './ComingSoon.module.scss';

interface ComingSoonProps {
    title: string;
    description: string;
}

export const ComingSoon = (props: ComingSoonProps) => (
    <div className={styles.ComingSoon}>
        <div className={styles.ComingSoon__icon}>
            <Construction width={24} height={24} />
        </div>
        <h1 className={styles.ComingSoon__title}>{props.title}</h1>
        <p className={styles.ComingSoon__description}>{props.description}</p>
    </div>
);
