"use client";
export default function DealFilters() {
  return (
    <div className="flex flex-row flex-nowrap items-center w-full gap-20 justify-between">
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search by deal title..."
          className="search-input w-72"
        />
      </div>
      <div className="flex flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12">
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
      
        <input type="date" className="form-input min-w-[150px] w-auto" placeholder="Date From" />
        <input type="date" className="form-input min-w-[150px] w-auto" placeholder="Date To" />
        <button className="btn-primary flex items-center gap-1 whitespace-nowrap px-6">
          <span>Apply</span>
        </button>
      </div>
     
      {/* <button className="btn-secondary flex items-center gap-1 whitespace-nowrap px-6"><span>Advanced Filters</span></button> */}
    </div>
  );
}
