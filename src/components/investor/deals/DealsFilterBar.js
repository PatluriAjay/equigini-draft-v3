"use client";
import { FiFilter } from "react-icons/fi";
import { useState } from "react";

export default function DealsFilterBar({
  filters,
  selected,
  onSelect,
  geographies,
  selectedGeo,
  onGeoSelect,
  sort,
  onSort,
  onOpenFilters,
  onFilterChange,
  searchTerm = "",
  onSearchChange,
  dropdownOptions = {
    sectors: [],
    stages: [],
    statuses: [],
    ticketSizes: [],
  },
  loading = false,
}) {
  const [selectedFilters, setSelectedFilters] = useState({
    sector: "",
    stage: "",
    status: "",
    ticketSize: "",
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      {/* Mobile filter bar */}
      <div className="flex md:hidden w-full items-center justify-between gap-2 mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="search-input w-full max-w-[70%]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="btn-icon ml-2"
          aria-label="Open filters"
          onClick={onOpenFilters}
        >
          <FiFilter size={22} />
        </button>
      </div>
      {/* Desktop filter bar */}
      <div className="hidden md:flex flex flex-row flex-wrap items-center w-full gap-20 justify-between">
        <div className="flex-shrink-0">
          <input
            type="text"
            placeholder="Search..."
            className="search-input w-72"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12">
          <select 
            className="form-select min-w-[150px] w-auto"
            value={selectedFilters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            disabled={loading}
          >
            <option value="">All Sectors</option>
            {dropdownOptions.sectors.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className="form-select min-w-[150px] w-auto"
            value={selectedFilters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
            disabled={loading}
          >
            <option value="">All Stages</option>
            {dropdownOptions.stages.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
         
          <select 
            className="form-select min-w-[150px] w-auto"
            value={selectedFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={loading}
          >
            <option value="">All Deal Status</option>
            {dropdownOptions.statuses.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select 
            className="form-select min-w-[150px] w-auto"
            value={selectedFilters.ticketSize}
            onChange={(e) => handleFilterChange('ticketSize', e.target.value)}
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
    </>
  );
}
