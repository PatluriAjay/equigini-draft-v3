"use client";
export default function EOIFilters() {
  return (
    <div className="flex flex-row flex-nowrap items-center w-full gap-20 justify-between">
      {/* Search Section */}
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search by name, email"
          className="search-input w-72"
        />
      </div>

      {/* Filters Section */}
      <div className="flex flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12">
        <select className="form-select min-w-[120px] w-auto">
          <option>All Status</option>
          <option>New</option>
          <option>Assigned</option>
          <option>Reviewed</option>
        </select>
        <select className="form-select min-w-[120px] w-auto">
          <option>All Deals</option>
          <option>TechStartup Innovation Ltd</option>
          <option>Green Energy Solutions</option>
          <option>FinTech Revolution</option>
          <option>Healthcare AI Platform</option>
        </select>
        <select className="form-select min-w-[120px] w-auto">
          <option>All Analysts</option>
          <option>Unassigned</option>
          <option>John Smith</option>
        </select>
        <input type="date" className="form-input min-w-[120px] w-auto" placeholder="Date Range" />
        <button className="btn-primary flex items-center gap-1 whitespace-nowrap px-4"><span>Apply</span></button>
      </div>
    </div>
  );
} 