"use client";
import Link from "next/link";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DealListPage from "@/components/admin/investor-view/DealListPage";

const mockDeals = [
  { id: 1, name: "Deal Alpha", value: "$10,000", status: "Active", created: "2025-06-01" },
  { id: 2, name: "Deal Beta", value: "$7,500", status: "Pending", created: "2025-05-28" },
  { id: 3, name: "Deal Gamma", value: "$12,000", status: "Closed", created: "2025-05-20" },
  { id: 4, name: "Deal Delta", value: "$5,000", status: "Active", created: "2025-05-15" },
  { id: 5, name: "Deal Epsilon", value: "$8,200", status: "Pending", created: "2025-05-10" },
  { id: 6, name: "Deal Zeta", value: "$9,100", status: "Closed", created: "2025-05-05" },
  { id: 7, name: "Deal Eta", value: "$6,300", status: "Active", created: "2025-05-01" },
  { id: 8, name: "Deal Theta", value: "$11,400", status: "Pending", created: "2025-04-28" },
  { id: 9, name: "Deal Iota", value: "$13,000", status: "Closed", created: "2025-04-20" },
  { id: 10, name: "Deal Kappa", value: "$4,800", status: "Active", created: "2025-04-15" },
];

const PAGE_SIZE = 5;

export default function DealsPage() {
  return <DealListPage />;
}
