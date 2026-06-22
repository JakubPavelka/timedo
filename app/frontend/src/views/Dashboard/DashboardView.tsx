import { useLogout } from "@/hooks/api/useAuth";

export const DashboardView = () => {
  const { mutate: logout } = useLogout();

  return (
    <div>
      <p>DASHBOARD</p>
      <button onClick={() => logout()}>LOGOUT</button>
    </div>
  );
};
