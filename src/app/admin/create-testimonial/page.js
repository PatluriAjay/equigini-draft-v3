"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestimonial } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: "",
    investor_type: "",
    message: "",
  });
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = () => {
    document.getElementById("user-image-upload").click();
  };

  const handleDeleteImage = () => {
    setUserImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById("user-image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.user_name || !formData.investor_type || !formData.message || !userImage) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please fill in all required fields and upload a user image"
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("user_name", formData.user_name);
      formDataToSend.append("investor_type", formData.investor_type);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("user_img", userImage);

      const response = await createTestimonial(formDataToSend);
      
      if (response.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Testimonial created successfully!"
        });
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/testimonials");
        }, 1500);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to create testimonial"
        });
      }
    } catch (err) {
      console.error("Error creating testimonial:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to create testimonial"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Create testimonial</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-[150px] h-[150px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {/* <p className="mt-2 text-sm">No image selected</p> */}
                  </div>
                )}
              </div>
              
              {/* Edit/Delete Icons - Only show when image is uploaded */}
              {imagePreview && (
                <div className="  flex justify-center items-center gap-2  p-1">
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
            
            {/* Hidden file input */}
            <input
              type="file"
              className="hidden"
              id="user-image-upload"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            
            {/* Upload button - Only show when no image is selected */}
            {!imagePreview && (
              <button
                type="button"
                onClick={() => document.getElementById("user-image-upload").click()}
                className="btn-primary mt-2"
              >
                Upload Image
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Investor Name *
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter investor name"
                required
              />
            </div>

            <div>
              <label className="form-label">
                Designation *
              </label>
              <input
                type="text"
                name="investor_type"
                value={formData.investor_type}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="e.g., CEO, Founder, etc."
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Testimonial Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="form-input w-full"
              placeholder="Enter testimonial Message"
              rows={4}
              required
            />
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
              onClick={() => router.push("/admin/testimonials")}
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