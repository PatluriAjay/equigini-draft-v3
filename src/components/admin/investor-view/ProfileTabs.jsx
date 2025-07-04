"use client";
import React, { useState, useEffect } from "react";
import ProfileDetails from "./ProfileDetails";
import EOIList from "./EOIList";
import LegalDocsList from "./LegalDocsList";
import AccessLogsList from "./AccessLogsList";
import { getEOIsByInvestor } from "@/services/api";

const sampleDocs = [
  {
    type: "nda",
    deal: "Deal Alpha",
    version: 1,
    status: "signed",
    signed_date: "2024-12-11",
  },
  {
    type: "toc",
    deal: "Deal Beta",
    version: 2,
    status: "pending",
    signed_date: null,
  },
];
const sampleLogs = [
  {
    document: "NDA - Deal Alpha",
    type: "NDA",
    action: "viewed",
    timestamp: "2024-12-11 10:00",
    ip: "192.168.1.1",
    nda_status: true,
  },
  {
    document: "IM - Deal Beta",
    type: "IM",
    action: "downloaded",
    timestamp: "2024-12-12 14:30",
    ip: "192.168.1.2",
    nda_status: false,
  },
];

export default function ProfileTabs({ investor, source = "management" }) {
  const [active, setActive] = useState(0);
  const [eois, setEois] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch EOIs when EOI tab is active
  useEffect(() => {
    const fetchEOIs = async () => {
      if (active === 1 && investor?._id) {
        setLoading(true);
        try {
          const response = await getEOIsByInvestor(investor._id);
          setEois(response.result_info.eois || []);
        } catch (error) {
          console.error("Error fetching EOIs:", error);
          setEois([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEOIs();
  }, [active, investor?._id]);

  const tabs =
    source === "approval"
      ? ["Profile Details"]
      : [
          "Profile Details",
          "EOI Submissions",
          "Legal Documents",
          "Document Access Logs",
        ];

  return (
    <div className="bg-white rounded-xl py-4">
      <div className="flex gap-4 border-b border-bordercolor mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`px-3 py-2 font-medium text-sm border-b-2 transition-all ${
              active === idx
                ? "border-primarycolor text-primarycolor"
                : "border-transparent text-secondary3"
            }`}
            onClick={() => setActive(idx)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {active === 0 && <ProfileDetails investor={investor} />}
        {source !== "approval" && active === 1 && (
          <EOIList eois={eois} loading={loading} />
        )}
        {source !== "approval" && active === 2 && (
          <LegalDocsList docs={sampleDocs} />
        )}
        {source !== "approval" && active === 3 && (
          <AccessLogsList logs={sampleLogs} />
        )}
      </div>
    </div>
  );
}
