"use client";
import AnalystSidebar from "@/components/analyst/Sidebar";
import AnalystNavbar from "@/components/analyst/Navbar";
import { useState } from "react";

export default function AnalystLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "w-16" : "w-60";
  const mainPadding = collapsed ? "pl-16" : "pl-60";
  const navbarLeft = collapsed ? "left-16" : "left-60";
  const navbarPadding = collapsed ? "pt-[90px]" : "pt-[90px]";

  return (
    <div className="flex min-h-screen bg-bodybg">
      {/* Sidebar fixed on the left */}
      <div
        className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${sidebarWidth}`}
      >
        <AnalystSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {/* Main content area with navbar fixed at the top */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${mainPadding}`}
      >
        <div
          className={`fixed top-0 z-20 right-0 transition-all duration-300 ${navbarLeft}`}
        >
          <AnalystNavbar />
        </div>
        <main
          className={`flex-1 p-6 ${navbarPadding} min-h-screen bg-bodybg`}
        >
          {children}
        </main>
      </div>
    </div>
  );
} 