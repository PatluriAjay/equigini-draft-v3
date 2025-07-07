"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/Navbar";
import PageLoader from "@/components/loading-components/PageLoader";
import { usePageLoader } from "@/utils/usePageLoader";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const { isLoading } = usePageLoader();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile and desktop sidebar state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-bodybg flex flex-col">
      {/* Page Loader */}
      <PageLoader isLoading={isLoading} />
      
      {/* Navbar full width at the top */}
      <div className="w-full fixed top-0 left-0 right-0 z-40 backdrop-blur-xl drop-shadow-[0_4px_6px_rgba(190,190,190,0.3)] border-b border-white rounded">
        <AdminNavbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      {/* Content below navbar: sidebar left, main right */}
      <div className="flex flex-row w-full pt-[80px] min-h-screen">
        {/* Sidebar for both mobile and desktop */}
        {/* On mobile, sidebar overlays content. On desktop, sidebar is fixed. */}
        {!isMobile && (
          <div
            className={`transition-all duration-300 h-[calc(100vh-80px)] ${
              sidebarOpen ? "w-60" : "w-16"
            } fixed left-0 z-30 backdrop-blur-xl drop-shadow-[0_4px_6px_rgba(190,190,190,0.3)] border-b border-white rounded md:block hidden`}
          >
            <AdminSidebar
              collapsed={!sidebarOpen}
              setCollapsed={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isMobile={false}
            />
          </div>
        )}
        {/* Mobile sidebar overlay */}
        {isMobile && (
          <AdminSidebar
            collapsed={false}
            setCollapsed={() => {}}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobile={true}
          />
        )}
        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 p-4 bg-bodybg  ${
            !isMobile ? (sidebarOpen ? "ml-60" : "ml-16") : ""
          }`}
        >
          <div className="pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
