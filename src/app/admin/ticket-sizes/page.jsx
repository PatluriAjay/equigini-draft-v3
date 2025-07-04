"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function TicketSizeManagementPage() {
  const [ranges, setRanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ min: "", max: "" });
  const [message, setMessage] = useState({ show: false, type: "success", text: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch ticket sizes from backend
  const fetchRanges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/getAllTicketSizes`);
      const result = await response.json();
      if (result.status === "S" && Array.isArray(result.result_info)) {
        setRanges(result.result_info.map(r => ({ min: r.ticket_min, max: r.ticket_max })));
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to fetch ticket sizes." });
      }
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to fetch ticket sizes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanges();
  }, []);

  // Filtered and paginated ranges
  const filteredRanges = ranges.filter(r => {
    const rangeStr = `${r.min} – ${r.max}`.toLowerCase();
    return rangeStr.includes(search.toLowerCase());
  });
  const totalPages = Math.ceil(filteredRanges.length / PAGE_SIZE);
  const paginatedRanges = filteredRanges.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Create ticket size API call
  const handleCreateRange = async (e) => {
    e.preventDefault();
    if (!formData.min || !formData.max) {
      setMessage({ show: true, type: "error", text: "Both min and max are required." });
      return;
    }
    
    // Add ₹ prefix if not present
    const minValue = formData.min.startsWith('₹') ? formData.min : `₹${formData.min}`;
    const maxValue = formData.max.startsWith('₹') ? formData.max : `₹${formData.max}`;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/createTicketSize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_min: minValue, ticket_max: maxValue, created_by: 1 })
      });
      const result = await response.json();
      if (result.status === "S") {
        setMessage({ show: true, type: "success", text: "Ticket size created successfully!" });
        setShowModal(false);
        setFormData({ min: "", max: "" });
        fetchRanges();
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to create ticket size." });
      }
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to create ticket size." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar: Heading and Create Button */}
      <div className="flex flex-row items-center justify-between mb-4 gap-3">
        <h1 className="heading-main ">Ticket Size Management</h1>
        <button className="btn-primary w-fit px-6" onClick={() => setShowModal(true)}>Create</button>
      </div>

      {/* Search and Export Row */}
      <div className="flex items-center w-full justify-between mb-5">
        <div className="flex-shrink-0">
          <input
            type="text"
            className="search-input w-72"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button className="btn-primary w-fit">Export</button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg p-0">
        <div className="overflow-x-auto">
          <table className="table-main">
            <thead>
              <tr className="table-header-row">
                <th className="table-th">RANGE</th>
                <th className="table-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRanges.map((range, idx) => (
                <tr key={range.min + '-' + range.max} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{range.min} – {range.max}</td>
                  <td className="table-td flex gap-2 items-center">
                    <button className="btn-inline text-gray-700" title="Edit" type="button"><FaEdit size={20} /></button>
                    <button className="btn-inline text-gray-700" title="Delete" type="button"><MdDelete size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredRanges.length}
        itemsPerPage={PAGE_SIZE}
      />

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="heading-main mb-4 text-primarycolor">+ Create </h2>
            <form onSubmit={handleCreateRange}>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Min"
                  value={formData.min}
                  onChange={e => setFormData(f => ({ ...f, min: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Max"
                  value={formData.max}
                  onChange={e => setFormData(f => ({ ...f, max: e.target.value }))}
                  required
                />
              </div>
              <button
                className="btn-primary w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Message Modal */}
      <ModalMessage
        show={message.show}
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ show: false, type: "success", text: "" })}
      />
    </div>
  );
}
