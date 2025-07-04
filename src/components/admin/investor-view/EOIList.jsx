import React from 'react';
import { IoMdEye } from "react-icons/io";

const statusMap = {
  pending: 'badge bg-yellow-100 text-yellow-800',
  approved: 'badge bg-green-100 text-green-800',
  rejected: 'badge bg-red-100 text-red-800',
};

export default function EOIList({ eois = [], loading = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg">Loading EOIs...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Deal</th>
            <th className="table-th">EOI Date</th>
          </tr>
        </thead>
        <tbody>
          {eois.length === 0 && (
            <tr><td colSpan={2} className="table-empty">No EOIs found.</td></tr>
          )}
          {eois.map((eoi, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-td">{eoi.deal_title}</td>
              <td className="table-td">{formatDate(eoi.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 