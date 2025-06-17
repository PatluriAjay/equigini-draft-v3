import { FaBriefcase, FaRegBookmark, FaRegMoneyBillAlt, FaFileSignature } from 'react-icons/fa';

export default function StatsCards({ stats }) {
  // stats = { activeDeals, watchlist, invested, ndasSigned }
  const summary = [
    {
      label: 'Active Deals',
      value: stats?.activeDeals ?? 0,
      icon: <FaBriefcase className="text-primarycolor text-xl" />,
    },
    {
      label: 'Watchlist',
      value: stats?.watchlist ?? 0,
      icon: <FaRegBookmark className="text-primarycolor text-xl" />,
    },
    {
      label: 'Invested',
      value: stats?.invested ?? 0,
      icon: <FaRegMoneyBillAlt className="text-primarycolor text-xl" />,
    },
    {
      label: 'NDAs Signed',
      value: stats?.ndasSigned ?? 0,
      icon: <FaFileSignature className="text-primarycolor text-xl" />,
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {summary.map((item) => (
        <div key={item.label} className=" flex flex-row items-center gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm ">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primarycolor2">
            {item.icon}
          </div>
          <div className="flex flex-col items-start">
            <div className="font-bold text-2xl text-secondary">{item.value}</div>
            <div className="text-xs text-secondary3 mt-1 font-medium">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 