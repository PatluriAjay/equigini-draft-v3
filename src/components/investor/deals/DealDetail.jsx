import React, { useEffect, useState } from "react";
import Button from "../../admin/deals/Button";
import { FaRegEye, FaDownload } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';

export default function DealDetail({ dealSlug }) {
  const [deal, setDeal] = useState(null);
  const [activeTab, setActiveTab] = useState("Executive Summary");

  const tabSections = [
    { label: "Executive Summary", key: "Executive Summary" },
    { label: "Investment Thesis", key: "Investment Thesis" },
    { label: "Sector Overview", key: "Sector Overview" },
    { label: "Deal Structure & Ticket Size", key: "Deal Structure & Ticket Size" },
    { label: "Deal Documents", key: "Deal Documents" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeal({
        slug: dealSlug,
        title: "TechFlow AI",
        status: "Open",
        sector: "Fintech",
        stage: "Growth",
        location: "Mumbai, India",
        irr: "25-30% IRR",
        summary: "AI-powered financial analytics platform revolutionizing investment decision-making for institutional investors across emerging markets with proven revenue model and strong market traction.",
        ndaSigned: true,
        documents: [
          { name: "TechFlow_AI_Overview.pdf", type: "overview", size: "2.3 MB", url: "#" },
          { name: "TechFlow_AI_Pitch_Deck.pptx", type: "pitch", size: "12 MB", url: "#" },
          { name: "Investment_Memorandum.pdf", type: "im", size: "8.7 MB", url: "#" },
          { name: "Financial_Model.xlsx", type: "model", size: "3.1 MB", url: "#" },
          { name: "Term_Sheet.pdf", type: "term", size: "1.2 MB", url: "#" },
        ],
        executiveSummary: `TechFlow AI is pioneering the next generation of financial analytics through advanced artificial intelligence and machine learning algorithms. Our platform processes vast amounts of financial data in real-time, providing institutional investors with unprecedented insights into market trends, risk assessment, and investment opportunities.\n\nFounded in 2021, we have successfully onboarded 15+ institutional clients including major banks and investment firms, processing over $2B in transaction data monthly with a proven track record of improving investment returns by 18-25%.`,
        thesis: "Investment thesis content goes here...",
        sectorOverview: "Fintech",
        structure: "Deal structure and ticket size content goes here...",
      });
    }, 500);
  }, [dealSlug]);
  if (!deal) return null;

  return (
    <div className="relative min-h-screen pb-20">
      <div className="mx-auto ">
        {/* Header - always visible */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-main mb-1">{deal.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2 flex-col">
              <p className="text-sm text-secondary3"><span className="font-bold-custom">Status:</span> {deal.status}</p>
              <p className="text-sm text-secondary3 "><span className="font-bold-custom">Sector:</span> {deal.sector}</p>
              <p className="text-sm text-secondary3 "><span className="font-bold-custom">Stage:</span> {deal.stage}</p>
              <p className="text-sm text-secondary3 "><span className="font-bold-custom">Location:</span> {deal.location}</p>
              <p className="text-sm text-secondary3"><span className="font-bold-custom">Expected IRR:</span> {deal.irr}</p>
            </div>
            <p className="p-large ">{deal.summary}</p>
            {/* Teaser Document */}
            {deal.documents && deal.documents.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <p className="text-xs text-secondary3 font-bold-custom">Teaser Document:</p>
                <p className="text-xs font-medium">{deal.documents[0].name} <span className="text-gray-400">({deal.documents[0].size})</span></p>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full"><FaRegEye className="w-5 h-5 text-black" /></button>
                  <button className="p-2 rounded-full"><MdFileDownload className="w-5 h-5 text-black" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 flex flex-wrap gap-2">
          {tabSections.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-all duration-150 ${activeTab === tab.key ? 'border-primarycolor text-primarycolor' : 'border-transparent text-secondary3 hover:text-primarycolor'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {activeTab === "Executive Summary" && (
          <div className="mb-4">
            <div className="card-heading-secondary">Executive Summary</div>
            <p className="p-medium whitespace-pre-line">{deal.executiveSummary}</p>
          </div>
        )}
        {activeTab === "Deal Overview Document" && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="card-heading-secondary">Deal Overview Document</div>
                <div className="p-medium text-gray-700">{deal.documents[0].name} <span className="text-xs text-gray-400">({deal.documents[0].size})</span></div>
              </div>
              <Button as="a" href={deal.documents[0].url} variant="primary" download>Download</Button>
            </div>
          </div>
        )}
        {activeTab === "Investment Thesis" && (
          <div className="mb-4">
            <div className="card-heading-secondary">Investment Thesis</div>
            <p className="p-medium whitespace-pre-line">{deal.thesis}</p>
          </div>
        )}
        {activeTab === "Sector Overview" && (
          <div className="mb-4">
            <div className="card-heading-secondary">Sector Overview</div>
            <p className="p-medium whitespace-pre-line">{deal.sectorOverview}</p>
          </div>
        )}
        {activeTab === "Deal Structure & Ticket Size" && (
          <div className="mb-4">
            <div className="card-heading-secondary">Deal Structure & Ticket Size</div>
            <p className="p-medium whitespace-pre-line">{deal.structure}</p>
          </div>
        )}
        {activeTab === "Deal Documents" && (
          <div className="mb-4">
            <div className="card-heading-secondary mb-2">Deal Documents</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deal.documents.slice(1).map((doc, idx) => (
                <div key={doc.name} className="flex items-center justify-between border border-bordercolor rounded-lg px-4 py-3 bg-white">
                  <div>
                    <div className="font-medium text-sm text-primarycolor mb-1">{doc.name}</div>
                    <div className="text-xs text-gray-400 mb-1">{doc.size}</div>
                    <div className="text-gray-700 capitalize text-sm ">{doc.type.replace("_", " ")}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full"><FaRegEye className="w-5 h-5 text-black" /></button>
                    <button className="p-2 rounded-full"><MdFileDownload className="w-5 h-5 text-black" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-5 left-0 right-0 container">
        <div className="mx-auto py-4 flex justify-end">
          <Button variant="primary" className="btn-primary">Submit EOI</Button>
        </div>
      </div>
    </div>
  );
}