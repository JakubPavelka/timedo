import { Sidebar } from '@/components/features/Sidebar/Sidebar';
import { useLogout } from '@/hooks/api/useAuth';
import sidebarButtonsData from '@/data/sidebarButtonsData';

export const DashboardView = () => {
    const { mutate: logout } = useLogout();

    return (
        <div>
            <Sidebar buttons={sidebarButtonsData} />
            <button onClick={() => logout()}>LOGOUT</button>
        </div>
    );
};
