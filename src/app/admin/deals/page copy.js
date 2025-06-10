"use client";
import Link from "next/link";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const mockDeals = [
  { id: 1, name: "Deal Alpha", value: "$10,000", status: "Active", created: "2025-06-01" },
  { id: 2, name: "Deal Beta", value: "$7,500", status: "Pending", created: "2025-05-28" },
  { id: 3, name: "Deal Gamma", value: "$12,000", status: "Closed", created: "2025-05-20" },
  { id: 4, name: "Deal Delta", value: "$5,000", status: "Active", created: "2025-05-15" },
  { id: 5, name: "Deal Epsilon", value: "$8,200", status: "Pending", created: "2025-05-10" },
  { id: 6, name: "Deal Zeta", value: "$9,100", status: "Closed", created: "2025-05-05" },
  { id: 7, name: "Deal Eta", value: "$6,300", status: "Active", created: "2025-05-01" },
  { id: 8, name: "Deal Theta", value: "$11,400", status: "Pending", created: "2025-04-28" },
  { id: 9, name: "Deal Iota", value: "$13,000", status: "Closed", created: "2025-04-20" },
  { id: 10, name: "Deal Kappa", value: "$4,800", status: "Active", created: "2025-04-15" },
];

const PAGE_SIZE = 5;

export default function DealsPage() {
  const [page, setPage] = useState(1);
  const deals = mockDeals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(mockDeals.length / PAGE_SIZE);

  return (
    <div className="flex gap-8 w-full ">
    
      <div className="flex-1 rounded-2xl flex flex-col" >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="heading-main">Deals</h2>
          <Link className="btn-primary" href="/admin/create-deal">Create Deal</Link>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="table-main">
            <thead className="table-header-row">
              <tr>
                <th className="table-th rounded-tl-xl">Name</th>
                <th className="table-th">Value</th>
                <th className="table-th">Status</th>
                <th className="table-th">Created</th>
                <th className="table-th rounded-tr-xl text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="table-row">
                  <td className="table-td font-medium text-gray-800">{deal.name}</td>
                  <td className="table-td">{deal.value}</td>
                  <td className="table-td">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${deal.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                      ${deal.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${deal.status === 'Closed' ? 'bg-gray-200 text-gray-600' : ''}
                    `}>{deal.status}</span>
                  </td>
                  <td className="table-td">{deal.created}</td>
                  <td className="table-td text-center">
                    <button className="inline-flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-full p-2 mr-2 transition"><FiEdit2 size={16} /></button>
                    <button className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty">No deals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-500 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      
      
    </div>
  );
}
