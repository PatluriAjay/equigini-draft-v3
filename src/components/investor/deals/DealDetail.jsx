import React, { useEffect, useState } from "react";
import { MdFileDownload } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import Link from "next/link";
import Image from "next/image";
import EOIModal from "../EOIModal";
import ModalMessage from "../ModalMessage";
import NDAModal from "../NDAModal";
import Loader from "../../common/Loader";
import { getDealBySlug, checkEOIStatus, checkNDAStatus, toggleDealInWatchlist, isDealInWatchlist } from "../../../services/api";

export default function DealDetail({ dealSlug }) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Summary");
  const [showEOIModal, setShowEOIModal] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgType, setMsgType] = useState("success");
  const [msgText, setMsgText] = useState("");
  const [eoiForm, setEoiForm] = useState({
    ticketSize: '',
    rationale: '',
    timeline: '',
    contactMethod: '',
    contactType: null,
    contactValue: '',
  });
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [eoiSubmitted, setEoiSubmitted] = useState(false);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Check if there are any signed documents to show
  const hasSignedDocuments = deal && (
    (deal.eoi_submissions && deal.eoi_submissions.length > 0) ||
    (deal.nda_agreements && deal.nda_agreements.length > 0)
  );

  const tabSections = [
    { label: "Summary", key: "Summary" },
    { label: "Deal Structure & Ticket Size", key: "Deal Structure & Ticket Size" },
    ...(hasSignedDocuments ? [{ label: "Signed Documents", key: "Signed Documents" }] : []),
  ];

  // If current active tab is "Signed Documents" but there are no signed documents, switch to "Summary"
  useEffect(() => {
    if (activeTab === "Signed Documents" && !hasSignedDocuments) {
      setActiveTab("Summary");
    }
  }, [hasSignedDocuments, activeTab]);

  // Get investor ID from localStorage
  const getInvestorId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user._id || user.id || null;
      } catch (parseError) {
        console.error("Error parsing user data from localStorage:", parseError);
        return null;
      }
    }
    return null;
  };

  const handleBookmarkToggle = async () => {
    const investorId = getInvestorId();
    if (!investorId || !deal) {
      console.error("Investor ID or deal not available");
      return;
    }

    setBookmarkLoading(true);
    try {
      const result = await toggleDealInWatchlist(investorId, deal._id);
      if (result.status === "S") {
        setIsBookmarked(result.result_info.action === "added");
        setMsgType("success");
        setMsgText(result.result_info.message);
        setShowMsg(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setMsgType("error");
      setMsgText("Failed to update bookmark. Please try again.");
      setShowMsg(true);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Check bookmark status
  const checkBookmarkStatus = async (investorId, dealId) => {
    try {
      const result = await isDealInWatchlist(investorId, dealId);
      if (result.status === "S") {
        setIsBookmarked(result.result_info.is_in_watchlist);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  useEffect(() => {
    const fetchDealAndStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch deal data
        const dealResponse = await getDealBySlug(dealSlug);
        if (dealResponse.result_info) {
          setDeal(dealResponse.result_info);
          
          // Fetch EOI, NDA, and bookmark status
          setStatusLoading(true);
          try {
            const investorId = getInvestorId();
            
            if (investorId) {
              // Use Promise.all to fetch all statuses in parallel
              const [eoiResponse, ndaResponse] = await Promise.all([
                checkEOIStatus(investorId, dealResponse.result_info._id),
                checkNDAStatus(investorId, dealResponse.result_info._id)
              ]);
              
              setEoiSubmitted(eoiResponse.result_info?.submitted || false);
              setNdaSigned(ndaResponse.result_info?.is_signed || false);
              
              // Check bookmark status
              await checkBookmarkStatus(investorId, dealResponse.result_info._id);
            } else {
              // Set default values if no investor ID
              setEoiSubmitted(false);
              setNdaSigned(false);
              setIsBookmarked(false);
            }
          } catch (statusError) {
            console.error("Error fetching status:", statusError);
            // Set default values if status check fails
            setEoiSubmitted(false);
            setNdaSigned(false);
            setIsBookmarked(false);
          } finally {
            setStatusLoading(false);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching deal:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dealSlug) {
      fetchDealAndStatus();
    }
  }, [dealSlug]);

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Error: {error}</div>
          <Link href="/investor/deals" className="btn-primary">
            Back to Deals
          </Link>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Deal not found</div>
          <Link href="/investor/deals" className="btn-primary">
            Back to Deals
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to construct image URL
  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.path) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const cleanPath = imageData.path.replace(/\\/g, '/');
    return `${baseUrl}/${cleanPath}`;
  };

  // Helper function to construct document URL
  const getDocumentUrl = (documentData) => {
    if (!documentData || !documentData.path) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const cleanPath = documentData.path.replace(/\\/g, '/');
    return `${baseUrl}/${cleanPath}`;
  };

  // Helper function to construct signed document URL
  const getSignedDocumentUrl = (pdfPath) => {
    if (!pdfPath) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const cleanPath = pdfPath.replace(/\\/g, '/');
    return `${baseUrl}/${cleanPath}`;
  };

  // Helper function to format date in DD-MM-YYYY format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Transform backend data to frontend format
  const transformedDeal = {
    slug: deal.slug || '',
    title: deal.deal_title || '',
    status: deal.status || '',
    sector: deal.sector || '',
    stage: deal.stage || '',
    ticketSize: deal.ticket_size_range || '',
    timeline: deal.timeline , // Use backend value or fallback
    expectedIrr: deal.expected_irr , // Use backend value or fallback
    location: deal.geography || '',
    summary: deal.summary || deal.full_description || '',
    full_description: deal.full_description || '',
    imageUrl: getImageUrl(deal.image),
    teaserDocument: deal.teaser_document,
    dealCollateral: deal.deal_collateral,
    executiveSummary: deal.summary || deal.full_description || '',
    thesis: "Investment thesis content goes here...", // Default value
    sectorOverview: "Sector overview content goes here...", // Default value
    structure: "Deal structure and ticket size details...", // Default value
  };

  return (
    <div className="flex flex-col min-h-screen font-primary">
        <nav className="flex items-center justify-between text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Link href="/investor" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/investor/deals" className="hover:underline">Deals</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold truncate block max-w-full">{transformedDeal.title}</span>
          </div>
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            {bookmarkLoading ? (
              <div className="w-6 h-6 border-2 border-primarycolor border-t-transparent rounded-full animate-spin"></div>
            ) : isBookmarked ? (
              <GoBookmarkFill className="w-6 h-6 text-primarycolor" />
            ) : (
              <GoBookmark className="w-6 h-6 text-gray-600 hover:text-primarycolor" />
            )}
          </button>
        </nav>
      {/* Top Banner Image with Title Overlay */}
      <div className="w-full h-48 relative overflow-hidden">
        {transformedDeal.imageUrl ? (
          <Image 
            src={transformedDeal.imageUrl}
            alt={transformedDeal.title}
            width={800}
            height={192}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-4xl text-gray-400">{transformedDeal.title.charAt(0)}</div>
          </div>
        )}
        <div className="absolute inset-0 sidebar-gradient opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <h1 className="deal-heading-lg-override text-white mb-0">{transformedDeal.title}</h1>
            <span className={`badge ${
              transformedDeal.status === "Open" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {transformedDeal.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full pb-5">
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
              <p className="card-paragraph2">{transformedDeal.ticketSize}</p>
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
              <p className="card-paragraph2">{transformedDeal.expectedIrr}</p>
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
              <p className="card-paragraph2">{transformedDeal.timeline}</p>
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
              <p className="card-paragraph2">{transformedDeal.sector}</p>
            </div>
          </div>

          {/* Deal Teaser */}
          {transformedDeal.teaserDocument && (
            <div className="card-bordered bg-purple-50 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="card-heading text-primarycolor">Deal Teaser</p>
                  <p className="card-paragraph">{transformedDeal.teaserDocument.originalname} <span className="text-gray-400">({(transformedDeal.teaserDocument.size / 1024 / 1024).toFixed(1)} MB)</span></p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="btn-icon-only"
                    onClick={() => {
                      const documentUrl = getDocumentUrl(transformedDeal.teaserDocument);
                      if (documentUrl) {
                        window.open(documentUrl, '_blank');
                      }
                    }}
                  >
                    <FaEye className="w-5 h-5 text-primarycolor" />
                  </button>
                </div>
              </div>
            </div>
          )}

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
            {activeTab === "Summary" && (
              <div>
                <h3 className="heading-section">Summary</h3>
                <p className="p-medium">{transformedDeal.summary}</p>
                <div className="mt-6">
                  <h4 className="heading-section text-lg">Full Description</h4>
                  <p className="p-medium">{transformedDeal.full_description}</p>
                </div>
              </div>
            )}
            {activeTab === "Deal Structure & Ticket Size" && (
              <div>
                {/* <h3 className="heading-section">Deal Structure & Ticket Size</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ticket Size</h4>
                    <p className="p-medium">{transformedDeal.ticketSize}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Expected IRR</h4>
                    <p className="p-medium">{transformedDeal.expectedIrr}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Timeline</h4>
                    <p className="p-medium">{transformedDeal.timeline}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Sector</h4>
                    <p className="p-medium">{transformedDeal.sector}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Signed Documents" && (
              <div>
                <h3 className="heading-section mb-6">Signed Documents</h3>
                
                {/* Combined Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EOI Documents */}
                  {deal.eoi_submissions && deal.eoi_submissions.map((eoi, index) => (
                    <div key={`eoi-${eoi._id || index}`} className="card-bordered hover:border-primarycolor transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="card-heading text-primarycolor">EOI Submission</p>
                                                        <p className="card-paragraph text-sm">
                                Submitted on: {formatDate(eoi.createdAt)}
                              </p>
                          {/* <p className="text-xs text-secondary3">
                            Status: {eoi.is_approved ? 'Approved' : 'Pending'}
                          </p> */}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="btn-icon-only"
                            onClick={() => {
                              const documentUrl = getSignedDocumentUrl(eoi.pdf_path);
                              if (documentUrl) {
                                window.open(documentUrl, '_blank');
                              }
                            }}
                            title="View EOI Document"
                          >
                            <FaEye className="w-5 h-5 text-primarycolor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* NDA Documents */}
                  {deal.nda_agreements && deal.nda_agreements.map((nda, index) => (
                    <div key={`nda-${nda._id || index}`} className="card-bordered hover:border-primarycolor transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="card-heading text-primarycolor">NDA Agreement</p>
                                                        <p className="card-paragraph text-sm">
                                Signed on: {formatDate(nda.signed_date)}
                              </p>
                          {/* <p className="text-xs text-secondary3">
                            Status: {nda.nda_signed ? 'Signed' : 'Pending'}
                          </p> */}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="btn-icon-only"
                            onClick={() => {
                              const documentUrl = getSignedDocumentUrl(nda.pdf_path);
                              if (documentUrl) {
                                window.open(documentUrl, '_blank');
                              }
                            }}
                            title="View NDA Document"
                          >
                            <FaEye className="w-5 h-5 text-primarycolor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show message if no signed documents */}
                {(!deal.eoi_submissions || deal.eoi_submissions.length === 0) && 
                 (!deal.nda_agreements || deal.nda_agreements.length === 0) && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">No signed documents available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submit an EOI or sign an NDA to see your documents here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Document Vault */}
          {transformedDeal.dealCollateral && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="heading-section mb-6">Document Vault</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(transformedDeal.dealCollateral).map(([type, document]) => (
                  <div key={type} className="card-bordered hover:border-primarycolor transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="card-heading text-primarycolor">{document.originalname}</p>
                        <p className="card-paragraph">{(document.size / 1024 / 1024).toFixed(1)} MB</p>
                        <p className="text-xs text-secondary3 capitalize">{type}</p>
                      </div>
                      <div className="flex gap-2">
                        {ndaSigned ? (
                          <button 
                            className="btn-icon-only"
                            onClick={() => {
                              const documentUrl = getDocumentUrl(document);
                              if (documentUrl) {
                                window.open(documentUrl, '_blank');
                              }
                            }}
                          >
                            <FaEye className="w-5 h-5 text-primarycolor" />
                          </button>
                        ) : (
                          <button 
                            className="btn-icon-only" 
                            onClick={() => setShowNDAModal(true)}
                            title="Sign NDA to view document"
                          >
                            <FaEye className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky EOI - Only show if EOI not submitted */}
      {!eoiSubmitted && (
        <div className="sm:fixed bottom-0 left-0 right-0 bg-purple-50 border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="p-medium mb-0-override">Ready to invest in {transformedDeal.title}?</p>
            <button className="btn-tertiary font-thin " onClick={() => setShowEOIModal(true)}>
              Express Interest
            </button>
          </div>
        </div>
      )}

      {showEOIModal && (
        <EOIModal
          show={showEOIModal}
          onClose={() => setShowEOIModal(false)}
          onSubmit={async (form) => {
            setShowEOIModal(false);
            setEoiForm(form);
            setEoiSubmitted(true); // Update local state
            setMsgType("success");
            setMsgText("Your Expression of Interest has been submitted successfully.");
            setShowMsg(true);
            
            // Refresh EOI status from backend
            try {
              const userData = localStorage.getItem('user');
              if (userData) {
                const user = JSON.parse(userData);
                const investorId = user._id || user.id;
                const eoiResponse = await checkEOIStatus(investorId, deal._id);
                setEoiSubmitted(eoiResponse.result_info?.submitted || false);
              }
            } catch (error) {
              console.error("Error refreshing EOI status:", error);
            }
          }}
          dealTitle={transformedDeal.title}
          dealId={deal._id}
        />
      )}
      {showNDAModal && (
        <NDAModal
          show={showNDAModal}
          onClose={() => setShowNDAModal(false)}
          onSubmit={async () => {
            setShowNDAModal(false);
            setNdaSigned(true); // Update local state
            setMsgType("success");
            setMsgText("NDA Accepted. You can now download the document.");
            setShowMsg(true);
            
            // Refresh NDA status from backend
            try {
              const userData = localStorage.getItem('user');
              if (userData) {
                const user = JSON.parse(userData);
                const investorId = user._id || user.id;
                const ndaResponse = await checkNDAStatus(investorId, deal._id);
                setNdaSigned(ndaResponse.result_info?.is_signed || false);
              }
            } catch (error) {
              console.error("Error refreshing NDA status:", error);
            }
          }}
          dealTitle={transformedDeal.title}
          dealId={deal._id}
        />
      )}
      <ModalMessage
        show={showMsg}
        onClose={() => setShowMsg(false)}
        type={msgType}
        message={msgText}
      />
    </div>
  );
}