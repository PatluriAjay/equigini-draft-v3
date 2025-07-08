import React, { useState, useEffect } from "react";
import Select from "react-select";
import { createEOI } from "../../services/api";

export default function EOIModal({ show, onClose, onSubmit, dealTitle, dealId }) {
  const [form, setForm] = useState({
    ticketSize: '',
    rationale: '',
    timeline: '',
    contactMethod: '',
    contactType: null,
    contactValue: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactOptions, setContactOptions] = useState([]);

  const contactTypes = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'other', label: 'Other' }
  ];

  // Get contact options from user data when modal opens
  useEffect(() => {
    if (show) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const options = [];
          
          // Add email if available
          if (user.email) {
            options.push({ value: user.email, label: `${user.email}`, type: 'email' });
          }
          
          // Add phone if available - check for mobile_number field
          if (user.mobile_number || user.mobile || user.phone || user.contact_number) {
            const phone = user.mobile_number || user.mobile || user.phone || user.contact_number;
            options.push({ value: phone, label: `${phone}`, type: 'phone' });
          }
          
          setContactOptions(options);
          
          // Don't set default values - let user choose manually
          setContactOptions(options);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get investor data from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error("User data not found. Please login again.");
      }

      const user = JSON.parse(userData);
      
      // Prepare EOI data according to backend model
      const eoiData = {
        deal_title: dealTitle,
        deal_id: dealId,
        investor_name: user.full_name || user.name || "",
        investor_mobile: user.mobile_number || user.mobile || user.phone || user.contact_number || "",
        investor_id: user._id || user.id,
        intended_ticket_size: form.ticketSize,
        comments: form.rationale,
        timeline_to_invest: form.timeline,
        preferred_contact_method: form.contactValue,
        created_by: 1 // Default value
      };

      // Validate required fields
      const requiredFields = ['ticketSize', 'timeline', 'contactValue'];
      const missingFields = requiredFields.filter(field => !form[field].trim());
      
      if (!form.contactType) {
        throw new Error("Please select a contact method type");
      }
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate investor_mobile is present
      if (!eoiData.investor_mobile) {
        throw new Error("Investor mobile number is required. Please update your profile.");
      }

      // Submit EOI to backend
      const result = await createEOI(eoiData);
      
      if (result.status === "S") {
        // Reset form
        setForm({ 
          ticketSize: '', 
          rationale: '', 
          timeline: '', 
          contactMethod: '',
          contactType: null,
          contactValue: ''
        });
        // Call parent onSubmit
        onSubmit(form);
      } else {
        throw new Error(result.error_info || "Failed to submit EOI");
      }
    } catch (err) {
      setError(err.message || "Failed to submit EOI");
    } finally {
      setLoading(false);
    }
  };

  const handleContactTypeChange = (selectedOption) => {
    setForm(prev => ({ 
      ...prev, 
      contactType: selectedOption,
      contactValue: '',
      contactMethod: ''
    }));
  };

  const handleContactValueChange = (e) => {
    const newValue = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      contactValue: newValue,
      contactMethod: newValue
    }));
  };

  // Custom styles for React Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#8b5cf6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #8b5cf6' : 'none',
      '&:hover': {
        borderColor: '#8b5cf6'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#8b5cf6' : '#f3f4f6'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    })
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-primarycolor">Express Interest in {dealTitle}</h2>
        
        {/* {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )} */}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="eoi-ticket-size" className="form-label">
              Intended Ticket Size <span className="text-red-500">*</span>
            </label>
            <input
              id="eoi-ticket-size"
              type="text"
              className="form-input"
              value={form.ticketSize}
              onChange={e => setForm({ ...form, ticketSize: e.target.value })}
              placeholder="e.g., ₹50L - ₹1Cr"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="eoi-rationale" className="form-label">
              Strategic Rationale or Comments
            </label>
            <textarea
              id="eoi-rationale"
              className="form-input"
              value={form.rationale}
              onChange={e => setForm({ ...form, rationale: e.target.value })}
              rows={3}
              placeholder="Optional comments about your interest in this deal"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="eoi-timeline" className="form-label">
              Timeline to Invest <span className="text-red-500">*</span>
            </label>
            <input
              id="eoi-timeline"
              type="text"
              className="form-input"
              value={form.timeline}
              onChange={e => setForm({ ...form, timeline: e.target.value })}
              placeholder="e.g., 3-6 months"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">
              Preferred Contact Method Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={form.contactType}
              onChange={handleContactTypeChange}
              options={contactTypes}
              placeholder="Select contact type"
              isDisabled={loading}
              styles={customStyles}
              isClearable={false}
              className="react-select-container"
            />
          </div>
          {form.contactType && (
            <div className="mb-6">
              <label htmlFor="eoi-contact-value" className="form-label">
                Contact Details <span className="text-red-500">*</span>
              </label>
              <input
                id="eoi-contact-value"
                type={form.contactType.value === 'email' ? 'email' : 'text'}
                className="form-input"
                value={form.contactValue}
                onChange={handleContactValueChange}
                placeholder={
                  form.contactType.value === 'email' 
                    ? 'Enter your email address' 
                    : form.contactType.value === 'phone' 
                      ? 'Enter your phone number' 
                      : 'Enter your contact details'
                }
                required
                disabled={loading}
              />
            </div>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !form.contactType || !form.contactValue}
          >
            {loading ? "Submitting..." : "Submit EOI"}
          </button>
        </form>
      </div>
    </div>
  );
}
