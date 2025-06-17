"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    admin: {
      email: "admin.equigini@gmail.com",
      password: "123456",
      redirect: "/admin/dashboard",
    },
    investor: {
      email: "investor.equigini@gmail.com",
      password: "123456",
      redirect: "/investor/dashboard",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check for admin credentials
      if (
        username === DUMMY_CREDENTIALS.admin.email &&
        password === DUMMY_CREDENTIALS.admin.password
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
        router.push(DUMMY_CREDENTIALS.admin.redirect);
        return;
      }

      // Check for investor credentials
      if (
        username === DUMMY_CREDENTIALS.investor.email &&
        password === DUMMY_CREDENTIALS.investor.password
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
        router.push(DUMMY_CREDENTIALS.investor.redirect);
        return;
      }

      // If no matching credentials
      setError("Invalid email or password");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF4]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/equigini-logo.webp"
            alt="Equigini Logo"
            width={150}
            height={80}
            className="mb-2"
            priority
          />
          {/* <h1 className="text-2xl font-bold text-center text-primarycolor font-primary mb-2">
            Log in
          </h1> */}
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
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex justify-center text-sm mt-1 mb-2">
            <span className="text-secondary3">Forgot your &nbsp;</span>
            <div>
              <Link
                href="#"
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
        <div className="mt-6 text-center text-sm text-secondary3">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="text-primarycolor font-medium hover:underline"
          >
            Create an account.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
