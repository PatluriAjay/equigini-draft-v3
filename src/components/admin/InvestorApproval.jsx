"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import Pagination from "@/components/common/Pagination";
import { getPendingInvestors, approveInvestor, rejectInvestor } from "../../services/api";
import ModalMessage from "../investor/ModalMessage";

const InvestorApproval = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [regDateFilter, setRegDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toggleStates, setToggleStates] = useState({});
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set to 8 items per page for Investor Approval
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [investorToReject, setInvestorToReject] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const router = useRouter();

  // Fetch pending investors on component mount
  useEffect(() => {
    fetchPendingInvestors();
  }, []);

  const fetchPendingInvestors = async () => {
    try {
      setLoading(true);
      const response = await getPendingInvestors();
      if (response.result_info) {
        setInvestors(response.result_info);
      }
    } catch (error) {
      console.error("Error fetching pending investors:", error);
      setModalMessage("Failed to fetch pending investors. Please try again.");
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const allSelected =
    selected.length === filteredInvestors().length &&
    filteredInvestors().length > 0;

  function filteredInvestors() {
    let data = [...investors];
    if (typeFilter !== "All") data = data.filter((i) => i.investor_type === typeFilter);
    if (regionFilter !== "All")
      data = data.filter((i) => i.geography === regionFilter);
    if (statusFilter !== "All")
      data = data.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (i) =>
          (i.full_name && i.full_name.toLowerCase().includes(s)) ||
          (i.mobile_number && i.mobile_number.toLowerCase().includes(s)) ||
          (i.investor_type && i.investor_type.toLowerCase().includes(s)) ||
          (i.investment_range && i.investment_range.toLowerCase().includes(s)) ||
          (i.preferred_sectors && Array.isArray(i.preferred_sectors) && 
           i.preferred_sectors.some(sector => sector.toLowerCase().includes(s)))
      );
    }
    if (regDateFilter === "Newest First")
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (regDateFilter === "Oldest First")
      data = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return data;
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  
  const toggleAll = () => {
    const filtered = filteredInvestors();
    setSelected(allSelected ? [] : filtered.map((i) => i._id));
  };
  
  const clearFilters = () => {
    setTypeFilter("All");
    setRegionFilter("All");
    setRegDateFilter("All");
    setStatusFilter("All");
    setSearch("");
  };

  const handleApprove = async (investorId) => {
    try {
      setProcessingAction(true);
      await approveInvestor(investorId);
      setModalMessage("Investor approved successfully!");
      setModalType("success");
      setShowModal(true);
      // Refresh the list
      await fetchPendingInvestors();
    } catch (error) {
      setModalMessage(error.message || "Failed to approve investor");
      setModalType("error");
      setShowModal(true);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async (investorId, reason = "") => {
    try {
      setProcessingAction(true);
      await rejectInvestor(investorId, reason);
      setModalMessage("Investor rejected successfully!");
      setModalType("success");
      setShowModal(true);
      setShowRejectModal(false);
      setRejectReason("");
      setInvestorToReject(null);
      // Refresh the list
      await fetchPendingInvestors();
    } catch (error) {
      setModalMessage(error.message || "Failed to reject investor");
      setModalType("error");
      setShowModal(true);
    } finally {
      setProcessingAction(false);
    }
  };

  const openRejectModal = (investor) => {
    setInvestorToReject(investor);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (investorToReject) {
      handleReject(investorToReject._id, rejectReason);
    }
  };

  const investorsList = filteredInvestors();
  const totalPages = Math.max(1, Math.ceil(investorsList.length / itemsPerPage));
  const paginatedInvestors = investorsList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleExport = () => {
    // Simple CSV export for visible page
    const headers = ["Name", "Mobile", "Type", "Range", "Preferred Sectors"];
    const rows = paginatedInvestors.map((inv) => [
      inv.full_name,
      inv.mobile_number,
      inv.investor_type,
      inv.investment_range,
      inv.preferred_sectors?.join(", ") || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pending-investors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="heading-main">Investor Approval Queue</h1>
        <p className="p-medium">Review and approve new investor registrations</p>
      </div>
      
      {/* Filters & Export */}
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
          disabled={paginatedInvestors.length === 0}
        >
          Export
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
        <table className="table-main ">
          <thead className="">
            <tr>
              <th className="table-th break-words table-header-row">NAME</th>
              <th className="table-th break-words table-header-row">MOBILE</th>
              <th className="table-th break-words table-header-row">TYPE</th>
              <th className="table-th break-words table-header-row">RANGE</th>
              <th className="table-th break-words table-header-row">PREFERRED SECTORS</th>
              <th className="table-th break-words table-header-row">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvestors.map((inv) => (
              <tr
                key={inv._id}
                className="table-row hover:bg-white cursor-pointer"
              >
                <td
                  className="table-td break-words whitespace-nowrap"
                  onClick={() =>
                    router.push(
                      `/admin/investors/${inv._id}`
                    )
                  }
                >
                  <span className="font-medium text-primarycolor hover:underline">
                    {inv.full_name}
                  </span>
                </td>
                <td
                  className="table-td break-words whitespace-nowrap"
                  onClick={() =>
                    router.push(
                      `/admin/investors/${inv._id}`
                    )
                  }
                >
                  {inv.mobile_number}
                </td>
                <td
                  className="table-td break-words whitespace-nowrap"
                  onClick={() =>
                    router.push(
                      `/admin/investors/${inv._id}`
                    )
                  }
                >
                  {inv.investor_type}
                </td>
                <td
                  className="table-td break-words whitespace-nowrap"
                  onClick={() =>
                    router.push(
                      `/admin/investors/${inv._id}`
                    )
                  }
                >
                  {inv.investment_range}
                </td>
                <td
                  className="table-td break-words whitespace-nowrap"
                  onClick={() =>
                    router.push(
                      `/admin/investors/${inv._id}`
                    )
                  }
                >
                  {inv.preferred_sectors?.join(", ") || "N/A"}
                </td>
                <td className="table-td flex gap-2 break-words">
                  <button
                    className="btn-secondary px-2 py-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/admin/investors/${inv._id}`
                      );
                    }}
                  >
                    View
                  </button>
                  <button
                    className="btn-primary px-2 py-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(inv._id);
                    }}
                    disabled={processingAction}
                  >
                    {/* {processingAction ? "Processing..." : "Approve"} */}
                    Approve
                  </button>
                  <button
                    className="btn-secondary px-2 py-1 text-xs bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRejectModal(inv);
                    }}
                    disabled={processingAction}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {paginatedInvestors.length === 0 && (
              <tr>
                <td colSpan={6} className="table-empty">
                  {investors.length === 0 
                    ? "No pending investors found." 
                    : "No investors found for selected filters."}
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
          totalItems={investorsList.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Success/Error Modal */}
      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        message={modalMessage}
      />

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
                setInvestorToReject(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primarycolor mb-2">
                Reject Investor
              </h3>
              <p className="text-sm text-secondary3 mb-4">
                Are you sure you want to reject {investorToReject?.full_name}? 
                Please provide a reason for rejection (optional).
              </p>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor focus:border-transparent"
                placeholder="Rejection reason (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setInvestorToReject(null);
                }}
                disabled={processingAction}
              >
                Cancel
              </button>
              <button
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                onClick={confirmReject}
                disabled={processingAction}
              >
                {processingAction ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorApproval;
