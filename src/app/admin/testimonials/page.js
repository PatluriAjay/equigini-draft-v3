"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllTestimonials, deleteTestimonial } from "@/services/api";
import TestimonialTable from "@/components/admin/testimonials/TestimonialTable";
import TestimonialFilters from "@/components/admin/testimonials/TestimonialFilters";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import ModalMessage from "@/components/investor/ModalMessage";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, testimonialId: null, testimonialName: "" });

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
    // Find the testimonial to get the name for confirmation
    const testimonial = testimonials.find(t => t._id === testimonialId);
    setDeleteModal({
      show: true,
      testimonialId: testimonialId,
      testimonialName: testimonial?.user_name || "this testimonial"
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteTestimonial(deleteModal.testimonialId);
      if (response.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Testimonial deleted successfully!"
        });
        // Refresh the testimonials list
        fetchTestimonials();
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to delete testimonial"
        });
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to delete testimonial"
      });
    } finally {
      setDeleteModal({ show: false, testimonialId: null, testimonialName: "" });
    }
  };

  const handleEdit = async (testimonialId) => {
    // Navigate to edit page
    window.location.href = `/admin/edit-testimonial/${testimonialId}`;
  };

  if (loading) {
    return <Loader text="Loading..." />;
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

      {/* Success/Error Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => setModalMessage({ show: false, type: "success", message: "" })}
      />

      {/* Delete Confirmation Modal */}
      <ModalMessage
        show={deleteModal.show}
        type="confirm"
        message={`Are you sure you want to delete ${deleteModal.testimonialName}? This action cannot be undone.`}
        onClose={() => setDeleteModal({ show: false, testimonialId: null, testimonialName: "" })}
        onConfirm={confirmDelete}
        confirmText="Delete"
        showCancel={true}
      />
    </div>
  );
} 