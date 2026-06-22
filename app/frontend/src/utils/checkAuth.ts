import { authApi } from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/useAuthStore";

export const checkAuth = async () => {
  try {
    const user = await authApi.me();
    useAuthStore.getState().setUser(user);
    return user;
  } catch {
    return null;
  }
};
