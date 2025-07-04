import Image from "next/image";
import Link from "next/link";

export default function InvestorFooter() {
  return (
    <footer className="w-full bg-white border-t border-bordercolor py-4 px-6 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm">
      {/* Left side: Logo and copyright */}
      <div className="flex items-center mb-2 md:mb-0">
        <Image src="/equigini-logo.webp" alt="Pantomath Group Logo" width={120} height={60} className="mr-2" />
        <span className="text-secondary3">Copyright © 2025 Pantomath Group</span>
      </div>
      {/* Right side: Links */}
      <div className="flex flex-wrap gap-4 items-center">
        <Link href="/investor/privacy-policy" className="text-primarycolor hover:underline">Privacy Policy</Link>
        <Link href="/investor/disclaimer" className="text-primarycolor hover:underline">Disclaimer</Link>
        <Link href="/investor/terms-and-conditions" className="text-primarycolor hover:underline">Terms & Conditions</Link>
      </div>
    </footer>
  );
}
