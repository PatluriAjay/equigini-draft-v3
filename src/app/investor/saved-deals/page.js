"use client";
import SavedDealsGrid from "@/components/investor/deals/SavedDealsGrid";
import { useState, useEffect } from "react";
import { getAllSectors, getAllStages, getAllStatuses, getAllTicketSizes } from "@/services/api";

export default function SavedDealsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All Deals");
  const [selectedGeo, setSelectedGeo] = useState("India");
  const [sort, setSort] = useState("latest");
  const [dropdownOptions, setDropdownOptions] = useState({
    sectors: [],
    stages: [],
    statuses: [],
    ticketSizes: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [sectorsRes, stagesRes, statusesRes, ticketSizesRes] = await Promise.all([
          getAllSectors(),
          getAllStages(),
          getAllStatuses(),
          getAllTicketSizes(),
        ]);

        setDropdownOptions({
          sectors: sectorsRes.status === "S" ? sectorsRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          stages: stagesRes.status === "S" ? stagesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          statuses: statusesRes.status === "S" ? statusesRes.result_info.map(s => ({ value: s._id, label: s.name })) : [],
          ticketSizes: ticketSizesRes.status === "S" ? ticketSizesRes.result_info.map(t => ({ 
            value: t._id, 
            label: `${t.ticket_min || ''} - ${t.ticket_max || ''}` 
          })) : [],
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="heading-main mb-2">My Saved Deals</div>
      <div>
        <SavedDealsGrid
          dropdownOptions={dropdownOptions}
          loading={loading}
        />
      </div>
    </div>
  );
}
