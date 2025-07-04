"use client";
import DealFilters from "./DealFilters";
import DealTable from "./DealTable";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { getAllDeals } from "@/services/api";

export default function DealListPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Placeholder handlers
  const onEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/admin/edit-deal/${id}`;
  };

  const onArchive = (id) => {
    // No longer needed
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
          <p className="mt-2 text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col gap-5">
  //       <div className="flex justify-between items-center gap-2">
  //         <h1 className="heading-main">Deal Management</h1>
  //         <Link href="/admin/create-deal" className="btn-primary">
  //           + Create Deal
  //         </Link>
  //       </div>
  //       <div className="bg-white rounded-lg p-8 text-center">
  //         <p className="text-red-600 mb-4">Error: {error}</p>
  //         <button 
  //           onClick={() => window.location.reload()} 
  //           className="btn-primary"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

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
          onArchive={onArchive}
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
    </div>
  );
}
