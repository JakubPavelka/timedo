import styles from './AddCard.module.scss';
import { Plus } from 'lucide-react';

type AddCardProps = {
    text: string;
    onClick: () => void;
};

export const AddCard = (props: AddCardProps) => (
    <div className={styles.AddCard} onClick={props.onClick} role={'button'} tabIndex={0}>
        <Plus width={16} height={16} />
        <p>{props.text}</p>
    </div>
);
