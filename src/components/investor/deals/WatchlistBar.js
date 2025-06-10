export default function WatchlistBar({ watchlist, onViewAll }) {
  // watchlist = [{ id, title, stage, sector, ticketSize }]
  return (
    <div className="mb-6">
      <div className="heading-section mb-2">Your Watchlist ({watchlist.length} deals)</div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {watchlist.map((deal) => (
          <div key={deal.id} className="card-bordered min-w-[220px] flex flex-col justify-between">
            <div>
              <div className="font-semibold text-sm mb-1">{deal.title}</div>
              <div className="text-xs text-secondary3 mb-1">{deal.stage} • {deal.sector}</div>
              <div className="text-xs text-secondary3 mb-2">{deal.ticketSize}</div>
            </div>
            <a href={`/investor/deals/${deal.id}`} className="btn-secondary text-center mt-auto">View</a>
          </div>
        ))}
        <button
          className="card-bordered min-w-[220px] flex flex-col items-center justify-center border-dashed border-2 text-secondary3 hover:bg-gray-50 transition"
          onClick={onViewAll}
          style={{ borderStyle: 'dashed' }}
        >
          View All Watchlist
        </button>
      </div>
    </div>
  );
} 