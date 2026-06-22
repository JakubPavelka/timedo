import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginView } from "@/views/auth/LoginView";
import { checkAuth } from "@/utils/checkAuth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const user = await checkAuth();
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginView,
});
