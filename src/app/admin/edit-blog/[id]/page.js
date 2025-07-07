"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogById, updateBlog, publishBlog } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
  });
  const [wordDocument, setWordDocument] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogStatus, setBlogStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
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
            meta_title: blog.meta_title || "",
            meta_description: blog.meta_description || "",
          });
          setBlogStatus(blog.status || "draft");
          
          // Handle existing featured image
          if (blog.featured_image) {
            setFeaturedImage(blog.featured_image);
            // Create preview URL for existing image
            const imageUrl = `http://localhost:4000/${blog.featured_image.path.replace(/\\/g, "/")}`;
            setImagePreview(imageUrl);
          }
          
          // Handle existing word document
          if (blog.word_document) {
            setWordDocument(blog.word_document);
          }
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
      // Create preview URL for featured image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = () => {
    document.getElementById("featured-image-upload").click();
  };

  const handleDeleteImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById("featured-image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleViewDocument = (document) => {
    if (document && document.path) {
      const documentUrl = `http://localhost:4000/${document.path.replace(/\\/g, "/")}`;
      window.open(documentUrl, '_blank');
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      const response = await publishBlog(blogId);
      
      if (response.status === "S") {
        setBlogStatus("published");
        setModalMessage({
          show: true,
          type: "success",
          message: "Blog published successfully!"
        });
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 1500);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to publish blog"
        });
      }
    } catch (err) {
      console.error("Error publishing blog:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to publish blog"
      });
    } finally {
      setPublishing(false);
    }
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
      formDataToSend.append("meta_title", formData.meta_title);
      formDataToSend.append("meta_description", formData.meta_description);

      // Handle word document - check if it's a new File object or existing document
      if (wordDocument) {
        if (wordDocument instanceof File) {
          // New file selected
          formDataToSend.append("word_document", wordDocument);
        } else if (wordDocument.path) {
          // Existing document from backend
          formDataToSend.append("existing_word_document", JSON.stringify(wordDocument));
        }
      }

      // Handle featured image - check if it's a new File object or existing image
      if (featuredImage) {
        if (featuredImage instanceof File) {
          // New file selected
          formDataToSend.append("featured_image", featuredImage);
        } else if (featuredImage.path) {
          // Existing image from backend
          formDataToSend.append("existing_featured_image", JSON.stringify(featuredImage));
        }
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
        <div>
          <nav className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/admin/blogs" className="hover:underline">Blog Management</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">Edit Blog</span>
          </nav>
        </div>
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Edit Blog</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (modalMessage.show && modalMessage.type === "error" && !formData.title) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <nav className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/admin/blogs" className="hover:underline">Blog Management</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">Edit Blog</span>
          </nav>
        </div>
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
      <div>
        <nav className="flex items-center space-x-2 text-gray-600 mb-4">
          <Link href="/admin" className="hover:underline">Home</Link>
          <span className="text-gray-400">{">"}</span>
          <Link href="/admin/blogs" className="hover:underline">Blog Management</Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold">{formData.title || 'Edit Blog'}</span>
        </nav>
      </div>
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Edit Blog</h1>
        {/* Preview Button */}
        {formData.slug && (
          <a
            href={`https://equigini-website-fe.vercel.app/blogs/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            <FaEye className="w-4 h-4 mr-1" />
            Preview
          </a>
        )}
      </div>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Featured Image Preview Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-[200px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Featured Image Preview"
                    width={200}
                    height={100}
                    className="w-full h-full object-fill"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Edit/Delete Icons - Show when image exists */}
              {imagePreview && (
                <div className="flex justify-center items-center gap-2 p-1">
                  <button
                    type="button"
                    onClick={handleEditImage}
                    title="Edit Image"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    title="Delete Image"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Hidden file input for featured image */}
            <input
              type="file"
              className="hidden"
              id="featured-image-upload"
              onChange={(e) => handleFileChange(e, "image")}
              accept="image/*"
            />
            
            {/* Upload button - Only show when no image is selected */}
            {!imagePreview && (
              <button
                type="button"
                onClick={() => document.getElementById("featured-image-upload").click()}
                className="btn-primary mt-2"
              >
                Upload Featured Image
              </button>
            )}
            
            {/* Aspect ratio note */}
            <p className="text-sm text-gray-500 mt-2 text-center">
             Upload an image with a 16:10 aspect ratio
            </p>
          </div>

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
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                className="form-input w-full"
                  placeholder="blog-slug"
                  required
                />
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter meta title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter meta description"
                rows="3"
              />
            </div>
          </div>

          {/* Word Document Section */}
          <div>
            <label className="form-label">
              Word Document
            </label>
            
            {/* Show existing document if available */}
            {wordDocument && wordDocument.path ? (
              <div className="mb-4">
                <div className="overflow-x-auto">
                  <table className="table-main mb-2">
                    <thead className="table-header-row">
                      <tr>
                        <th className="table-th">File Name</th>
                        <th className="table-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-row">
                        <td className="table-td">
                          {wordDocument.originalname || wordDocument.name}
                        </td>
                        <td className="table-td flex gap-2">
                          <button 
                            className="btn-inline text-primarycolor" 
                            onClick={() => handleViewDocument(wordDocument)}
                            title="View Document"
                          >
                            <FaEye size={20} />
                          </button>
                          <label className="btn-inline cursor-pointer" title="Edit Document">
                            <input 
                              type="file" 
                              accept=".doc,.docx" 
                              className="hidden" 
                              onChange={e => handleFileChange(e, "word")} 
                            />
                            <FaEdit size={20} />
                          </label>
                          <button 
                            className="btn-inline" 
                            onClick={() => setWordDocument(null)}
                            title="Delete Document"
                          >
                            <FaTrash size={20} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : wordDocument && wordDocument.name ? (
              // Show newly selected file
              <div className="mb-4">
                <div className="overflow-x-auto">
                  <table className="table-main mb-2">
                    <thead className="table-header-row">
                      <tr>
                        <th className="table-th">File Name</th>
                        <th className="table-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-row">
                        <td className="table-td">
                          {wordDocument.name}
                        </td>
                        <td className="table-td flex gap-2">
                          <label className="btn-inline cursor-pointer" title="Edit Document">
                            <input 
                              type="file" 
                              accept=".doc,.docx" 
                              className="hidden" 
                              onChange={e => handleFileChange(e, "word")} 
                            />
                            <FaEdit size={20} />
                          </label>
                          <button 
                            className="btn-inline" 
                            onClick={() => setWordDocument(null)}
                            title="Delete Document"
                          >
                            <FaTrash size={20} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Show upload interface when no document exists
              <div className="mb-4">
                <div
                  className="file-upload-container cursor-pointer"
                  onClick={() =>
                    document.getElementById("word-doc-upload").click()
                  }
                >
                  <span className="file-upload-text">
                    Choose file
                  </span>
                  <input
                    type="file"
                    className="file-upload-input hidden"
                    id="word-doc-upload"
                    onChange={(e) => handleFileChange(e, "word")}
                    accept=".doc,.docx"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a Word document (.doc or .docx)
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 justify-center items-center">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Updating..." : "Update Blog"}
            </button>
            
            {/* Show Publish button only for draft blogs */}
            {blogStatus === "draft" && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="btn-secondary"
              >
                {publishing ? "Publishing..." : "Publish Blog"}
              </button>
            )}
            
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