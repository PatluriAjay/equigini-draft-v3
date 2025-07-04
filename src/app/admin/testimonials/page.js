"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllTestimonials } from "@/services/api";
import TestimonialTable from "@/components/admin/testimonials/TestimonialTable";
import TestimonialFilters from "@/components/admin/testimonials/TestimonialFilters";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await getAllTestimonials();
      if (response.status === "S") {
        setTestimonials(response.result_info || []);
      } else {
        setError(response.error_info || "Failed to fetch testimonials");
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError(err.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  // Filter testimonials based on search value
  const filteredTestimonials = useMemo(() => {
    if (!searchValue.trim()) {
      return testimonials;
    }

    const searchTerm = searchValue.toLowerCase().trim();
    return testimonials.filter((testimonial) => {
      return (
        (testimonial.user_name && testimonial.user_name.toLowerCase().includes(searchTerm)) ||
        (testimonial.investor_type && testimonial.investor_type.toLowerCase().includes(searchTerm)) ||
        (testimonial.message && testimonial.message.toLowerCase().includes(searchTerm))
      );
    });
  }, [testimonials, searchValue]);

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
  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / itemsPerPage));
  const paginatedTestimonials = filteredTestimonials.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (testimonialId) => {
    // TODO: Implement delete functionality
    console.log("Delete testimonial:", testimonialId);
  };

  const handleEdit = async (testimonialId) => {
    // TODO: Implement edit functionality
    console.log("Edit testimonial:", testimonialId);
  };

  if (loading) {
    return <Loader text="Loading testimonials..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Testimonials</h1>
        </div>
        <div className="bg-white rounded-lg p-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Testimonials</h1>
        {/* <Link href="/admin/create-testimonial" className="btn-primary">
          Create Testimonial
        </Link> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg py-4 flex flex-col gap-4 items-end">
        <TestimonialFilters 
          searchValue={searchValue}
          onSearch={handleSearch}
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <TestimonialTable 
          testimonials={paginatedTestimonials} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredTestimonials.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
} 