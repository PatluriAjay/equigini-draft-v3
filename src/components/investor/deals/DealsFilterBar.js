import { FiFilter } from 'react-icons/fi';

export default function DealsFilterBar({
  filters, selected, onSelect, geographies, selectedGeo, onGeoSelect, sort, onSort, onOpenFilters
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-medium text-secondary text-sm mr-2">Filter by:</span>
        {filters.map((filter) => (
          <button
            key={filter}
            className={filter === selected ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onSelect(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
      {/* <div className="flex flex-wrap gap-2 items-center">
        {geographies.map((geo) => (
          <button
            key={geo}
            className={geo === selectedGeo ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onGeoSelect(geo)}
            type="button"
          >
            {geo}
          </button>
        ))}
      </div> */}
      <div className="flex items-center gap-2 ml-auto">
        <select
          className="form-select min-w-[120px]"
          value={sort}
          onChange={e => onSort(e.target.value)}
        >
          <option value="latest">Sort by: Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>
        <button className="btn-outline flex items-center gap-1" onClick={onOpenFilters} type="button">
          <FiFilter /> Filters
        </button>
      </div>
    </div>
  );
} 