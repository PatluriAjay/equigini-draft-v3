"use client";
export default function EOIStats({ stats }) {
  // Placeholder values for now
  const summary = [
    { label: "Total EOIs", value: 47, color: "text-primarycolor", bg: "bg-blue-50", icon: "📄", sub: "+12% this week" },
    { label: "New/Unassigned", value: 23, color: "text-orange-600", bg: "bg-orange-50", icon: "⏳", sub: "Pending" },
    { label: "Assigned", value: 18, color: "text-green-600", bg: "bg-green-50", icon: "👤", sub: "In Progress" },
    { label: "Reviewed", value: 6, color: "text-purple-600", bg: "bg-purple-50", icon: "✔", sub: "Completed" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {summary.map((item) => (
        <div key={item.label} className={`rounded-lg p-4 flex flex-row items-center gap-4 ${item.bg}`}>
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl ${item.color} bg-white border border-gray-200`}>{item.icon}</div>
          <div className="flex flex-col items-start">
            <div className={`font-bold text-2xl ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{item.label}</div>
            <div className="text-xs mt-1 font-medium text-green-500">{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 