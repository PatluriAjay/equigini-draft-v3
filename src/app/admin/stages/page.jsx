"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";
import { createStage, updateStage, deleteStage } from "@/services/api";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function StageManagementPage() {
	const [stages, setStages] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [newStage, setNewStage] = useState("");
	const [editingStage, setEditingStage] = useState(null);
	const [deletingStage, setDeletingStage] = useState(null);
	const [message, setMessage] = useState({ show: false, type: "success", text: "" });
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// Fetch stages from backend
	const fetchStages = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${API_BASE}/getAllStages`);
			const result = await response.json();
			if (result.status === "S" && Array.isArray(result.result_info)) {
				setStages(result.result_info);
			} else {
				setMessage({ show: true, type: "error", text: result.error_info || "Failed to fetch stages." });
			}
		} catch (err) {
			setMessage({ show: true, type: "error", text: err.message || "Failed to fetch stages." });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStages();
	}, []);

	// Filtered and paginated stages
	const filteredStages = stages.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
	const totalPages = Math.ceil(filteredStages.length / PAGE_SIZE);
	const paginatedStages = filteredStages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	// Create stage API call
	const handleCreateStage = async (e) => {
		e.preventDefault();
		if (!newStage.trim()) {
			setMessage({ show: true, type: "error", text: "Stage name is required." });
			return;
		}
		setLoading(true);
		try {
			const result = await createStage({ name: newStage.trim(), created_by: 1 });
			setMessage({ show: true, type: "success", text: "Stage created successfully!" });
			setShowModal(false);
			setNewStage("");
			fetchStages();
		} catch (err) {
			setMessage({ show: true, type: "error", text: err.message || "Failed to create stage." });
		} finally {
			setLoading(false);
		}
	};

	// Edit stage
	const handleEditStage = (stage) => {
		setEditingStage(stage);
		setShowEditModal(true);
	};

	// Update stage API call
	const handleUpdateStage = async (e) => {
		e.preventDefault();
		if (!editingStage.name.trim()) {
			setMessage({ show: true, type: "error", text: "Stage name is required." });
			return;
		}
		setLoading(true);
		try {
			const stageId = editingStage._id || editingStage.id;
			const result = await updateStage(stageId, { name: editingStage.name.trim() });
			setMessage({ show: true, type: "success", text: "Stage updated successfully!" });
			setShowEditModal(false);
			setEditingStage(null);
			fetchStages();
		} catch (err) {
			setMessage({ show: true, type: "error", text: err.message || "Failed to update stage." });
		} finally {
			setLoading(false);
		}
	};

	// Delete stage
	const handleDeleteStage = (stage) => {
		setDeletingStage(stage);
		setShowDeleteModal(true);
	};

	// Confirm delete stage API call
	const handleConfirmDelete = async () => {
		setLoading(true);
		try {
			const stageId = deletingStage._id || deletingStage.id;
			const result = await deleteStage(stageId);
			setMessage({ show: true, type: "success", text: "Stage deleted successfully!" });
			setShowDeleteModal(false);
			setDeletingStage(null);
			fetchStages();
		} catch (err) {
			setMessage({ show: true, type: "error", text: err.message || "Failed to delete stage." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen">
			{/* Top Bar: Heading and Create Button */}
			<div className="flex flex-row items-center justify-between mb-4 gap-3">
				<h1 className="heading-main ">Stage Management</h1>
				<button className="btn-primary w-fit px-6" onClick={() => setShowModal(true)}>+ Create</button>
			</div>

			{/* Search and Export Row */}
			<div className="flex  items-center w-full justify-between mb-5">
			<div className="flex-shrink-0">
				<input
					type="text"
					className="search-input w-72"
					placeholder="Search..."
					value={search}
					onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
				/>
				</div>
				<button className="btn-primary w-fit">Export</button>
			</div>

			{/* Table Card */}
			<div className="bg-white rounded-lg p-0">
				<div className="overflow-x-auto">
					<table className="table-main">
						<thead>
							<tr className="table-header-row">
								<th className="table-th">STAGE NAME</th>
								<th className="table-th">ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{paginatedStages.map((stage, idx) => (
								<tr key={stage._id || stage.id || stage.name + idx} className="table-row hover:bg-white">
									<td className="table-td font-semibold">{stage.name}</td>
									<td className="table-td flex gap-2 items-center">
										<button 
											className="btn-inline text-gray-700" 
											title="Edit" 
											type="button"
											onClick={() => handleEditStage(stage)}
										>
											<FaEdit size={20} />
										</button>
										<button 
											className="btn-inline text-gray-700" 
											title="Delete" 
											type="button"
											onClick={() => handleDeleteStage(stage)}
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

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={filteredStages.length}
				itemsPerPage={PAGE_SIZE}
			/>

			{/* Create Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
						<button
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
							onClick={() => setShowModal(false)}
							aria-label="Close"
						>
							×
						</button>
						<h2 className="heading-main mb-4 text-primarycolor">Create Stage</h2>
						<form onSubmit={handleCreateStage}>
							<input
								type="text"
								className="form-input w-full mb-4"
								placeholder="Enter stage name"
								value={newStage}
								onChange={e => setNewStage(e.target.value)}
								autoFocus
							/>
							<button
								className="btn-primary w-full"
								type="submit"
								disabled={loading}
							>
								{loading ? "Creating..." : "Create"}
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{showEditModal && editingStage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
						<button
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
							onClick={() => { setShowEditModal(false); setEditingStage(null); }}
							aria-label="Close"
						>
							×
						</button>
						<h2 className="heading-main mb-4 text-primarycolor">Edit Stage</h2>
						<form onSubmit={handleUpdateStage}>
							<input
								type="text"
								className="form-input w-full mb-4"
								placeholder="Enter stage name"
								value={editingStage.name}
								onChange={e => setEditingStage({ ...editingStage, name: e.target.value })}
								autoFocus
							/>
							<button
								className="btn-primary w-full"
								type="submit"
								disabled={loading}
							>
								{loading ? "Updating..." : "Update"}
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && deletingStage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
						<h2 className="heading-main mb-4 text-red-600">Delete Stage</h2>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete &ldquo;{deletingStage.name}&rdquo;? This action cannot be undone.
						</p>
						<div className="flex gap-3">
							<button
								className="btn-secondary flex-1"
								onClick={() => { setShowDeleteModal(false); setDeletingStage(null); }}
								disabled={loading}
							>
								Cancel
							</button>
							<button
								className="bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex-1"
								onClick={handleConfirmDelete}
								disabled={loading}
							>
								{loading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

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
