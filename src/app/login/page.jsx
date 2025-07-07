"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/common/AuthNavbar";
import ModalMessage from "@/components/investor/ModalMessage";
import { loginInvestor } from "@/services/api";
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });
  const [redirectPath, setRedirectPath] = useState("");
  const router = useRouter();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage({ show: false, type: "success", message: "" });
    setLoading(true);

    try {
      // Try login via API
      const result = await loginInvestor(username, password);
      
      if (result.status === "S") {
        // Store token
        localStorage.setItem("token", result.result_info.token);
        
        // Store user data - for both admin and investor, store in 'user' key
        // For admin: store userAuth data, for investor: store investor data
        const userData =
          result.result_info.userAuth.role === "admin"
            ? result.result_info.userAuth
            : result.result_info.investor;
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Calculate redirect path
        const calculatedRedirectPath = result.result_info.userAuth.role === "admin" 
          ? "/admin/dashboard" 
          : result.result_info.userAuth.role === "analyst"
          ? "/analyst/dashboard"
          : result.result_info.investor?.is_approved
          ? "/investor/dashboard"
          : "/unverified-investor/dashboard";
        
        // Store redirect path in component state
        setRedirectPath(calculatedRedirectPath);
        
        // Show success message
        setModalMessage({
          show: true,
          type: "success",
          message: "Login successful!"
        });
      } else {
        setModalMessage({
          show: true,
          type: "error",
          message: "Invalid email or password"
        });
      }
    } catch (err) {
      setModalMessage({
        show: true,
        type: "error",
        message: err.message || "Login failed"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF4]">
      <AuthNavbar
        rightText="Don't have an account?"
        rightLink="/register"
        rightLinkText="Create an account"
        className="fixed top-0 left-0 right-0 z-10"
      />
      <div className="w-full flex flex-col items-center py-8 justify-center flex-1">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
          <div className=" flex flex-col items-center">
            <Image
              src="/equigini-logo.webp"
              alt="Equigini Logo"
              width={150}
              height={80}
              className="mb-2"
              priority
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="http://localhost:3000/"
              className="text-primarycolor hover:text-primarycolor/80 transition-colors"
            >
              <FaArrowLeft className="w-3 h-3" />
            </Link>
            <span className="text-secondary3">Back to</span>
            <Link
              href="http://localhost:3000/"
              className="text-primarycolor font-medium hover:underline"
            >
              home
            </Link>
          </div>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label ">Username or email</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username or email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-center text-sm mt-1 mb-2">
              <span className="text-secondary3">Forgot your &nbsp;</span>
              <div>
                <Link
                  href="/forgot-password"
                  className="text-primarycolor font-medium hover:underline"
                >
                  password
                </Link>
                <span className="text-secondary3">?</span>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
      
      {/* Modal Message */}
      <ModalMessage
        show={modalMessage.show}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() => {
          setModalMessage({ show: false, type: "success", message: "" });
          // Redirect when user clicks close on success modal
          if (modalMessage.type === "success" && redirectPath) {
            router.push(redirectPath);
          }
        }}
      />
    </div>
  );
};

export default Login;
