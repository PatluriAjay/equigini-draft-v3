"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthNavbar from "@/components/common/AuthNavbar";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const otpLength = 6;

  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    // TODO: API call to verify OTP
    router.push("/confirmation");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF4] items-center ">
      <AuthNavbar />
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-card p-8 mt-8">
        <form className="flex flex-col items-center" onSubmit={handleVerify}>
          <h2 className="heading-main mb-2">Verify Your Email</h2>
          <p className="p-medium mb-4 text-center">
            A verification code has been sent to{" "}
            <span className="font-bold">{email}</span>
            .<br /> Please enter the 6-digit OTP below to verify your email.
          </p>
          <div className="flex gap-2 justify-center mb-4">
            {Array.from({ length: otpLength }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="[0-9]{1}"
                maxLength={1}
                className="form-input text-center text-lg w-10 h-12 p-0"
                value={otp[idx] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (!val) return;
                  const newOtp = otp.split("");
                  newOtp[idx] = val;
                  setOtp(newOtp.join("").padEnd(otpLength, ""));
                  // Move to next box
                  const next = document.getElementById(`otp-box-${idx + 1}`);
                  if (next) next.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    if (otp[idx]) {
                      const newOtp = otp.split("");
                      newOtp[idx] = "";
                      setOtp(newOtp.join("").padEnd(otpLength, ""));
                    } else if (idx > 0) {
                      const prev = document.getElementById(`otp-box-${idx - 1}`);
                      if (prev) prev.focus();
                    }
                  }
                }}
                id={`otp-box-${idx}`}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {error && <div className="text-red-600 p-small mb-2">{error}</div>}
          <button className="btn-primary w-full" type="submit">
            Verify & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
