"use client";
import Link from "next/link";
export default function DealFilters({ searchValue = "", onSearch }) {
  return (
    <div className="flex flex-row flex-nowrap items-center w-full gap-20 justify-between">
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search..."
          className="search-input w-72"
          value={searchValue}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      {/* <div className=" hidden flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12">
        <select className="form-select min-w-[150px] w-auto">
          <option>All Status</option>
          <option>Open</option>
          <option>Closed</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        <select className="form-select min-w-[150px] w-auto">
          <option>All Sectors</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>FinTech</option>
          <option>Real Estate</option>
          <option>Manufacturing</option>
        </select>

        <input
          type="date"
          className="form-input min-w-[150px] w-auto"
          placeholder="Date From"
        />
        <input
          type="date"
          className="form-input min-w-[150px] w-auto"
          placeholder="Date To"
        />
        <button className="btn-primary flex items-center gap-1 whitespace-nowrap px-6">
          <span>Apply</span>
        </button>
      </div> */}
      {/* <button className="btn-primary">Export</button> */}
      {/* <Link href="/admin/create-deal" className="btn-primary">
          + Create
        </Link> */}
    </div>
  );
}
