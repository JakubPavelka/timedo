import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './Pagination.module.scss';

type PaginationProps = {
    currentPage: string;
    maxPage: string;
    onClickBack: () => void;
    onClickForward: () => void;
};

export const Pagination = (props: PaginationProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.Pagination}>
            <Button
                onClick={props.onClickBack}
                className={styles.Pagination__button}
                variant={'outline'}
            >
                <ArrowLeft width={14} height={14} />
            </Button>
            <div>
                <p className={styles.Pagination__text}>
                    {t('Pagination.page')} {props.currentPage}/{props.maxPage}
                </p>
            </div>
            <Button
                onClick={props.onClickForward}
                className={styles.Pagination__button}
                variant={'outline'}
            >
                <ArrowRight width={14} height={14} />
            </Button>
        </div>
    );
};
