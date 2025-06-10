"use client";

import { useState, useEffect } from 'react';
import DealsGrid from '@/components/investor/deals/DealsGrid';
import StickyVerificationBar from '@/components/unverified-investor/dashboard/StickyVerificationBar';

export default function UnverifiedInvestorWatchlistPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchWatchlist = async () => {
      try {
        // Simulated API response
        const watchlistDeals = [
          {
            id: 1,
            slug: 'techflow-ai',
            title: "TechFlow AI",
            status: "Open",
            stage: "Series A",
            sector: "FinTech",
            summary: "AI-powered financial analytics platform revolutionizing investment decision-making for institutional investors across emerging markets.",
            ticketSize: "₹50L - ₹5Cr",
            irr: "25-30%",
            ndaStatus: true,
            requiresVerification: false,
            bookmarked: true
          },
          {
            id: 2,
            slug: 'greenenergy-solutions',
            title: "GreenEnergy Solutions",
            status: "Open",
            stage: "Series B",
            sector: "CleanTech",
            summary: "Leading renewable energy solutions provider with operations across 15 countries and growing market presence.",
            ticketSize: "₹1Cr - ₹10Cr",
            irr: "20-25%",
            ndaStatus: false,
            requiresVerification: false,
            bookmarked: true
          }
        ];

        setDeals(watchlistDeals);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleVerify = (id) => {
    // Handle verification for unverified investors
  };

  const handleView = (slug) => {
    // Handle view deal details
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="p-large">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-main">Your Watchlist</h1>
      </div>
      <div>
        <div className="heading-section mb-2">Saved Investment Opportunities</div>
        <DealsGrid 
          deals={deals} 
          onVerify={handleVerify} 
          onView={handleView} 
          isUnverified={true}
          isSavedDeals={true}
        />
      </div>
      <StickyVerificationBar />
    </div>
  );
} 