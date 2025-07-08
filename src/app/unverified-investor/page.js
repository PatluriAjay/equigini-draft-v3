import { redirect } from "next/navigation";

export default function UnverifiedInvestorPage() {
  redirect("/unverified-investor/dashboard");
  return null;
}