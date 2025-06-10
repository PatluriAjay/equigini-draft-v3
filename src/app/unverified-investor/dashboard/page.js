"use client";
import { useEffect, useState } from 'react';
import ProfileStatus from '@/components/unverified-investor/dashboard/ProfileStatus';
import LockedDeals from '@/components/unverified-investor/dashboard/LockedDeals';
import StickyVerificationBar from '@/components/unverified-investor/dashboard/StickyVerificationBar';

export default function UnverifiedInvestorDashboard() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchData = async () => {
      try {
        // Simulated API calls
        const profileResponse = {
          status: "Pending Review",
          // Add other profile data as needed
        };

        const dealsResponse = [
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
          },
          {
            id: 3,
            slug: 'healthtech-solutions',
            title: "HealthTech Solutions",
            status: "Open",
            stage: "Series A",
            sector: "HealthTech",
            summary: "Digital health platform connecting patients with healthcare providers through innovative telemedicine solutions.",
            ticketSize: "₹25L - ₹2Cr",
            irr: "30-35%",
            ndaStatus: false,
            requiresVerification: false,
          },
          {
            id: 4,
            slug: 'edtech-innovators',
            title: "EdTech Innovators",
            status: "Open",
            stage: "Early Stage",
            sector: "EdTech",
            summary: "Revolutionary educational technology platform making quality education accessible through AI-driven personalized learning.",
            ticketSize: "₹10L - ₹1Cr",
            irr: "35-40%",
            ndaStatus: true,
            requiresVerification: false,
          }
          
        ];

        setProfileData(profileResponse);
        setDeals(dealsResponse);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="p-large"></p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="heading-main">Welcome back, Sarah</h1>
      
      {/* Profile Status Section */}
      <ProfileStatus status={profileData?.status} />

      {/* Locked Deals Section */}
      <LockedDeals deals={deals} />
      <StickyVerificationBar />
    </div>
  );
} 