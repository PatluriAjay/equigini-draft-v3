"use client";
import React, { useState, useEffect } from "react";
import { FiInfo, FiFileText, FiUpload } from "react-icons/fi";
import { MdAdd, MdDelete } from "react-icons/md";
import Select from "react-select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDeal, getAllSectors, getAllStages, getAllTicketSizes, getAllStatuses } from "@/services/api";
import ModalMessage from "@/components/investor/ModalMessage";
const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#A330AE" : "#e9e6ea",
    boxShadow: state.isFocused ? "0 0 0 2px #A330AE30" : "none",
    minHeight: "44px",
    color: "#111",
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#e9d6fa"
      : state.isFocused
      ? "#f3eafd"
      : "#fff",
    color: "#111",
    fontWeight: state.isSelected ? 600 : 400,
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111",
    fontFamily: "Poppins, sans-serif",
  }),
  menu: (base) => ({ ...base, zIndex: 20 }),
};

function DealDocuments({ onDocChange }) {
  const [docs, setDocs] = useState([
    // Start with no docs, user can add one of each type
  ]);

  // Only allow these types, one file per type
  const docTypeOptions = [
    { value: "Pitch", label: "Pitch" },
    { value: "Deck", label: "Deck" },
    { value: "IM", label: "IM" },
    { value: "Financials", label: "Financials" },
  ];

  // Compute available types (not already used)
  const usedTypes = docs.map((d) => d.type).filter(Boolean);
  const availableOptions = docTypeOptions.filter(
    (opt) => !usedTypes.includes(opt.value)
  );

  const handleTypeChange = (selected, idx) => {
    const updatedDocs = docs.map((d, i) =>
      i === idx ? { ...d, type: selected.value } : d
    );
    setDocs(updatedDocs);
    onDocChange(updatedDocs[idx], idx);
  };

  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const updatedDocs = docs.map((d, i) => (i === idx ? { ...d, file } : d));
      setDocs(updatedDocs);
      onDocChange(updatedDocs[idx], idx);
    }
  };

  const handleAdd = () => {
    if (availableOptions.length > 0) {
      setDocs((docs) => [...docs, { id: Date.now(), type: "", file: null }]);
    }
  };

  const handleDelete = (idx) => {
    setDocs((docs) => {
      const newDocs = docs.length > 1 ? docs.filter((_, i) => i !== idx) : [];
      onDocChange(null, idx);
      return newDocs;
    });
  };

  return (
    <div className="space-y-3">
      {docs.map((doc, idx) => (
        <div
          key={doc.id}
          className="file-upload-container flex items-center gap-4 p-4 border rounded-lg bg-white"
        >
          <div className="w-1/4 min-w-[150px]">
            <Select
              classNamePrefix="react-select"
              options={
                doc.type
                  ? docTypeOptions.filter((opt) => opt.value === doc.type)
                  : availableOptions
              }
              value={
                docTypeOptions.find((opt) => opt.value === doc.type) || null
              }
              onChange={(selected) => handleTypeChange(selected, idx)}
              styles={reactSelectStyles}
              placeholder="Select Type"
              isDisabled={!!doc.type}
            />
          </div>
          <div
            className="flex-1 flex items-center gap-2 cursor-pointer"
            onClick={() =>
              document.getElementById(`deal-doc-upload-${doc.id}`).click()
            }
          >
            <span className="file-upload-text text-gray-600">
              {doc.file ? doc.file.name : "Choose file"}
            </span>
            <input
              type="file"
              className="file-upload-input hidden"
              id={`deal-doc-upload-${doc.id}`}
              onChange={(e) => handleFileChange(e, idx)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              disabled={!doc.type}
            />
            {availableOptions.length > 0 &&
              idx === docs.length - 1 &&
              !doc.type && (
                <button
                  type="button"
                  className="text-2xl text-primarycolor hover:text-opacity-80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd();
                  }}
                  title="Add"
                >
                  <MdAdd size={25} />
                </button>
              )}
            <button
              type="button"
              className="text-2xl text-red-700 hover:text-opacity-80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(idx);
              }}
              title="Delete"
            >
              <MdDelete size={25} />
            </button>
          </div>
        </div>
      ))}
      {availableOptions.length > 0 && (
        <button type="button" className="btn-secondary" onClick={handleAdd}>
          Add Documents
        </button>
      )}
    </div>
  );
}

const steps = [
  { label: "Basic Details", icon: FiInfo },
  { label: "Deal Details", icon: FiFileText },
  { label: "Document Upload", icon: FiUpload },
];

export default function CreateDealPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    geography: "",
    sector: "",
    stage: "",
  });
  const [formData, setFormData] = useState({
    priority: { value: false, label: "No" },
    visibility: { value: "", label: "Select Visibility" },
  });
  const [teaserFile, setTeaserFile] = useState(null);
  const [dealDocs, setDealDocs] = useState([]);
  const [dealImage, setDealImage] = useState(null);
  const [dealIcon, setDealIcon] = useState(null);

  // Add state for step 2 fields
  const [step2, setStep2] = useState({
    ticketSize: "",
    status: "",
    summary: "",
    description: "",
    expectedIrr: "",
    timeline: "",
  });

  // Add state for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    sectors: [],
    stages: [],
    ticketSizes: [],
    statuses: [],
  });

  // Add state for success/error messages
  const [message, setMessage] = useState({ show: false, type: "success", text: "" });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const visibilityOptions = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
  ];

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [sectorsRes, stagesRes, ticketSizesRes, statusesRes] = await Promise.all([
          getAllSectors(),
          getAllStages(),
          getAllTicketSizes(),
          getAllStatuses(),
        ]);

        setDropdownOptions({
          sectors: sectorsRes.status === "S" ? sectorsRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          stages: stagesRes.status === "S" ? stagesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          ticketSizes: ticketSizesRes.status === "S" ? ticketSizesRes.result_info.map(t => ({ 
            value: t._id, 
            label: `${t.ticket_min || ''} - ${t.ticket_max || ''}` 
          })) : [],
          statuses: statusesRes.status === "S" ? statusesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        setMessage({ show: true, type: "error", text: "Failed to load dropdown options. Please refresh the page." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  const handleTeaserFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeaserFile(file);
    }
  };

  const handleDealDocChange = (file, index) => {
    setDealDocs((prev) => {
      const newDocs = [...prev];
      newDocs[index] = file;
      return newDocs;
    });
  };

  const handleDealImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDealImage(file);
    }
  };
  const handleDealIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDealIcon(file);
    }
  };

  // Function to clear all form data
  const clearForm = () => {
    setForm({
      title: "",
      slug: "",
      geography: "",
      sector: "",
      stage: "",
    });
    setFormData({
      priority: { value: false, label: "No" },
      visibility: { value: "", label: "Select Visibility" },
    });
    setStep2({
      ticketSize: "",
      status: "",
      summary: "",
      description: "",
      expectedIrr: "",
      timeline: "",
    });
    setTeaserFile(null);
    setDealDocs([]);
    setDealImage(null);
    setDealIcon(null);
    setStep(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    // Validate required fields
    const requiredFields = {
      'Deal Title': form.title,
      'Slug': form.slug,
      'Geography': form.geography,
      'Sector': form.sector,
      'Stage': form.stage,
      'Ticket Size': step2.ticketSize,
      'Status': step2.status,
      'Summary': step2.summary,
      'Description': step2.description,
      'Visibility': formData.visibility.value,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setMessage({ 
        show: true, 
        type: "error", 
        text: `Please fill in the following required fields: ${missingFields.join(', ')}` 
      });
      return;
    }
    
    const createdBy = 1; // Hardcoded for now

    // Helper function to get label from ID
    const getLabelFromId = (id, options) => {
      const option = options.find(opt => opt.value === id);
      return option ? option.label : id;
    };

    // Build FormData for file upload
    const formDataObj = new FormData();
    formDataObj.append("deal_title", form.title);
    formDataObj.append("slug", form.slug);
    formDataObj.append("geography", form.geography);
    formDataObj.append("sector", getLabelFromId(form.sector, dropdownOptions.sectors));
    formDataObj.append("stage", getLabelFromId(form.stage, dropdownOptions.stages));
    formDataObj.append("ticket_size_range", getLabelFromId(step2.ticketSize, dropdownOptions.ticketSizes));
    formDataObj.append("status", getLabelFromId(step2.status, dropdownOptions.statuses));
    formDataObj.append("expected_irr", step2.expectedIrr);
    formDataObj.append("timeline", step2.timeline);
    formDataObj.append("summary", step2.summary);
    formDataObj.append("full_description", step2.description);
    formDataObj.append("deal_priority", formData.priority.value);
    formDataObj.append("visibility", formData.visibility.value);
    formDataObj.append("created_by", createdBy);
    if (teaserFile) formDataObj.append("teaser_document", teaserFile);
    if (dealImage) formDataObj.append("image", dealImage);
    if (dealIcon) formDataObj.append("deal_icon", dealIcon);

    // Deal Collateral Documents (Pitch, Deck, IM, Financials)
    dealDocs.forEach((doc) => {
      if (doc && doc.type && doc.file) {
        const key = `deal_collateral_${doc.type.toLowerCase()}`;
        formDataObj.append(key, doc.file);
      }
    });

    try {
      setIsSubmitting(true);
      const result = await createDeal(formDataObj);
      if (result.status === "S") {
        setMessage({ show: true, type: "success", text: "Deal created successfully!" });
        clearForm();
        router.push("/admin/deals");
      } else {
        setMessage({ show: true, type: "error", text: result.error_info || "Failed to create deal" });
      }
    } catch (error) {
      setMessage({ show: true, type: "error", text: error.message || "Error creating deal" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Basic Details
  return (
    <div className="py-1" style={{ overflowY: "auto" }}>
      <div>
        <nav className="flex items-center space-x-2 text-gray-600 mb-4">
          <Link href="/admin" className="hover:underline">
            Home
          </Link>
          <span className="text-gray-400">{">"}</span>
          <Link href="/admin/deals" className="hover:underline">
            Deal
          </Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold">Create Deal</span>
        </nav>
      </div>
      <div className="py-4 overflow-visible">
        <h2 className="heading-main">Create Deal</h2>
        {/* Stepper and Step Forms aligned in same container */}
        <div className=" sm:px-32 mx-auto">
          {/* Stepper */}
          <div className="flex flex-row items-center mb-10 justify-between w-full">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full shadow transition-all z-10 border-2
                    ${
                      step === i
                        ? "bg-white border-[#a330ae]"
                        : "bg-gray-100 border-gray-200"
                    }`}
                    style={{ marginBottom: 8 }}
                  >
                    <s.icon
                      className={`text-2xl ${
                        step === i ? "text-[#a330ae]" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step === i ? "text-[#a330ae]" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {/* Render line except after last step */}
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 h-1 w-full bg-gray-200 -ml-2 -mr-2 z-0"
                    style={{ marginTop: -32 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Step Forms - match width to stepper */}
          {step === 0 && (
            <form className="space-y-6">
              <div>
                <label htmlFor="deal-title" className="form-label">
                  Deal Title
                </label>
                <input
                  id="deal-title"
                  type="text"
                  className="form-input"
                  placeholder="Enter deal title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="deal-slug" className="form-label">
                  Slug
                </label>
                <input
                  id="deal-slug"
                  type="text"
                  className="form-input"
                  placeholder="Enter slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="deal-geography" className="form-label">
                  Geography
                </label>
                <input
                  id="deal-geography"
                  type="text"
                  className="form-input"
                  placeholder="Enter geography"
                  value={form.geography}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, geography: e.target.value }))
                  }
                />
              </div>
              <div>
                <label htmlFor="sector-select" className="form-label">
                  Sector
                </label>
                <Select
                  id="sector-select"
                  classNamePrefix="react-select"
                  options={dropdownOptions.sectors}
                  value={dropdownOptions.sectors.find((opt) => opt.value === form.sector) || null}
                  onChange={(opt) =>
                    setForm((f) => ({ ...f, sector: opt ? opt.value : "" }))
                  }
                  placeholder={isLoading ? "Loading..." : "Select Sector"}
                  styles={reactSelectStyles}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="stage-select" className="form-label">
                  Stage
                </label>
                <Select
                  id="stage-select"
                  classNamePrefix="react-select"
                  options={dropdownOptions.stages}
                  value={dropdownOptions.stages.find((opt) => opt.value === form.stage) || null}
                  onChange={(opt) =>
                    setForm((f) => ({ ...f, stage: opt ? opt.value : "" }))
                  }
                  placeholder={isLoading ? "Loading..." : "Select Stage"}
                  styles={reactSelectStyles}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn-secondary me-7"
                  onClick={() => setStep(1)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(1)}
                >
                  Next
                </button>
              </div>
            </form>
          )}
          {/* Step 2 */}
          {step === 1 && (
            <form className="space-y-6">
              <div>
                <label className="form-label">Ticket Size Range</label>
                <Select
                  id="ticket-size-select"
                  classNamePrefix="react-select"
                  options={dropdownOptions.ticketSizes}
                  value={dropdownOptions.ticketSizes.find((opt) => opt.value === step2.ticketSize) || null}
                  onChange={(opt) =>
                    setStep2((s) => ({ ...s, ticketSize: opt ? opt.value : "" }))
                  }
                  placeholder={isLoading ? "Loading..." : "Select Range"}
                  styles={reactSelectStyles}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                />
              </div>
              <div>
                <label className="form-label">Status</label>
                <Select
                  id="status-select"
                  classNamePrefix="react-select"
                  options={dropdownOptions.statuses}
                  value={dropdownOptions.statuses.find((opt) => opt.value === step2.status) || null}
                  onChange={(opt) =>
                    setStep2((s) => ({ ...s, status: opt ? opt.value : "" }))
                  }
                  placeholder={isLoading ? "Loading..." : "Select Status"}
                  styles={reactSelectStyles}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                />
              </div>
              <div>
                <label className="form-label">Expected IRR</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 25-30%"
                  value={step2.expectedIrr}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, expectedIrr: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="form-label">Timeline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 6-8 Weeks"
                  value={step2.timeline}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, timeline: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="form-label">Summary</label>
                <textarea
                  className="form-input"
                  placeholder="Brief summary for listing"
                  rows={2}
                  value={step2.summary}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, summary: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-4">
                <div style={{ flex: 1 }}>
                  <label className="form-label">Deal Priority Flag</label>
                  <div className="mt-3 flex items-center">
                    <button
                      type="button"
                      aria-pressed={formData.priority?.value === false}
                      onClick={() =>
                        handleSelectChange(
                          priorityOptions[
                            formData.priority?.value === false ? 1 : 0
                          ],
                          { name: "priority" }
                        )
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out bg-gray-200 border ${
                        formData.priority?.value === true
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      style={{
                        boxShadow:
                          formData.priority?.value === true
                            ? "0 0 0 2px #a330ae55"
                            : undefined,
                      }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                          formData.priority?.value === true
                            ? "translate-x-5"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            formData.priority?.value === true
                              ? "#a330ae"
                              : "#ffffff",
                        }}
                      ></div>
                    </button>
                    <span className="text-gray-600 ms-2">High Priority</span>
                  </div>
                </div>
                <div style={{ width: "60%" }}>
                  <div>
                    <label className="form-label">Visibility</label>
                    <Select
                      id="visibility-select"
                      classNamePrefix="react-select"
                      options={visibilityOptions}
                      value={visibilityOptions.find((opt) => opt.value === formData.visibility.value) || null}
                      onChange={(opt) =>
                        handleSelectChange(opt, { name: "visibility" })
                      }
                      placeholder="Select Visibility"
                      styles={reactSelectStyles}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="form-label">Detailed Description</label>
                <textarea
                  className="form-input"
                  placeholder="Provide a comprehensive description of the deal..."
                  rows={3}
                  value={step2.description}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, description: e.target.value }))
                  }
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn-secondary me-7"
                  onClick={() => setStep(0)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Teaser Document</label>
                <div
                  className="file-upload-container cursor-pointer"
                  onClick={() =>
                    document.getElementById("teaser-upload").click()
                  }
                >
                  <span className="file-upload-text">
                    {teaserFile ? teaserFile.name : "Choose file"}
                  </span>
                  <input
                    type="file"
                    className="file-upload-input hidden"
                    id="teaser-upload"
                    onChange={handleTeaserFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Deal Collateral Documents</label>
                <DealDocuments onDocChange={handleDealDocChange} />
              </div>
              <div>
                <label className="form-label">Deal Image</label>
                <div
                  className="file-upload-container cursor-pointer"
                  onClick={() =>
                    document.getElementById("deal-image-upload").click()
                  }
                >
                  <span className="file-upload-text">
                    {dealImage ? dealImage.name : "Choose file"}
                  </span>
                  <input
                    type="file"
                    className="file-upload-input hidden"
                    id="deal-image-upload"
                    onChange={handleDealImageChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Deal Icon</label>
                <div
                  className="file-upload-container cursor-pointer"
                  onClick={() =>
                    document.getElementById("deal-icon-upload").click()
                  }
                >
                  <span className="file-upload-text">
                    {dealIcon ? dealIcon.name : "Choose file"}
                  </span>
                  <input
                    type="file"
                    className="file-upload-input hidden"
                    id="deal-icon-upload"
                    onChange={handleDealIconChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <div className="flex gap-4">
                  <button type="button" className="btn-secondary">
                    Save Draft
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Success/Error Message Modal */}
      <ModalMessage
        show={message.show}
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ show: false, type: "success", text: "" })}
      />
    </div>
  );
}
