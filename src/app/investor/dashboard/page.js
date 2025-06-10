'use client';
import StatsCards from '@/components/investor/dashboard/StatsCards';
import RecentActivity from '@/components/investor/dashboard/RecentActivity';
import OpportunitiesFilter from '@/components/investor/dashboard/OpportunitiesFilter';
import OpportunitiesList from '@/components/investor/dashboard/OpportunitiesList';
import { useState } from 'react';

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
  const opportunities = [
    {
      id: 1,
      title: 'TechFlow AI',
      stage: 'Series A',
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
      stage: 'Series B',
      sector: 'HealthTech',
      status: 'Open',
      summary: 'Digital health platform connecting patients with healthcare providers through innovative telemedicine solutions.',
      ticketSize: '₹25L - ₹2Cr',
      irr: '30-35%',
      bookmarked: false,
    },
    {
      id: 4,
      title: 'EdTech Innovators',
      stage: 'Early Stage',
      sector: 'EdTech',
      status: 'Open',
      summary: 'Personalized learning platform using AI to adapt educational content to individual student needs and learning styles.',
      ticketSize: '₹10L - ₹1Cr',
      irr: '35-40%',
      bookmarked: false,
    },
    {
      id: 5,
      title: 'LogiTech Systems',
      stage: 'Growth',
      sector: 'Logistics',
      status: 'Open',
      summary: 'Smart logistics and supply chain management platform optimizing delivery routes and warehouse operations.',
      ticketSize: '₹1.5L - ₹7Cr',
      irr: '22-28%',
      bookmarked: false,
    },
  ];
  // Filter logic (for integration, filter by sector, stage, etc.)
  const filteredOpportunities = selectedFilter === 'All'
    ? opportunities
    : opportunities.filter(op => op.sector === selectedFilter || op.stage === selectedFilter);

  // Bookmark handler (integration-ready)
  const handleBookmark = (id) => {
    // Implement API call or state update here
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <h1 className="heading-main">Welcome back, Sarah</h1>
      </div>
      <StatsCards stats={stats} />
      <RecentActivity activities={activities} />
      <div>
        <div className="heading-section mb-2">Investment Opportunities</div>
        <OpportunitiesFilter
          filters={filterOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
        <OpportunitiesList
          opportunities={filteredOpportunities}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );
}
