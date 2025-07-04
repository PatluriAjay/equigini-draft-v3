import React, { useState } from 'react';
import { approveInvestor, rejectInvestor } from '../../../services/api';
import ModalMessage from '../../investor/ModalMessage';

const statusMap = {
  pending_review: { label: 'Pending Review', color: 'badge bg-yellow-100 text-yellow-800' },
  unverified: { label: 'Unverified', color: 'badge bg-red-100 text-red-800' },
  verified: { label: 'Verified', color: 'badge bg-green-100 text-green-800' },
  deactivated: { label: 'Deactivated', color: 'badge bg-gray-200 text-gray-600' },
  active: { label: 'Active', color: 'badge bg-green-100 text-green-800' },
};

export default function ProfileHeader({ investor, source = 'management', onStatusChange }) {
  const [processingAction, setProcessingAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    try {
      setProcessingAction(true);
      await approveInvestor(investor._id);
      setModalMessage("Investor approved successfully!");
      setModalType("success");
      setShowModal(true);
      // Call callback to refresh parent component
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      setModalMessage(error.message || "Failed to approve investor");
      setModalType("error");
      setShowModal(true);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async (reason = "") => {
    try {
      setProcessingAction(true);
      await rejectInvestor(investor._id, reason);
      setModalMessage("Investor rejected successfully!");
      setModalType("success");
      setShowModal(true);
      setShowRejectModal(false);
      setRejectReason("");
      // Call callback to refresh parent component
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      setModalMessage(error.message || "Failed to reject investor");
      setModalType("error");
      setShowModal(true);
    } finally {
      setProcessingAction(false);
    }
  };

  const openRejectModal = () => {
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    handleReject(rejectReason);
  };

  const handleDeactivate = () => {
    // TODO: Implement deactivate functionality
    console.log('Deactivating investor:', investor._id);
  };

  return (
    <>
      <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 pb-0 ">
        <div className="flex items-center gap-4">
          {/* <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-primarycolor">
            {investor.full_name?.[0]}
          </div> */}
          <div>
            <div className="heading-main mb-1">{investor.full_name || '-'}</div>
            <div className="p-medium mb-2">{investor.email || '-'}</div>
            {/* <div className="flex flex-wrap gap-2">
              <span className={statusMap[investor.status]?.color}>{statusMap[investor.status]?.label}</span>
              <span className="badge bg-blue-100 text-blue-800">{investor.investor_type}</span>
              <span className={`badge ${source === 'approval' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-800'}`}>{source === 'approval' ? 'NDA Not Signed' : 'NDA Signed'}</span>
            </div> */}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          {source === 'approval' && (
            <>
              <button 
                className="btn-primary" 
                onClick={handleApprove}
                disabled={processingAction}
              >
                {processingAction ? "Processing..." : "Approve"}
              </button>
              <button 
                className="btn-secondary bg-red-100 text-red-600 border-red-200 hover:bg-red-200" 
                onClick={openRejectModal}
                disabled={processingAction}
              >
                Reject
              </button>
            </>
          )}
          {source === 'management' && (
            <button className="btn-tertiary" onClick={handleDeactivate}>Deactivate</button>
          )}
        </div>
      </div>

      {/* Success/Error Modal */}
      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        message={modalMessage}
      />

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primarycolor mb-2">
                Reject Investor
              </h3>
              <p className="text-sm text-secondary3 mb-4">
                Are you sure you want to reject {investor?.full_name}? 
                Please provide a reason for rejection (optional).
              </p>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor focus:border-transparent"
                placeholder="Rejection reason (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                disabled={processingAction}
              >
                Cancel
              </button>
              <button
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                onClick={confirmReject}
                disabled={processingAction}
              >
                {processingAction ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 