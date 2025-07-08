"use client";
import StatsCards from "@/components/investor/dashboard/StatsCards";
import RecentActivity from "@/components/investor/dashboard/RecentActivity";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import DealsGrid from "@/components/investor/deals/DealsGrid";
import SavedDealsGrid from "@/components/investor/deals/SavedDealsGrid";
import HorizontalScrollDeals from "@/components/investor/deals/HorizontalScrollDeals";
import { useEffect, useState } from "react";
import { getInvestorDashboard } from "@/services/api";
import Loader from "@/components/common/Loader";

export default function InvestorDashboardPage() {
  const [dashboardData, setDashboardData] = useState({ saved_deals: [], latest_deals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = localStorage.getItem('user');
        let investorId = null;
        if (userData) {
          const user = JSON.parse(userData);
          investorId = user._id || user.id;
        }
        if (!investorId) throw new Error("User not authenticated");
        const res = await getInvestorDashboard(investorId);
        if (res.status === "S") {
          setDashboardData({
            saved_deals: res.result_info.saved_deals || [],
            latest_deals: res.result_info.latest_deals || []
          });
        } else {
          setError(res.error_info || "Failed to load dashboard data");
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Placeholder stats
  const stats = {
    activeDeals: 24,
    watchlist: 8,
    invested: 3,
    ndasSigned: 12,
  };
  // Placeholder activities
  const activities = [
    {
      text: "Viewed TechFlow AI Series A documents",
      type: "viewed",
      time: "2 hours ago",
    },
    {
      text: "Added GreenEnergy Ventures to watchlist",
      type: "added",
      time: "1 day ago",
    },
    {
      text: "Signed NDA for FinTech Solutions",
      type: "signed",
      time: "3 days ago",
    },
  ];

  if (loading) return <Loader text="Loading..." />;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div>
        <h1 className="heading-main">Welcome back, Sarah</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="w-full ">
          <StatsCards stats={stats} />
        </div>
        {/* <div className="w-full md:w-1/2 min-w-[260px]">
          <RecentActivity activities={activities} />
        </div> */}
      </div>
      <div>
        <div className="mb-4 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-section mb-2">My Saved Deals</h2>
            <Link
              href="/investor/saved-deals"
              className="flex items-center gap-1 text-primarycolor font-medium text-sm hover:underline btn-link"
            >
              View All <FaArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="block md:hidden">
            <HorizontalScrollDeals deals={dashboardData.saved_deals} maxDeals={3} layout="compact" />
          </div>
          <div className="hidden md:block">
            <SavedDealsGrid deals={dashboardData.saved_deals} maxDeals={3} layout="compact" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="heading-main mb-2">Latest Deals</div>
          <Link
            href="/investor/deals"
            className="flex items-center gap-1 text-primarycolor font-medium text-sm hover:underline btn-link"
          >
            View All <FaArrowRight size={14} />
          </Link>
        </div>
        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="block md:hidden">
          <HorizontalScrollDeals deals={dashboardData.latest_deals} maxDeals={4} />
        </div>
        <div className="hidden md:block">
          <DealsGrid deals={dashboardData.latest_deals} maxDeals={4} />
        </div>
      </div>
    </div>
  );
}
