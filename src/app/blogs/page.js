import { getAllBlogs } from "@/services/api";
import Image from "next/image";

export const metadata = {
  title: "Blogs | Equigini",
  description: "Read our latest insights and articles on investment opportunities and market trends.",
  openGraph: {
    title: "Blogs | Equigini",
    description: "Read our latest insights and articles on investment opportunities and market trends.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Blogs | Equigini",
    description: "Read our latest insights and articles on investment opportunities and market trends."
  }
};

export default async function BlogsPage() {
  try {
    const response = await getAllBlogs();
    
    if (response.status !== "S" || !response.result_info) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blogs</h1>
            <p className="text-gray-600 mb-4">Failed to fetch blogs</p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Filter only published blogs
    const publishedBlogs = (response.result_info.blogs || response.result_info)
      .filter(blog => blog.status === 'published' && blog.is_active);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read our latest insights and articles on investment opportunities, market trends, and industry analysis.
            </p>
          </div>

          {/* Blogs Grid */}
          {publishedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Blogs Available</h2>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedBlogs.map((blog) => (
                <article key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Featured Image */}
                  {blog.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={`http://localhost:4000/${blog.featured_image.path.replace(/\\/g, "/")}`}
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      <a 
                        href={`/blogs/${blog.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {blog.title}
                      </a>
                    </h2>
                    
                    {/* Meta information */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      {blog.read_time && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{blog.read_time} min read</span>
                        </>
                      )}
                    </div>
                    
                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    )}
                    
                    {/* Read More Link */}
                    <a 
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blogs</h1>
          <p className="text-gray-600 mb-4">Failed to load blogs</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
} 