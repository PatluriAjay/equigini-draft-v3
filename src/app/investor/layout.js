import InvestorLayout from "@/components/investor/InvestorLayout";
import { Suspense } from "react";

export default function InvestorRootLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestorLayout>{children}</InvestorLayout>
    </Suspense>
  );
}
