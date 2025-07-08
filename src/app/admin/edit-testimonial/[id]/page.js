"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTestimonialById, updateTestimonial } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Select from "react-select";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id;
  
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  // Testimonial type options for React Select
  const testimonialTypeOptions = [
    { value: "message", label: "Text Message" },
    { value: "video", label: "Video" }
  ];

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setLoading(true);
        const response = await getTestimonialById(testimonialId);
        if (response.status === "S" && response.result_info) {
          const testimonial = response.result_info;
          setFormData({
            user_name: testimonial.user_name || "",
            investor_type: testimonial.investor_type || "",
            testimonial_type: testimonialTypeOptions.find(option => option.value === testimonial.testimonial_type) || { value: "message", label: "Text Message" },
            message: testimonial.message || "",
          });
          
          // Handle existing user image
          if (testimonial.user_img) {
            setUserImage(testimonial.user_img);
            // Create preview URL for existing image
            const imageUrl = `http://localhost:4000/${testimonial.user_img.replace(/\\/g, "/")}`;
            setImagePreview(imageUrl);
          }
          
          // Handle existing testimonial video
          if (testimonial.testimonial_video) {
            setTestimonialVideo(testimonial.testimonial_video);
            // Create preview URL for existing video
            const videoUrl = `http://localhost:4000/${testimonial.testimonial_video.replace(/\\/g, "/")}`;
            setVideoPreview(videoUrl);
          }
        } else {
          setModalMessage({
            show: true,
            type: "error",
            message: "Failed to fetch testimonial"
          });
        }
      } catch (err) {
        console.error("Error fetching testimonial:", err);
        setModalMessage({
          show: true,
          type: "error",
          message: err.message || "Failed to fetch testimonial"
        });
      } finally {
        setLoading(false);
      }
    };

    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

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

  const handleViewDocument = (documentPath) => {
    if (documentPath) {
      const documentUrl = `http://localhost:4000/${documentPath.replace(/\\/g, "/")}`;
      window.open(documentUrl, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields based on testimonial type
    if (!formData.user_name || !formData.investor_type) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please fill in all required fields"
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
      setSaving(true);

      const formDataToSend = new FormData();
      formDataToSend.append("user_name", formData.user_name);
      formDataToSend.append("investor_type", formData.investor_type);
      formDataToSend.append("testimonial_type", formData.testimonial_type.value);

      // Handle user image - check if it's a new File object or existing image
      if (userImage) {
        if (userImage instanceof File) {
          // New file selected
          formDataToSend.append("user_img", userImage);
        } else if (typeof userImage === "string") {
          // Existing image from backend
          formDataToSend.append("existing_user_img", userImage);
        }
      }

      if (formData.testimonial_type.value === "message") {
        formDataToSend.append("message", formData.message);
      } else if (formData.testimonial_type.value === "video") {
        // Handle testimonial video - check if it's a new File object or existing video
        if (testimonialVideo) {
          if (testimonialVideo instanceof File) {
            // New file selected
            formDataToSend.append("testimonial_video", testimonialVideo);
          } else if (typeof testimonialVideo === "string") {
            // Existing video from backend
            formDataToSend.append("existing_testimonial_video", testimonialVideo);
          }
        }
      }

      const response = await updateTestimonial(testimonialId, formDataToSend);
      
      if (response.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Testimonial updated successfully!"
        });
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/testimonials");
        }, 1500);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: response.error_info || "Failed to update testimonial"
        });
      }
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Failed to update testimonial"
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
            <Link href="/admin/testimonials" className="hover:underline">Testimonials</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">Edit Testimonial</span>
          </nav>
        </div>
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Edit Testimonial</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (modalMessage.show && modalMessage.type === "error" && !formData.user_name) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <nav className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/admin/testimonials" className="hover:underline">Testimonials</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">Edit Testimonial</span>
          </nav>
        </div>
        <div className="flex justify-between items-center gap-2">
          <h1 className="heading-main">Edit Testimonial</h1>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">Error: {modalMessage.message}</p>
          <button 
            onClick={() => router.push("/admin/testimonials")} 
            className="btn-primary"
          >
            Back to Testimonials
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
          <Link href="/admin/testimonials" className="hover:underline">Testimonials</Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold">{formData.user_name || 'Edit Testimonial'}</span>
        </nav>
      </div>
      <div className="flex justify-between items-center gap-2">
        <h1 className="heading-main">Edit Testimonial</h1>
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
            
            {/* Hidden file input */}
            <input
              type="file"
              className="hidden"
              id="user-image-upload"
              onChange={(e) => handleFileChange(e, "image")}
              accept="image/*"
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
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteVideo}
                        title="Delete Video"
                      >
                        <FaTrash className="w-5 h-5" />
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
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Updating..." : "Update"}
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