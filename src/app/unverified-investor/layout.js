import React, { Suspense } from 'react';
import UnverifiedInvestorLayout from "@/components/unverified-investor/UnverifiedInvestorLayout";

export default function UnverifiedInvestorRootLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnverifiedInvestorLayout>{children}</UnverifiedInvestorLayout>
    </Suspense>
  );
} 