import React from 'react';

export default function AccessLogsList({ logs = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead className="table-header-row">
          <tr>
            <th className="table-th">Document</th>
            <th className="table-th">Type</th>
            <th className="table-th">Action</th>
            <th className="table-th">Timestamp</th>
            <th className="table-th">IP</th>
            <th className="table-th">NDA Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td colSpan={6} className="table-empty">No access logs found.</td></tr>
          )}
          {logs.map((log, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-td">{log.document}</td>
              <td className="table-td">{log.type}</td>
              <td className="table-td">{log.action}</td>
              <td className="table-td">{log.timestamp}</td>
              <td className="table-td">{log.ip}</td>
              <td className="table-td"><span >{log.nda_status ? 'Signed' : 'Not Signed'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 