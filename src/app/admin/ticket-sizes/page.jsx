"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const initialRanges = [
  { min: 250000, max: 3000000, description: "Lorem" },
  { min: 500000, max: 5000000, description: "Lorem" },
];

const formatCurrency = (value) => {
  if (!value && value !== 0) return "";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

export default function CreateTicketRangePage() {
  const [formData, setFormData] = useState({ min: "", max: "", description: "" });
  const [errors, setErrors] = useState({});
  const [ranges, setRanges] = useState(initialRanges);
  const [editIdx, setEditIdx] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.min) newErrors.min = "Minimum is required";
    if (!formData.max) newErrors.max = "Maximum is required";
    if (formData.min && formData.max && Number(formData.min) >= Number(formData.max)) {
      newErrors.max = "Maximum must be greater than minimum";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editIdx !== null) {
        setRanges((prev) => prev.map((r, idx) => idx === editIdx ? { min: Number(formData.min), max: Number(formData.max), description: formData.description } : r));
        setEditIdx(null);
      } else {
        setRanges((prev) => [
          ...prev,
          {
            min: Number(formData.min),
            max: Number(formData.max),
            description: formData.description,
          },
        ]);
      }
      setFormData({ min: "", max: "", description: "" });
      setErrors({});
    }
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setFormData({ ...ranges[idx] });
  };

  const handleDelete = (idx) => {
    setRanges((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="heading-main ">Ticket Size Management</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg p-4 pt-2 mb-6">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="min" className="form-label">
                Min (₹)
              </label>
              <input
                id="min"
                type="number"
                className={`form-input${errors.min ? " border-red-500 ring-red-200" : ""}`}
                name="min"
                value={formData.min}
                onChange={handleInputChange}
                placeholder="Min"
                min="0"
                aria-describedby={errors.min ? "minError" : undefined}
              />
              {errors.min && <div id="minError" className="text-red-500 text-xs mt-1">{errors.min}</div>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="max" className="form-label">
                Max (₹)
              </label>
              <input
                id="max"
                type="number"
                className={`form-input${errors.max ? " border-red-500 ring-red-200" : ""}`}
                name="max"
                value={formData.max}
                onChange={handleInputChange}
                placeholder="Max"
                min="0"
                aria-describedby={errors.max ? "maxError" : undefined}
              />
              {errors.max && <div id="maxError" className="text-red-500 text-xs mt-1">{errors.max}</div>}
            </div>
            <div className="md:col-span-6">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                id="description"
                type="text"
                className={`form-input${errors.description ? " border-red-500 ring-red-200" : ""}`}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                aria-describedby={errors.description ? "descriptionError" : undefined}
              />
              {errors.description && <div id="descriptionError" className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary w-full py-2">
                {editIdx !== null ? "Update Range" : "Add Range"}
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
                <th className="table-th">RANGE</th>
                <th className="table-th">DESCRIPTION</th>
                <th className="table-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((range, idx) => (
                <tr key={range.min + '-' + range.max + '-' + range.description} className="table-row hover:bg-white">
                  <td className="table-td font-semibold">{formatCurrency(range.min)} – {formatCurrency(range.max)}</td>
                  <td className="table-td">{range.description}</td>
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
