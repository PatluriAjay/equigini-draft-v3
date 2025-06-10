"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function AnalystSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);
  const iconClass = "text-[22px] text-[#b57cf6] min-w-[22px]";
  const links = [
    // { href: "/analyst/dashboard", label: "Dashboard", icon: FiHome },
    { href: "/analyst/eoi", label: "EOI", icon: FiFileText },
    { href: "/analyst/compliance", label: "Compliance", icon: FiFileText },
    { href: "/analyst/documents", label: "Upload Documents", icon: FiUpload },
  ];

  return (
    <aside
      className={`bg-white/60 backdrop-blur-xl shadow-lg rounded-2xl p-3 min-h-screen flex flex-col justify-between border border-white/30 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div>
        <div
          className={`flex items-center gap-2 mb-10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <button
            className="rounded-lg p-2 hover:bg-white/40 transition"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <FiChevronRight size={22} />
            ) : (
              <FiChevronLeft size={22} />
            )}
          </button>
          {!collapsed && (
            <Link href="/analyst">
              <Image
                src="/equigini-logo.webp"
                alt="Logo"
                width={120}
                height={50}
                className="object-contain"
                priority
              />
            </Link>
          )}
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/analyst/dashboard" &&
                pathname.startsWith(link.href));
            const isHovered = hovered === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-3 py-2 rounded-xl transition-all flex items-center gap-3
                  ${
                    isActive || isHovered
                      ? "text-white font-semibold sidebar-gradient text-base"
                      : "text-gray-700 border-l-0 font-normal"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
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
                {!collapsed && <span className="ml-2 z-10">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto">
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
          {!collapsed && (
            <>
              <span className="text-xs text-gray-600 mb-2 text-center">
                Initiative by <br /> <strong>Pantomath Group</strong>
              </span>
              <button className="bg-primarycolor text-white rounded-lg px-4 py-1 text-xs">
                Know More
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
} 