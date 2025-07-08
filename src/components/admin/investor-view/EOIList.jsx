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

  const handleViewPDF = (pdfPath) => {
    if (pdfPath) {
      window.open("http://localhost:4000/" + pdfPath, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg">Loading...</div>
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
            <th className="table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {eois.length === 0 && (
            <tr><td colSpan={3} className="table-empty">No EOIs found.</td></tr>
          )}
          {eois.map((eoi, idx) => (
            <tr key={eoi._id || idx} className="table-row">
              <td className="table-td">{eoi.deal_title}</td>
              <td className="table-td">{formatDate(eoi.createdAt)}</td>
              <td className="table-td">
                {eoi.pdf_path && (
                  <button 
                    className="text-primarycolor hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPDF(eoi.pdf_path);
                    }}
                    title="View PDF"
                  >
                    <IoMdEye size={20} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 