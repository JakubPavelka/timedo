import type { ReactNode } from 'react';
import { ListFilter } from 'lucide-react';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import { useTranslation } from 'react-i18next';
import styles from './Filter.module.scss';

type FilterProps = {
    children: ReactNode;
    align?: 'left' | 'right' | 'middle';
};

export const Filter = ({ children, align = 'left' }: FilterProps) => {
    const { t } = useTranslation();

    return (
        <Popover
            align={align}
            trigger={
                <Button variant={'outline'}>
                    <span className={styles.Filter__buttonWrapper}>
                        <ListFilter width={16} height={16} />
                        {t('Task.Filter.filter')}
                    </span>
                </Button>
            }
        >
            {children}
        </Popover>
    );
};
