"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/common/AuthNavbar";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter your current password"
      });
      return false;
    }

    if (!formData.newPassword) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter a new password"
      });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setModalMessage({
        show: true,
        type: "error",
        message: "New password must be at least 6 characters long"
      });
      return false;
    }

    if (formData.newPassword === formData.currentPassword) {
      setModalMessage({
        show: true,
        type: "error",
        message: "New password must be different from current password"
      });
      return false;
    }

    if (!formData.confirmPassword) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please confirm your new password"
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setModalMessage({
        show: true,
        type: "error",
        message: "New passwords do not match"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setModalMessage({ show: false, type: "success", message: "" });

    try {
      // TODO: Replace with actual API call
      // const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const result = { status: "S", message: "Password changed successfully" };
      
      if (result.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Password changed successfully! You will be redirected to login."
        });
        
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: result.message || "Failed to change password"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "An error occurred while changing password"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF4]">
      <AuthNavbar
        rightText="Remember your password?"
        rightLink="/login"
        rightLinkText="Sign In"
        className="fixed top-0 left-0 right-0 z-10"
      />
      <div className="w-full flex flex-col items-center py-8 justify-center flex-1">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
          {/* <div className="flex flex-col items-center">
            <Image
              src="/equigini-logo.webp"
              alt="Equigini Logo"
              width={150}
              height={80}
              className="mb-2"
              priority
            />
          </div> */}
          {/* <div className="mb-4 flex items-center gap-2">
            <Link
              href="/login"
              className="text-primarycolor hover:text-primarycolor/80 transition-colors"
            >
              <FaArrowLeft className="w-3 h-3" />
            </Link>
            <span className="text-secondary3">Back to</span>
            <Link
              href="/login"
              className="text-primarycolor font-medium hover:underline"
            >
              login
            </Link>
          </div> */}
          
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-primarycolor mb-2 text-center">Change Password</h1>
          </div>

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  className="form-input pr-10"
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary3 hover:text-primarycolor transition-colors"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                >
                  {showPasswords.currentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  className="form-input pr-10"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary3 hover:text-primarycolor transition-colors"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPasswords.newPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <p className="text-xs text-secondary3 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-input pr-10"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary3 hover:text-primarycolor transition-colors"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPasswords.confirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-4"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          {/* <div className="mt-6 text-center">
            <span className="text-secondary3 text-sm">Need help? </span>
            <Link
              href="/contact"
              className="text-primarycolor font-medium hover:underline text-sm"
            >
              Contact support
            </Link>
          </div> */}
        </div>
      </div>
      
      {/* Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => {
          setModalMessage({ show: false, type: "success", message: "" });
        }}
      />
    </div>
  );
};

export default ChangePassword;
