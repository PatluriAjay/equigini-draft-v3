"use client";
export default function InvestorStats({ stats }) {
  // Placeholder values for now
  const summary = [
    { label: "Pending Review", value: 23, color: "text-orange-500", bg: "bg-orange-50", icon: "!" },
    { label: "Verified", value: 1156, color: "text-green-600", bg: "bg-green-50", icon: "✓" },
    { label: "Unverified", value: 45, color: "text-gray-600", bg: "bg-gray-50", icon: "👤" },
    { label: "NDA Signed", value: 892, color: "text-blue-600", bg: "bg-blue-50", icon: "📄" },
    { label: "Deactivated", value: 23, color: "text-red-600", bg: "bg-red-50", icon: "✗" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
      {summary.map((item) => (
        <div key={item.label} className={`rounded-lg p-4 flex flex-row items-center gap-4 ${item.bg}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl ${item.color} bg-white border border-gray-200`}>{item.icon}</div>
          <div className="flex flex-col items-start">
            <div className={`font-bold text-2xl ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 