import { FiFilter } from "react-icons/fi";

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
}) {
  return (
    
    <div className=" hidden md:flex flex flex-row flex-wrap items-center w-full gap-20 justify-between">
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search by deal title..."
          className="search-input w-72"
        />
      </div>
      <div className="flex flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12">
        <select className="form-select min-w-[150px] w-auto">
          <option>All Sectors</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>FinTech</option>
          <option>Real Estate</option>
          <option>Manufacturing</option>
        </select>

        <select className="form-select min-w-[150px] w-auto">
          <option>All Stages</option>
          <option>Growth </option>
          <option>Early Stage </option>
        </select>
        {/* geographies */}
        <select className="form-select min-w-[150px] w-auto">
          <option>All Geographies</option>
          <option>India</option>
          <option>Global</option>
        </select>
        <select className="form-select min-w-[150px] w-auto">
          <option>All Deal Status</option>
          <option>Open</option>
          <option>Closed</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        {/* ticket size */}
        <select className="form-select min-w-[150px] w-auto">
          <option>All Ticket Sizes</option>
          <option>₹50L - ₹5Cr</option>
          <option>₹25L - ₹2Cr</option>
          <option>₹1Cr - ₹10Cr</option>
        </select>
      </div>
    </div>
  );
}
