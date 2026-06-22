import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { LoginView } from "./views/auth/LoginView";
import { RegisterView } from "./views/auth/RegisterView";
import { DashboardView } from "./views/Dashboard/DashboardView";
import { authApi } from "./api/auth/auth.api";
import { useAuthStore } from "./store/useAuthStore";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const checkAuth = async () => {
  try {
    const user = await authApi.me();
    useAuthStore.getState().setUser(user);
    return user;
  } catch {
    return null;
  }
};

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: async () => {
    const user = await checkAuth();
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginView,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: async () => {
    const user = await checkAuth();
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterView,
});

const forgottenPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgotten-password",
  component: RegisterView,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: RegisterView,
});

const termsOfServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms-of-service",
  component: RegisterView,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: async () => {
    const user = await checkAuth();
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardView,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  privacyPolicyRoute,
  termsOfServiceRoute,
  forgottenPasswordRoute,
  dashboardRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
