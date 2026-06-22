import { createFileRoute } from "@tanstack/react-router";
import { RegisterView } from "@/views/auth/RegisterView";

export const Route = createFileRoute("/privacy-policy")({
  component: RegisterView,
});
