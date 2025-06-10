"use client";
export default function DealStats({ stats }) {
  // Placeholder values for now
  const summary = [
    { label: "Open", value: 3, color: "text-green-600", bg: "bg-green-50", icon: "✔" },
    { label: "Closed", value: 1, color: "text-gray-600", bg: "bg-gray-50", icon: "⏹" },
    { label: "Draft", value: 1, color: "text-yellow-600", bg: "bg-yellow-50", icon: "✎" },
    { label: "Archived", value: 0, color: "text-red-600", bg: "bg-red-50", icon: "🗄" },
    { label: "Priority", value: 1, color: "text-purple-600", bg: "bg-purple-50", icon: "★" },
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