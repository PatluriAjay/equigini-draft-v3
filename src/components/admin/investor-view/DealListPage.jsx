"use client";
import DealFilters from "./DealFilters";
import DealStats from "./DealStats";
import DealTable from "./DealTable";
import Link from "next/link";
import { useState } from "react";

export default function DealListPage() {
  // Placeholder data and handlers for integration readiness
  const [deals, setDeals] = useState([
    {
      id: 1,
      title: "TechStartup Innovation Ltd",
      sector: "Technology",
      stage: "Series A",
      ticket: "₹50L - ₹5Cr",
      status: "Open",
      priority: true,
      created: "2024-12-15",
      updated: "2024-12-15",
    },
    {
      id: 2,
      title: "HealthTech Solutions",
      sector: "Healthcare",
      stage: "Series B",
      ticket: "₹2Cr - ₹10Cr",
      status: "Open",
      priority: false,
      created: "2024-12-14",
      updated: "2024-12-14",
    },
    {
      id: 3,
      title: "FinTech Revolution",
      sector: "FinTech",
      stage: "Series A",
      ticket: "₹1Cr - ₹8Cr",
      status: "Closed",
      priority: false,
      created: "2024-12-12",
      updated: "2024-12-12",
    },
    {
      id: 4,
      title: "PropTech Innovations",
      sector: "Real Estate",
      stage: "Seed",
      ticket: "₹25L - ₹2Cr",
      status: "Draft",
      priority: false,
      created: "2024-12-13",
      updated: "2024-12-13",
    },
    {
      id: 5,
      title: "Manufacturing Excellence",
      sector: "Manufacturing",
      stage: "Growth",
      ticket: "₹5Cr - ₹25Cr",
      status: "Open",
      priority: false,
      created: "2024-12-10",
      updated: "2024-12-10",
    },
  ]);

  // Placeholder for stats
  const stats = {};

  // Placeholder handlers
  const onEdit = (id) => {};
  const onArchive = (id) => {};
  const onStatusChange = (id, status) => {};

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main mb-1">Deal Management</h1>
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          {/* <span className="bg-white rounded px-3 py-1 text-xs font-medium border border-gray-200">Total Deals: <span className="font-bold">{deals.length}</span></span> */}
          {/* <button className="btn-secondary">Export List</button> */}
          <Link href="/admin/create-deal" className="btn-primary">+ Create New Deal</Link>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg py-4 flex flex-col gap-4 items-end">
        <DealFilters />
      </div>
      {/* Stats */}
      {/* <DealStats stats={stats} /> */}
      {/* Directory Card */}
      <div className="bg-white rounded-lg p-0">
        <div className="flex items-center justify-between py-6 ">
          {/* <h2 className="font-semibold text-lg">Deal Directory</h2> */}
        </div>
        <div className=" pb-2">
          <DealTable deals={deals} onEdit={onEdit} onArchive={onArchive} onStatusChange={onStatusChange} />
        </div>
      </div>
    </div>
  );
} 