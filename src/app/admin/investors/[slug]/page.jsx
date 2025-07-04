"use client";
import ProfileHeader from "@/components/admin/investor-view/ProfileHeader";
import ProfileTabs from "@/components/admin/investor-view/ProfileTabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getInvestorById } from "@/services/api";

// Function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default function InvestorDetailPage({ params }) {
  const searchParams = useSearchParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        setLoading(true);
        
        // Validate ObjectId format
        if (!isValidObjectId(params.slug)) {
          throw new Error("Invalid investor ID format");
        }
        
        const response = await getInvestorById(params.slug);
        setInvestor(response.result_info);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchInvestor();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Investor not found</div>
      </div>
    );
  }

  // Determine source based on is_approved field
  const source = investor.is_approved ? "management" : "approval";

  // Determine breadcrumb navigation based on source
  const getBreadcrumbLinks = () => {
    switch (source) {
      case "approval":
        return {
          backLink: "/admin/investor-approval",
          backText: "Investor Approval Queue"
        };
      case "management":
      default:
        return {
          backLink: "/admin/investors",
          backText: "Investor Management"
        };
    }
  };

  const { backLink, backText } = getBreadcrumbLinks();

  return (
    <div className="mx-auto">
      <div>
        <nav className="flex items-center space-x-2 text-gray-600 mb-4">
          <Link href="/admin" className="hover:underline">Home</Link>
          <span className="text-gray-400">{">"}</span>
          <Link href={backLink} className="hover:underline">{backText}</Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold">{investor.full_name}</span>
        </nav>
      </div>
      {/* Profile Header and Tabs */}
      <ProfileHeader investor={investor} source={source} />
      <ProfileTabs investor={investor} source={source} />
    </div>
  );
}
