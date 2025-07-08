"use client";
import DealDetail from "@/components/investor/deals/DealDetail";

export default function DealDetailPage({ params }) {
  return (
    <div className="min-h-screen">
      <DealDetail dealSlug={params.id} />
    </div>
  );
}