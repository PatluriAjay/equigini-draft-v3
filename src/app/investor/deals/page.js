"use client"
import DealsFilterBar from '@/components/investor/deals/DealsFilterBar';
import RecentActivityBar from '@/components/investor/deals/RecentActivityBar';
import WatchlistBar from '@/components/investor/deals/WatchlistBar';
import DealsGrid from '@/components/investor/deals/DealsGrid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestorDealsPage() {
  // Placeholder filters
  const filterOptions = ['All Deals', 'FinTech', 'CleanTech', 'HealthTech', 'Early Stage', 'Growth', 'Pre-IPO'];
  const [selectedFilter, setSelectedFilter] = useState('All Deals');
  const geographies = ['India', 'SEA', 'Global'];
  const [selectedGeo, setSelectedGeo] = useState('India');
  const [sort, setSort] = useState('latest');
  const router = useRouter();

  // Placeholder activities
  const activities = [
    { text: 'Viewed TechFlow AI documents', type: 'viewed' },
    { text: 'Added 2 deals to watchlist', type: 'added' },
    { text: 'Signed NDA for HealthTech Solutions', type: 'signed' },
  ];

  // Placeholder watchlist
  const watchlist = [
    { id: 2, title: 'GreenEnergy Ventures', stage: 'Growth', sector: 'CleanTech', ticketSize: '₹1Cr - ₹10Cr' },
    { id: 4, title: 'EdTech Innovators', stage: 'Early Stage', sector: 'EdTech', ticketSize: '₹10L - ₹1Cr' },
    { id: 5, title: 'LogiTech Systems', stage: 'Growth', sector: 'Logistics', ticketSize: '₹75L - ₹7Cr' },
  ];

  // Placeholder deals
  const deals = [
    {
      id: 1,
      slug: 'techflow-ai',
      title: 'TechFlow AI',
      stage: 'Series A',
      sector: 'FinTech',
      status: 'Closing Soon',
      summary: 'AI-powered financial analytics platform revolutionizing investment decision-making for institutional investors across emerging markets.',
      ticketSize: '₹50L - ₹5Cr',
      irr: '25-30%',
      ndaStatus: true,
      requiresVerification: false,
    },
    {
      id: 2,
      slug: 'greenenergy-ventures',
      title: 'GreenEnergy Ventures',
      stage: 'Growth',
      sector: 'CleanTech',
      status: 'Open',
      summary: 'Leading renewable energy solutions provider with operations across 15 countries and growing market presence.',
      ticketSize: '₹1Cr - ₹10Cr',
      irr: '20-25%',
      ndaStatus: false,
      requiresVerification: false,
    },
    {
      id: 3,
      slug: 'healthtech-solutions',
      title: 'HealthTech Solutions',
      stage: 'Series B',
      sector: 'HealthTech',
      status: 'Open',
      summary: 'Digital health platform connecting patients with healthcare providers through innovative telemedicine solutions.',
      ticketSize: '₹25L - ₹2Cr',
      irr: '30-35%',
      ndaStatus: false,
      requiresVerification: false,
    },
    {
      id: 4,
      slug: 'edtech-innovators',
      title: 'EdTech Innovators',
      stage: 'Early Stage',
      sector: 'EdTech',
      status: 'Open',
      summary: 'Revolutionary educational technology platform making quality education accessible through AI-driven personalized learning.',
      ticketSize: '₹10L - ₹1Cr',
      irr: '35-40%',
      ndaStatus: true,
      requiresVerification: false,
    },
    {
      id: 5,
      slug: 'logitech-systems',
      title: 'LogiTech Systems',
      stage: 'Growth',
      sector: 'Logistics',
      status: 'Closing Soon',
      summary: 'Next-generation logistics optimization platform using AI to streamline supply chain operations and reduce costs.',
      ticketSize: '₹75L - ₹7Cr',
      irr: '22-28%',
      ndaStatus: false,
      requiresVerification: false,
    },
    {
      id: 6,
      slug: 'cybershield',
      title: 'CyberShield',
      stage: 'Series A',
      sector: 'CyberSecurity',
      status: 'Open',
      summary: 'Advanced cybersecurity solutions provider protecting enterprises from emerging digital threats with AI-powered defense systems.',
      ticketSize: '₹50L - ₹5Cr',
      irr: '28-32%',
      ndaStatus: true,
      requiresVerification: false,
    }
  ];

  // Filter logic (for integration, filter by sector, stage, etc.)
  const filteredDeals = selectedFilter === 'All Deals'
    ? deals
    : deals.filter(deal => deal.sector === selectedFilter || deal.stage === selectedFilter);

  // Handlers (integration-ready)
  const handleOpenFilters = () => {};
  const handleVerify = (id) => {};
  const handleView = (slug) => {
    router.push(`/investor/deals/${slug}`);
  };
  const handleViewAllWatchlist = () => {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-main">Investment Opportunities</h1>
      </div>
      <DealsFilterBar
        filters={filterOptions}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
        geographies={geographies}
        selectedGeo={selectedGeo}
        onGeoSelect={setSelectedGeo}
        sort={sort}
        onSort={setSort}
        onOpenFilters={handleOpenFilters}
      />
      {/* <WatchlistBar watchlist={watchlist} onViewAll={handleViewAllWatchlist} /> */}
      <div>
        <div className="heading-section mb-2">All Investment Opportunities</div>
        <DealsGrid deals={filteredDeals} onVerify={handleVerify} onView={handleView} />
      </div>
    </div>
  );
} 