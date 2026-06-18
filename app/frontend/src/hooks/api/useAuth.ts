import { authApi } from "@/api/auth/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({ mutationFn: authApi.register });
};
