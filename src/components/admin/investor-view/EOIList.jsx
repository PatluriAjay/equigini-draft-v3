import React from 'react';
import { IoMdEye } from "react-icons/io";

const statusMap = {
  pending: 'badge bg-yellow-100 text-yellow-800',
  approved: 'badge bg-green-100 text-green-800',
  rejected: 'badge bg-red-100 text-red-800',
};

export default function EOIList({ eois = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Deal</th>
            <th className="table-th">Date</th>
            <th className="table-th">Status</th>
            <th className="table-th">Amount</th>
            <th className="table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {eois.length === 0 && (
            <tr><td colSpan={5} className="table-empty">No EOIs found.</td></tr>
          )}
          {eois.map((eoi, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-td">{eoi.deal}</td>
              <td className="table-td">{eoi.date}</td>
              <td className="table-td">{eoi.status.charAt(0).toUpperCase() + eoi.status.slice(1)}</td>
              <td className="table-td">₹{eoi.amount.toLocaleString('en-IN')}</td>
              <td className="table-td"><button className=""><IoMdEye size={20} color="" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 