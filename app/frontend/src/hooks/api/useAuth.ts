import { authApi } from "@/api/auth/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({ mutationFn: authApi.register });
};

export const useLogin = () => {
  return useMutation({ mutationFn: authApi.login });
};

export const useLogout = () => {
  return useMutation({ mutationFn: authApi.logout });
};
