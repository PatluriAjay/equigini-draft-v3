"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const initialStages = [
	{ name: "Early", description: "Early-stage companies" },
	{ name: "Growth", description: "Growth-stage companies" },
	{ name: "Debt", description: "Debt financing stage" },
	{ name: "Pre-IPO", description: "Companies preparing for IPO" },
];

export default function CreateStagePage() {
	const [formData, setFormData] = useState({ name: "", description: "" });
	const [errors, setErrors] = useState({});
	const [stages, setStages] = useState(initialStages);
	const [editIdx, setEditIdx] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = "Stage name is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			if (editIdx !== null) {
				setStages((prev) =>
					prev.map((s, idx) => (idx === editIdx ? { ...formData } : s))
				);
				setEditIdx(null);
			} else {
				setStages((prev) => [...prev, { ...formData }]);
			}
			setFormData({ name: "", description: "" });
			setErrors({});
		}
	};

	const handleEdit = (idx) => {
		setEditIdx(idx);
		setFormData({ ...stages[idx] });
	};

	const handleDelete = (idx) => {
		setStages((prev) => prev.filter((_, i) => i !== idx));
		if (editIdx === idx) setEditIdx(null);
	};

	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
				<div>
					<h1 className="heading-main ">Stage Management</h1>
				</div>
			</div>

			{/* Form Card */}
			<div className="bg-white rounded-lg p-4 pt-2 mb-6">
				<form onSubmit={handleSubmit} autoComplete="off">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
						<div className="md:col-span-4">
							<label htmlFor="stageName" className="form-label">
								Stage Name
							</label>
							<input
								id="stageName"
								type="text"
								className={`form-input${
									errors.name ? " border-red-500 ring-red-200" : ""
								}`}
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter stage name"
								aria-describedby={
									errors.name ? "stageNameError" : undefined
								}
							/>
							{errors.name && (
								<div
									id="stageNameError"
									className="text-red-500 text-xs mt-1"
								>
									{errors.name}
								</div>
							)}
						</div>
						<div className="md:col-span-6">
							<label htmlFor="stageDescription" className="form-label">
								Description
							</label>
							<input
								id="stageDescription"
								type="text"
								className={`form-input${
									errors.description
										? " border-red-500 ring-red-200"
										: ""
								}`}
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Enter stage description"
								aria-describedby={
									errors.description
										? "stageDescriptionError"
										: undefined
								}
							/>
							{errors.description && (
								<div
									id="stageDescriptionError"
									className="text-red-500 text-xs mt-1"
								>
									{errors.description}
								</div>
							)}
						</div>
						<div className="md:col-span-2">
							<button
								type="submit"
								className="btn-primary w-full py-2"
							>
								{editIdx !== null ? "Update Stage" : "Add Stage"}
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
								<th className="table-th">STAGE NAME</th>
								<th className="table-th">DESCRIPTION</th>
								<th className="table-th">ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{stages.map((stage, idx) => (
								<tr
									key={stage.name}
									className="table-row hover:bg-white"
								>
									<td className="table-td font-semibold">{stage.name}</td>
									<td className="table-td">{stage.description}</td>
									<td className="table-td flex gap-2 items-center">
										<button
											className="btn-inline text-gray-700"
											title="Edit"
											type="button"
											onClick={() => handleEdit(idx)}
										>
											<FaEdit size={20} />
										</button>
										<button
											className="btn-inline text-gray-700"
											title="Delete"
											type="button"
											onClick={() => handleDelete(idx)}
										>
											<MdDelete size={20} />
										</button>
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
