import { authApi } from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({ mutationFn: authApi.register });
};

export const useLogin = () => {
  return useMutation({ mutationFn: authApi.login });
};

export const useLogout = () => {
  return useMutation({ mutationFn: authApi.logout });
};

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    retry: false,
  });
};
