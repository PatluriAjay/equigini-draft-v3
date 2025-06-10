"use client";
import InvestorNavbar from "@/components/investor/Navbar";
import { useState } from "react";

export default function InvestorLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navbarPadding = "pt-[90px]";

  return (
    <div className="min-h-screen bg-bodybg">
      {/* Navbar fixed at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <InvestorNavbar />
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