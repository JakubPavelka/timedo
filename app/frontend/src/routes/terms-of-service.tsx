import { createFileRoute } from "@tanstack/react-router";
import { RegisterView } from "@/views/auth/RegisterView";

export const Route = createFileRoute("/terms-of-service")({
  component: RegisterView,
});
