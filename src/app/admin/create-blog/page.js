"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
  });
  const [wordDocument, setWordDocument] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "slug") {
      // Convert spaces to hyphens and remove forward slashes
      const formattedSlug = value
        .replace(/\s+/g, '-') // Replace one or more spaces with single hyphen
        .replace(/\//g, '') // Remove forward slashes
        .toLowerCase(); // Convert to lowercase for consistency
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !wordDocument) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please fill in all required fields and upload a Word document"
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("word_document", wordDocument);
      formDataToSend.append("created_by", "1");

      if (featuredImage) {
        formDataToSend.append("featured_image", featuredImage);
      }

      const response = await createBlog(formDataToSend);
      
      if (response.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Blog created successfully!"
        });
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 1500);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to create blog"
        });
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to create blog"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Create Blog</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Featured Image Preview Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-[200px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden ">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Featured Image Preview"
                    className="w-full h-full object-fill"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {/* <p className="mt-1 text-xs">16:10 ratio</p> */}
                  </div>
                )}
              </div>
              
              {/* Edit/Delete Icons - Only show when image is uploaded */}
              {imagePreview && (
                <div className="flex justify-center items-center gap-2 p-1">
                  <button
                    type="button"
                    onClick={handleEditImage}
                    title="Edit Image"
                  >
                    <FaEdit className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    title="Delete Image"
                  >
                    <MdDelete className="w-6 h-6" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Word Document *
              </label>
              <div
                className="file-upload-container cursor-pointer"
                onClick={() =>
                  document.getElementById("word-doc-upload").click()
                }
              >
                <span className="file-upload-text">
                  {wordDocument ? wordDocument.name : "Choose file"}
                </span>
                <input
                  type="file"
                  className="file-upload-input hidden"
                  id="word-doc-upload"
                  onChange={(e) => handleFileChange(e, "word")}
                  accept=".doc,.docx"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload a Word document (.doc or .docx)
              </p>
            </div>


          </div>

          <div className="flex gap-4 pt-4 justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creating..." : "Create"}
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
