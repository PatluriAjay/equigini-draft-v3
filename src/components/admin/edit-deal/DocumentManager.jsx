import React, { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

const defaultTeaserDocs = [
  { id: 1, name: "Company Overview.pdf", size: "2.3 MB", uploadedAt: "Dec 10, 2024" },
];
const defaultCollateralDocs = [
  { id: 2, name: "Financial Projections.xlsx", size: "1.8 MB", uploadedAt: "Dec 8, 2024" },
  { id: 3, name: "Investor Deck.pptx", size: "5.2 MB", uploadedAt: "Dec 5, 2024" },
];

export default function DocumentManager({ teaserDocs, collateralDocs, onTeaserUpload, onCollateralUpload, onDownload, onDelete }) {
  const teaserInputRef = useRef();
  const collateralInputRef = useRef();
  const teasers = teaserDocs && teaserDocs.length > 0 ? teaserDocs : defaultTeaserDocs;
  const collaterals = collateralDocs && collateralDocs.length > 0 ? collateralDocs : defaultCollateralDocs;

  // Local upload handler for demo
  const handleTeaserUpload = e => {
    if (onTeaserUpload) return onTeaserUpload(e);
    // fallback: show file in list (demo only)
    // ...
  };
  const handleCollateralUpload = e => {
    if (onCollateralUpload) return onCollateralUpload(e);
    // fallback: show file in list (demo only)
    // ...
  };

  return (
    <section className="mb-6">
      <h2 className="heading-main mb-4">Document Management</h2>
      <div className="mb-6">
        <h3 className="subheading mb-2">Teaser Documents (Public Access)</h3>
        <div className="overflow-x-auto">
          <table className="table-main mb-2">
            <thead className="table-header-row">
              <tr>
                <th className="table-th">File Name</th>
                <th className="table-th">Size</th>
                <th className="table-th">Uploaded</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teasers.length === 0 ? (
                <tr><td colSpan={4} className="table-empty">No teaser documents uploaded.</td></tr>
              ) : (
                teasers.map(doc => (
                  <tr key={doc.id} className="table-row">
                    <td className="table-td">{doc.name}</td>
                    <td className="table-td">{doc.size}</td>
                    <td className="table-td">{doc.uploadedAt}</td>
                    <td className="table-td flex gap-2">
                      <button className="btn-inline text-primarycolor" onClick={() => onDownload && onDownload(doc, 'teaser')}><FaDownload size={20} color="" /></button>
                      <button className="btn-inline text-gray-700" onClick={() => onDelete && onDelete(doc, 'teaser')}><MdDelete size={20} color="red" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center border-2 border-dashed border-bordercolor rounded-lg p-4 bg-bodybg4 mt-2">
          <span className="p-small mb-2">Drag and drop teaser documents here</span>
          <input type="file" className="hidden" id="teaser-upload" ref={teaserInputRef} onChange={handleTeaserUpload} multiple />
          <label htmlFor="teaser-upload" className="btn-secondary cursor-pointer">Browse files</label>
        </div>
      </div>
      <div>
        <h3 className="subheading mb-2">Collateral Documents (NDA Required)</h3>
        <div className="overflow-x-auto">
          <table className="table-main mb-2">
            <thead className="table-header-row">
              <tr>
                <th className="table-th">File Name</th>
                <th className="table-th">Size</th>
                <th className="table-th">Uploaded</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaterals.length === 0 ? (
                <tr><td colSpan={4} className="table-empty">No collateral documents uploaded.</td></tr>
              ) : (
                collaterals.map(doc => (
                  <tr key={doc.id} className="table-row">
                    <td className="table-td">{doc.name}</td>
                    <td className="table-td">{doc.size}</td>
                    <td className="table-td">{doc.uploadedAt}</td>
                    <td className="table-td flex gap-2">
                      <button className=" btn-inline text-primarycolor" onClick={() => onDownload && onDownload(doc, 'collateral')}><FaDownload size={20} color="" /></button>
                      <button className="btn-inline text-gray-700" onClick={() => onDelete && onDelete(doc, 'collateral')}><MdDelete size={20} color="red" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center border-2 border-dashed border-bordercolor rounded-lg p-4 bg-bodybg4 mt-2">
          <span className="p-small mb-2">Drag and drop confidential documents here</span>
          <input type="file" className="hidden" id="collateral-upload" ref={collateralInputRef} onChange={handleCollateralUpload} multiple />
          <label htmlFor="collateral-upload" className="btn-secondary cursor-pointer">Browse files</label>
        </div>
      </div>
    </section>
  );
} 