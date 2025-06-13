"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/Navbar";
import AdminFooter from "@/components/admin/Footer";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "w-16" : "w-60";
  const mainPadding = collapsed ? "pl-16" : "pl-60";
  const navbarLeft = collapsed ? "left-16" : "left-60";
  const navbarPadding = collapsed ? "pt-[90px]" : "pt-[90px]"; // adjust if needed

  return (
    <div className="flex min-h-screen bg-bodybg">
      {/* Sidebar fixed on the left */}
      <div
        className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${sidebarWidth}`}
      >
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {/* Main content area with navbar fixed at the top */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${mainPadding}`}
      >
        <div
          className={`fixed top-0 z-20 right-0 transition-all duration-300 ${navbarLeft} backdrop-blur-xl drop-shadow-[0_4px_6px_rgba(190,190,190,0.3)] border-b border-white rounded`}
        >
          <AdminNavbar />
        </div>
        <main
          className={`flex-1 p-6 ${navbarPadding} min-h-screen bg-bodybg `}
        >
          <div className="pt-2">{children}</div>
        </main>
        {/* <AdminFooter /> */}
      </div>
    </div>
  );
}
