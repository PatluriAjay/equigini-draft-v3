"use client";
export default function InvestorFilters({ searchTerm = "", onSearchChange }) {
  return (
    <div className="flex  items-center w-full gap-20 justify-between">
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search..."
          className="search-input w-72"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="hidden = flex-col md:flex-row  flex-nowrap gap-3 items-center  w-full sm:w-8/12">
        <select className="= form-select min-w-[150px] w-auto">
          <option>All Investor Types</option>
          <option>HNWI</option>
          <option>Angel Investor</option>
          <option>Family Office</option>
          <option>Other</option>
        </select>
        <select className=" form-select min-w-[150px] w-auto">
          <option>All Geographies</option>
          {/* <option>India</option>
          <option>US</option>
          <option>Europe</option> */}
        </select>
        <button className="btn-primary flex items-center gap-1 whitespace-nowrap px-6">
          <span>Apply</span>
        </button>
      </div>
      <div className="">
        <button className="btn-primary">Export</button>
      </div>
    </div>
  );
}
