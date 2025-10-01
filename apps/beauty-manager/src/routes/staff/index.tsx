import { createFileRoute } from "@tanstack/react-router";
import { Staff } from "@/components/features/staff/page";

export const Route = createFileRoute("/staff/")({
  component: Staff,
});
