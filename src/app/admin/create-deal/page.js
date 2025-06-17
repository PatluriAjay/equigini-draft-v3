"use client";
import React, { useState } from 'react'
import { FiInfo, FiFileText, FiUpload } from 'react-icons/fi'
import { MdAdd, MdDelete } from 'react-icons/md';
import Select from 'react-select'
import Link from 'next/link';

const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: state.isFocused ? '#A330AE' : '#e9e6ea',
    boxShadow: state.isFocused ? '0 0 0 2px #A330AE30' : 'none',
    minHeight: '44px',
    color: '#111',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#e9d6fa'
      : state.isFocused
      ? '#f3eafd'
      : '#fff',
    color: '#111',
    fontWeight: state.isSelected ? 600 : 400,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif'
  }),
  singleValue: base => ({ ...base, color: '#111', fontFamily: 'Poppins, sans-serif' }),
  menu: base => ({ ...base, zIndex: 20 })
};

function DealDocuments({ onDocChange }) {
  const [docs, setDocs] = useState([
    { id: 1, type: '', file: null }
  ]);

  const docTypeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'Pitch Deck', label: 'Pitch Deck' },
    { value: 'IM', label: 'IM' },
    { value: 'Financials', label: 'Financials' },
    { value: 'Term Sheet', label: 'Term Sheet' },
    { value: 'Other', label: 'Other' }
  ];

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
      const updatedDocs = docs.map((d, i) => 
        i === idx ? { ...d, file } : d
      );
      setDocs(updatedDocs);
      onDocChange(updatedDocs[idx], idx);
    }
  };

  const handleAdd = () => {
    setDocs(docs => [...docs, { id: Date.now(), type: '', file: null }]);
  };

  const handleDelete = idx => {
    setDocs(docs => {
      const newDocs = docs.length > 1 ? docs.filter((_, i) => i !== idx) : docs;
      onDocChange(null, idx);
      return newDocs;
    });
  };

  return (
    <div className="space-y-3">
      {docs.map((doc, idx) => (
        <div key={doc.id} className="file-upload-container flex items-center gap-4 p-4 border rounded-lg bg-white">
          <div className="w-1/4 min-w-[150px]">
            <Select
              classNamePrefix="react-select"
              options={docTypeOptions}
              value={docTypeOptions.find(opt => opt.value === doc.type)}
              onChange={selected => handleTypeChange(selected, idx)}
              styles={reactSelectStyles}
              placeholder="Select Type"
            />
          </div>
          <div 
            className="flex-1 flex items-center gap-2 cursor-pointer"
            onClick={() => document.getElementById(`deal-doc-upload-${doc.id}`).click()}
          >
            <span className="file-upload-text text-gray-600">
              {doc.file ? doc.file.name : 'No file selected'}
            </span>
            <input
              type="file"
              className="file-upload-input hidden"
              id={`deal-doc-upload-${doc.id}`}
              onChange={e => handleFileChange(e, idx)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
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
    </div>
  );
}

const steps = [
  { label: 'Basic Details', icon: FiInfo },
  { label: 'Deal Details', icon: FiFileText },
  { label: 'Document Upload', icon: FiUpload }
]

export default function CreateDealPage () {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    geography: '',
    sector: '',
    stage: ''
  })
  const [formData, setFormData] = useState({
    priority: { value: false, label: 'No' },
    visibility: { value: '', label: 'Select Visibility' }
  })
  const [teaserFile, setTeaserFile] = useState(null)
  const [dealDocs, setDealDocs] = useState([])

  const priorityOptions = [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ]
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }))
  }

  const handleTeaserFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTeaserFile(file)
    }
  }

  const handleDealDocChange = (file, index) => {
    setDealDocs(prev => {
      const newDocs = [...prev]
      newDocs[index] = file
      return newDocs
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically handle the form submission
    // including uploading the files to your backend
    console.log('Form submitted with files:', { teaserFile, dealDocs })
  }

  // Step 1: Basic Details
  return (
    <div
      className='py-1'
      style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
    >
        <div>
      <nav className="flex items-center space-x-2 text-gray-600 mb-4">
        <Link href="/admin" className="hover:underline">Home</Link>
        <span className="text-gray-400">{">"}</span>
        <Link href="/admin/deals" className="hover:underline">Deal</Link>
        <span className="text-gray-400">{">"}</span>
        <span className="font-semibold">Create Deal</span>
      </nav>
    </div>
      <div className='py-4 overflow-visible'>
        <h2 className='heading-main'>Create Deal</h2>
        {/* Stepper and Step Forms aligned in same container */}
        <div className="px-32 mx-auto">
          {/* Stepper */}
          <div className="flex flex-row items-center mb-10 justify-between w-full">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center min-w-[120px]">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full shadow transition-all z-10 border-2
                    ${step === i ? 'bg-white border-[#a330ae]' : 'bg-gray-100 border-gray-200'}`}
                    style={{ marginBottom: 8 }}
                  >
                    <s.icon
                      className={`text-2xl ${step === i ? 'text-[#a330ae]' : 'text-gray-400'}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${step === i ? 'text-[#a330ae]' : 'text-gray-500'}`}
                  >
                    {s.label}
                  </span>
                </div>
                {/* Render line except after last step */}
                {i < steps.length - 1 && (
                  <div className="flex-1 h-1 w-full bg-gray-200 -ml-2 -mr-2 z-0" style={{ marginTop: -32 }} />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Step Forms - match width to stepper */}
          {step === 0 && (
            <form className='space-y-6'>
              <div>
                <label htmlFor='deal-title' className='form-label'>Deal Title</label>
                <input
                  id='deal-title'
                  type='text'
                  className='form-input'
                  placeholder='Enter deal title'
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor='deal-geography' className='form-label'>Geography</label>
                <input
                  id='deal-geography'
                  type='text'
                  className='form-input'
                  placeholder='Enter geography'
                  value={form.geography}
                  onChange={e => setForm(f => ({ ...f, geography: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor='sector-select' className='form-label'>Sector</label>
                <Select
                  id='sector-select'
                  classNamePrefix='react-select'
                  options={[
                    { value: '', label: 'Select Sector' },
                    { value: 'Finance', label: 'Finance' }
                  ]}
                  value={[
                    { value: '', label: 'Select Sector' },
                    { value: 'Finance', label: 'Finance' }
                  ].find(opt => opt.value === form.sector)}
                  onChange={opt => setForm(f => ({ ...f, sector: opt.value }))}
                />
              </div>
              <div>
                <label htmlFor='stage-select' className='form-label'>Stage</label>
                <Select
                  id='stage-select'
                  classNamePrefix='react-select'
                  options={[
                    { value: '', label: 'Select Stage' },
                    { value: 'Seed', label: 'Seed' },
                  ]}
                  value={[
                    { value: '', label: 'Select Stage' },
                    { value: 'Seed', label: 'Seed' }
                  ].find(opt => opt.value === form.stage)}
                  onChange={opt => setForm(f => ({ ...f, stage: opt.value }))}
                />
              </div>
              <div className='flex justify-center'>
                <button
                  type='button'
                  className='btn-secondary me-7'
                  onClick={() => setStep(1)}
                >
                  Save
                </button>
                <button
                  type='button'
                  className='btn-primary'
                  onClick={() => setStep(1)}
                >
                  Next
                </button>
              </div>
            </form>
          )}
          {/* Step 2 */}
          {step === 1 && (
            <form className='space-y-6'>
              <div>
                <label className='form-label'>Ticket Size Range</label>
                <Select
                  id='ticket-size-select'
                  classNamePrefix='react-select'
                  options={[
                    { value: '', label: 'Select Range' },
                    { value: '0-1M', label: '0 - 1M' }
                  ]}
                />
              </div>
              <div>
                <label className='form-label'>Status</label>
                <Select
                  id='status-select'
                  classNamePrefix='react-select'
                  options={[
                    { value: '', label: 'Select Status' },
                    { value: 'Open', label: 'Open' },
                    { value: 'Closed', label: 'Closed' }
                  ]}
                />
              </div>
              <div>
                <label className='form-label'>Summary</label>
                <textarea
                  className='form-input'
                  placeholder='Brief summary for listing'
                  rows={2}
                />
              </div>
              <div className='flex gap-4'>
                <div style={{ flex: 1 }}>
                  <label className='form-label'>Deal Priority Flag</label>
                  <div className='mt-3 flex items-center'>
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
                          formData.priority?.value === true ? "translate-x-5" : ""
                        }`}
                        style={{
                          backgroundColor:
                            formData.priority?.value === true
                              ? "#a330ae"
                              : "#ffffff",
                        }}
                      ></div>
                    </button>
                    <span className='text-gray-600 ms-2'>High Priority</span>
                  </div>
                </div>
                <div style={{ width: '60%' }}>
                  <div>
                    <label className='form-label'>Visibility</label>
                    <Select
                      id='visibility-select'
                      classNamePrefix='react-select'
                      options={[
                        { value: '', label: 'Select Visibility' },
                        { value: 'Public', label: 'Public' },
                        { value: 'Private', label: 'Private' }
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className='form-label'>Detailed Description</label>
                <textarea
                  className='form-input'
                  placeholder='Provide a comprehensive description of the deal...'
                  rows={3}
                />
              </div>
              <div className='flex justify-center'>
                <button
                  type='button'
                  className='btn-secondary me-7'
                  onClick={() => setStep(0)}
                >
                  Back
                </button>
                <button
                  type='button'
                  className='btn-primary'
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
                  onClick={() => document.getElementById('teaser-upload').click()}
                >
                  <span className="file-upload-text">{teaserFile ? teaserFile.name : 'No file selected'}</span>
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
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="btn-secondary"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
