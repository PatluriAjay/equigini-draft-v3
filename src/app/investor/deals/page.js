"use client";
import DealsFilterBar from "@/components/investor/deals/DealsFilterBar";
import DealsGrid from "@/components/investor/deals/DealsGrid";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllSectors, getAllStages, getAllStatuses, getAllTicketSizes } from "@/services/api";

export default function InvestorDealsPage() {
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
  const [selectedFilter, setSelectedFilter] = useState("All Deals");
  const geographies = ["India", "SEA", "Global"];
  const [selectedGeo, setSelectedGeo] = useState("India");
  const [sort, setSort] = useState("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sector: "",
    stage: "",
    status: "",
    ticketSize: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState({
    sectors: [],
    stages: [],
    statuses: [],
    ticketSizes: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [sectorsRes, stagesRes, statusesRes, ticketSizesRes] = await Promise.all([
          getAllSectors(),
          getAllStages(),
          getAllStatuses(),
          getAllTicketSizes(),
        ]);

        setDropdownOptions({
          sectors: sectorsRes.status === "S" ? sectorsRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          stages: stagesRes.status === "S" ? stagesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          statuses: statusesRes.status === "S" ? statusesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          ticketSizes: ticketSizesRes.status === "S" ? ticketSizesRes.result_info.map(t => ({ 
            value: t._id, 
            label: `${t.ticket_min || ''} - ${t.ticket_max || ''}` 
          })) : [],
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Handlers (integration-ready)
  const handleOpenFilters = () => setShowMobileFilters(true);
  const handleCloseFilters = () => setShowMobileFilters(false);
  const handleVerify = (id) => {};
  const handleView = (slug) => {
    router.push(`/investor/deals/${slug}`);
  };
  const handleViewAllWatchlist = () => {};

  // Handle filter changes from DealsFilterBar
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log("Active filters:", filters);
  };

  // Handle search term changes
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    console.log("Search term:", term);
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <h1 className="heading-main">Investment Opportunities</h1>
      </div>
      <DealsFilterBar
        filters={filterOptions}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
        geographies={geographies}
        selectedGeo={selectedGeo}
        onGeoSelect={setSelectedGeo}
        sort={sort}
        onSort={setSort}
        onOpenFilters={handleOpenFilters}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        dropdownOptions={dropdownOptions}
        loading={loading}
      />
      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-2 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-primarycolor text-xl"
              onClick={handleCloseFilters}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">Filters</h2>
            
            {/* Filter Options */}
            <div className="flex flex-col gap-4">
              {/* Sector Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                <select
                  className="form-select w-full"
                  value={activeFilters.sector}
                  onChange={(e) => handleFilterChange({ ...activeFilters, sector: e.target.value })}
                  disabled={loading}
                >
                  <option value="">All Sectors</option>
                  {dropdownOptions.sectors.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  className="form-select w-full"
                  value={activeFilters.stage}
                  onChange={(e) => handleFilterChange({ ...activeFilters, stage: e.target.value })}
                  disabled={loading}
                >
                  <option value="">All Stages</option>
                  {dropdownOptions.stages.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ticket Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Size
                </label>
                <select
                  className="form-select w-full"
                  value={activeFilters.ticketSize}
                  onChange={(e) => handleFilterChange({ ...activeFilters, ticketSize: e.target.value })}
                  disabled={loading}
                >
                  <option value="">All Ticket Sizes</option>
                  {dropdownOptions.ticketSizes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                className="btn-secondary w-1/2"
                onClick={() => {
                  handleFilterChange({
                    sector: "",
                    stage: "",
                    status: "",
                    ticketSize: "",
                  });
                  handleSearchChange("");
                  handleCloseFilters();
                }}
              >
                Clear All
              </button>
              <button
                className="btn-primary w-1/2"
                onClick={handleCloseFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="">
        <DealsGrid 
          onView={handleView} 
          filters={activeFilters}
          searchTerm={searchTerm}
          dropdownOptions={dropdownOptions}
        />
      </div>
    </div>
  );
}
