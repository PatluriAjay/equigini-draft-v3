import React from 'react';
import { IoMdEye } from "react-icons/io";

const statusMap = {
  signed: 'badge bg-green-100 text-green-800',
  pending: 'badge bg-yellow-100 text-yellow-800',
  archived: 'badge bg-gray-200 text-gray-600',
};

export default function LegalDocsList({ ndaAgreements = [] }) {
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

  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Deal Name</th>
            <th className="table-th">Signed Date</th>
            <th className="table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {ndaAgreements.length === 0 && (
            <tr><td colSpan={3} className="table-empty">No NDA agreements found.</td></tr>
          )}
          {ndaAgreements.map((nda, idx) => (
            <tr key={nda._id || idx} className="table-row">
              <td className="table-td">{nda.deal_name}</td>
              <td className="table-td">{formatDate(nda.signed_date)}</td>
              <td className="table-td">
                {nda.pdf_path && (
                  <button 
                    className="text-primarycolor hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPDF(nda.pdf_path);
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