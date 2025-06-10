import React from 'react';

export default function EngagementList({ engagements = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Deal</th>
            <th className="table-th">Action</th>
            <th className="table-th">Date</th>
            <th className="table-th">Details</th>
          </tr>
        </thead>
        <tbody>
          {engagements.length === 0 && (
            <tr><td colSpan={4} className="table-empty">No engagement history found.</td></tr>
          )}
          {engagements.map((e, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-td">{e.deal}</td>
              <td className="table-td">{e.action}</td>
              <td className="table-td">{e.date}</td>
              <td className="table-td">{e.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 