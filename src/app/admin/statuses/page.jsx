"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const initialStatuses = [
//   { name: "Unverified", description: "Initial status for new entries" },
//   { name: "Pending Review", description: "Waiting for admin review" },
//   { name: "Verified", description: "Successfully verified entries" },
//   { name: "Deactivated", description: "Disabled or removed entries" },
    { name: "Open", description: "Currently active and open for business" },
    { name: "Closed", description: "No longer active or available" },

];

export default function CreateStatusPage() {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [statuses, setStatuses] = useState(initialStatuses);
  const [editIdx, setEditIdx] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Status name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editIdx !== null) {
        setStatuses((prev) => prev.map((s, idx) => idx === editIdx ? { ...formData } : s));
        setEditIdx(null);
      } else {
        setStatuses((prev) => [...prev, { ...formData }]);
      }
      setFormData({ name: "", description: "" });
      setErrors({});
    }
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setFormData({ ...statuses[idx] });
  };

  const handleDelete = (idx) => {
    setStatuses((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main">Status Management</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg p-4 pt-2 mb-6">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label htmlFor="statusName" className="form-label">
                Status Name
              </label>
              <input
                id="statusName"
                type="text"
                className={`form-input${errors.name ? " border-red-500 ring-red-200" : ""}`}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter status name"
                aria-describedby={errors.name ? "statusNameError" : undefined}
              />
              {errors.name && <div id="statusNameError" className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            <div className="md:col-span-6">
              <label htmlFor="statusDescription" className="form-label">
                Description
              </label>
              <input
                id="statusDescription"
                type="text"
                className={`form-input${errors.description ? " border-red-500 ring-red-200" : ""}`}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter status description"
                aria-describedby={errors.description ? "statusDescriptionError" : undefined}
              />
              {errors.description && <div id="statusDescriptionError" className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary w-full py-2">
                {editIdx !== null ? "Update Status" : "Add Status"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg p-0">
        <div className="overflow-x-auto">
          <table className="table-main">
            <thead>
              <tr className="table-header-row">
                <th className="table-th">STATUS NAME</th>
                <th className="table-th">DESCRIPTION</th>
                <th className="table-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status, idx) => (
                <tr key={status.name} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{status.name}</td>
                  <td className="table-td">{status.description}</td>
                  <td className="table-td flex gap-2 items-center">
                    <button className="btn-inline text-gray-700" title="Edit" type="button" onClick={() => handleEdit(idx)}><FaEdit size={20} /></button>
                    <button className="btn-inline text-gray-700" title="Delete" type="button" onClick={() => handleDelete(idx)}><MdDelete size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
