"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdOutlineWork, MdBookmarkBorder, MdPersonOutline } from "react-icons/md";

const navLinks = [
  { href: "/investor/dashboard", label: "Dashboard", icon: <MdDashboard size={24} /> },
  { href: "/investor/deals", label: "Deals", icon: <MdOutlineWork size={24} /> },
  { href: "/investor/saved-deals", label: "Watchlist", icon: <MdBookmarkBorder size={24} /> },
  { href: "/investor/profile", label: "Profile", icon: <MdPersonOutline size={24} /> },
];

export default function InvestorFooterMenu() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-bordercolor shadow md:hidden ">
      <div className="flex justify-between items-center px-4 py-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center flex-1 text-xs ${isActive ? "text-primarycolor" : "text-secondary3"}`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              {link.icon}
              <span className="mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
