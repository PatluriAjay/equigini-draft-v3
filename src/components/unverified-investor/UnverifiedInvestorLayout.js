"use client";
import UnverifiedInvestorNavbar from "@/components/unverified-investor/Navbar";
import PageLoader from "@/components/loading-components/PageLoader";
import { usePageLoader } from "@/utils/usePageLoader";
import { useState } from "react";

export default function UnverifiedInvestorLayout({ children }) {
  const { isLoading } = usePageLoader();
  const [collapsed, setCollapsed] = useState(false);
  const navbarPadding = "pt-[90px]";

  return (
    <div className="min-h-screen bg-bodybg">
      {/* Page Loader */}
      <PageLoader isLoading={isLoading} />
      
      {/* Navbar fixed at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <UnverifiedInvestorNavbar />
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 ${navbarPadding}`}>
        <main className="container mx-auto px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
} 