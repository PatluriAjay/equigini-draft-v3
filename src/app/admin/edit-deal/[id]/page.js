"use client";
import BasicInfoForm from '@/components/admin/edit-deal/BasicInfoForm';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDealById, updateDeal } from '@/services/api';
import Loader from '@/components/common/Loader';
import Link from 'next/link';

export default function EditDealPage({ params }) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!params.id) {
          throw new Error("Deal ID is required");
        }

        const response = await getDealById(params.id);
        if (response.status === "S" && response.result_info) {
          const dealData = response.result_info;
          
          // Transform backend data to frontend format
          setDeal({
            title: dealData.deal_title || '',
            crmCode: dealData.crm_code || '',
            sector: dealData.sector || '',
            stage: dealData.stage || '',
            ticketSize: dealData.ticket_size_range || '',
            status: dealData.status || 'Open',
            summary: dealData.summary || '',
            description: dealData.full_description || dealData.summary || '',
            // Map deal_priority string to boolean for UI
            priorityFlag: dealData.deal_priority === true || dealData.deal_priority === 'true' || dealData.deal_priority === 'High',
            visibleToInvestors: dealData.visibility === 'Public',
            geography: dealData.geography || '',
            expectedIrr: dealData.expected_irr || '',
            timeline: dealData.timeline || '',
            slug: dealData.slug || '',
            // Include document data - preserve existing documents
            teaser_document: dealData.teaser_document || null,
            deal_collateral: dealData.deal_collateral || {},
            // Include image data
            image: dealData.image || null,
            deal_icon: dealData.deal_icon || null,
          });
        } else {
          throw new Error(response.error_info || "Failed to fetch deal");
        }
      } catch (err) {
        console.error("Error fetching deal:", err);
        setError(err.message || "Failed to fetch deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [params.id]);

  // Handlers
  const handleDealChange = e => {
    const { name, value, type, checked } = e.target;
    setDeal(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add basic deal data - send text values, not IDs
      formData.append("deal_title", deal.title || '');
      formData.append("sector", deal.sector || '');
      formData.append("stage", deal.stage || '');
      formData.append("ticket_size_range", deal.ticketSize || '');
      formData.append("status", deal.status || 'Open');
      formData.append("summary", deal.summary || '');
      formData.append("full_description", deal.description || '');
      // Map priorityFlag boolean to string for backend
      formData.append("deal_priority", deal.priorityFlag ? 'High' : 'Normal');
      formData.append("visibility", deal.visibleToInvestors ? 'Public' : 'Private');
      formData.append("geography", deal.geography || '');
      formData.append("expected_irr", deal.expectedIrr || '');
      formData.append("timeline", deal.timeline || '');
      formData.append("slug", deal.slug || '');

      // Debug: Log the form data being sent
      console.log('Form data being sent:');
      console.log('- deal_title:', deal.title);
      console.log('- sector:', deal.sector);
      console.log('- stage:', deal.stage);
      console.log('- ticket_size_range:', deal.ticketSize);
      console.log('- status:', deal.status);
      console.log('- deal_priority:', deal.priorityFlag);
      console.log('- visibility:', deal.visibleToInvestors ? 'Public' : 'Private');

      // Add files if they exist and are new (not from backend)
      if (deal.teaser_document && deal.teaser_document.file) {
        formData.append("teaser_document", deal.teaser_document.file);
        console.log('Uploading new teaser document:', deal.teaser_document.file.name);
      }
      
      if (deal.image && deal.image.file) {
        formData.append("image", deal.image.file);
        console.log('Uploading new image:', deal.image.file.name);
      }
      
      if (deal.deal_icon && deal.deal_icon.file) {
        formData.append("deal_icon", deal.deal_icon.file);
        console.log('Uploading new deal icon:', deal.deal_icon.file.name);
      }

      // Handle collateral documents - preserve existing ones and add new ones
      const existingCollateral = {};
      let hasNewFiles = false;
      
      // Debug: Log the current deal_collateral object
      console.log('Current deal_collateral object:', deal.deal_collateral);
      
      // First, collect existing documents that should be preserved
      if (deal.deal_collateral) {
        Object.entries(deal.deal_collateral).forEach(([category, document]) => {
          console.log(`Checking ${category}:`, document);
          if (document && !document.file && document.path) {
            // This is an existing document that should be preserved
            existingCollateral[category] = document;
            console.log(`Preserving existing ${category} document`);
          } else if (document && document.file) {
            // This is a new file being uploaded
            console.log(`Found new ${category} file:`, document.file.name);
          }
        });
      }
      
      // Then, add new files being uploaded
      if (deal.deal_collateral) {
        Object.entries(deal.deal_collateral).forEach(([category, document]) => {
          if (document && document.file) {
            // This is a new file being uploaded
            const fieldName = `deal_collateral_${category}`;
            formData.append(fieldName, document.file);
            hasNewFiles = true;
            console.log(`Uploading new ${category} document:`, document.file.name);
          }
        });
      }
      
      // Add the existing collateral data as a hidden field that the backend can process
      if (Object.keys(existingCollateral).length > 0) {
        formData.append("existing_collateral", JSON.stringify(existingCollateral));
        console.log('Preserving existing collateral:', Object.keys(existingCollateral));
      }
      
      if (hasNewFiles) {
        console.log('Uploading new collateral files');
      }

      const response = await updateDeal(params.id, formData);
      if (response.status === "S") {
        router.push("/admin/deals");
      } else {
        throw new Error(response.error_info || "Failed to update deal");
      }
    } catch (error) {
      console.error("Error saving deal:", error);
      setError(error.message || "Failed to update deal");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/deals");
  };

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <nav className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/admin/deals" className="hover:underline">Deal Management</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">Edit Deal</span>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="heading-main">Edit Deal</h1>
          <button 
            className="btn-secondary w-full sm:w-auto"
            onClick={() => router.push("/admin/deals")}
          >
            Back to Deals
          </button>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="heading-main">Edit Deal</h1>
          <button 
            className="btn-secondary w-full sm:w-auto"
            onClick={() => router.push("/admin/deals")}
          >
            Back to Deals
          </button>
        </div>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Deal not found</p>
          <button 
            onClick={() => router.push("/admin/deals")} 
            className="btn-primary"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-5">
      <div className="flex-1 min-w-0">
        <div>
          <nav className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/admin" className="hover:underline">Home</Link>
            <span className="text-gray-400">{">"}</span>
            <Link href="/admin/deals" className="hover:underline">Deal Management</Link>
            <span className="text-gray-400">{">"}</span>
            <span className="font-semibold">{deal.title || 'Edit Deal'}</span>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="heading-main">{deal.title}</h1>
          {/* <button className="btn-secondary w-full sm:w-auto">Preview Deal</button> */}
        </div>
        <BasicInfoForm values={deal} onChange={handleDealChange} />
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button 
            type="button" 
            className="btn-secondary w-full sm:w-auto" 
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-primary w-full sm:w-auto" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'updating...' : 'update'}
          </button>
        </div>
      </div>
    </div>
  );
}