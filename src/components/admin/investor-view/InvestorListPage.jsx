"use client";
import { useState, useEffect, useMemo } from "react";
import InvestorStats from "./InvestorStats";
import InvestorFilters from "./InvestorFilters";
import InvestorTable from "./InvestorTable";
import Pagination from "@/components/common/Pagination";
import { getApprovedInvestors } from "@/services/api";

export default function InvestorListPage() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApprovedInvestors = async () => {
      try {
        setLoading(true);
        const response = await getApprovedInvestors();
        if (response.result_info) {
          setInvestors(response.result_info);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching approved investors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedInvestors();
  }, []);

  // Filter and search investors
  const filteredInvestors = useMemo(() => {
    if (!searchTerm.trim()) {
      return investors;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = investors.filter(investor => 
      (investor.full_name && investor.full_name.toLowerCase().includes(searchLower)) ||
      (investor.email && investor.email.toLowerCase().includes(searchLower)) ||
      (investor.investor_type && investor.investor_type.toLowerCase().includes(searchLower))
    );
    
    console.log("Search term:", searchTerm);
    console.log("Total investors:", investors.length);
    console.log("Filtered investors:", filtered.length);
    
    return filtered;
  }, [investors, searchTerm]);

  // Paginate filtered investors
  const paginatedInvestors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvestors.slice(startIndex, endIndex);
  }, [filteredInvestors, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Placeholder handlers for integration readiness
  const onApprove = () => {};
  const onReject = () => {};
  const onDeactivate = () => {};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading approved investors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className=" ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main mb-1">Investor Management</h1>
          {searchTerm && (
            <p className="text-sm text-gray-600">
              Showing {filteredInvestors.length} of {investors.length} investors 
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg py-4 mb-6  flex flex-col gap-4">
        <InvestorFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>
      {/* Stats */}
      {/* <InvestorStats stats={stats} /> */}
      {/* Directory Card */}
      <div className="bg-white rounded-lg p-0">
        <div className=" pb-2 ">
          <InvestorTable 
            investors={paginatedInvestors} 
            onApprove={onApprove} 
            onReject={onReject} 
            onDeactivate={onDeactivate} 
          />
        </div>
      </div>
      {/* Pagination */}
      <div className="bg-white rounded-lg p-4 mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredInvestors.length / itemsPerPage)}
          totalItems={filteredInvestors.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showItemsPerPage={true}
          onItemsPerPageChange={handleItemsPerPageChange}
          showPageInfo={true}
        />
      </div>
    </div>
  );
}
