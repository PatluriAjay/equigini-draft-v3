"use client";
import React, { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import EOIList from "./EOIList";
import LegalDocsList from "./LegalDocsList";
import AccessLogsList from "./AccessLogsList";
import EngagementList from "./EngagementList";

const sampleEOIs = [
  { deal: "Deal Alpha", date: "2024-12-10", status: "pending", amount: 500000 },
  {
    deal: "Deal Beta",
    date: "2024-12-12",
    status: "approved",
    amount: 1000000,
  },
];
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
const sampleEngagements = [
  {
    deal: "Deal Alpha",
    action: "Viewed",
    date: "2024-12-10",
    details: "Viewed deal details",
  },
  {
    deal: "Deal Beta",
    action: "Saved",
    date: "2024-12-12",
    details: "Added to watchlist",
  },
];

export default function ProfileTabs({ investor, source = "management" }) {
  const [active, setActive] = useState(0);

  const tabs =
    source === "approval"
      ? ["Profile Details", 
        // "Legal Documents"
      ]
      : [
          "Profile Details",
          "EOI Submissions",
          "Legal Documents",
          "Document Access Logs",
          "Deal Engagement",
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
        {source !== "approval" && active === 1 && <EOIList eois={sampleEOIs} />}
        {/* {active === (source === 'approval' ? 1 : 2) && <LegalDocsList docs={sampleDocs} />} */}
        {active !== "approval" && active === 2 && (
          <LegalDocsList docs={sampleDocs} />
        )}
        {source !== "approval" && active === 3 && (
          <AccessLogsList logs={sampleLogs} />
        )}
        {source !== "approval" && active === 4 && (
          <EngagementList engagements={sampleEngagements} />
        )}
      </div>
    </div>
  );
}
