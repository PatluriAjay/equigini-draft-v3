"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalMessage from "@/components/investor/ModalMessage";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 10;
const API_BASE = "http://localhost:4000/api";

export default function StageManagementPage() {
	const [stages, setStages] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [newStage, setNewStage] = useState("");
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
				setStages(result.result_info.map(s => ({ name: s.name })));
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
			const response = await fetch(`${API_BASE}/createStage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newStage.trim(), created_by: 1 })
			});
			const result = await response.json();
			if (result.status === "S") {
				setMessage({ show: true, type: "success", text: "Stage created successfully!" });
				setShowModal(false);
				setNewStage("");
				fetchStages();
			} else {
				setMessage({ show: true, type: "error", text: result.error_info || "Failed to create stage." });
			}
		} catch (err) {
			setMessage({ show: true, type: "error", text: err.message || "Failed to create stage." });
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
								<tr key={stage.name + idx} className="table-row hover:bg-white">
									<td className="table-td font-semibold">{stage.name}</td>
									<td className="table-td flex gap-2 items-center">
										<button className="btn-inline text-gray-700" title="Edit" type="button"><FaEdit size={20} /></button>
										<button className="btn-inline text-gray-700" title="Delete" type="button"><MdDelete size={20} /></button>
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
