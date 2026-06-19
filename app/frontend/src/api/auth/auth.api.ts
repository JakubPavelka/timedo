import { apiClient } from "../client";
import axios from "axios";
import type {
  LoginData,
  RegisterData,
} from "@timedo/shared/src/schemas/authSchema";

export class ApiAuthError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

export const authApi = {
  register: async (
    data: Omit<RegisterData, "passwordAgain" | "termsAccepted">,
  ): Promise<unknown> => {
    try {
      const response = await apiClient.post("/api/auth/register", data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new ApiAuthError(err.response?.data?.code ?? "UNKNOWN_ERROR");
      }
      throw err;
    }
  },

  login: async (data: LoginData): Promise<unknown> => {
    try {
      const response = await apiClient.post("/api/auth/login", data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new ApiAuthError(err.response?.data?.code ?? "UNKNOWN_ERROR");
      }
      throw err;
    }
  },
};
