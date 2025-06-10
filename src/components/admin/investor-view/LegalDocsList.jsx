import React from 'react';
import { IoMdEye } from "react-icons/io";

const statusMap = {
  signed: 'badge bg-green-100 text-green-800',
  pending: 'badge bg-yellow-100 text-yellow-800',
  archived: 'badge bg-gray-200 text-gray-600',
};

export default function LegalDocsList({ docs = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Type</th>
            <th className="table-th">Deal</th>
            <th className="table-th">Version</th>
            <th className="table-th">Status</th>
            <th className="table-th">Signed Date</th>
            <th className="table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {docs.length === 0 && (
            <tr><td colSpan={6} className="table-empty">No legal documents found.</td></tr>
          )}
          {docs.map((doc, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-td">{doc.type.toUpperCase()}</td>
              <td className="table-td">{doc.deal}</td>
              <td className="table-td">{doc.version}</td>
              <td className="table-td"><span className={[doc.status]}>{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span></td>
              <td className="table-td">{doc.signed_date || '-'}</td>
              <td className="table-td"><button className=""><IoMdEye size={20} color="" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 