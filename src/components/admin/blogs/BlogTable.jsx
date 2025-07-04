"use client";
import { FiEdit2, FiArchive } from "react-icons/fi";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function BlogTable({ blogs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto w-full max-w-xs sm:max-w-sm md:max-w-full">
      <table className="table-main">
        <thead>
          <tr className="table-header-row">
            <th className="table-th">TITLE</th>
            <th className="table-th">SLUG</th>
            {/* <th className="table-th">READ TIME</th>
            <th className="table-th">VIEWS</th>
            <th className="table-th">STATUS</th> */}
            <th className="table-th">CREATED</th>
            <th className="table-th">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 && (
            <tr><td colSpan={7} className="table-empty">No blogs found.</td></tr>
          )}
          {blogs.map((blog) => (
            <tr key={blog._id} className="table-row hover:bg-white">
              <td className="table-td whitespace-nowrap font-semibold text-sm max-w-xs truncate">
                {blog.title || "-"}
              </td>
              <td className="table-td whitespace-nowrap text-sm text-gray-600">
                {blog.slug || "-"}
              </td>
                {/* <td className="table-td whitespace-nowrap">
                  {blog.read_time ? `${blog.read_time} min` : "-"}
                </td>
                <td className="table-td whitespace-nowrap">
                  {blog.views || 0}
                </td>
                <td className="table-td whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blog.is_active 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {blog.is_active ? "Active" : "Inactive"}
                  </span>
                </td> */}
              <td className="table-td whitespace-nowrap text-sm text-gray-600">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-') : "-"}
              </td>
              <td className="table-td flex gap-3 items-center">
                <button 
                  // className="text-blue-600 hover:text-blue-800" 
                  title="Edit" 
                  // onClick={() => onEdit(blog._id)}
                >
                  <FaEdit size={16} />
                </button>
                <button 
                  // className="text-red-600 hover:text-red-800" 
                  title="Delete" 
                  onClick={() => onDelete(blog._id)}
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