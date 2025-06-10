"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const mockInvestors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    pan: 'ABCDE1234F',
    type: 'HNWI',
    geography: 'North America',
    focus: 'Technology, Healthcare',
    range: '$50K - $500K',
    registration: 'Dec 15, 2024',
    daysAgo: '2 days ago',
    status: 'Pending Review',
    statusColor: 'badge bg-yellow-100 text-yellow-800',
    regDate: new Date('2024-12-15'),
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@venture.com',
    phone: '+65 9876 5432',
    pan: 'FGHIJ5678K',
    type: 'Family Office',
    geography: 'Asia Pacific',
    focus: 'FinTech, Real Estate',
    range: '$1M - $10M',
    registration: 'Dec 14, 2024',
    daysAgo: '3 days ago',
    status: 'Unverified',
    statusColor: 'badge bg-red-100 text-red-800',
    regDate: new Date('2024-12-14'),
  },
  {
    id: 3,
    name: 'Emma Williams',
    email: 'emma.w@capital.com',
    phone: '+44 20 7123 4567',
    pan: 'KLMNO9012P',
    type: 'Angel Investor',
    geography: 'Europe',
    focus: 'SaaS, E-commerce',
    range: '$25K - $250K',
    registration: 'Dec 13, 2024',
    daysAgo: '4 days ago',
    status: 'Pending Review',
    statusColor: 'badge bg-yellow-100 text-yellow-800',
    regDate: new Date('2024-12-13'),
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'd.kim@institutional.com',
    phone: '+82 2 1234 5678',
    pan: 'QRSTU3456V',
    type: 'Institutional',
    geography: 'Asia Pacific',
    focus: 'Clean Energy, Infrastructure',
    range: '$5M - $50M',
    registration: 'Dec 12, 2024',
    daysAgo: '5 days ago',
    status: 'Documents Required',
    statusColor: 'badge bg-orange-100 text-orange-800',
    regDate: new Date('2024-12-12'),
  },
];

const statusBadge = (status, color) => (
  <span className={color}>{status}</span>
);

const investorTypes = [
  'All Investor Types',
  'HNWI',
  'Family Office',
  'Angel Investor',
  'Institutional',
];
const regions = [
  'All  Geographies',
  // 'North America',
  // 'Asia Pacific',
  // 'Europe',
];
// const regDateOptions = [
//   'All',
//   'Newest First',
//   'Oldest First',
// ];
// const statusOptions = [
//   'All',
//   'Pending Review',
//   'Unverified',
//   'Documents Required',
// ];

const InvestorApproval = () => {
  const [selected, setSelected] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [regDateFilter, setRegDateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const allSelected = selected.length === filteredInvestors().length && filteredInvestors().length > 0;

  function filteredInvestors() {
    let data = [...mockInvestors];
    if (typeFilter !== 'All') data = data.filter(i => i.type === typeFilter);
    if (regionFilter !== 'All') data = data.filter(i => i.geography === regionFilter);
    if (statusFilter !== 'All') data = data.filter(i => i.status === statusFilter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(i =>
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        i.pan.toLowerCase().includes(s)
      );
    }
    if (regDateFilter === 'Newest First') data = data.sort((a, b) => b.regDate - a.regDate);
    if (regDateFilter === 'Oldest First') data = data.sort((a, b) => a.regDate - b.regDate);
    return data;
  }

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    const filtered = filteredInvestors();
    setSelected(allSelected ? [] : filtered.map((i) => i.id));
  };
  const clearFilters = () => {
    setTypeFilter('All');
    setRegionFilter('All');
    setRegDateFilter('All');
    setStatusFilter('All');
    setSearch('');
  };

  const investors = filteredInvestors();

  // Helper to create slug from name
  const getSlug = (name) => name.toLowerCase().replace(/ /g, "-");

  return (
    <div className=" mx-auto ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-main">Investor Approval Queue</h1>
          {/* <p className="p-medium">Review and approve new investor registrations</p> */}
        </div>
        <div className="flex items-center gap-3">
          {/* <button className="btn-secondary flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
            12 Pending Approvals
          </button> */}
          {/* <button className="btn-primary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Export Queue
          </button> */}
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-row flex-nowrap items-center w-full gap-20 justify-between py-3">
        <div className="flex-shrink-0">
          <input
            type="text"
            placeholder="Search investors..."
            className="search-input w-72"
            value={search} onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-3 items-center  w-full sm:w-8/12 ">
          <select className="form-select w-auto " value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {investorTypes.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select className="form-select w-auto" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
            {regions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          {/* <select className="form-select w-auto" value={regDateFilter} onChange={e => setRegDateFilter(e.target.value)}>
            {regDateOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select> */}
          {/* <select className="form-select w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select> */}
          <button className="btn-primary btn-inline text-sm px-4 py-2 w-auto" onClick={clearFilters}>
          Apply
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg overflow-x-auto">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          {/* <h2 className="heading-main">Pending Investor Registrations</h2> */}
          {/* <button className="btn-secondary btn-inline text-sm px-4 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h13M3 16h13M9 12h13" /></svg>
            Sort by Date
          </button> */}
        </div>
        <table className="table-main">
          <thead className="table-header-row">
            <tr>
              {/* <th className="table-th"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th> */}
              <th className="table-th">INVESTOR DETAILS</th>
              <th className="table-th">CONTACT INFO</th>
              <th className="table-th">TYPE & GEOGRAPHY</th>
              <th className="table-th">INVESTMENT FOCUS</th>
              <th className="table-th">REGISTRATION</th>
              {/* <th className="table-th">STATUS</th> */}
            </tr>
          </thead>
          <tbody>
            {investors.map((inv) => (
              <tr key={inv.id} className="table-row hover:bg-white cursor-pointer" onClick={() => router.push(`/admin/investors/${getSlug(inv.name)}?source=approval`)}>
                {/* <td className="table-td"><input type="checkbox" checked={selected.includes(inv.id)} onChange={() => toggleSelect(inv.id)} /></td> */}
                <td className="table-td">
                  <div className="font-medium subheading text-primarycolor cursor-pointer hover:underline" onClick={() => router.push(`/admin/investors/${getSlug(inv.name)}?source=approval`)}>{inv.name}</div>
                  <div className="text-xs text-gray-500">PAN: {inv.pan}</div>
                </td>
                <td className="table-td">
                  <div className="text-sm text-gray-900">{inv.email}</div>
                  <div className="text-xs text-gray-500">{inv.phone}</div>
                </td>
                <td className="table-td">
                  <div className={` ${inv.type === 'HNWI' ? '' : inv.type === 'Family Office' ? '' : inv.type === 'Angel Investor' ? '' : ''}`}>{inv.type}</div>
                  <div className="text-xs text-gray-500 mt-1">{inv.geography}</div>
                </td>
                <td className="table-td">
                  <div className="text-sm text-gray-900">{inv.focus}</div>
                  <div className="text-xs text-gray-500">{inv.range}</div>
                </td>
                <td className="table-td">
                  <div className="text-sm text-gray-900">{inv.registration}</div>
                  <div className="text-xs text-gray-500">{inv.daysAgo}</div>
                </td>
                {/* <td className="table-td">{statusBadge(inv.status)}</td> */}
              </tr>
            ))}
            {investors.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty">No investors found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestorApproval;