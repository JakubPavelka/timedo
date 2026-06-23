import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button/Button';
import styles from './Sidebar.module.scss';
import { Link } from '@tanstack/react-router';
import { Settings } from 'lucide-react';

type SidebarProps = {
    projects?: any[];
    buttons: any[];
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const theme = useTheme((s) => s.theme);

    return (
        <div className={styles.Sidebar}>
            {/* LOGO */}
            {theme === 'light' ? (
                <LogoBlue height={40} width={110} />
            ) : (
                <LogoBlueDarkTheme height={40} width={110} />
            )}

            {/* START TIMER BUTTON */}
            <div className={styles.Sidebar__buttonFocus}>
                <Button onClick={props.onTimerClick} havePlayIcon>
                    <p>xdd</p>
                </Button>
            </div>

            {/* BUTTONS */}
            <div>
                {props.buttons?.map(() => {
                    return <div></div>;
                })}
            </div>

            {/* PROFILE BUTTON */}
            <div>
                <Link to={'/profile'}>
                    <div>
                        <p></p>
                        <p></p>
                    </div>
                    <Settings />
                </Link>
            </div>
        </div>
    );
};
