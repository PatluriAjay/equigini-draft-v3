"use client";
import { useState, useEffect, useMemo } from "react"; 
import { FaLock, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { DealIconMap } from "./dealIcons";
import { getAllDeals, getAllEOIs, toggleDealInWatchlist, isDealInWatchlist } from "../../../services/api";
import Link from "next/link";
import Loader from "../../common/Loader";
import { usePathname } from "next/navigation";

export default function DealsGrid({ 
  maxDeals, 
  layout = "default", 
  filters = {}, 
  searchTerm = "", 
  dropdownOptions = {
    sectors: [],
    stages: [],
    statuses: [],
    ticketSizes: [],
  }
}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eoiStatus, setEoiStatus] = useState({});
  const [bookmarkStatus, setBookmarkStatus] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState({});
  const pathname = usePathname();

  // Check if we're on the dashboard page
  const isDashboardPage = pathname === "/investor/dashboard";

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

  // Fetch deals and EOI status on component mount
  useEffect(() => {
    fetchDealsAndStatus();
  }, []);

  const fetchDealsAndStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch deals and EOIs in parallel
      const [dealsResponse, eoiResponse] = await Promise.all([
        getAllDeals(),
        getAllEOIs()
      ]);
      
      if (dealsResponse.result_info) {
        setDeals(dealsResponse.result_info);
        
        // Check bookmark status for all deals only on dashboard page
        if (isDashboardPage) {
          const investorId = getInvestorId();
          if (investorId) {
            const bookmarkMap = {};
            const loadingMap = {};
            
            dealsResponse.result_info.forEach(deal => {
              bookmarkMap[deal._id] = false;
              loadingMap[deal._id] = false;
            });
            
            setBookmarkStatus(bookmarkMap);
            setBookmarkLoading(loadingMap);
            
            // Check bookmark status for each deal
            await Promise.all(
              dealsResponse.result_info.map(async (deal) => {
                try {
                  const result = await isDealInWatchlist(investorId, deal._id);
                  if (result.status === "S") {
                    setBookmarkStatus(prev => ({
                      ...prev,
                      [deal._id]: result.result_info.is_in_watchlist
                    }));
                  }
                } catch (error) {
                  console.error(`Error checking bookmark status for deal ${deal._id}:`, error);
                }
              })
            );
          }
        }
      }
      
      // Get current user's investor ID
      const investorId = getInvestorId();
      
      // Create EOI status map
      if (eoiResponse.result_info && investorId) {
        const eoiMap = {};
        eoiResponse.result_info.forEach(eoi => {
          if (eoi.investor_id === investorId) {
            eoiMap[eoi.deal_id] = true;
          }
        });
        setEoiStatus(eoiMap);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      setError("Failed to fetch deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (dealId, e) => {
    e.stopPropagation(); // Prevent card click
    const investorId = getInvestorId();
    if (!investorId) {
      console.error("Investor ID not available");
      return;
    }

    setBookmarkLoading(prev => ({ ...prev, [dealId]: true }));
    try {
      const result = await toggleDealInWatchlist(investorId, dealId);
      if (result.status === "S") {
        setBookmarkStatus(prev => ({
          ...prev,
          [dealId]: result.result_info.action === "added"
        }));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setBookmarkLoading(prev => ({ ...prev, [dealId]: false }));
    }
  };

  // Transform backend data to frontend format
  const transformDealData = (deal) => {
    // Helper function to construct image URL
    const getImageUrl = (imageData) => {
      if (!imageData || !imageData.path) return null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      // Convert Windows path separators to URL format and ensure proper URL structure
      const cleanPath = imageData.path.replace(/\\/g, '/');
      return `${baseUrl}/${cleanPath}`;
    };

    return {
      id: deal._id,
      name: deal.deal_title || '',
      slug: deal.slug || '',
      sector: deal.sector || '',
      stage: deal.stage || '',
      geography: deal.geography || '',
      range: deal.ticket_size_range || '',
      description: deal.summary || deal.full_description || '',
      fullDescription: deal.full_description || deal.summary || '',
      status: deal.status || '',
      priority: deal.deal_priority || '',
      visibility: deal.visibility || '',
      imageUrl: getImageUrl(deal.image),
      dealIconUrl: getImageUrl(deal.deal_icon),
      teaserDocument: deal.teaser_document,
      dealCollateral: deal.deal_collateral,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
      irr: deal.expected_irr || "-", 
      eoi_submitted: eoiStatus[deal._id] || false,
      // For filtering - use the actual string values since they're stored as strings
      sectorId: deal.sector,
      stageId: deal.stage,
      statusId: deal.status,
      ticketSizeId: deal.ticket_size_range,
    };
  };

  // Apply filters to deals
  const filteredDeals = useMemo(() => {
    let filtered = deals.map(transformDealData);
    
    // Filter out private deals - only show public deals to investors
    filtered = filtered.filter(deal => deal.visibility !== "Private");
    console.log("After visibility filter (public only):", filtered.length);
    
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.name.toLowerCase().includes(searchLower) ||
        deal.sector.toLowerCase().includes(searchLower) ||
        deal.stage.toLowerCase().includes(searchLower) ||
        deal.description.toLowerCase().includes(searchLower)
      );
      console.log("After search filter:", filtered.length);
    }
    
    // Apply sector filter - compare with the actual sector name
    if (filters.sector && filters.sector !== "" && dropdownOptions?.sectors) {
      // Find the sector label for the selected ID
      const selectedSectorOption = dropdownOptions.sectors.find(opt => opt.value === filters.sector);
      const sectorLabel = selectedSectorOption ? selectedSectorOption.label : filters.sector;
      
      filtered = filtered.filter(deal => deal.sector === sectorLabel);
    }
    
    // Apply stage filter - compare with the actual stage name
    if (filters.stage && filters.stage !== "" && dropdownOptions?.stages) {
      // Find the stage label for the selected ID
      const selectedStageOption = dropdownOptions.stages.find(opt => opt.value === filters.stage);
      const stageLabel = selectedStageOption ? selectedStageOption.label : filters.stage;
      
      filtered = filtered.filter(deal => deal.stage === stageLabel);
      // console.log("After stage filter:", filtered.length, "Stage label:", stageLabel);
    }
    
    // Apply status filter - compare with the actual status name
    if (filters.status && filters.status !== "" && dropdownOptions?.statuses) {
      // Find the status label for the selected ID
      const selectedStatusOption = dropdownOptions.statuses.find(opt => opt.value === filters.status);
      const statusLabel = selectedStatusOption ? selectedStatusOption.label : filters.status;
      
      filtered = filtered.filter(deal => deal.status === statusLabel);
      // console.log("After status filter:", filtered.length, "Status label:", statusLabel);
    }
    
    // Apply ticket size filter - compare with the actual ticket size name
    if (filters.ticketSize && filters.ticketSize !== "" && dropdownOptions?.ticketSizes) {
      // Find the ticket size label for the selected ID
      const selectedTicketSizeOption = dropdownOptions.ticketSizes.find(opt => opt.value === filters.ticketSize);
      const ticketSizeLabel = selectedTicketSizeOption ? selectedTicketSizeOption.label : filters.ticketSize;
      
      filtered = filtered.filter(deal => deal.range === ticketSizeLabel);
      // console.log("After ticket size filter:", filtered.length, "Ticket size label:", ticketSizeLabel);
    }
    
    return filtered;
  }, [deals, filters, searchTerm, eoiStatus, dropdownOptions]);

  const displayDeals = maxDeals ? filteredDeals.slice(0, maxDeals) : filteredDeals;
  const gridCols = layout === "compact" ? "lg:grid-cols-3" : "lg:grid-cols-4";

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error}</div>
          <button 
            onClick={fetchDealsAndStatus}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && (!deals || deals.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">No deals available at the moment.</div>
          <button 
            onClick={fetchDealsAndStatus}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Check if filters are applied but no results found
  const hasActiveFilters = Object.values(filters).some(filter => filter && filter !== "");
  const hasSearchTerm = searchTerm && searchTerm.trim() !== "";
  if (!loading && deals.length > 0 && filteredDeals.length === 0 && (hasActiveFilters || hasSearchTerm)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">
            {hasSearchTerm && hasActiveFilters 
              ? "No deals match your search and filter criteria." 
              : hasSearchTerm 
                ? "No deals match your search criteria." 
                : "No deals match your current filters."
            }
          </div>
          {/* <div className="text-sm text-gray-500 mb-4">Try adjusting your search or filter criteria.</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            Clear All
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridCols} gap-6 `}>
      {displayDeals && displayDeals.length > 0 ? (
        displayDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col relative group cursor-pointer"
          >
            {/* EOI Submitted Badge */}
            {deal.eoi_submitted && (
              <span className="absolute top-2 right-2 bg-[#A330AE] text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10">
                EOI Submitted
              </span>
            )}
            
            {/* Clickable area for the main card content */}
            <Link href={`/investor/deals/${deal.slug}`} className="flex-1">
              <div className="cursor-pointer">
                {/* Deal Image */}
                <div className="w-full mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                  <img
                    src={deal.imageUrl || "https://placehold.co/400x180?text=No+Image"}
                    alt={deal.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                  />
                  {/* Bookmark Button - Only show on dashboard page */}
                  {isDashboardPage && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBookmarkToggle(deal.id, e);
                      }}
                      disabled={bookmarkLoading[deal.id]}
                      className="absolute bottom-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 disabled:opacity-50 z-10"
                      title={bookmarkStatus[deal.id] ? "Remove from bookmarks" : "Add to bookmarks"}
                    >
                      {bookmarkLoading[deal.id] ? (
                        <div className="w-4 h-4 border-2 border-primarycolor border-t-transparent rounded-full animate-spin"></div>
                      ) : bookmarkStatus[deal.id] ? (
                        <GoBookmarkFill className="w-4 h-4 text-primarycolor" />
                      ) : (
                        <GoBookmark className="w-4 h-4 text-gray-600 hover:text-primarycolor" />
                      )}
                    </button>
                  )}
                </div>
                {/* Icon, Title, Status Row */}
                <div className="flex items-center gap-3 mb-2 px-4">
                  <div className="card-icon-div ">
                    {/* First try to use custom deal icon from backend, then fallback to sector-based icon */}
                    {deal.dealIconUrl ? (
                      <img 
                        src={deal.dealIconUrl} 
                        alt={`${deal.sector} icon`}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      DealIconMap[deal.sector] || DealIconMap[deal.icon] || (
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          {deal.sector ? deal.sector.charAt(0) : 'D'}
                        </div>
                      )
                    )}
                  </div>
                  <h3 className="card-heading text-secondary-override line-clamp-2 flex-1">
                    {deal.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deal.status === "Open"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {deal.status || "Open"}
                  </span>
                </div>
                {/* Sector & Stage Grid */}
                <div className="grid grid-cols-2 gap-2 mb-2 px-4 justify-between">
                  <div className="card-paragraph2 flex flex-col items-start">
                    <p className="text-sm font-medium text-primarycolor">Sector:</p>
                    <p className="text-sm">{deal.sector}</p>
                  </div>
                  <div className="card-paragraph2 flex flex-col items-start">
                    <p className="text-sm font-medium text-primarycolor">Stage:</p>
                    <p className="text-sm">{deal.stage}</p>
                  </div>
                </div>
                {/* Description Paragraph */}
                <div className="px-4 mb-2">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {deal.description}
                  </p>
                </div>
                {/* Ticket Size & IRR */}
                <div className="grid grid-cols-2 gap-2 mb-2 px-4 justify-between">
                  <div className="card-paragraph2 flex flex-col items-start">
                    <p className="text-sm font-medium text-primarycolor">Ticket Size:</p>
                    <p className="text-sm">{deal.range}</p>
                  </div>
                  <div className="card-paragraph2 flex flex-col items-start">
                    <p className="text-sm font-medium text-primarycolor">Expected IRR:</p>
                    <p className="text-sm">{deal.irr}</p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Button Row - Separate from clickable area */}
            <div className="w-full px-2 pb-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Link href={`/investor/deals/${deal.slug}`} className="flex-1">
                <button
                  className={` px-2 py-2 w-full rounded-full bg-[#A330AE10] font-light text-black border border-secondary hover:bg-primarycolor hover:text-white focus:ring-transparent hover:border-primarycolor font-extralight text-sm transition-colors duration-200 `}
                >
                  Read More
                </button>
              </Link>
              <Link 
                href={deal.teaserDocument && deal.teaserDocument.path ? 
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${deal.teaserDocument.path.replace(/\\/g, '/')}` : 
                  `#`
                } 
                target="_blank"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  disabled={deal.status === "Closed"}
                  className={` px-2 py-2 w-full rounded-full bg-primarycolor font-light text-white border border-primarycolor hover:bg-white hover:text-primarycolor focus:ring-transparent font-extralight text-sm transition-colors duration-200 `}
                >
                  Download Teaser
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full p-small text-secondary3">No deals found.</p>
      )}
    </div>
  );
}
