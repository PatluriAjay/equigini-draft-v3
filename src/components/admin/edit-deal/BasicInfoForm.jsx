import React from "react";

const sectors = ["Technology", "Healthcare", "Fintech", "Consumer", "Other"];
const stages = ["Seed", "Series A", "Series B", "Growth", "Pre-IPO"];
const statuses = ["Open", "Closed", "Draft", "Archived"];

export default function BasicInfoForm({ values = {}, onChange }) {
  // Provide dummy defaults if not set
  const v = {
    title: values.title ?? "TechStartup Innovation Ltd",
    crmCode: values.crmCode ?? "TS-2024-001",
    sector: values.sector ?? "Technology",
    stage: values.stage ?? "Series A",
    ticketSize: values.ticketSize ?? "₹50L - ₹5Cr",
    status: values.status ?? "Open",
    summary: values.summary ?? "AI-powered healthcare platform revolutionizing patient care through advanced diagnostics and treatment recommendations.",
    description: values.description ?? "TechStartup Innovation Ltd is developing an AI-powered healthcare platform that combines machine learning algorithms with clinical expertise to provide accurate diagnostics and personalized treatment recommendations. The platform has shown promising results in pilot studies and is ready for Series A funding to scale operations and expand market reach.",
    priorityFlag: values.priorityFlag ?? true,
    visibleToInvestors: values.visibleToInvestors ?? true,
  };
  return (
    <for m className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <label className="form-label">Deal Title</label>
        <input className="form-input" name="title" value={v.title} onChange={onChange} required />
        <label className="form-label">Sector</label>
        <select className="form-select" name="sector" value={v.sector} onChange={onChange} required>
          <option value="">Select sector</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="form-label">Ticket Size Range</label>
        <input className="form-input" name="ticketSize" value={v.ticketSize} onChange={onChange} placeholder="e.g. ₹50L - ₹5Cr" required />
        <label className="form-label">Summary</label>
        <textarea className="form-input" name="summary" value={v.summary} onChange={onChange} rows={2} required />
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="priorityFlag" checked={v.priorityFlag} onChange={onChange} />
            Priority Flag
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visibleToInvestors" checked={v.visibleToInvestors} onChange={onChange} />
            Visible to Investors
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <label className="form-label">CRM Deal Code</label>
        <input className="form-input" name="crmCode" value={v.crmCode} onChange={onChange} />
        <label className="form-label">Stage</label>
        <select className="form-select" name="stage" value={v.stage} onChange={onChange} required>
          <option value="">Select stage</option>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="form-label">Status</label>
        <select className="form-select" name="status" value={v.status} onChange={onChange} required>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="form-label">Full Description</label>
        <textarea className="form-input" name="description" value={v.description} onChange={onChange} rows={6} required />
      </div>
    </for>
  );
} 