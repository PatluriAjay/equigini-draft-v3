"use client";
import DealDetail from "@/components/investor/deals/DealDetail";

export default function DealDetailPage({ params }) {
  // params.slug will be the deal slug
  // Integration-ready: fetch deal data using params.slug
  return (
    <div className="min-h-screen">
      <DealDetail dealSlug={params.slug} />
    </div>
  );
} 