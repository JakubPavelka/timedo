import { Sidebar } from '@/components/features/Sidebar/Sidebar';
import { useLogout } from '@/hooks/api/useAuth';

export const DashboardView = () => {
    const { mutate: logout } = useLogout();

    return (
        <div>
            <Sidebar />
            <button onClick={() => logout()}>LOGOUT</button>
        </div>
    );
};
