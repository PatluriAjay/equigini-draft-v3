"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import { createStatus, updateStatus, deleteStatus } from "@/services/api";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(null);
  const [message, setMessage] = useState({ show: false, type: "success", text: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch statuses from backend
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/getAllStatuses`);
      const result = await response.json();
      if (result.status === "S" && Array.isArray(result.result_info)) {
        setStatuses(result.result_info);
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to fetch statuses." });
      }
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to fetch statuses." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Filtered and paginated statuses
  const filteredStatuses = statuses.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredStatuses.length / PAGE_SIZE);
  const paginatedStatuses = filteredStatuses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Create status API call
  const handleCreateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus.trim()) {
      setMessage({ show: true, type: "error", text: "Status name is required." });
      return;
    }
    setLoading(true);
    try {
      const result = await createStatus({ name: newStatus.trim(), created_by: 1 });
      setMessage({ show: true, type: "success", text: "Status created successfully!" });
      setShowModal(false);
      setNewStatus("");
      fetchStatuses();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to create status." });
    } finally {
      setLoading(false);
    }
  };

  // Edit status
  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setShowEditModal(true);
  };

  // Update status API call
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!editingStatus.name.trim()) {
      setMessage({ show: true, type: "error", text: "Status name is required." });
      return;
    }
    setLoading(true);
    try {
      const statusId = editingStatus._id || editingStatus.id;
      const result = await updateStatus(statusId, { name: editingStatus.name.trim() });
      setMessage({ show: true, type: "success", text: "Status updated successfully!" });
      setShowEditModal(false);
      setEditingStatus(null);
      fetchStatuses();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to update status." });
    } finally {
      setLoading(false);
    }
  };

  // Delete status
  const handleDeleteStatus = (status) => {
    setDeletingStatus(status);
    setShowDeleteModal(true);
  };

  // Confirm delete status API call
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const statusId = deletingStatus._id || deletingStatus.id;
      const result = await deleteStatus(statusId);
      setMessage({ show: true, type: "success", text: "Status deleted successfully!" });
      setShowDeleteModal(false);
      setDeletingStatus(null);
      fetchStatuses();
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to delete status." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar: Heading and Create Button */}
      <div className="flex flex-row items-center justify-between mb-4 gap-3">
        <h1 className="heading-main">Status Management</h1>
        <button className="btn-primary w-fit px-6" onClick={() => setShowModal(true)}>+ Create</button>
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
                <th className="table-th">STATUS NAME</th>
                <th className="table-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStatuses.map((status, idx) => (
                <tr key={status._id || status.id || status.name + idx} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{status.name}</td>
                  <td className="table-td flex gap-2 items-center">
                    <button 
                      className="btn-inline text-gray-700" 
                      title="Edit" 
                      type="button"
                      onClick={() => handleEditStatus(status)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button 
                      className="btn-inline text-gray-700" 
                      title="Delete" 
                      type="button"
                      onClick={() => handleDeleteStatus(status)}
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
        totalItems={filteredStatuses.length}
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
            <h2 className="heading-main mb-4 text-primarycolor">Create Status</h2>
            <form onSubmit={handleCreateStatus}>
              <input
                type="text"
                className="form-input w-full mb-4"
                placeholder="Enter status name"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                autoFocus
              />
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
      {showEditModal && editingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowEditModal(false); setEditingStatus(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="heading-main mb-4 text-primarycolor">Edit Status</h2>
            <form onSubmit={handleUpdateStatus}>
              <input
                type="text"
                className="form-input w-full mb-4"
                placeholder="Enter status name"
                value={editingStatus.name}
                onChange={e => setEditingStatus({ ...editingStatus, name: e.target.value })}
                autoFocus
              />
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
      {showDeleteModal && deletingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <h2 className="heading-main mb-4 text-red-600">Delete Status</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{deletingStatus.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => { setShowDeleteModal(false); setDeletingStatus(null); }}
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
