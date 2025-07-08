import { FaLock, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { DealIconMap } from "./dealIcons";
import { deals as dealsData } from "@/components/investor/deals/deals";
import Link from "next/link";

export default function HorizontalScrollDeals({ maxDeals, layout = "default" }) {
  const displayDeals = maxDeals ? dealsData.slice(0, maxDeals) : dealsData;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
        {displayDeals && displayDeals.length > 0 ? (
          displayDeals.map((deal) => (
            <div
              key={deal.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col min-w-[260px] max-w-[320px] flex-shrink-0`}
            >
              {/* Deal Image */}
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {deal.imageUrl ? (
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                    {deal.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Icon, Title, Status Row */}
              <div className="flex items-center gap-3 mb-2 px-4">
                <div className="card-icon-div ">
                  {DealIconMap[deal.sector] || DealIconMap[deal.icon] || null}
                </div>
                <h3 className="card-heading text-secondary-override line-clamp-2 flex-1">
                  {deal.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    deal.status === "Open"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {deal.status || "Open"}
                </span>
              </div>
              {/* Sector & Stage Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2 px-4 justify-between">
                <div className="card-paragraph2 flex flex-col items-start">
                  <p className="text-sm font-medium text-primarycolor">Sector:</p>
                  <p className="text-sm">{deal.sector}</p>
                </div>
                <div className="card-paragraph2 flex flex-col items-start">
                  <p className="text-sm font-medium text-primarycolor">Stage:</p>
                  <p className="text-sm">{deal.stage}</p>
                </div>
              </div>
              {/* Description Paragraph */}
              <div className="px-4 mb-2">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {deal.description}
                </p>
              </div>
              {/* Ticket Size & IRR */}
              <div className="grid grid-cols-2 gap-2 mb-2 px-4 justify-between">
                <div className="card-paragraph2 flex flex-col items-start">
                  <p className="text-sm font-medium text-primarycolor">Ticket Size:</p>
                  <p className="text-sm">{deal.range}</p>
                </div>
                <div className="card-paragraph2 flex flex-col items-start">
                  <p className="text-sm font-medium text-primarycolor">Expected IRR:</p>
                  <p className="text-sm">{deal.irr}</p>
                </div>
              </div>
              {/* Button */}
              <div className="w-full px-2 pb-4 flex gap-2">
                <Link href={`/investor/deals/${deal.slug}`} className="flex-1">
                  <button
                    className={` px-2 py-2 w-full rounded-full bg-[#A330AE10] font-light text-black border border-secondary hover:bg-primarycolor hover:text-white focus:ring-transparent hover:border-primarycolor font-extralight text-sm transition-colors duration-200 `}
                  >
                    Read More
                  </button>
                </Link>
                <Link href={`/investor/deals/${deal.slug}`} className="flex-1">
                  <button
                    disabled={deal.status === "Closed"}
                    className={` px-2 py-2 w-full rounded-full bg-primarycolor font-light text-white border border-primarycolor hover:bg-white hover:text-primarycolor focus:ring-transparent font-extralight text-sm transition-colors duration-200 `}
                  >
                    Download Teaser
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="p-small text-secondary3">No deals found.</p>
        )}
      </div>
    </div>
  );
}
