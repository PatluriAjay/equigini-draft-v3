"use client";
import { MdNotificationsActive, MdSearch } from "react-icons/md";
import { FiUser, FiLogOut, FiBookmark } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AnalystNavbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const pathname = usePathname();

  const navLinks = [
    { href: "/analyst/dashboard", label: "Dashboard" },
    { href: "/analyst/deals", label: "Deals" },
    { href: "/analyst/documents", label: "Documents" },
  ];

  // Toggle search
  const handleSearchToggle = () => setSearchOpen((v) => !v);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    }
    if (open || searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, searchOpen]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.querySelector("input")?.focus();
    }
  }, [searchOpen]);

  return (
    <header className="w-full flex items-center justify-center rounded-2xl min-h-[56px] p-5 bg-white">
      <div className="flex-1 flex items-center justify-center">
        {/* Empty for spacing */}
      </div>
      <div className="flex items-center gap-4 relative">
        {/* Nav Links with horizontal slide animation */}
        <nav
          className={`flex gap-8 items-center navbar-links ${
            searchOpen ? "navbar-links-slide-out" : "navbar-links-slide-in"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all duration-200 px-2 py-1 rounded font-medium text-base
                  ${isActive ? "text-primarycolor scale-110" : "text-gray-500"}
                  hover:text-primarycolor hover:scale-110 animate__animated animate__faster
                `}
                style={{
                  transition: "color 0.2s, transform 0.2s",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search icon and input */}
        {/* <div className="relative">
          <button
            className="bg-gray-100/80 rounded-full p-2 shadow min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors duration-200"
            onClick={handleSearchToggle}
            aria-label={searchOpen ? "Close search" : "Open search"}
            style={{ visibility: searchOpen ? "hidden" : "visible" }}
          >
            <MdSearch size={22} className="transition-transform duration-300" />
          </button>
          <div
            ref={searchRef}
            className={`absolute right-full top-1/2 -translate-y-1/2 bg-white border border-primarycolor rounded-lg shadow-sm flex items-center pl-2 navbar-search ${
              searchOpen ? "navbar-search-slide-in" : "navbar-search-slide-out"
            }`}
            style={{ zIndex: 20, width: 220 }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
              }}
              className="flex items-center w-full relative"
            >
              <input
                type="text"
                placeholder="Search..."
                className={`outline-none w-full bg-transparent py-2 pr-8 pl-2 text-sm border-none focus:ring-2 focus:ring-primarycolor focus:border-primarycolor`}
                style={{ boxShadow: "none" }}
                tabIndex={searchOpen ? 0 : -1}
                disabled={!searchOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchOpen(false);
                  }
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primarycolor"
                tabIndex={searchOpen ? 0 : -1}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label="Search"
              >
                <MdSearch size={18} />
              </button>
            </form>
          </div>
        </div> */}

        {/* Notification icon */}
        {/* <button className="bg-gray-100/80 rounded-full p-2 shadow min-h-[40px] min-w-[40px] flex items-center justify-center">
          <MdNotificationsActive size={25} />
        </button> */}

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="w-10 h-10 rounded-full bg-gray-300/80 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setOpen((v) => !v)}
            aria-label="User menu"
          >
            <span className="font-bold text-gray-700">A</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fade-in">
              <Link
                href="/analyst/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
              >
                <FiUser className="text-blue-500" />
                Profile
              </Link>
              {/* <Link
                href="/analyst/saved-deals"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
              >
                <FiBookmark className="text-blue-500" />
                Saved Deals
              </Link> */}
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 w-full text-left transition"
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
              >
                <FiLogOut className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 