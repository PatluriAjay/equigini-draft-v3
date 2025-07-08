"use client";
import { FiEdit2, FiArchive } from "react-icons/fi";
import { FaEye, FaEdit, FaVideo } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function TestimonialTable({ testimonials, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">USER NAME</th>
            <th className="table-th">INVESTOR TYPE</th>
            <th className="table-th">TYPE</th>
            <th className="table-th">CONTENT</th>
            <th className="table-th">CREATED</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length === 0 && (
            <tr><td colSpan={6} className="table-empty">No testimonials found.</td></tr>
          )}
          {testimonials.map((testimonial) => (
            <tr key={testimonial._id} className="table-row hover:bg-white">
              <td className="table-td whitespace-nowrap font-semibold text-sm max-w-xs truncate">
                {testimonial.user_name || "-"}
              </td>
              <td className="table-td whitespace-nowrap text-sm text-gray-600">
                {testimonial.investor_type || "-"}
              </td>
              <td className="table-td whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  testimonial.testimonial_type === 'video' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {testimonial.testimonial_type === 'video' ? (
                    <>
                      <FaVideo className="w-3 h-3 mr-1" />
                      Video
                    </>
                  ) : (
                    'Text'
                  )}
                </span>
              </td>
              <td className="table-td text-sm text-gray-600 max-w-xs truncate">
                {testimonial.testimonial_type === 'video' ? (
                  <span className="flex items-center text-blue-600">
                    <FaVideo className="w-3 h-3 mr-1" />
                    Video testimonial
                  </span>
                ) : (
                  testimonial.message || "-"
                )}
              </td>
              <td className="table-td whitespace-nowrap text-sm text-gray-600">
                {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-') : "-"}
              </td>
              <td className="table-td flex gap-3 items-center">
                <button 
                  title="Edit" 
                  onClick={() => onEdit(testimonial._id)}
                >
                  <FaEdit size={16} />
                </button>
                <button 
                  title="Delete" 
                  onClick={() => onDelete(testimonial._id)}
                >
                  <MdDelete size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 