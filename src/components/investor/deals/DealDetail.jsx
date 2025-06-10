import React, { useEffect, useState } from "react";
import Button from "../../admin/deals/Button";
// TODO: Import subcomponents for each section (Overview, Executive Summary, Documents, etc.)

export default function DealDetail({ dealSlug }) {
  // Integration-ready: fetch deal data using dealSlug
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with real API call
    setLoading(true);
    setTimeout(() => {
      setDeal({
        slug: dealSlug,
        title: "TechFlow AI",
        status: "Open",
        sector: "Fintech",
        stage: "Series A",
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
      setLoading(false);
    }, 500);
  }, [dealSlug]);

  // if (loading) return <div className="p-8 text-center p-large">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600 p-large">{error}</div>;
  if (!deal) return null;

  return (
    <div className="relative min-h-screen pb-20">
      <div className="mx-auto ">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-main mb-1">{deal.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="badge bg-green-100 text-green-800">{deal.status}</span>
              <span className="badge bg-blue-100 text-blue-800">{deal.sector}</span>
              {/* <span className="badge bg-gray-100 text-gray-700">{deal.stage}</span> */}
              <span className="badge bg-gray-100 text-gray-700">{deal.location}</span>
              <span className="badge bg-purple-100 text-purple-800">{deal.irr}</span>
            </div>
            <p className="p-large max-w-2xl">{deal.summary}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {/* {deal.ndaSigned && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-xs font-medium mb-2">NDA Signed<br />You have access to all deal documents and detailed information.</div>
            )} */}
            <Button as="a" href={deal.documents[0].url} variant="primary" download>Download Overview</Button>
          </div>
        </div>

        {/* Deal Overview Document */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="card-heading-secondary">Deal Overview Document</div>
              <div className="p-medium text-gray-700">{deal.documents[0].name} <span className="text-xs text-gray-400">({deal.documents[0].size})</span></div>
            </div>
            <Button as="a" href={deal.documents[0].url} variant="primary" download>Download</Button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-4">
          <div className="card-heading-secondary">Executive Summary</div>
          <p className="p-medium whitespace-pre-line">{deal.executiveSummary}</p>
        </div>

        {/* Investment Thesis */}
        <div className="mb-4">
          <div className="card-heading-secondary">Investment Thesis</div>
          <p className="p-medium whitespace-pre-line">{deal.thesis}</p>
        </div>

        {/* Sector Overview */}
        <div className="mb-4">
          <div className="card-heading-secondary">Sector Overview</div>
          <p className="p-medium whitespace-pre-line">{deal.sectorOverview}</p>
        </div>

        {/* Deal Structure & Ticket Size */}
        <div className="mb-4">
          <div className="card-heading-secondary">Deal Structure & Ticket Size</div>
          <p className="p-medium whitespace-pre-line">{deal.structure}</p>
        </div>

        {/* Deal Documents */}
        <div className="mb-4">
          <div className="card-heading-secondary mb-2">Deal Documents</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deal.documents.slice(1).map((doc, idx) => (
              <div key={doc.name} className="flex items-center justify-between border border-bordercolor rounded-lg px-4 py-3 bg-white">
                <div>
                  <div className="font-medium text-sm text-primarycolor mb-1">{doc.name}</div>
                  <div className="text-xs text-gray-400 mb-1">{doc.size}</div>
                  <div className="badge bg-gray-100 text-gray-700 capitalize text-xs">{doc.type.replace("_", " ")}</div>
                </div>
                <div className="flex gap-2">
                  <Button as="a" href={doc.url} variant="secondary" download>Download</Button>
                  <Button as="a" href={doc.url} variant="primary" target="_blank" rel="noopener noreferrer">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
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