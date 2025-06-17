import React, { useEffect, useState } from "react";
import { FaRegEye } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';

export default function DealDetail({ dealSlug }) {
  const [deal, setDeal] = useState(null);
  const [activeTab, setActiveTab] = useState("Executive Summary");

  const tabSections = [
    { label: "Executive Summary", key: "Executive Summary" },
    { label: "Investment Thesis", key: "Investment Thesis" },
    { label: "Sector Overview", key: "Sector Overview" },
    { label: "Deal Structure & Ticket Size", key: "Deal Structure & Ticket Size" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeal({
        slug: dealSlug,
        title: "Series A Investment in ZappyPay",
        status: "Open",
        sector: "FinTech",
        stage: "Series A",
        ticketSize: "₹50L - ₹5Cr",
        timeline: "6-8 Weeks",
        expectedIrr: "25-30%",
        location: "India",
        summary: "ZappyPay is revolutionizing digital payments in India with its innovative UPI-based platform targeting small merchants and rural customers. The company has demonstrated strong product-market fit with 2M+ active users and ₹500Cr+ monthly transaction volume.",
        documents: [
          { name: "ZappyPay_Teaser.pdf", type: "teaser", size: "2.3 MB", url: "#" },
          { name: "Investment_Memorandum.pdf", type: "memorandum", size: "8.7 MB", url: "#" },
          { name: "Financial_Model.xlsx", type: "financial", size: "3.1 MB", url: "#" },
          { name: "Pitch_Deck.pdf", type: "pitch", size: "12 MB", url: "#" },
          { name: "Legal_Documents.pdf", type: "legal", size: "1.2 MB", url: "#" },
        ],
        executiveSummary: "ZappyPay is revolutionizing digital payments in India...",
        thesis: "Investment thesis content goes here...",
        sectorOverview: "FinTech sector overview...",
        structure: "Deal structure and ticket size details...",
      });
    }, 500);
  }, [dealSlug]);

  if (!deal) return null;

  return (
    <div className="flex flex-col min-h-screen font-primary">
      {/* Top Banner Image with Title Overlay */}
      <div className="w-full h-48 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550565118-3a14e8d0386f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
          alt="Finance Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 sidebar-gradient opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <h1 className="deal-heading-lg-override text-white mb-0">{deal.title}</h1>
            <span className={`badge ${
              deal.status === "Open" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {deal.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full pb-20">
        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          {/* Key Info Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card-bordered">
              <div className="flex items-center gap-2 mb-2">
                <div className="card-icon-div">
                  <svg className="card-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 1h6v2H7V5zm8 5a1 1 0 10-2 0v4a1 1 0 102 0v-4zm-3-1a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="card-heading">Ticket Size</p>
              <p className="card-paragraph2">{deal.ticketSize}</p>
            </div>
            <div className="card-bordered">
              <div className="flex items-center gap-2 mb-2">
                <div className="card-icon-div">
                  <svg className="card-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="card-heading">Expected IRR</p>
              <p className="card-paragraph2">{deal.expectedIrr}</p>
            </div>
            <div className="card-bordered">
              <div className="flex items-center gap-2 mb-2">
                <div className="card-icon-div">
                  <svg className="card-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="card-heading">Timeline</p>
              <p className="card-paragraph2">{deal.timeline}</p>
            </div>
            <div className="card-bordered">
              <div className="flex items-center gap-2 mb-2">
                <div className="card-icon-div">
                  <svg className="card-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="card-heading">Sector</p>
              <p className="card-paragraph2">{deal.sector}</p>
            </div>
          </div>

          {/* Deal Teaser */}
          <div className="card-bordered bg-purple-50 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="card-heading text-primarycolor">Deal Teaser</p>
                <p className="card-paragraph">{deal.documents[0].name} <span className="text-gray-400">({deal.documents[0].size})</span></p>
              </div>
              <div className="flex gap-2">
                {/* <button className="btn-icon-only">
                  <FaRegEye className="w-5 h-5 text-primarycolor" />
                </button> */}
                <button className="btn-icon-only">
                  <MdFileDownload className="w-5 h-5 text-primarycolor" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap -mb-px">
              {tabSections.map(tab => (
                <button
                  key={tab.key}
                  className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primarycolor text-primarycolor'
                      : 'border-transparent text-secondary3 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === "Executive Summary" && (
              <div>
                <h3 className="heading-section">Executive Summary</h3>
                <p className="p-medium">{deal.executiveSummary}</p>
              </div>
            )}
            {activeTab === "Investment Thesis" && (
              <div>
                <h3 className="heading-section">Investment Thesis</h3>
                <p className="p-medium">{deal.thesis}</p>
              </div>
            )}
            {activeTab === "Sector Overview" && (
              <div>
                <h3 className="heading-section">Sector Overview</h3>
                <p className="p-medium">{deal.sectorOverview}</p>
              </div>
            )}
            {activeTab === "Deal Structure & Ticket Size" && (
              <div>
                <h3 className="heading-section">Deal Structure & Ticket Size</h3>
                <p className="p-medium">{deal.structure}</p>
              </div>
            )}
          </div>

          {/* Document Vault - Separate Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="heading-section mb-6">Document Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deal.documents.slice(1).map((doc) => (
                <div key={doc.name} className="card-bordered hover:border-primarycolor transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="card-heading text-primarycolor">{doc.name}</p>
                      <p className="card-paragraph">{doc.size}</p>
                      <p className="text-xs text-secondary3 capitalize">{doc.type}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* <button className="btn-icon-only">
                        <FaRegEye className="w-5 h-5 text-primarycolor" />
                      </button> */}
                      <button className="btn-icon-only">
                        <MdFileDownload className="w-5 h-5 text-primarycolor" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky EOI */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-50 border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="p-medium mb-0-override">Ready to invest in {deal.title}?</p>
          <button className="btn-tertiary font-thin ">
            Express Interest
          </button>
        </div>
      </div>
    </div>
  );
}