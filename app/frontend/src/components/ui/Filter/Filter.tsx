import type { ReactNode } from 'react';
import { ListFilter } from 'lucide-react';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './Filter.module.scss';

type FilterProps = {
    children: ReactNode;
    align?: 'left' | 'right' | 'middle';
    activeFilters?: number;
};

export const Filter = ({ children, align = 'left', activeFilters = 0 }: FilterProps) => {
    const { t } = useTranslation();
    const hasActiveFilters = activeFilters > 0;

    return (
        <Popover
            align={align}
            trigger={
                <Button
                    className={clsx(hasActiveFilters && styles.Filter__activeButton)}
                    variant={'outline'}
                >
                    <span className={styles.Filter__buttonWrapper}>
                        <ListFilter width={16} height={16} />
                        {t('Task.Filter.filter')}
                        {hasActiveFilters && (
                            <span className={styles.Filter__activeFiltersCount}>
                                {activeFilters}
                            </span>
                        )}
                    </span>
                </Button>
            }
        >
            {children}
        </Popover>
    );
};
