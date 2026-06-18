import { apiClient } from "../client";
import type { RegisterData } from "@/../@timedo/shared/src/schemas/authSchema";

export const authApi = {
  register: async (
    data: Omit<RegisterData, "passwordAgain" | "termsAccepted">,
  ): Promise<unknown> => {
    const response = await apiClient.post("/api/auth/register", data);
    return response.data;
  },
};
