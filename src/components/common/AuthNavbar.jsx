"use client";
import Link from "next/link";
import Image from "next/image";

export default function AuthNavbar({ rightText = "Already have an account?", rightLink = "/login", rightLinkText = "Sign In" }) {
  return (
    <nav className="w-full flex items-center justify-between px-2 py-4 border-b border-bordercolor bg-white h-[10vh] ">
      <div className="flex items-center gap-2">
          <Image
            src="/equigini-logo.webp"
            alt="Equigini Logo"
            width={150}
            height={80}
            priority
          />
      </div>
      <div className="flex  gap-2 flex-col sm:flex-row sm:gap-4 items-end sm:items-center" >
        <span className="text-sm text-secondary3">
          {rightText}
        </span>
        <Link
          href={rightLink}
          className="text-primarycolor font-medium hover:underline text-sm"
        >
          {rightLinkText}
        </Link>
      </div>
    </nav>
  );
}
