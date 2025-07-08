"use client";
import React, { useState, useEffect } from "react";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import { getAllEOIs } from "../../../services/api";
import { FaEye } from "react-icons/fa";

const mockAnalysts = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Wilson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "David Miller" },
];

export default function EOIReviewPanel() {
  const [eois, setEois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEoi, setSelectedEoi] = useState(null);
  const [selectedAnalyst, setSelectedAnalyst] = useState("");
  const [comments, setComments] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch EOIs on component mount
  useEffect(() => {
    fetchEOIs();
  }, []);

  const fetchEOIs = async () => {
    try {
      setLoading(true);
      const response = await getAllEOIs();
      if (response.result_info) {
        setEois(response.result_info);
      }
    } catch (error) {
      console.error("Error fetching EOIs:", error);
      setErrorMessage("Failed to fetch EOIs. Please try again.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  function filteredEois() {
    let data = [...eois];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (eoi) =>
          eoi.investor_name.toLowerCase().includes(s) ||
          eoi.deal_title.toLowerCase().includes(s) ||
          eoi.investor_mobile.includes(s) ||
          formatDate(eoi.createdAt).toLowerCase().includes(s)
      );
    }
    return data;
  }

  const handleAssign = (eoi) => {
    setSelectedEoi(eoi);
    setSelectedAnalyst("");
    setComments("");
    setShowAssignModal(true);
  };

  const handleAssignSubmit = () => {
    if (selectedAnalyst && selectedEoi) {
      console.log(`Assigning ${selectedAnalyst} to EOI ${selectedEoi._id} with comments: ${comments}`);
      setShowAssignModal(false);
      setSelectedEoi(null);
      setSelectedAnalyst("");
      setComments("");
      setShowSuccessMessage(true);
    }
  };

  const handleExport = () => {
    const headers = ["Investor Name", "Deal Name", "EOI Date", "Mobile Number", "Ticket Size", "Timeline", "Contact Method"];
    const rows = filteredEois().map((eoi) => [
      eoi.investor_name,
      eoi.deal_title,
      formatDate(eoi.createdAt),
      eoi.investor_mobile,
      eoi.intended_ticket_size,
      eoi.timeline_to_invest,
      eoi.preferred_contact_method,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eois.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  const eoisList = filteredEois();
  const totalPages = Math.max(1, Math.ceil(eoisList.length / itemsPerPage));
  const paginatedEois = eoisList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="heading-main">EOI Review Panel</h1>
        <p className="p-medium">Review and manage Expression of Interest submissions</p>
      </div>

      {/* Search & Export */}
      <div className="flex flex-row items-center w-full justify-between py-3 mb-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="search-input w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn-primary btn-inline text-sm px-4 py-2 w-auto"
          onClick={handleExport}
          disabled={paginatedEois.length === 0}
        >
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
        <table className="table-main ">
          <thead className="table-header-row">
            <tr>
              <th className="table-th break-words">INVESTOR NAME</th>
              <th className="table-th break-words">DEAL NAME</th>
              <th className="table-th break-words">EOI DATE</th>
              <th className="table-th break-words">MOBILE NUMBER</th>
              <th className="table-th break-words">VIEW DETAILS</th>
              <th className="table-th break-words">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEois.map((eoi) => (
              <tr
                key={eoi._id}
                className="table-row hover:bg-white cursor-pointer"
              >
                <td className="table-td break-words whitespace-nowrap">
                  <span className="font-medium text-primarycolor">
                    {eoi.investor_name}
                  </span>
                </td>
                <td className="table-td break-words whitespace-nowrap">
                  <span className="font-medium">
                    {eoi.deal_title}
                  </span>
                </td>
                <td className="table-td break-words whitespace-nowrap">
                  {formatDate(eoi.createdAt)}
                </td>
                <td className="table-td break-words whitespace-nowrap">
                  {eoi.investor_mobile}
                </td>
                <td className="table-td break-words whitespace-nowrap ">
                  {eoi.pdf_path && (
                    <button
                      className="text-primarycolor hover:text-blue-700"
                      title="View PDF"
                      onClick={e => {
                        e.stopPropagation();
                        window.open("http://localhost:4000/" + eoi.pdf_path, "_blank");
                      }}
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  )}
                </td>
                <td className="table-td flex gap-2 break-words whitespace-nowrap">
                  <button
                    className="btn-primary px-2 py-1 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      handleAssign(eoi);
                    }}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
            {paginatedEois.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty">
                  {eois.length === 0 
                    ? "No EOIs found." 
                    : "No EOIs found for selected filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={eoisList.length}
          itemsPerPage={itemsPerPage}
          showItemsPerPage={true}
          onItemsPerPageChange={handleItemsPerPageChange}
          currentItemsPerPage={itemsPerPage}
          showPageInfo={true}
        />
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Analyst</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EOI Details
              </label>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Investor:</strong> {selectedEoi?.investor_name}</p>
                <p className="text-sm"><strong>Deal:</strong> {selectedEoi?.deal_title}</p>
                <p className="text-sm"><strong>EOI Date:</strong> {formatDate(selectedEoi?.createdAt)}</p>
                <p className="text-sm"><strong>Ticket Size:</strong> {selectedEoi?.intended_ticket_size}</p>
                <p className="text-sm"><strong>Timeline:</strong> {selectedEoi?.timeline_to_invest}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Analyst *
              </label>
              <select
                className="form-input"
                value={selectedAnalyst}
                onChange={(e) => setSelectedAnalyst(e.target.value)}
              >
                <option value="">Choose an analyst...</option>
                {mockAnalysts.map((analyst) => (
                  <option key={analyst.id} value={analyst.name}>
                    {analyst.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Add any comments or notes for the analyst..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                className="btn-secondary px-4 py-2"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2"
                onClick={handleAssignSubmit}
                disabled={!selectedAnalyst}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      <ModalMessage
        show={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        type="success"
        message="Analyst assigned successfully!"
      />

      {/* Error Message Modal */}
      <ModalMessage
        show={showError}
        onClose={() => setShowError(false)}
        type="error"
        message={errorMessage}
      />
    </div>
  )
} 