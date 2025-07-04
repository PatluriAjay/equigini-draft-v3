"use client";
import React, { useState, useEffect } from "react";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import { getAllSignedNDAs } from "../../../services/api";
import { FaEye } from "react-icons/fa";

export default function NDAReviewPanel() {
  const [ndas, setNdas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set to 6 items per page for NDA
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch NDA agreements on component mount
  useEffect(() => {
    fetchNDAs();
  }, []);

  const fetchNDAs = async () => {
    try {
      setLoading(true);
      const response = await getAllSignedNDAs();
      if (response.result_info && response.result_info.signed_agreements) {
        setNdas(response.result_info.signed_agreements);
      } else {
        setNdas([]);
      }
    } catch (error) {
      console.error("Error fetching NDA agreements:", error);
      setErrorMessage("Failed to fetch NDA agreements. Please try again.");
      setShowError(true);
      setNdas([]);
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

  function filteredNdas() {
    let data = [...ndas];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (nda) =>
          (nda.investor_name && nda.investor_name.toLowerCase().includes(s)) ||
          (nda.deal_name && nda.deal_name.toLowerCase().includes(s)) ||
          (nda.investor_mobile && nda.investor_mobile.includes(s)) ||
          (nda.signed_date && formatDate(nda.signed_date).toLowerCase().includes(s))
      );
    }
    return data;
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleExport = () => {
    const headers = ["Investor Name", "Deal Name", "NDA Signed Date", "Mobile Number"];
    const rows = filteredNdas().map((nda) => [
      nda.investor_name || "N/A",
      nda.deal_name || "N/A",
      nda.signed_date ? formatDate(nda.signed_date) : "N/A",
      nda.investor_mobile || "N/A",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nda-agreements.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const ndasList = filteredNdas();
  const totalPages = Math.max(1, Math.ceil(ndasList.length / itemsPerPage));
  const paginatedNdas = ndasList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading NDA agreements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="heading-main">NDA Management</h1>
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
          className="btn-primary btn-inline text-sm px-4 py-2 sm:w-auto"
          onClick={handleExport}
          disabled={paginatedNdas.length === 0}
        >
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
        <table className="table-main">
          <thead className="table-header-row">
            <tr>
              <th className="table-th">INVESTOR NAME</th>
              <th className="table-th">DEAL NAME</th>
              <th className="table-th">NDA SIGNED DATE</th>
              <th className="table-th">MOBILE NUMBER</th>
              <th className="table-th">VIEW DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNdas.map((nda) => (
              <tr
                key={nda._id}
                className="table-row hover:bg-white cursor-pointer"
              >
                <td className="table-td whitespace-nowrap">
                  <span className="font-medium text-primarycolor">
                    {nda.investor_name || "N/A"}
                  </span>
                </td>
                <td className="table-td whitespace-nowrap">
                  <span className="font-medium">
                    {nda.deal_name || "N/A"}
                  </span>
                </td>
                <td className="table-td whitespace-nowrap">
                  {nda.signed_date ? formatDate(nda.signed_date) : "N/A"}
                </td>
                <td className="table-td whitespace-nowrap">
                  {nda.investor_mobile || "N/A"}
                </td>
                <td className="table-td whitespace-nowrap ">
                  {nda.pdf_path && (
                    <button
                      className="text-primarycolor hover:text-blue-700"
                      title="View PDF"
                      onClick={e => {
                        e.stopPropagation();
                        window.open("http://localhost:4000/" + nda.pdf_path, "_blank");
                      }}
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {paginatedNdas.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  {ndas.length === 0 
                    ? "No NDA agreements found." 
                    : "No NDA agreements found for selected filters."}
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
          totalItems={ndasList.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Success Message Modal */}
      <ModalMessage
        show={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        type="success"
        message="NDA updated successfully!"
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