"use client";
import DealFilters from "./DealFilters";
import DealTable from "./DealTable";
import Pagination from "@/components/common/Pagination";
import ModalMessage from "@/components/investor/ModalMessage";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { getAllDeals, deleteDeal } from "@/services/api";
import { useRouter } from "next/navigation";

export default function DealListPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [message, setMessage] = useState({ show: false, type: "success", text: "" });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, dealId: null });
  const router = useRouter();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllDeals();
        if (response.status === "S" && response.result_info) {
          setDeals(response.result_info);
        } else {
          setError("Failed to fetch deals");
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError(err.message || "Failed to fetch deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Filter deals based on search value
  const filteredDeals = useMemo(() => {
    if (!searchValue.trim()) {
      return deals;
    }

    const searchTerm = searchValue.toLowerCase().trim();
    return deals.filter((deal) => {
      return (
        (deal.deal_title && deal.deal_title.toLowerCase().includes(searchTerm)) ||
        (deal.sector && deal.sector.toLowerCase().includes(searchTerm)) ||
        (deal.stage && deal.stage.toLowerCase().includes(searchTerm)) ||
        (deal.ticket_size_range && deal.ticket_size_range.toLowerCase().includes(searchTerm)) ||
        (deal.status && deal.status.toLowerCase().includes(searchTerm)) ||
        (deal.deal_priority && deal.deal_priority.toLowerCase().includes(searchTerm))
      );
    });
  }, [deals, searchValue]);

  // Handle search input change
  const handleSearch = (value) => {
    setSearchValue(value);
    setPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / itemsPerPage));
  const paginatedDeals = filteredDeals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Placeholder for stats
  const stats = {};

  // Handlers
  const onEdit = (id) => {
    // Navigate to edit page using Next.js router
    router.push(`/admin/edit-deal/${id}`);
  };

  const onDelete = (id) => {
    setConfirmDelete({ show: true, dealId: id });
  };

  const handleConfirmDelete = async () => {
    const dealId = confirmDelete.dealId;
    setConfirmDelete({ show: false, dealId: null });
    
    try {
      const response = await deleteDeal(dealId);
      if (response.status === "S") {
        // Refresh the deals list
        const updatedResponse = await getAllDeals();
        if (updatedResponse.status === "S" && updatedResponse.result_info) {
          setDeals(updatedResponse.result_info);
        }
        setMessage({ show: true, type: "success", text: "Deal deleted successfully!" });
      } else {
        setMessage({ show: true, type: "error", text: "Failed to delete deal: " + (response.error_info || "Unknown error") });
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
      setMessage({ show: true, type: "error", text: "Error deleting deal: " + error.message });
    }
  };

  const onStatusChange = (id, status) => {};

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Deal Management</h1>
          <Link href="/admin/create-deal" className="btn-primary">
            + Create
          </Link>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Deal Management</h1>
        <Link href="/admin/create-deal" className="btn-primary">
          + Create
        </Link>
      </div>

      {/* Filters */}
      <div className=" bg-white rounded-lg py-4 flex flex-col gap-4 items-end">
        <DealFilters 
          searchValue={searchValue}
          onSearch={handleSearch}
        />
      </div>

      <div className="bg-white rounded-lg p-0">
        <DealTable
          deals={paginatedDeals}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredDeals.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Success/Error Message Modal */}
      <ModalMessage
        show={message.show}
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ show: false, type: "success", text: "" })}
      />

      {/* Delete Confirmation Modal */}
      <ModalMessage
        show={confirmDelete.show}
        type="confirm"
        message="Are you sure you want to delete this deal"
        onClose={() => setConfirmDelete({ show: false, dealId: null })}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        showCancel={true}
      />
    </div>
  );
}
