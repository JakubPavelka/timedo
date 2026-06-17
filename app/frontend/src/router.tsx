import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { LoginView } from "./views/auth/LoginView";
import { RegisterView } from "./views/auth/RegisterView";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginView,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
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

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  privacyPolicyRoute,
  termsOfServiceRoute,
  forgottenPasswordRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
