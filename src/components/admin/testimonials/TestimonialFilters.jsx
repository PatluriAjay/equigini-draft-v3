"use client";
import Link from "next/link";

export default function TestimonialFilters({ searchValue = "", onSearch }) {
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
      {/* <button className="btn-primary">Export</button> */}
      <Link href="/admin/create-testimonial" className="btn-primary">
          + Create
        </Link>
    </div>
  );
} 