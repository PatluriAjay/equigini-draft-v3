export default function RecentActivity({ activities }) {
  // activities = [{ text, type, time }]
  const typeColor = {
    viewed: 'bg-green-500',
    added: 'bg-purple-500',
    signed: 'bg-orange-500',
    default: 'bg-gray-300',
  };
  return (
    <div className=" mb-6">
      <div className="heading-section mb-2">Recent Activity</div>
      <ul className="space-y-2 flex flex-col gap-2 ">
        {activities && activities.length > 0 ? activities.map((a, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full mb-2 ${typeColor[a.type] || typeColor.default}`}></span>
            <p className="p-small flex-1 m-0">{a.text}</p>
            <span className="text-xs text-secondary3">{a.time}</span>
          </li>
        )) : (
          <li className="p-small text-secondary3">No recent activity.</li>
        )}
      </ul>
    </div>
  );
} 