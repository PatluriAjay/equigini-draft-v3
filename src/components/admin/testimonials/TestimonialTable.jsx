"use client";
import { FiEdit2, FiArchive } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function TestimonialTable({ testimonials, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">USER NAME</th>
            <th className="table-th">INVESTOR TYPE</th>
            <th className="table-th">MESSAGE</th>
            <th className="table-th">CREATED</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length === 0 && (
            <tr><td colSpan={5} className="table-empty">No testimonials found.</td></tr>
          )}
          {testimonials.map((testimonial) => (
            <tr key={testimonial._id} className="table-row hover:bg-white">
              <td className="table-td whitespace-nowrap font-semibold text-sm max-w-xs truncate">
                {testimonial.user_name || "-"}
              </td>
              <td className="table-td whitespace-nowrap text-sm text-gray-600">
                {testimonial.investor_type || "-"}
              </td>
              <td className="table-td text-sm text-gray-600 max-w-xs truncate">
                {testimonial.message || "-"}
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
                  // className="text-blue-600 hover:text-blue-800" 
                  title="Edit" 
                  onClick={() => onEdit(testimonial._id)}
                >
                  <FaEdit size={16} />
                </button>
                <button 
                  // className="text-red-600 hover:text-red-800" 
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