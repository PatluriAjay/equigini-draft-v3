"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/Navbar";
import AdminFooter from "@/components/admin/Footer";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile and desktop sidebar state

  return (
    <div className="min-h-screen bg-bodybg flex flex-col">
      {/* Navbar full width at the top */}
      <div className="w-full fixed top-0 left-0 right-0 z-40 backdrop-blur-xl drop-shadow-[0_4px_6px_rgba(190,190,190,0.3)] border-b border-white rounded">
        <AdminNavbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      {/* Content below navbar: sidebar left, main right */}      <div className="flex flex-row w-full pt-[80px] min-h-screen">
        {/* Sidebar for both mobile and desktop */}
        <div
          className={`transition-all duration-300 h-[calc(100vh-80px)] ${
            sidebarOpen ? "w-60" : "w-16"
          } fixed left-0 z-30 backdrop-blur-xl drop-shadow-[0_4px_6px_rgba(190,190,190,0.3)] border-b border-white rounded`}
        >
          <AdminSidebar collapsed={!sidebarOpen} setCollapsed={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        {/* Main content */}
        <div 
          className={`flex-1 transition-all duration-300 p-6 bg-bodybg min-h-[calc(100vh-80px)] ${
            sidebarOpen ? "ml-60" : "ml-16"
          }`}
        >
          <div className="pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
