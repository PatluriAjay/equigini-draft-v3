"use client";
import Image from "next/image";
import { FaEye } from "react-icons/fa";

export default function EOITable({ eois, onView, onAssign, onReassign }) {
  const ndaBadge = {
    Signed: "bg-green-100 text-green-700",
    Pending: "bg-red-100 text-red-700",
  };
  const statusBadge = {
    New: "bg-orange-100 text-orange-700",
    Assigned: "bg-blue-100 text-blue-700",
    Reviewed: "bg-purple-100 text-purple-700",
  };
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">Investor</th>
            <th className="table-th">Deal</th>
            <th className="table-th">Ticket Size</th>
            <th className="table-th">NDA Status</th>
            <th className="table-th">Status</th>
            <th className="table-th">Analyst</th>
            <th className="table-th">Submitted</th>
            <th className="table-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {eois.length === 0 && (
            <tr><td colSpan={8} className="table-empty">No EOIs found.</td></tr>
          )}
          {eois.map((eoi) => (
            <tr key={eoi.id} className="table-row">
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-semibold text-sm">{eoi.investor.name}</div>
                    <div className="text-xs text-gray-500">{eoi.investor.type}</div>
                  </div>
                </div>
              </td>
              <td className="table-td">
                <div className="font-semibold text-sm text-secondarycolor">{eoi.deal.title}</div>
                <div className="text-xs text-gray-500">{eoi.deal.sector} • {eoi.deal.stage}</div>
              </td>
              <td className="table-td">{eoi.ticket}</td>
              <td className="table-td">
                <span className={`badge ${ndaBadge[eoi.nda] || "bg-gray-100 text-gray-700"}`}>{eoi.nda === "Signed" ? "✔ Signed" : "✗ Pending"}</span>
              </td>
              <td className="table-td">
                <span className={`badge ${statusBadge[eoi.status] || "bg-gray-100 text-gray-700"}`}>{eoi.status}</span>
              </td>
              <td className="table-td">{eoi.analyst}</td>
              <td className="table-td">
                <div>{eoi.submitted}</div>
                <div className="text-xs text-gray-400">{eoi.submittedDate}</div>
              </td>
              <td className="table-td flex gap-4 items-center">
                <button className="btn-inline text-gray-700" title="View Details" onClick={() => onView(eoi.id)}><FaEye size={20} color="" /></button>
                {eoi.status === "New" && (
                  <button className="btn-primary btn-inline text-xs" title="Assign" onClick={() => onAssign(eoi.id)}>Assign</button>
                )}
                {eoi.status === "Assigned" && (
                  <button className="btn-secondary btn-inline text-xs" title="Reassign" onClick={() => onReassign(eoi.id)}>Reassign</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 