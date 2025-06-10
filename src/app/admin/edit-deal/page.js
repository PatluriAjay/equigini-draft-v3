"use client";
import BasicInfoForm from '@/components/admin/edit-deal/BasicInfoForm';
import DocumentManager from '@/components/admin/edit-deal/DocumentManager';
import DealStatusPanel from '@/components/admin/edit-deal/DealStatusPanel';
import React, { useState } from 'react';

const defaultDeal = {
  title: 'TechStartup Innovation Ltd',
  crmCode: 'TS-2024-001',
  sector: 'Technology',
  stage: 'Series A',
  ticketSize: '₹50L - ₹5Cr',
  status: 'Open',
  summary: 'AI-powered healthcare platform revolutionizing patient care through advanced diagnostics and treatment recommendations.',
  description: 'TechStartup Innovation Ltd is developing an AI-powered healthcare platform that combines machine learning algorithms with clinical expertise to provide accurate diagnostics and personalized treatment recommendations. The platform has shown promising results in pilot studies and is ready for Series A funding to scale operations and expand market reach.',
  priorityFlag: true,
  visibleToInvestors: true,
};
const defaultTeaserDocs = [
  { id: 1, name: "Company Overview.pdf", size: "2.3 MB", uploadedAt: "Dec 10, 2024" },
];
const defaultCollateralDocs = [
  { id: 2, name: "Financial Projections.xlsx", size: "1.8 MB", uploadedAt: "Dec 8, 2024" },
  { id: 3, name: "Investor Deck.pptx", size: "5.2 MB", uploadedAt: "Dec 5, 2024" },
];

export default function EditDealPage() {
  const [deal, setDeal] = useState(defaultDeal);
  const [teaserDocs, setTeaserDocs] = useState(defaultTeaserDocs);
  const [collateralDocs, setCollateralDocs] = useState(defaultCollateralDocs);

  // Handlers
  const handleDealChange = e => {
    const { name, value, type, checked } = e.target;
    setDeal(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSave = () => {/* API integration here */};
  const handleCancel = () => {/* navigation or reset */};
  const handleTeaserUpload = e => {
    const files = Array.from(e.target.files);
    setTeaserDocs(prev => [
      ...prev,
      ...files.map((file, idx) => ({
        id: Date.now() + idx,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        uploadedAt: new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
      }))
    ]);
    e.target.value = '';
  };
  const handleCollateralUpload = e => {
    const files = Array.from(e.target.files);
    setCollateralDocs(prev => [
      ...prev,
      ...files.map((file, idx) => ({
        id: Date.now() + idx,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        uploadedAt: new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
      }))
    ]);
    e.target.value = '';
  };
  const handleDownload = (doc, type) => {/* download logic */};
  const handleDelete = (doc, type) => {
    if (type === 'teaser') setTeaserDocs(prev => prev.filter(d => d.id !== doc.id));
    if (type === 'collateral') setCollateralDocs(prev => prev.filter(d => d.id !== doc.id));
  };

  // Sidebar data
  const metrics = { views: 247, downloads: 89, eois: 12, watchlisted: 34 };
  const checklist = [
    { label: 'Deal title provided', done: !!deal.title },
    { label: 'Sector selected', done: !!deal.sector },
    { label: 'Teaser document uploaded', done: teaserDocs.length > 0 },
    { label: 'Description completed', done: !!deal.description },
    { label: 'At least 2 collateral docs recommended', done: collateralDocs.length >= 2 },
    { label: 'Deal ready for publishing', done: !!deal.title && !!deal.sector && !!deal.description && teaserDocs.length > 0 && collateralDocs.length >= 2 },
  ];
  const recentChanges = [
    'Status changed to "Open"',
    'Document uploaded',
    'Deal created',
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="heading-main">Edit Deal</h1>
          <button className="btn-secondary w-full sm:w-auto">Preview Deal</button>
        </div>
        <BasicInfoForm values={deal} onChange={handleDealChange} />
        <DocumentManager
          teaserDocs={teaserDocs}
          collateralDocs={collateralDocs}
          onTeaserUpload={handleTeaserUpload}
          onCollateralUpload={handleCollateralUpload}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleCancel}>Cancel</button>
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
      <div className="w-full lg:w-96 flex-shrink-0">
        <DealStatusPanel status={deal.status} metrics={metrics} checklist={checklist} recentChanges={recentChanges} />
      </div>
    </div>
  );
}
