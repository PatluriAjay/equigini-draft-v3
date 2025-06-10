export default function RecentActivityBar({ activities }) {
  // activities = [{ text, type }]
  const typeColor = {
    viewed: 'bg-green-500',
    added: 'bg-purple-500',
    signed: 'bg-orange-500',
    default: 'bg-gray-300',
  };
  return (
    <div className="flex flex-wrap gap-4 items-center py-2">
      <span className="font-medium text-secondary text-sm mr-2">Recent Activity</span>
      {activities && activities.length > 0 ? activities.map((a, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className={`w-2.5 h-2.5 rounded-full ${typeColor[a.type] || typeColor.default}`}></span>
          <span className="p-small m-0">{a.text}</span>
        </span>
      )) : (
        <span className="p-small text-secondary3">No recent activity.</span>
      )}
    </div>
  );
} 