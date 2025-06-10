"use client";
import ProfileHeader from "@/components/admin/investor-view/ProfileHeader";
import ProfileTabs from "@/components/admin/investor-view/ProfileTabs";
import { useSearchParams } from "next/navigation";

export default function InvestorDetailPage({ params }) {
  const searchParams = useSearchParams();
  const source = searchParams.get("source") || "management"; // Default to management view

  // Mock data for now
  const investor = {
    full_name: "Michael Thompson",
    email: "michael.thompson@email.com",
    phone: "+1 (555) 123-4567",
    status: "pending_review",
    investor_type: "HNWI",
    geography: "North America",
    ticket_range: { min: 100000, max: 1000000 },
    preferred_sectors: ["Technology", "Healthcare", "FinTech"],
    pan_number: "ABCDE1234F",
    nda_signed: false,
    nda_signed_at: null,
    role: "investor",
    created_at: "2024-12-15",
    verified_at: null,
    last_login_at: "2024-12-16T14:30:00",
    address_line1: "123 Investment Street",
    address_line2: "Suite 456",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "United States",
    crm_status_id: "CRM-INV-001",
  };

  return (
    <div className="mx-auto">
      <ProfileHeader investor={investor} source={source} />
      <ProfileTabs investor={investor} source={source} />
    </div>
  );
}
