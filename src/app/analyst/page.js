import { redirect } from "next/navigation";

export default function AnalystIndexPage() {
  redirect("/analyst/dashboard");
  return null;
}
