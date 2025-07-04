"use client";
import InvestorNavbar from "@/components/investor/Navbar";
import InvestorFooterMenu from "@/components/investor/InvestorFooterMenu";
import InvestorFooter from "@/components/investor/InvestorFooter";

export default function InvestorLayout({ children }) {
  /**
   * @param {{ children: React.ReactNode }} props
   */
  // const navbarPadding = "pt-[90px]";

  return (
    <div className="min-h-screen bg-bodybg flex flex-col">
      {/* Navbar fixed at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <InvestorNavbar />
      </div>
      {/* Main content area with scroll, padding for navbar/footer */}
      <div
        className={`flex-1 pt-[14vh] overflow-y-auto container mx-auto px-6 `}
        style={{ minHeight: 0 }}
      >
        <main className="container mx-auto">{children}</main>
      </div>
      <div className="hidden md:block w-full">
        <InvestorFooter />
      </div>
      <div className="block md:hidden w-full mb-16">
        <InvestorFooterMenu />
      </div>
    </div>
  );
}
