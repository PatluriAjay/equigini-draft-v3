"use client";
import DealsFilterBar from "@/components/investor/deals/DealsFilterBar";
import DealsGrid from "@/components/investor/deals/DealsGrid";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SavedDealsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All Deals");
  const [selectedGeo, setSelectedGeo] = useState("India");
  const [sort, setSort] = useState("latest");
  const router = useRouter();

  // Placeholder filters
  const filterOptions = [
    "All Deals",
    "FinTech",
    "CleanTech",
    "HealthTech",
    "Early Stage",
    "Growth",
    "Pre-IPO",
  ];
  const geographies = ["India", "SEA", "Global"];

  // Placeholder saved deals
  const savedDeals = [
    {
      id: 1,
      slug: "techflow-ai",
      title: "TechFlow AI",
      stage: "Early",
      sector: "FinTech",
      status: "Closing Soon",
      summary:
        "AI-powered financial analytics platform revolutionizing investment decision-making for institutional investors across emerging markets.",
      ticketSize: "₹50L - ₹5Cr",
      irr: "25-30%",
      ndaStatus: true,
    },
    {
      id: 2,
      slug: "greenenergy-ventures",
      title: "GreenEnergy Ventures",
      stage: "Growth",
      sector: "CleanTech",
      status: "Open",
      summary:
        "Leading renewable energy solutions provider with operations across 15 countries and growing market presence.",
      ticketSize: "₹1Cr - ₹10Cr",
      irr: "20-25%",
      ndaStatus: false,
    },
    {
      id: 3,
      slug: "healthtech-solutions",
      title: "HealthTech Solutions",
      stage: "Debt",
      sector: "HealthTech",
      status: "Open",
      summary:
        "Digital health platform connecting patients with healthcare providers through innovative telemedicine solutions.",
      ticketSize: "₹25L - ₹2Cr",
      irr: "30-35%",
      ndaStatus: false,
    },
  ];

  // Filter logic
  const filteredDeals =
    selectedFilter === "All Deals"
      ? savedDeals
      : savedDeals.filter(
          (deal) =>
            deal.sector === selectedFilter || deal.stage === selectedFilter
        );

  // Handlers
  const handleOpenFilters = () => {};
  const handleView = (slug) => {
    router.push(`/investor/deals/${slug}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <div>
        <h1 className="heading-main">Saved Deals</h1>
      </div> */}
      {/* <DealsFilterBar
        filters={filterOptions}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
        geographies={geographies}
        selectedGeo={selectedGeo}
        onGeoSelect={setSelectedGeo}
        sort={sort}
        onSort={setSort}
        onOpenFilters={handleOpenFilters}
      /> */}
      <div>
        {/* <div className="heading-section mb-2">Your Saved Deals</div>
        <DealsGrid deals={filteredDeals} onView={handleView} isSavedDeals={true} /> */}

        <div className="">
          <h1 className="heading-main">Work in Progress</h1>
          <p className="p-medium">This page is currently under development.</p>
        </div>
      </div>
    </div>
  );
}
