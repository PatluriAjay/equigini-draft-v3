"use client";
import BlogFilters from "./BlogFilters";
import BlogTable from "./BlogTable";
import Pagination from "@/components/common/Pagination";
import ModalMessage from "@/components/investor/ModalMessage";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { getAllBlogs, deleteBlog } from "@/services/api";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, blogId: null, blogTitle: "" });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBlogs();
        if (response.status === "S" && response.result_info) {
          setBlogs(response.result_info.blogs || response.result_info);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search value
  const filteredBlogs = useMemo(() => {
    if (!searchValue.trim()) {
      return blogs;
    }

    const searchTerm = searchValue.toLowerCase().trim();
    return blogs.filter((blog) => {
      return (
        (blog.title && blog.title.toLowerCase().includes(searchTerm)) ||
        (blog.slug && blog.slug.toLowerCase().includes(searchTerm)) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm))
      );
    });
  }, [blogs, searchValue]);

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
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle edit blog
  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/admin/edit-blog/${id}`;
  };

  // Handle delete blog
  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog._id === id);
    setDeleteConfirmation({
      show: true,
      blogId: id,
      blogTitle: blogToDelete?.title || "this blog"
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteBlog(deleteConfirmation.blogId);
      // Refresh the blogs list
      const response = await getAllBlogs();
      if (response.status === "S" && response.result_info) {
        setBlogs(response.result_info.blogs || response.result_info);
        setModalMessage({
          show: true,
          type: "success",
          message: "Blog deleted successfully!"
        });
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: "Failed to delete blog: " + err.message
      });
    } finally {
      setDeleteConfirmation({ show: false, blogId: null, blogTitle: "" });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, blogId: null, blogTitle: "" });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Blog Management</h1>
          {/* <Link href="/admin/create-blog" className="btn-primary">
            + Create Blog
          </Link> */}
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Blog Management</h1>
          <Link href="/admin/create-blog" className="btn-primary">
            + Create
          </Link>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Blog Management</h1>
        {/* <Link href="/admin/create-blog" className="btn-primary">
          + Create Blog
        </Link> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg py-4 flex flex-col gap-4 items-end">
        <BlogFilters 
          searchValue={searchValue}
          onSearch={handleSearch}
        />
      </div>

      <div className="bg-white rounded-lg p-0">
        <BlogTable
          blogs={paginatedBlogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredBlogs.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => setModalMessage({ show: false, type: "success", message: "" })}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <div className="mb-4 flex justify-center">
              <span className="inline-block w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">!</span>
            </div>
            <div className="text-lg font-semibold mb-2 text-primarycolor">
              Confirm Delete
            </div>
            <div className="text-sm text-secondary3 mb-4">
              Are you sure you want to delete &ldquo;{deleteConfirmation.blogTitle}&rdquo;? This action cannot be undone.
            </div>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 