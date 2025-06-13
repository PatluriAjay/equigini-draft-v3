"use client";
import InvestorStats from "./InvestorStats";
import InvestorFilters from "./InvestorFilters";
import InvestorTable from "./InvestorTable";

export default function InvestorListPage() {
  // Placeholder data and handlers for integration readiness
  const investors = [];
  const stats = {};
  const onApprove = () => {};
  const onReject = () => {};
  const onDeactivate = () => {};

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main mb-1">Investor Management</h1>
          {/* <p className="p-medium text-gray-500">Comprehensive oversight of all registered investor profiles and verification status</p> */}
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg py-4 mb-6  flex flex-col gap-4">
        <InvestorFilters />
      </div>
      {/* Stats */}
      {/* <InvestorStats stats={stats} /> */}
      {/* Directory Card */}
      <div className="bg-white rounded-lg p-0">
        <div className=" pb-2">
          <InvestorTable investors={investors} onApprove={onApprove} onReject={onReject} onDeactivate={onDeactivate} />
        </div>
      </div>
    </div>
  );
}
