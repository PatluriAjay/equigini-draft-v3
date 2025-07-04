"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function SectorManagementPage() {
  const [sectors, setSectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSector, setNewSector] = useState("");
  const [message, setMessage] = useState({ show: false, type: "success", text: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch sectors from backend
  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/getAllSectors`);
      const result = await response.json();
      if (result.status === "S" && Array.isArray(result.result_info)) {
        setSectors(result.result_info.map(s => ({ name: s.name })));
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to fetch sectors." });
      }
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to fetch sectors." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  // Filtered and paginated sectors
  const filteredSectors = sectors.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredSectors.length / PAGE_SIZE);
  const paginatedSectors = filteredSectors.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Create sector API call
  const handleCreateSector = async (e) => {
    e.preventDefault();
    if (!newSector.trim()) {
      setMessage({ show: true, type: "error", text: "Sector name is required." });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/createSector`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSector.trim(), created_by: 1 })
      });
      const result = await response.json();
      if (result.status === "S") {
        setMessage({ show: true, type: "success", text: "Sector created successfully!" });
        setShowModal(false);
        setNewSector("");
        fetchSectors();
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to create sector." });
      }
    } catch (err) {
      setMessage({ show: true, type: "error", text: err.message || "Failed to create sector." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar: Heading and Create Button */}
      <div className="flex flex-row items-center justify-between mb-4 gap-3">
        <h1 className="heading-main ">Sector Management</h1>
        <button className="btn-primary w-fit px-6"  onClick={() => setShowModal(true)}>+ Create</button>
      </div>

      {/* Search and Export Row */}
      <div className="flex  items-center w-full justify-between mb-5">
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
                <th className="table-th">SECTOR NAME</th>
                <th className="table-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSectors.map((sector, idx) => (
                <tr key={sector.name + idx} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{sector.name}</td>
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
        totalItems={filteredSectors.length}
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
            <h2 className="heading-main mb-4 text-primarycolor">Create Sector</h2>
            <form onSubmit={handleCreateSector}>
              <input
                type="text"
                className="form-input w-full mb-4"
                placeholder="Enter sector name"
                value={newSector}
                onChange={e => setNewSector(e.target.value)}
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
