"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestimonial } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import Select from "react-select";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_name: "",
    investor_type: "",
    testimonial_type: { value: "message", label: "Text Message" },
    message: "",
  });
  const [userImage, setUserImage] = useState(null);
  const [testimonialVideo, setTestimonialVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  // Testimonial type options for React Select
  const testimonialTypeOptions = [
    { value: "message", label: "Text Message" },
    { value: "video", label: "Video" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    if (actionMeta.name === "testimonial_type") {
      setFormData(prev => ({
        ...prev,
        testimonial_type: selectedOption
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setUserImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (type === "video") {
      setTestimonialVideo(file);
      // Create preview URL for video
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
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

  const handleEditVideo = () => {
    document.getElementById("testimonial-video-upload").click();
  };

  const handleDeleteVideo = () => {
    setTestimonialVideo(null);
    setVideoPreview(null);
    // Reset the file input
    const fileInput = document.getElementById("testimonial-video-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields based on testimonial type
    if (!formData.user_name || !formData.investor_type || !userImage) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please fill in all required fields and upload a user image"
      });
      return;
    }

    // Validate content based on testimonial type
    if (formData.testimonial_type.value === "message" && !formData.message) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter a testimonial message"
      });
      return;
    }

    if (formData.testimonial_type.value === "video" && !testimonialVideo) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please upload a testimonial video"
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("user_name", formData.user_name);
      formDataToSend.append("investor_type", formData.investor_type);
      formDataToSend.append("testimonial_type", formData.testimonial_type.value);
      formDataToSend.append("user_img", userImage);

      if (formData.testimonial_type.value === "message") {
        formDataToSend.append("message", formData.message);
      } else if (formData.testimonial_type.value === "video") {
        formDataToSend.append("testimonial_video", testimonialVideo);
      }

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
      <div>
        <nav className="flex items-center space-x-2 text-gray-600 mb-4">
          <Link href="/admin" className="hover:underline">Home</Link>
          <span className="text-gray-400">{">"}</span>
          <Link href="/admin/testimonials" className="hover:underline">Testimonials</Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold">Create Testimonial</span>
        </nav>
      </div>
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
            
            {/* Hidden file input */}
            <input
              type="file"
              className="hidden"
              id="user-image-upload"
              onChange={(e) => handleFileChange(e, "image")}
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

          {/* Testimonial Type Dropdown using React Select */}
          <div>
            <label className="form-label">
              Testimonial Type *
            </label>
            <Select
              name="testimonial_type"
              value={formData.testimonial_type}
              onChange={handleSelectChange}
              options={testimonialTypeOptions}
              placeholder="Select testimonial type"
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
              required
            />
          </div>

          {/* Conditional Content Based on Testimonial Type */}
          {formData.testimonial_type.value === "message" ? (
            <div>
              <label className="form-label">
                Testimonial Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="Enter testimonial message"
                rows={4}
                required
              />
            </div>
          ) : (
            <div>
              <label className="form-label">
                Testimonial Video *
              </label>
              
              {/* Video Preview Section */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm">No video selected</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Edit/Delete Icons - Only show when video is uploaded */}
                  {videoPreview && (
                    <div className="flex justify-center items-center gap-2 p-1">
                      <button
                        type="button"
                        onClick={handleEditVideo}
                        title="Edit Video"
                      >
                        <FaEdit className="w-6 h-6" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteVideo}
                        title="Delete Video"
                      >
                        <MdDelete className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Hidden file input for video */}
                <input
                  type="file"
                  className="hidden"
                  id="testimonial-video-upload"
                  onChange={(e) => handleFileChange(e, "video")}
                  accept="video/*"
                  required
                />
                
                {/* Upload button - Only show when no video is selected */}
                {!videoPreview && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("testimonial-video-upload").click()}
                    className="btn-primary mt-2"
                  >
                    Upload Video
                  </button>
                )}
              </div>
            </div>
          )}

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