import InvestorActions from "./InvestorActions";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

// Custom date formatting function
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function InvestorTable({
  investors,
  onApprove,
  onReject,
  onDeactivate,
  onToggleActivation,
  onDeleteInvestor,
}) {
  const router = useRouter();

  // Badge color mapping
  const typeBadge = {
    HNWI: "bg-blue-100 text-blue-700",
    "Family Office": "",
    "Angel Investor": "",
    Other: "",
  };
  const statusBadge = {
    "Pending Review": "bg-orange-100 text-orange-700",
    Verified: "",
    Unverified: "",
    Deactivated: "",
  };
  const ndaBadge = {
    Signed: "",
    "Not Signed": "",
  };

  return (
    <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            {/* <th className="table-th"><input type="checkbox" className="form-checkbox" /></th> */}
            <th className="table-th">INVESTOR NAME</th>
            <th className="table-th">EMAIL</th>
            <th className="table-th">TYPE</th>
            <th className="table-th">REGISTRATION DATE</th>
            <th className="table-th">STATUS</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {investors && investors.length > 0 ? (
            investors.map((inv) => (
              <tr
                key={inv._id}
                className="table-row hover:bg-white cursor-pointer"
                onClick={() =>
                  router.push(
                    `/admin/investors/${inv._id}`
                  )
                }
              >
                {/* <td className="table-td"><input type="checkbox" className="form-checkbox" /></td> */}
                <td className="table-td">
                  <div className="font-semibold text-sm">{inv.full_name || '-'}</div>
                </td>
                <td className="table-td">{inv.email || '-'}</td>
                <td className="table-td">
                    {inv.investor_type || '-'}
                </td>
                <td className="table-td">
                  {formatDate(inv.createdAt)}
                </td>
                <td className="table-td">
                  <div 
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={inv.is_active}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggleActivation(inv._id, !inv.is_active);
                        }}
                      />
                      <div className="relative w-9 h-5 bg-gray-200 
                      rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primarycolor dark:peer-checked:bg-primarycolor"></div>
                    </label>
                  </div>
                </td>
                <td className="table-td flex gap-2 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InvestorActions
                    status={inv.is_approved ? "Approved" : "Pending Review"}
                    onApprove={() => onApprove(inv._id)}
                    onReject={() => onReject(inv._id)}
                    onDeactivate={() => onDeactivate(inv._id)}
                  />
                  <button
                    className="btn-inline text-gray-700"
                    title="View"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/admin/investors/${inv._id}`
                      );
                    }}
                  >
                    <FaEdit size={20} color="" />
                  </button>
                  <button 
                    className="btn-inline text-gray-700" 
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteInvestor(inv._id);
                    }}
                  >
                    <MdDelete size={20} color="" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="table-empty">
                No approved investors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
