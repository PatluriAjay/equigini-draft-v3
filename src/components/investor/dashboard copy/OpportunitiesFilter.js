export default function OpportunitiesFilter({ filters, selected, onSelect }) {
  // filters = ["All", "FinTech", "CleanTech", ...]
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className={
            filter === selected
              ? 'btn-primary'
              : 'btn-secondary'
          }
          onClick={() => onSelect(filter)}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
} 