import React from "react";

export default function DealStatusPanel({ status, metrics, checklist, recentChanges }) {
  return (
    <aside className=" mb-6 w-full md:w-80 lg:w-96 flex flex-col gap-6">
      <div>
        <h3 className="heading-section mb-2">Deal Status</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
        </div>
        <div className="p-small text-gray-500">Current Status</div>
      </div>
      <div>
        <h3 className="heading-section mb-2">Engagement Metrics</h3>
        <ul className="p-small text-gray-700 space-y-1">
          <li>Total Views: <span className="font-bold-custom">{metrics.views}</span></li>
          <li>Document Downloads: <span className="font-bold-custom">{metrics.downloads}</span></li>
          <li>EOIs Received: <span className="font-bold-custom">{metrics.eois}</span></li>
          <li>Watchlisted: <span className="font-bold-custom">{metrics.watchlisted}</span></li>
        </ul>
      </div>
      <div>
        <h3 className="heading-section mb-2">Publishing Checklist</h3>
        <ul className="space-y-1">
          {checklist.map((item, idx) => (
            <li key={idx} className={`flex items-center gap-2 p-small ${item.done ? 'text-green-700' : 'text-gray-400'}`}>
              <span className={`w-3 h-3 rounded-full ${item.done ? 'bg-green-400' : 'bg-gray-300'} inline-block`}></span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="heading-section mb-2">Recent Changes</h3>
        <ul className="p-small text-gray-700 space-y-1">
          {recentChanges.map((change, idx) => (
            <li key={idx}>{change}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 