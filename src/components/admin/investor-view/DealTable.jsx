"use client";
import { FiEdit2, FiArchive } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function DealTable({ deals, onEdit, onArchive, onStatusChange }) {
  // Badge color mapping
  const statusBadge = {
    Open: "",
    Closed: "",
    Draft: "",
    Archived: "",
  };
  const priorityBadge = {
    true: "",
    false: "",
  };
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">DEAL TITLE</th>
            <th className="table-th">SECTOR</th>
            <th className="table-th">STAGE</th>
            <th className="table-th">TICKET SIZE</th>
            <th className="table-th">STATUS</th>
            <th className="table-th">PRIORITY</th>
            {/* <th className="table-th">CREATED</th>
            <th className="table-th">UPDATED</th> */}
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 && (
            <tr><td colSpan={9} className="table-empty">No deals found.</td></tr>
          )}
          {deals.map((deal) => (
            <tr key={deal.id} className="table-row hover:bg-white ">
              <td className="table-td font-semibold text-sm">{deal.title}</td>
              <td className="table-td">{deal.sector}</td>
              <td className="table-td">{deal.stage}</td>
              <td className="table-td">{deal.ticket}</td>
              <td className="table-td">
                <span className={` `}>{deal.status}</span>
              </td>
              <td className="table-td">
                <span className={` `}>{deal.priority ? "Yes" : "No"}</span>
              </td>
              {/* <td className="table-td">{deal.created}</td>
              <td className="table-td">{deal.updated}</td> */}
              <td className="table-td flex gap-3 items-center">
                <button className="" title="Edit" ><FaEdit size={20} color="" /></button>
                <button className="" title="Delete"><MdDelete  size={20} color="" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 