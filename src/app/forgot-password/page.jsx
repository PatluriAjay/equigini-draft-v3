"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/common/AuthNavbar";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaArrowLeft, FaEye, FaEyeSlash, FaEnvelope, FaShieldAlt, FaLock } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const router = useRouter();

  const steps = [
    { id: 1, name: "Email", icon: FaEnvelope, description: "Enter your email address" },
    { id: 2, name: "Verify OTP", icon: FaShieldAlt, description: "Enter the 6-digit code" },
    { id: 3, name: "New Password", icon: FaLock, description: "Set your new password" },
  ];

  const handleInputChange = (e) => {
    const { name, value, maxLength } = e.target;
    
    if (name.startsWith("otp")) {
      // OTP input handling
      const idx = parseInt(name.replace("otp", ""), 10);
      let otpArr = [...formData.otp];
      otpArr[idx] = value.slice(0, 1); // Only allow 1 digit per box
      setFormData(prev => ({ ...prev, otp: otpArr }));
      
      // Auto-focus next box if value entered
      if (value && maxLength === 1 && idx < 5) {
        const next = document.querySelector(`input[name=otp${idx + 1}]`);
        if (next) next.focus();
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateEmail = () => {
    if (!formData.email) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter your email address"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter a valid email address"
      });
      return false;
    }
    
    return true;
  };

  const validateOTP = () => {
    if (formData.otp.some(digit => !digit)) {
      setModalMessage({
        show: true,
        type: "error",
        message: "Please enter the complete 6-digit OTP"
      });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
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
        message: "Password must be at least 6 characters long"
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
        message: "Passwords do not match"
      });
      return false;
    }

    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setModalMessage({ show: false, type: "success", message: "" });

    try {
      // TODO: Replace with actual API call
      // const result = await sendForgotPasswordOTP(formData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const result = { status: "S", message: "OTP sent successfully" };
      
      if (result.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "OTP sent to your email address"
        });
        setStep(2);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: result.message || "Failed to send OTP"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "An error occurred while sending OTP"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }

    setLoading(true);
    setModalMessage({ show: false, type: "success", message: "" });

    try {
      // TODO: Replace with actual API call
      // const result = await verifyForgotPasswordOTP(formData.email, formData.otp.join(""));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const result = { status: "S", message: "OTP verified successfully" };
      
      if (result.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "OTP verified successfully"
        });
        setStep(3);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: result.message || "Invalid OTP"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "An error occurred while verifying OTP"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setModalMessage({ show: false, type: "success", message: "" });

    try {
      // TODO: Replace with actual API call
      // const result = await resetPassword(formData.email, formData.otp.join(""), formData.newPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const result = { status: "S", message: "Password reset successfully" };
      
      if (result.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "Password reset successfully! You will be redirected to login."
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: result.message || "Failed to reset password"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "An error occurred while resetting password"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setModalMessage({ show: false, type: "success", message: "" });

    try {
      // TODO: Replace with actual API call
      // const result = await sendForgotPasswordOTP(formData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const result = { status: "S", message: "OTP resent successfully" };
      
      if (result.status === "S") {
        setModalMessage({
          show: true,
          type: "success",
          message: "OTP resent to your email address"
        });
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: result.message || "Failed to resend OTP"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "An error occurred while resending OTP"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((stepItem, index) => (
        <div key={stepItem.id} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step >= stepItem.id 
              ? 'bg-primarycolor border-primarycolor text-white' 
              : 'border-bordercolor text-secondary3'
          }`}>
            <stepItem.icon size={14} />
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step > stepItem.id ? 'bg-primarycolor' : 'bg-bordercolor'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          className="form-input"
          placeholder="Enter your email address"
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full mt-4"
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleOTPSubmit} className="w-full flex flex-col gap-4">
      <div>
        <label className="form-label">Enter 6-digit OTP</label>
        <p className="text-secondary3 text-sm mb-3">
          We've sent a 6-digit code to {formData.email}
        </p>
        <div className="flex gap-2 justify-center">
          {formData.otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              name={`otp${index}`}
              className="w-12 h-12 text-center border border-bordercolor rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycolor/20 focus:border-primarycolor text-lg font-semibold"
              maxLength={1}
              value={digit}
              onChange={handleInputChange}
              disabled={loading}
            />
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        
        <button
          type="button"
          onClick={handleResendOTP}
          className="text-primarycolor font-medium hover:underline text-sm"
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4">
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
        {loading ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );

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
          <div className="mb-4 flex items-center gap-2">
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
          </div>
          
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-primarycolor mb-2 text-center">Forgot Password</h1>
          </div>

          {renderStepIndicator()}

          {step === 1 && renderEmailStep()}
          {step === 2 && renderOTPStep()}
          {step === 3 && renderPasswordStep()}
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

export default ForgotPassword;
