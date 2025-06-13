'use client';
import StatsCards from '@/components/investor/dashboard/StatsCards';
import RecentActivity from '@/components/investor/dashboard/RecentActivity';
import OpportunitiesFilter from '@/components/investor/dashboard/OpportunitiesFilter';
import OpportunitiesList from '@/components/investor/dashboard/OpportunitiesList';
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function InvestorDashboardPage() {
  // Placeholder stats
  const stats = {
    activeDeals: 24,
    watchlist: 8,
    invested: 3,
    ndasSigned: 12,
  };
  // Placeholder activities
  const activities = [
    { text: 'Viewed TechFlow AI Series A documents', type: 'viewed', time: '2 hours ago' },
    { text: 'Added GreenEnergy Ventures to watchlist', type: 'added', time: '1 day ago' },
    { text: 'Signed NDA for FinTech Solutions', type: 'signed', time: '3 days ago' },
  ];
  // Placeholder filters
  const filterOptions = ['All', 'FinTech', 'CleanTech', 'HealthTech', 'Early Stage', 'Growth'];
  const [selectedFilter, setSelectedFilter] = useState('All');
  // Placeholder opportunities
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'TechFlow AI',
      stage: 'Early',
      sector: 'FinTech',
      status: 'Closing Soon',
      summary: 'AI-powered financial analytics platform revolutionizing investment decision-making for institutional investors.',
      ticketSize: '₹50L - ₹5Cr',
      irr: '25-30%',
      bookmarked: false,
    },
    {
      id: 2,
      title: 'GreenEnergy Ventures',
      stage: 'Growth',
      sector: 'CleanTech',
      status: 'Open',
      summary: 'Leading renewable energy solutions provider with operations across 15 countries and growing market presence.',
      ticketSize: '₹1Cr - ₹10Cr',
      irr: '20-25%',
      bookmarked: true,
    },
    {
      id: 3,
      title: 'HealthTech Solutions',
      stage: 'Debt',
      sector: 'HealthTech',
      status: 'Open',
      summary: 'Digital health platform connecting patients with healthcare providers through innovative telemedicine solutions.',
      ticketSize: '₹25L - ₹2Cr',
      irr: '30-35%',
      bookmarked: true,
    },
    {
      id: 4,
      title: 'EdTech Innovators',
      stage: 'Pre-IPO',
      sector: 'EdTech',
      status: 'Open',
      summary: 'Personalized learning platform using AI to adapt educational content to individual student needs and learning styles.',
      ticketSize: '₹10L - ₹1Cr',
      irr: '35-40%',
      bookmarked: false,
    },
    {
      id: 5,
      title: 'AgriTech Solutions',
      stage: 'Early',
      sector: 'AgriTech',
      status: 'Open',
      summary: 'Smart farming solutions leveraging IoT and AI to optimize agricultural productivity and sustainability.',
      ticketSize: '₹50L - ₹3Cr',
      irr: '20-25%',
      bookmarked: false,
    },
    {
      id: 6,
      title: 'SmartCity Innovations',
      stage: 'Growth',
      sector: 'SmartCity',
      status: 'Open',
      summary: 'Urban infrastructure solutions enhancing city living through smart technology and data-driven decision making.',
      ticketSize: '₹1Cr - ₹8Cr',
      irr: '15-20%',
      bookmarked: true,
    },
  ]);

  // Filter logic (for integration, filter by sector, stage, etc.)
  const filteredOpportunities = selectedFilter === 'All'
    ? opportunities
    : opportunities.filter(op => op.sector === selectedFilter || op.stage === selectedFilter);

  // Bookmark handler (integration-ready)
  const handleBookmark = (id) => {
    setOpportunities(prev => prev.map(op =>
      op.id === id ? { ...op, bookmarked: !op.bookmarked } : op
    ));
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div>
        <h1 className="heading-main">Welcome back, Sarah</h1>
      </div>
      {/* Make stats and recent activity side by side */}
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="w-full md:w-1/2 min-w-[260px]">
          <StatsCards stats={stats} />
        </div>
        <div className="w-full md:w-1/2 min-w-[260px]">
          <RecentActivity activities={activities} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="heading-main">Latest Deals</div>
          <Link
            href="/investor/deals"
            className="flex items-center gap-1 text-primarycolor font-medium text-sm hover:underline btn-link"
          >
            View All <FaArrowRight size={14} />
          </Link>
        </div>
        {/* <OpportunitiesFilter
          filters={filterOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        /> */}
        <OpportunitiesList
          opportunities={filteredOpportunities.slice(0, 4)}
          onBookmark={handleBookmark}
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-section mb-2">My Saved Deals</h2>
            <Link
              href="/investor/saved-deals"
              className="flex items-center gap-1 text-primarycolor font-medium text-sm hover:underline btn-link"
            >
              View All <FaArrowRight size={14} />
            </Link>
          </div>
          <OpportunitiesList
            opportunities={opportunities.filter(op => op.bookmarked).slice(0, 4)}
            onBookmark={handleBookmark}
          />
        </div>
      </div>
    </div>
  );
}
