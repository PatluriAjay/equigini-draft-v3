"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import { createTicketSize, updateTicketSize, deleteTicketSize } from "@/services/api";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function TicketSizeManagementPage() {
  const [ranges, setRanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({ min: "", max: "" });
  const [editingRange, setEditingRange] = useState(null);
  const [deletingRange, setDeletingRange] = useState(null);
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
        setRanges(result.result_info);
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
    const rangeStr = `${r.ticket_min} – ${r.ticket_max}`.toLowerCase();
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
      const result = await createTicketSize({ ticket_min: minValue, ticket_max: maxValue, created_by: 1 });
      setMessage({ show: true, type: "success", text: "Ticket size created successfully!" });
      setShowModal(false);
      setFormData({ min: "", max: "" });
      fetchRanges();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to create ticket size." });
    } finally {
      setLoading(false);
    }
  };

  // Edit ticket size
  const handleEditRange = (range) => {
    setEditingRange({
      ...range,
      min: range.ticket_min,
      max: range.ticket_max
    });
    setShowEditModal(true);
  };

  // Update ticket size API call
  const handleUpdateRange = async (e) => {
    e.preventDefault();
    if (!editingRange.min || !editingRange.max) {
      setMessage({ show: true, type: "error", text: "Both min and max are required." });
      return;
    }
    
    // Add ₹ prefix if not present
    const minValue = editingRange.min.startsWith('₹') ? editingRange.min : `₹${editingRange.min}`;
    const maxValue = editingRange.max.startsWith('₹') ? editingRange.max : `₹${editingRange.max}`;
    
    setLoading(true);
    try {
      const rangeId = editingRange._id || editingRange.id;
      const result = await updateTicketSize(rangeId, { ticket_min: minValue, ticket_max: maxValue });
      setMessage({ show: true, type: "success", text: "Ticket size updated successfully!" });
      setShowEditModal(false);
      setEditingRange(null);
      fetchRanges();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to update ticket size." });
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket size
  const handleDeleteRange = (range) => {
    setDeletingRange(range);
    setShowDeleteModal(true);
  };

  // Confirm delete ticket size API call
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const rangeId = deletingRange._id || deletingRange.id;
      const result = await deleteTicketSize(rangeId);
      setMessage({ show: true, type: "success", text: "Ticket size deleted successfully!" });
      setShowDeleteModal(false);
      setDeletingRange(null);
      fetchRanges();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to delete ticket size." });
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
                <tr key={range._id || range.id || range.ticket_min + '-' + range.ticket_max} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{range.ticket_min} – {range.ticket_max}</td>
                  <td className="table-td flex gap-2 items-center">
                    <button 
                      className="btn-inline text-gray-700" 
                      title="Edit" 
                      type="button"
                      onClick={() => handleEditRange(range)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button 
                      className="btn-inline text-gray-700" 
                      title="Delete" 
                      type="button"
                      onClick={() => handleDeleteRange(range)}
                    >
                      <MdDelete size={20} />
                    </button>
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

      {/* Edit Modal */}
      {showEditModal && editingRange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowEditModal(false); setEditingRange(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="heading-main mb-4 text-primarycolor">Edit Ticket Size</h2>
            <form onSubmit={handleUpdateRange}>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Min"
                  value={editingRange.min}
                  onChange={e => setEditingRange({ ...editingRange, min: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Max"
                  value={editingRange.max}
                  onChange={e => setEditingRange({ ...editingRange, max: e.target.value })}
                  required
                />
              </div>
              <button
                className="btn-primary w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <h2 className="heading-main mb-4 text-red-600">Delete Ticket Size</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deletingRange.ticket_min} – {deletingRange.ticket_max}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => { setShowDeleteModal(false); setDeletingRange(null); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex-1"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
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
