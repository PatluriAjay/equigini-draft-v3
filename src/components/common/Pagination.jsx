"use client";
import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemsPerPage = false,
  itemsPerPageOptions = [5, 10, 20, 50],
  onItemsPerPageChange,
  showPageInfo = false,
  className = "",
}) => {
  // Calculate page info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Always show pagination if there are items, even for 1 page
  if (totalItems === 0) {
    return null; // Don't show pagination if there are no items
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-end items-center gap-3 ${className}`}>
      {/* Pagination Controls */}
      <nav className="flex items-center gap-1">
        {/* First Page */}
        <button
          className="px-2 py-1 text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First page"
        >
          First
        </button>

        {/* Previous Page */}
        <button
          className="px-2 py-1 text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`px-3 py-1 text-xs font-semibold border rounded transition-colors ${
              pageNum === currentPage
                ? "bg-primarycolor text-white border-primarycolor"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Page */}
        <button
          className="px-2 py-1 text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          Next
        </button>

        {/* Last Page */}
        <button
          className="px-2 py-1 text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last page"
        >
          Last
        </button>
      </nav>
    </div>
  );
};

export default Pagination;