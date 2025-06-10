import InvestorActions from "./InvestorActions";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

export default function InvestorTable({ investors, onApprove, onReject, onDeactivate }) {
  const router = useRouter();
  // Placeholder data for now
  const rows = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@familyoffice.com",
      type: "Family Office",
      // status: "Verified",
      nda: "Signed",
      created_at: "Nov 28, 2024",
      role: "Investor",
    },
    {
      id: 2,
      name: "David Chen",
      email: "david.chen@angelinvest.com",
      type: "Angel Investor",
      // status: "Verified",
      nda: "Signed",
      created_at: "Oct 12, 2024",
      role: "Investor",
    },
  ];

  // Badge color mapping
  const typeBadge = {
    "HNWI": "bg-blue-100 text-blue-700",
    "Family Office": "",
    "Angel Investor": "",
    "Other": "",
  };
  const statusBadge = {
    "Pending Review": "bg-orange-100 text-orange-700",
    "Verified": "",
    "Unverified": "",
    "Deactivated": "",
  };
  const ndaBadge = {
    "Signed": "",
    "Not Signed": "",
  };

  // Helper to create slug from name
  const getSlug = (name) => name.toLowerCase().replace(/ /g, "-");

  return (
    <div className="overflow-x-auto">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            {/* <th className="table-th"><input type="checkbox" className="form-checkbox" /></th> */}
            <th className="table-th">INVESTOR DETAILS</th>
            <th className="table-th">TYPE</th>
            {/* <th className="table-th">STATUS</th> */}
            <th className="table-th">NDA STATUS</th>
            <th className="table-th">REGISTRATION DATE</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((inv) => (
            <tr 
              key={inv.id} 
              className="table-row hover:bg-white cursor-pointer" 
              onClick={() => router.push(`/admin/investors/${getSlug(inv.name)}?source=management`)}
            >
              {/* <td className="table-td"><input type="checkbox" className="form-checkbox" /></td> */}
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-semibold text-sm">{inv.name}</div>
                    <div className="text-xs text-gray-500">{inv.email}</div>
                  </div>
                </div>
              </td>
              <td className="table-td">
                <span className={` ${typeBadge[inv.type] || ""}`}>{inv.type}</span>
              </td>
              {/* <td className="table-td">
                <span className={`badge ${statusBadge[inv.status] || "bg-gray-100 text-gray-700"}`}>{inv.status}</span>
              </td> */}
              <td className="table-td">
                <span className={` ${ndaBadge[inv.nda] || ""}`}>{inv.nda}</span>
              </td>
              <td className="table-td">{inv.created_at}</td>
              <td className="table-td flex gap-2 items-center">
                <InvestorActions
                  status={inv.status}
                  onApprove={() => onApprove(inv.id)}
                  onReject={() => onReject(inv.id)}
                  onDeactivate={() => onDeactivate(inv.id)}
                />
                <button className="btn-inline text-gray-700" title="Edit" onClick={() => router.push(`/admin/investors/${getSlug(inv.name)}?source=management`)}><FaEdit size={20} color="" /></button>
                <button className="btn-inline text-gray-700" title="Delete"><MdDelete  size={20} color="" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 