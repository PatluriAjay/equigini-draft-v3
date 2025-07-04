"use client";
import { useState, useEffect } from "react";
import ProfileHeaderCard from "@/components/investor/profile/ProfileHeaderCard";
import PersonalInfoCard from "@/components/investor/profile/PersonalInfoCard";
import InvestmentProfileCard from "@/components/investor/profile/InvestmentProfileCard";
import ProfileEditModal2 from "@/components/investor/profile/ProfileEditModal2";
import Loader from "@/components/common/Loader";
import ModalMessage from "@/components/investor/ModalMessage";
import { getInvestorById, updateInvestor, getAllSectors } from "@/services/api";

export default function InvestorProfilePage() {
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [allSectors, setAllSectors] = useState([]);
  const [modalMessage, setModalMessage] = useState({ show: false, type: "success", message: "" });

  const fetchInvestorData = async () => {
    try {
      setLoading(true);
      
      // Get investor ID from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error("User data not found. Please login again.");
      }

      const user = JSON.parse(userData);
      const investorId = user._id || user.id;
      
      if (!investorId) {
        throw new Error("Investor ID not found. Please login again.");
      }

      // Fetch investor data from API
      const response = await getInvestorById(investorId);
      setInvestor(response.result_info);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching investor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorData();
  }, []);

  useEffect(() => {
    getAllSectors().then(res => {
      if (res.status === "S") setAllSectors(res.result_info);
    });
  }, []);

  const handleUpdateProfile = async (updateData) => {
    try {
      setUpdateLoading(true);
      
      // Get investor ID from localStorage
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const investorId = user._id || user.id;

      // Call the update API
      const response = await updateInvestor(investorId, updateData);
      
      // Update the local state with the new data
      setInvestor(response.result_info);
      
      // Update localStorage with new user data
      const updatedUser = { ...user, ...response.result_info };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message
      setModalMessage({ show: true, type: "success", message: "Profile updated successfully!" });
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setModalMessage({ show: true, type: "error", message: err.message || "Failed to update profile" });
      throw err; // Re-throw to be handled by the modal
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePersonalInfoEdit = () => {
    setEditMode("personal");
  };

  const handleInvestmentProfileEdit = () => {
    setEditMode("investment");
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Investor not found</div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <ProfileHeaderCard investor={investor} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PersonalInfoCard investor={investor} onEditClick={handlePersonalInfoEdit} />
        <InvestmentProfileCard investor={investor} onEditClick={handleInvestmentProfileEdit} sectors={allSectors} />
      </div>
      {/* Unified Profile Edit Modal */}
      <ProfileEditModal2
        isOpen={!!editMode}
        onClose={() => setEditMode(null)}
        investor={investor}
        onUpdate={handleUpdateProfile}
        mode={editMode}
      />
      {/* Modal Message for Success/Error */}
      <ModalMessage
        show={modalMessage.show}
        onClose={() => setModalMessage({ ...modalMessage, show: false })}
        type={modalMessage.type}
        message={modalMessage.message}
      />
    </div>
  );
}