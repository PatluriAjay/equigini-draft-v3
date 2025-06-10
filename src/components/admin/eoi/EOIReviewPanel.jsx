"use client";
import EOIStats from "./EOIStats";
import EOIFilters from "./EOIFilters";
import EOITable from "./EOITable";

export default function EOIReviewPanel() {
  // Placeholder data for now
  const stats = {};
  const eois = [
    {
      id: 1,
      investor: { name: "Rajesh Kumar", type: "HNWI", avatar: "/avatar1.png" },
      deal: { title: "TechStartup Innovation Ltd", sector: "Technology", stage: "Series A" },
      ticket: "₹2.5 Cr",
      nda: "Signed",
      status: "New",
      analyst: "Unassigned",
      submitted: "2 hours ago",
      submittedDate: "Jan 15, 2024",
    },
    {
      id: 2,
      investor: { name: "Priya Sharma", type: "Family Office", avatar: "/avatar2.png" },
      deal: { title: "Green Energy Solutions", sector: "Clean Energy", stage: "Series B" },
      ticket: "₹5 Cr",
      nda: "Signed",
      status: "Assigned",
      analyst: "John Smith",
      submitted: "1 day ago",
      submittedDate: "Jan 14, 2024",
    },
    {
      id: 3,
      investor: { name: "Michael Chen", type: "Angel Investor", avatar: "/avatar3.png" },
      deal: { title: "FinTech Revolution", sector: "Financial Services", stage: "Seed" },
      ticket: "₹75 L",
      nda: "Pending",
      status: "New",
      analyst: "Unassigned",
      submitted: "3 days ago",
      submittedDate: "Jan 12, 2024",
    },
    {
      id: 4,
      investor: { name: "Sarah Johnson", type: "HNWI", avatar: "/avatar4.png" },
      deal: { title: "Healthcare AI Platform", sector: "Healthcare", stage: "Series A" },
      ticket: "₹1 Cr",
      nda: "Signed",
      status: "New",
      analyst: "Unassigned",
      submitted: "3 days ago",
      submittedDate: "Jan 12, 2024",
    },
  ];

  // Placeholder handlers
  const onView = (id) => {};
  const onAssign = (id) => {};
  const onReassign = (id) => {};

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main mb-1">EOI Review Panel</h1>
          <p className="p-medium text-gray-500">Manage and assign Expression of Interest submissions</p>
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <button className="btn-primary">Export EOIs</button>
        </div>
      </div>
      {/* Stats */}
      <EOIStats stats={stats} />
      {/* Filters */}
      <div className="bg-white rounded-lg py-4  flex flex-col gap-4 items-end">
        <EOIFilters />
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg p-0">
        <div className="flex items-center justify-between py-4 ">
          <h2 className="heading-main">EOI Submissions</h2>
          {/* <div className="text-xs text-gray-500">Showing {eois.length} results <button className="ml-2 px-2 py-1 border rounded text-xs font-medium bg-gray-100">Sort</button></div> */}
        </div>
        <div className=" pb-2">
          <EOITable eois={eois} onView={onView} onAssign={onAssign} onReassign={onReassign} />
        </div>
      </div>
    </div>
  );
} 