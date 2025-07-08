"use client";
import { FiEdit2, FiArchive } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function DealTable({ deals, onEdit, onDelete, onStatusChange }) {

  return (
    <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">DEAL TITLE</th>
            <th className="table-th">SECTOR</th>
            <th className="table-th">STAGE</th>
            <th className="table-th">TICKET SIZE</th>
            <th className="table-th">STATUS</th>
            <th className="table-th">PRIORITY</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 && (
            <tr><td colSpan={7} className="table-empty">No deals found.</td></tr>
          )}
          {deals.map((deal) => (
            <tr key={deal._id} className="table-row hover:bg-white ">
              <td className="table-td whitespace-nowrap font-semibold text-sm">{deal.deal_title || "-"}</td>
              <td className="table-td whitespace-nowrap">{deal.sector || "-"}</td>
              <td className="table-td whitespace-nowrap">{deal.stage || "-"}</td>
              <td className="table-td whitespace-nowrap">{deal.ticket_size_range || "-"}</td>
              <td className="table-td whitespace-nowrap">
                <span className={` `}>{deal.status || "-"}</span>
              </td>
              <td className="table-td">
                <span className={` `}>{deal.deal_priority || "-"}</span>
              </td>
              <td className="table-td flex gap-3 items-center">
                <button className=" transition-colors" title="Edit" onClick={() => onEdit(deal._id)}>
                  <FaEdit size={20} />
                </button>
                <button className=" transition-colors" title="Delete" onClick={() => onDelete(deal._id)}>
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}