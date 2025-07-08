import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllSectors, getAllStages, getAllTicketSizes, getAllStatuses } from "@/services/api";
import { FaEye, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";

// Collateral Documents Upload Component
function CollateralDocumentsUpload({ existingDocuments, onDocumentChange }) {
  const [docs, setDocs] = useState([]);

  // Only allow these types, one file per type
  const docTypeOptions = [
    { value: "Pitch", label: "Pitch" },
    { value: "Deck", label: "Deck" },
    { value: "IM", label: "IM" },
    { value: "Financials", label: "Financials" },
  ];

  // Get existing document types (normalize to match dropdown options)
  const existingDocTypes = Object.keys(existingDocuments || {}).map(key => {
    // Convert to proper case: "im" -> "IM", "pitch" -> "Pitch", etc.
    if (key.toLowerCase() === 'im') return 'IM';
    return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  });
  
  // Get currently selected types in the form
  const currentFormTypes = docs.map((d) => d.type).filter(Boolean);
  
  // Combine all used types
  const allUsedTypes = [...existingDocTypes, ...currentFormTypes];
  
  // Filter available options
  const availableOptions = docTypeOptions.filter(
    (opt) => !allUsedTypes.includes(opt.value)
  );

  const handleTypeChange = (selected, idx) => {
    const updatedDocs = docs.map((d, i) =>
      i === idx ? { ...d, type: selected.value } : d
    );
    setDocs(updatedDocs);
    onDocumentChange(updatedDocs[idx], idx);
  };

  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const updatedDocs = docs.map((d, i) => (i === idx ? { ...d, file } : d));
      setDocs(updatedDocs);
      onDocumentChange(updatedDocs[idx], idx);
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
      onDocumentChange(null, idx);
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
              className="react-select-container"
              options={
                doc.type
                  ? docTypeOptions.filter((opt) => opt.value === doc.type)
                  : availableOptions
              }
              value={
                docTypeOptions.find((opt) => opt.value === doc.type) || null
              }
              onChange={(selected) => handleTypeChange(selected, idx)}
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
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
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

export default function BasicInfoForm({ values = {}, onChange }) {
  const [sectorOptions, setSectorOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [ticketSizeOptions, setTicketSizeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(0);

  const visibilityOptions = [
    { value: true, label: "Public" },
    { value: false, label: "Private" },
  ];

  useEffect(() => {
    async function fetchDropdowns() {
      setLoading(true);
      try {
        const [sectorsRes, stagesRes, statusesRes, ticketSizesRes] = await Promise.all([
          getAllSectors(),
          getAllStages(),
          getAllStatuses(),
          getAllTicketSizes(),
        ]);
        setSectorOptions(
          sectorsRes.status === "S"
            ? sectorsRes.result_info.map((s) => ({ value: s._id || s.name, label: s.name }))
            : []
        );
        setStageOptions(
          stagesRes.status === "S"
            ? stagesRes.result_info.map((s) => ({ value: s._id || s.name, label: s.name }))
            : []
        );
        setStatusOptions(
          statusesRes.status === "S"
            ? statusesRes.result_info.map((s) => ({ value: s._id || s.name, label: s.name }))
            : []
        );
        setTicketSizeOptions(
          ticketSizesRes.status === "S"
            ? ticketSizesRes.result_info.map((t) => ({ value: t._id || t.range || `${t.ticket_min || ''} - ${t.ticket_max || ''}`, label: t.range || `${t.ticket_min || ''} - ${t.ticket_max || ''}` }))
            : []
        );
      } catch (err) {
        setSectorOptions([]);
        setStageOptions([]);
        setStatusOptions([]);
        setTicketSizeOptions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDropdowns();
  }, []);

  // Helper to get correct option for dropdowns (handles both _id and name)
  const getSelectedOption = (options, value) => {
    if (!value && value !== false) return null; // Handle false as a valid value
    
    // Special case for visibility dropdown (boolean values)
    if (options === visibilityOptions) {
      return options.find(opt => opt.value === value) || null;
    }
    
    // First try to find by value (ID)
    let option = options.find(opt => opt.value === value);
    if (option) return option;
    
    // If not found by ID, try to find by label (text value)
    option = options.find(opt => opt.label === value);
    if (option) return option;
    
    // If still not found, return null
    return null;
  };

  // Helper to get text value from ID or return the value as is
  const getTextValue = (value, options) => {
    if (!value) return '';
    // First try to find by value (ID)
    let option = options.find(opt => opt.value === value);
    if (option) return option.label;
    
    // If not found by ID, return the value as is (it might already be text)
    return value;
  };

  // Debug: Log current form values
  useEffect(() => {
    console.log('Current form values:', {
      sector: values.sector,
      stage: values.stage,
      ticketSize: values.ticketSize,
      status: values.status,
      priorityFlag: values.priorityFlag,
      visibleToInvestors: values.visibleToInvestors,
      deal_collateral: values.deal_collateral
    });
  }, [values.sector, values.stage, values.ticketSize, values.status, values.priorityFlag, values.visibleToInvestors, values.deal_collateral]);

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Helper to view PDF files
  const handleViewPDF = (filePath, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (filePath) {
      window.open("http://localhost:4000/" + filePath, "_blank");
    }
  };

  // Helper to view images
  const handleViewImage = (filePath) => {
    if (filePath) {
      window.open("http://localhost:4000/" + filePath, "_blank");
    }
  };

  // Handler for file input change
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Create a file object that includes both the file and metadata
      const fileObject = {
        file: file,
        filename: file.name,
        originalname: file.name,
        name: file.name,
        size: file.size,
        mimetype: file.type
      };
      
      onChange({ target: { name: type, value: fileObject } });
      // Reset file input after selection
      setFileInputKey(prev => prev + 1);
    }
  };

  // Handler for collateral document changes
  const handleCollateralDocumentChange = (doc, index) => {
    if (doc && doc.type && doc.file) {
      // Create a new document object with the file
      const newDocument = {
        filename: doc.file.name,
        originalname: doc.file.name,
        name: doc.file.name,
        file: doc.file,
        size: doc.file.size,
        mimetype: doc.file.type
      };
      
      // Update the collateral documents object
      const updatedCollateral = { ...values.deal_collateral };
      updatedCollateral[doc.type.toLowerCase()] = newDocument;
      
      onChange({ target: { name: 'deal_collateral', value: updatedCollateral } });
      
      console.log(`Added new ${doc.type} document:`, doc.file.name);
    }
  };

  // Handler for editing existing collateral documents
  const handleCollateralFileChange = (e, category) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Create a new document object with the new file
      const newDocument = {
        filename: file.name,
        originalname: file.name,
        name: file.name,
        file: file,
        size: file.size,
        mimetype: file.type
      };
      
      // Update the collateral documents object
      const updatedCollateral = { ...values.deal_collateral };
      updatedCollateral[category] = newDocument;
      
      onChange({ target: { name: 'deal_collateral', value: updatedCollateral } });
      
      // Reset file input after selection
      setFileInputKey(prev => prev + 1);
    }
  };

  // Placeholder style for empty image/icon
  const placeholderBox =
    "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 w-full bg-gray-50 text-gray-400";

  // Thumbnail style
  const thumbBox =
    "flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white";

  // Icon button style
  const iconBtn =
    "inline-flex items-center justify-center text-xl mx-1 cursor-pointer hover:text-primarycolor";

  if (loading) return <div>Loading...</div>;

  return (
    <form className="mb-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <label className="form-label">Deal Title</label>
          <input className="form-input" name="title" value={values.title || ''} onChange={onChange} required />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Slug</label>
          <input className="form-input" name="slug" value={values.slug || ''} onChange={onChange} required />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Geography</label>
          <input className="form-input" name="geography" value={values.geography || ''} onChange={onChange} placeholder="Enter geography" />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Expected IRR</label>
          <input className="form-input" name="expectedIrr" value={values.expectedIrr || ''} onChange={onChange} placeholder="e.g., 20-30%" />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Timeline</label>
          <input className="form-input" name="timeline" value={values.timeline || ''} onChange={onChange} placeholder="e.g., 3 Years" />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Ticket Size Range</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            name="ticketSize"
            value={getSelectedOption(ticketSizeOptions, values.ticketSize)}
            onChange={(selected) => onChange({ target: { name: "ticketSize", value: selected ? selected.label : "" } })}
            options={ticketSizeOptions}
            isClearable
            placeholder="Select ticket size"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Sector</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            name="sector"
            value={getSelectedOption(sectorOptions, values.sector)}
            onChange={(selected) => onChange({ target: { name: "sector", value: selected ? selected.label : "" } })}
            options={sectorOptions}
            isClearable
            placeholder="Select sector"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Stage</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            name="stage"
            value={getSelectedOption(stageOptions, values.stage)}
            onChange={(selected) => onChange({ target: { name: "stage", value: selected ? selected.label : "" } })}
            options={stageOptions}
            isClearable
            placeholder="Select stage"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Status</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            name="status"
            value={getSelectedOption(statusOptions, values.status)}
            onChange={(selected) => onChange({ target: { name: "status", value: selected ? selected.label : "" } })}
            options={statusOptions}
            isClearable
            placeholder="Select status"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-label">Visibility</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            name="visibleToInvestors"
            value={getSelectedOption(visibilityOptions, values.visibleToInvestors)}
            onChange={(selected) => onChange({ target: { name: "visibleToInvestors", value: selected ? selected.value : false } })}
            options={visibilityOptions}
            isClearable
            placeholder="Select visibility"
          />
        </div>
      </div>

      {/* Priority Toggle - Same as create deal page */}
      <div className="flex gap-4">
        <div style={{ flex: 1 }}>
          <label className="form-label">Deal Priority Flag</label>
          <div className="mt-3 flex items-center">
            <button
              type="button"
              aria-pressed={values.priorityFlag === true}
              onClick={() =>
                onChange({ target: { name: "priorityFlag", value: !values.priorityFlag } })
              }
              className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out bg-gray-200 border ${
                values.priorityFlag === true
                  ? "border-primary"
                  : "border-gray-300"
              }`}
              style={{
                boxShadow:
                  values.priorityFlag === true
                    ? "0 0 0 2px #a330ae55"
                    : undefined,
              }}
            >
              <div
                className={`w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                  values.priorityFlag === true
                    ? "translate-x-5"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    values.priorityFlag === true
                      ? "#a330ae"
                      : "#ffffff",
                }}
              ></div>
            </button>
            <span className="text-gray-600 ms-2">High Priority</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="form-label mt-4">Summary</label>
        <textarea className="form-input" name="summary" value={values.summary || ''} onChange={onChange} rows={2} required />
        <label className="form-label mt-4">Full Description</label>
        <textarea className="form-input" name="description" value={values.description || ''} onChange={onChange} rows={6} required />
      </div>

      {/* Images Section */}
      <div className="mt-6">
        <h2 className="heading-main mb-4">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deal Image */}
          <div>
            <h3 className="subheading mb-2">Deal Image</h3>
            {values.image ? (
              <div className={thumbBox}>
                <img
                  src={typeof values.image === 'object' && values.image.path ? "http://localhost:4000/" + values.image.path.replace(/\\/g, "/") : (values.image.file ? URL.createObjectURL(values.image.file) : URL.createObjectURL(values.image))}
                  alt={values.image.originalname || values.image.name}
                  className="object-contain h-32 w-full rounded"
                />
                <div className="flex justify-center mt-2">
                  {/* Upload new image */}
                  <label className={iconBtn} title="Upload New Image">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'image')} />
                    <FaEdit />
                  </label>
                  <span className={iconBtn} title="Delete (not implemented)"><FaTrash /></span>
                </div>
              </div>
            ) : (
              <div className={placeholderBox}>
                <label className="flex flex-col items-center cursor-pointer">
                  <FaImage className="text-4xl mb-2" />
                  <span className="text-xs mb-1">Upload Featured Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'image')} />
                </label>
              </div>
            )}
          </div>

          {/* Deal Icon */}
          <div>
            <h3 className="subheading mb-2">Deal Icon</h3>
            {values.deal_icon ? (
              <div className={thumbBox}>
                <img
                  src={typeof values.deal_icon === 'object' && values.deal_icon.path ? "http://localhost:4000/" + values.deal_icon.path.replace(/\\/g, "/") : (values.deal_icon.file ? URL.createObjectURL(values.deal_icon.file) : URL.createObjectURL(values.deal_icon))}
                  alt={values.deal_icon.originalname || values.deal_icon.name}
                  className="object-contain h-32 w-full rounded"
                />
                <div className="flex justify-center mt-2">
                  {/* Upload new icon */}
                  <label className={iconBtn} title="Upload New Icon">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'deal_icon')} />
                    <FaEdit />
                  </label>
                  <span className={iconBtn} title="Delete (not implemented)"><FaTrash /></span>
                </div>
              </div>
            ) : (
              <div className={placeholderBox}>
                <label className="flex flex-col items-center cursor-pointer">
                  <FaImage className="text-4xl mb-2" />
                  <span className="text-xs mb-1">Upload Icon</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'deal_icon')} />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Management Section */}
      <div className="mt-6">
        <h2 className="heading-main mb-4">Document Management</h2>
        
        {/* Teaser Documents */}
        <div className="mb-6">
          <h3 className="subheading mb-2">Teaser Documents</h3>
          
          {/* Existing Teaser Document */}
          {values.teaser_document && (values.teaser_document.path || values.teaser_document.file) ? (
            <div className="mb-4">
              <div className="overflow-x-auto">
                <table className="table-main mb-2">
                  <thead className="table-header-row">
                    <tr>
                      <th className="table-th">File Name</th>
                      <th className="table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-row">
                      <td className="table-td">
                        {values.teaser_document.originalname || values.teaser_document.name}
                      </td>
                      <td className="table-td flex gap-2">
                        {values.teaser_document.path ? (
                          <button 
                            className="btn-inline text-primarycolor" 
                            onClick={(e) => handleViewPDF(values.teaser_document.path, e)}
                            title="View Document"
                          >
                            <FaEye size={20} />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm"></span>
                        )}
                        <label className="btn-inline cursor-pointer" title="Edit Document">
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" 
                            className="hidden" 
                            key={`teaser-${fileInputKey}`}
                            onChange={e => handleFileChange(e, 'teaser_document')} 
                          />
                          <FaEdit size={20} />
                        </label>
                        <button 
                          className="btn-inline" 
                          onClick={() => onChange({ target: { name: 'teaser_document', value: null } })}
                          title="Delete Document"
                        >
                          <FaTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="file-upload-container flex items-center gap-4 p-4 border rounded-lg bg-white">
                <div className="flex-1 flex items-center gap-2 cursor-pointer" onClick={() => document.getElementById('teaser-upload-new').click()}>
                  <span className="file-upload-text text-gray-600">
                    Choose teaser document file
                  </span>
                  <input
                    type="file"
                    className="file-upload-input hidden"
                    id="teaser-upload-new"
                    onChange={e => handleFileChange(e, 'teaser_document')}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collateral Documents */}
        <div>
          <h3 className="subheading mb-2">Collateral Documents</h3>
          
          {/* Existing Documents Table */}
          {values.deal_collateral && Object.keys(values.deal_collateral).length > 0 && (
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="table-main mb-2">
                  <thead className="table-header-row">
                    <tr>
                      <th className="table-th">Category</th>
                      <th className="table-th">File Name</th>
                      <th className="table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(values.deal_collateral).map(([category, document]) => (
                      <tr key={category} className="table-row">
                        <td className="table-td capitalize">{category}</td>
                        <td className="table-td">
                          {document.originalname || document.name}
                        </td>
                        <td className="table-td flex gap-2">
                          {document.path ? (
                            <button 
                              className="btn-inline text-primarycolor" 
                              onClick={(e) => handleViewPDF(document.path, e)}
                              title="View Document"
                            >
                              <FaEye size={20} />
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm"></span>
                          )}
                          <label className="btn-inline cursor-pointer" title="Edit Document">
                            <input 
                              type="file" 
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" 
                              className="hidden" 
                              key={`collateral-${category}-${fileInputKey}`}
                              onChange={e => handleCollateralFileChange(e, category)} 
                            />
                            <FaEdit size={20} />
                          </label>
                          <button 
                            className="btn-inline" 
                            onClick={() => {
                              const updatedCollateral = { ...values.deal_collateral };
                              delete updatedCollateral[category];
                              onChange({ target: { name: 'deal_collateral', value: updatedCollateral } });
                            }}
                            title="Delete Document"
                          >
                            <FaTrash size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add New Documents Section */}
          <div>
            <CollateralDocumentsUpload 
              existingDocuments={values.deal_collateral || {}}
              onDocumentChange={handleCollateralDocumentChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}