"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiFile,
  FiEdit,
  FiChevronDown,
  FiChevronRight,
  FiSettings,
  FiTag,
  FiLayers,
  FiActivity,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
}) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const iconClass = "text-[22px] text-[#b57cf6] min-w-[22px]";

  // Close settings dropdown when sidebar collapses
  useEffect(() => {
    if (collapsed) {
      setSettingsOpen(false);
    }
  }, [collapsed]);

  // Close sidebar on mobile when clicking outside or on a link
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    function handleClick(e) {
      if (!e.target.closest(".admin-sidebar-mobile")) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/investors", label: "Investors" },
    { href: "/admin/deals", label: "Deals" },
    { href: "/admin/activity-monitor", label: "Activity Monitor" },
  ];

  const links = [
    // Add navLinks for mobile at the top
    ...(isMobile
      ? [
          { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
          { href: "/admin/investors", label: "Investors", icon: FiUsers },
          { href: "/admin/deals", label: "Deals", icon: FiBriefcase },
          {
            href: "/admin/activity-monitor",
            label: "Activity Monitor",
            icon: FiActivity,
          },
        ]
      : []),
    { href: "/admin/eoi", label: "EOI", icon: FiFileText },
    { href: "/admin/nda", label: "NDA", icon: FiFileText },
    { href: "/admin/crm", label: "CRM", icon: FiUsers },
    { href: "/admin/blogs", label: "Blogs", icon: FiBookOpen },
    {
      href: "/admin/investor-approval",
      label: "Investor Approval",
      icon: FiUsers,
    },
    {
      href: "/admin/document-access-logs",
      label: "Document Logs",
      icon: FiFile,
    },
    { href: "/admin/profile", label: "Profile", icon: FiEdit },
  ];

  // Sidebar classes for mobile/desktop
  const sidebarBase =
    "bg-white backdrop-blur-lg shadow-xl p-3 pt-6 flex flex-col justify-between border border-white transition-all duration-300 z-50";
  const sidebarDesktop = `${
    collapsed ? "w-16" : "w-60"
  } min-h-[calc(100vh-80px)] rounded-2xl`;
  const sidebarMobile =
    "admin-sidebar-mobile fixed left-0 h-[calc(100vh-80px)] w-60 min-h-screen transform transition-transform duration-300 top-[80px] border-t-0 border-l-0 rounded-none md:hidden" +
    (sidebarOpen ? " translate-x-0" : " -translate-x-full");

  // Overlay for mobile
  const overlayMobile =
    isMobile && sidebarOpen ? (
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        style={{ top: 80 }}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar overlay"
      />
    ) : null;

  // Sidebar content
  const sidebarContent = (
    <aside
      className={
        (isMobile
          ? `${sidebarBase} ${sidebarMobile}`
          : `${sidebarBase} ${sidebarDesktop}`) + " overflow-y-auto" // Enable vertical scrolling
      }
      style={isMobile ? { boxShadow: "0 0 0 100vmax rgba(0,0,0,0)" } : {}}
    >
      <div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" &&
                pathname.startsWith(link.href));
            const isHovered = hovered === link.href;
            const hasSubMenu = link.submenu && link.submenu.length > 0;
            return (
              <div key={link.href} className="flex flex-col">
                <Link
                  href={link.href}
                  className={`group relative px-3 py-2 rounded-xl transition-all flex items-center gap-3 text-sm
                  ${
                    isActive || isHovered
                      ? "text-white sidebar-gradient text-base"
                      : "text-gray-700 border-l-0 font-normal"
                  }
                  ${collapsed && !isMobile ? "justify-center px-0" : ""}
                `}
                  onMouseEnter={() => setHovered(link.href)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <span
                    className={`${iconClass} ${
                      isActive || isHovered ? "text-white" : "text-primarycolor"
                    } font-semibold group-hover:text-white`}
                  >
                    {link.icon &&
                      (() => {
                        const Icon = link.icon;
                        return <Icon />;
                      })()}
                  </span>
                  {(!collapsed || isMobile) && (
                    <span className="ml-2 z-10">{link.label}</span>
                  )}
                  {hasSubMenu && (
                    <span
                      className={`ml-auto transition-transform ${
                        settingsOpen ? "rotate-180" : ""
                      }`}
                    >
                      <FiChevronDown className="text-gray-500" />
                    </span>
                  )}
                </Link>
                {hasSubMenu && settingsOpen && (
                  <div className="pl-8 flex flex-col gap-2">
                    {link.submenu.map((subLink) => {
                      const isSubActive =
                        pathname === subLink.href ||
                        pathname.startsWith(subLink.href);
                      return (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className={`group relative px-3 py-2 rounded-lg transition-all flex items-center gap-3 text-sm
                          ${
                            isSubActive
                              ? "text-white bg-primarycolor rounded-lg"
                              : "text-gray-700 hover:text-white"
                          }
                          ${collapsed && !isMobile ? "justify-center px-0" : ""}
                        `}
                          onClick={() => {
                            if (isMobile) setSidebarOpen(false);
                          }}
                        >
                          <span
                            className={`${iconClass} ${
                              isSubActive ? "text-white" : "text-primarycolor"
                            } font-semibold group-hover:text-white`}
                          >
                            {subLink.icon &&
                              (() => {
                                const Icon = subLink.icon;
                                return <Icon />;
                              })()}
                          </span>
                          {(!collapsed || isMobile) && (
                            <span className="ml-2 z-10">{subLink.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full relative px-3 py-2 rounded-xl transition-all flex items-center gap-3 text-sm
                ${
                  pathname.startsWith("/admin/settings")
                    ? "text-white sidebar-gradient text-base"
                    : "text-gray-700"
                }
                ${collapsed && !isMobile ? "justify-center px-0" : ""}`}
            >
              <span
                className={`${iconClass} ${
                  pathname.startsWith("/admin/settings")
                    ? "text-white"
                    : "text-primarycolor"
                }`}
              >
                <FiSettings />
              </span>
              {(!collapsed || isMobile) && (
                <>
                  <span className="ml-2 z-10">Settings</span>
                  <FiChevronDown
                    className={`ml-auto transition-transform duration-200 ${
                      settingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>
            {settingsOpen && (!collapsed || isMobile) && (
              <div className="mt-1 pl-4 gap-2 flex flex-col">
                {[
                  {
                    href: "/admin/sectors",
                    label: "Sectors",
                    icon: FiTag,
                  },
                  {
                    href: "/admin/stages",
                    label: "Stages",
                    icon: FiLayers,
                  },
                  {
                    href: "/admin/statuses",
                    label: "Statuses",
                    icon: FiActivity,
                  },
                  {
                    href: "/admin/ticket-sizes",
                    label: "Ticket Sizes",
                    icon: MdCurrencyRupee,
                  },
                  {
                    href: "/admin/testimonials",
                    label: "Testimonials",
                    icon: FiUsers,
                  },
                ].map((subLink) => {
                  const isSubActive =
                    pathname === subLink.href ||
                    pathname.startsWith(subLink.href);
                  const isSubHovered = hovered === subLink.href;
                  return (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      className={`group relative px-3 py-2 rounded-xl transition-all flex items-center gap-3 text-sm
                        ${
                          isSubActive || isSubHovered
                            ? "text-white sidebar-gradient text-base"
                            : "text-gray-700 border-l-0 font-normal"
                        }
                      `}
                      onMouseEnter={() => setHovered(subLink.href)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        if (isMobile) setSidebarOpen(false);
                      }}
                    >
                      <span
                        className={`${iconClass} ${
                          isSubActive || isSubHovered
                            ? "text-white"
                            : "text-primarycolor"
                        } font-semibold group-hover:text-white`}
                      >
                        {subLink.icon &&
                          (() => {
                            const Icon = subLink.icon;
                            return <Icon />;
                          })()}
                      </span>
                      {(!collapsed || isMobile) && (
                        <span className="ml-2 z-10">{subLink.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="md:hidden ">
            <div className="bg-primarycolor-100/70 rounded-xl p-4 flex flex-col items-center">
              <div className="w-12 h-12 bg-white-300 flex align-center justify-center rounded-full mb-2">
                <Image
                  src="/favicon.png"
                  alt="Icon"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              {(!collapsed || isMobile) && (
                <>
                  <span className="text-xs text-gray-600 mb-2 text-center">
                    Initiative by <br /> <strong>Pantomath Group</strong>
                  </span>
                  <Link
                    href="https://equigini.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-primarycolor text-white rounded-lg px-4 py-1 text-xs">
                      Know More
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-8 hidden md:block">
        <div className="bg-primarycolor-100/70 rounded-xl p-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-white-300 flex align-center justify-center rounded-full mb-2">
            <Image
              src="/favicon.png"
              alt="Icon"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          {(!collapsed || isMobile) && (
            <>
              <span className="text-xs text-gray-600 mb-2 text-center">
                Initiative by <br /> <strong>Pantomath Group</strong>
              </span>
              <Link
                href="https://equigini.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-primarycolor text-white rounded-lg px-4 py-1 text-xs">
                  Know More
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {overlayMobile}
      {sidebarContent}
    </>
  );
}
