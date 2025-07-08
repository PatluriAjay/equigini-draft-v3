"use client";
import { useState, useEffect } from "react";
import { FiX, FiSave, FiUser, FiMail, FiPhone, FiDollarSign, FiGlobe, FiBriefcase, FiTag } from "react-icons/fi";
import Select from "react-select";
import { getAllSectors, getAllTicketSizes } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
import { FaIdCard } from "react-icons/fa";


export default function ProfileEditModal2({ isOpen, onClose, investor, onUpdate, mode = "personal" }) {
  // Shared state
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // For investment profile
  const [dropdownOptions, setDropdownOptions] = useState({ sectors: [], investmentRanges: [] });
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState({ show: false, type: 'success', message: '' });

  // Fetch dropdown options for investment profile
  useEffect(() => {
    if (mode === "investment" && isOpen) {
      const fetchOptions = async () => {
        try {
          setOptionsLoading(true);
          const [sectorsRes, ticketSizesRes] = await Promise.all([
            getAllSectors(),
            getAllTicketSizes(),
          ]);
          setDropdownOptions({
            sectors: sectorsRes.status === "S" ? sectorsRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
            investmentRanges: ticketSizesRes.status === "S" ? ticketSizesRes.result_info.map(t => ({
              value: t._id,
              label: `${t.ticket_min || ''} - ${t.ticket_max || ''}`
            })) : [],
          });
        } catch (error) {
          console.error("Error fetching dropdown options:", error);
        } finally {
          setOptionsLoading(false);
        }
      };
      fetchOptions();
    }
  }, [mode, isOpen]);

  // Initialize form data when investor or mode changes
  useEffect(() => {
    if (!investor) return;
    if (mode === "personal") {
      setFormData({
        full_name: investor.full_name || "",
        mobile_number: investor.mobile_number || "",
      });
    } else if (mode === "investment") {
      setFormData({
        investor_type: investor.investor_type ? { value: investor.investor_type, label: investor.investor_type } : null,
        investment_range: investor.investment_range ? { value: investor.investment_range, label: investor.investment_range } : null,
        geography: investor.geography ? { value: investor.geography, label: investor.geography } : null,
        preferred_sectors: [], // will be remapped below
      });
    }
  }, [investor, mode]);

  // Remap preferred_sectors to { value, label } objects when dropdownOptions.sectors are loaded
  useEffect(() => {
    if (mode === "investment" && investor && dropdownOptions.sectors.length > 0) {
      setFormData(prev => ({
        ...prev,
        preferred_sectors: investor.preferred_sectors
          ? investor.preferred_sectors.map(sectorId => {
              const found = dropdownOptions.sectors.find(s => s.value === sectorId || s.label === sectorId);
              return found ? found : { value: sectorId, label: sectorId };
            })
          : [],
      }));
    }
    // eslint-disable-next-line
  }, [dropdownOptions.sectors, investor, mode]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let updateData = {};
      if (mode === "personal") {
        updateData = Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );
      } else if (mode === "investment") {
        updateData = {
          investor_type: formData.investor_type?.value || null,
          investment_range: formData.investment_range?.label || null,
          geography: formData.geography?.value || null,
          preferred_sectors: formData.preferred_sectors?.map(sector => sector.label) || [],
        };
        updateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : true))
        );
      }
      await onUpdate(updateData);
      setModalMessage({ show: true, type: 'success', message: 'Profile updated successfully!' });
      onClose();
    } catch (err) {
      setError(err.message);
      setModalMessage({ show: true, type: 'error', message: err.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Investment profile dropdowns
  const investorTypes = ["HNWI", "Family Office", "Angel", "Other"].map(type => ({ value: type, label: type }));
  const geographies = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Singapore"].map(geo => ({ value: geo, label: geo }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "personal" ? "Edit Personal Information" : "Edit Investment Profile"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX size={20} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}
          {mode === "personal" && (
            <div className="space-y-4">
              {/* Full Name - Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {/* Email - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={investor?.email || ""}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 "
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              {/* Mobile Number - Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {/* PAN Number - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={investor?.pan_number || ""}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 "
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">PAN number cannot be changed</p>
              </div>
            </div>
          )}
          {mode === "investment" && (
            <div className="space-y-4">
              {/* Investor Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investor Type</label>
                <Select
                  name="investor_type"
                  value={formData.investor_type}
                  onChange={(option) => handleSelectChange(option, { name: "investor_type" })}
                  options={investorTypes}
                  placeholder="Select investor type"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>
              {/* Investment Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
                <Select
                  name="investment_range"
                  value={formData.investment_range}
                  onChange={(option) => handleSelectChange(option, { name: "investment_range" })}
                  options={dropdownOptions.investmentRanges}
                  placeholder={optionsLoading ? "Loading..." : "Select investment range"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  isLoading={optionsLoading}
                  isDisabled={optionsLoading}
                />
              </div>
              {/* Geography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geography</label>
                <Select
                  name="geography"
                  value={formData.geography}
                  onChange={(option) => handleSelectChange(option, { name: "geography" })}
                  options={geographies}
                  placeholder="Select geography"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>
              {/* Preferred Sectors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Sectors</label>
                <Select
                  name="preferred_sectors"
                  value={formData.preferred_sectors}
                  onChange={(option) => handleSelectChange(option, { name: "preferred_sectors" })}
                  options={dropdownOptions.sectors}
                  placeholder={optionsLoading ? "Loading..." : "Select preferred sectors"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isMulti
                  isLoading={optionsLoading}
                  isDisabled={optionsLoading}
                />
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primarycolor text-white rounded-lg hover:bg-primarycolor/90 transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Updating...</>) : (<>Update</>)}
            </button>
          </div>
        </form>
      </div>
      <ModalMessage
        show={modalMessage.show}
        onClose={() => setModalMessage({ ...modalMessage, show: false })}
        type={modalMessage.type}
        message={modalMessage.message}
      />
    </div>
  );
} 