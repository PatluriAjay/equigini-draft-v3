"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogById, updateBlog } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
  });
  const [wordDocument, setWordDocument] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(blogId);
        if (response.status === "S" && response.result_info) {
          const blog = response.result_info;
          setFormData({
            title: blog.title || "",
            slug: blog.slug || "",
          });
        } else {
          setModalMessage({
            show: true,
            type: "error",
            message: "Failed to fetch blog"
          });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setModalMessage({
          show: true,
          type: "error",
          message: err.message || "Failed to fetch blog"
        });
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "word") {
      setWordDocument(file);
    } else if (type === "image") {
      setFeaturedImage(file);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please fill in all required fields"
      });
      return;
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug);

      if (wordDocument) {
        formDataToSend.append("word_document", wordDocument);
      }

      if (featuredImage) {
        formDataToSend.append("featured_image", featuredImage);
      }

      const response = await updateBlog(blogId, formDataToSend);
      
      if (response.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Blog updated successfully!"
        });
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 1500);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to update blog"
        });
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to update blog"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Edit Blog</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (modalMessage.show && modalMessage.type === "error" && !formData.title) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Edit Blog</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">Error: {modalMessage.message}</p>
          <button 
            onClick={() => router.push("/admin/blogs")} 
            className="btn-primary"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Edit Blog</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="form-input flex-1"
                  placeholder="blog-slug"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="btn-secondary whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Document
              </label>
              <input
                type="file"
                accept=".doc,.docx"
                onChange={(e) => handleFileChange(e, "word")}
                className="form-input w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a new Word document to replace the existing one
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="form-input w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a new featured image to replace the existing one
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Updating..." : "Update Blog"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => setModalMessage({ show: false, type: "success", message: "" })}
      />
    </div>
  );
} 