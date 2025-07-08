"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/investor/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF4] items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card p-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="heading-main mb-2">Registration Submitted</h2>
          <p className="p-medium mb-4">
            Your profile has been submitted. 
            {/* You will be notified upon approval. */}
          </p>
          <div className="mt-4">
            <span className="text-primarycolor text-4xl">🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
