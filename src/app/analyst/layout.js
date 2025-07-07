import AnalystLayout from "@/components/analyst/AnalystLayout";
import { Suspense } from "react";

export default function AnalystRootLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalystLayout>{children}</AnalystLayout>
    </Suspense>
  );
}
