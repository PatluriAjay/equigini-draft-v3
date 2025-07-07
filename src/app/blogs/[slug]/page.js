import { getBlogBySlug } from "@/services/api";

export async function generateMetadata({ params }) {
  try {
    const response = await getBlogBySlug(params.slug);
    
    if (response.status === "S" && response.result_info) {
      const blog = response.result_info;
      return {
        title: `${blog.meta_title || blog.title} | Equigini`,
        description: blog.meta_description || blog.excerpt || "Read our latest blog post",
        openGraph: {
          title: blog.meta_title || blog.title,
          description: blog.meta_description || blog.excerpt || "Read our latest blog post",
          type: "article",
          ...(blog.featured_image && {
            images: [`http://localhost:4000/${blog.featured_image.path.replace(/\\/g, "/")}`]
          })
        },
        twitter: {
          card: "summary_large_image",
          title: blog.meta_title || blog.title,
          description: blog.meta_description || blog.excerpt || "Read our latest blog post",
          ...(blog.featured_image && {
            images: [`http://localhost:4000/${blog.featured_image.path.replace(/\\/g, "/")}`]
          })
        }
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Blog Not Found | Equigini",
    description: "The requested blog could not be found."
  };
}

export default async function BlogPage({ params }) {
  try {
    const response = await getBlogBySlug(params.slug);
    
    if (response.status !== "S" || !response.result_info) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-4">The blog you're looking for doesn't exist or has been removed.</p>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back Home
            </a>
          </div>
        </div>
      );
    }

    const blog = response.result_info;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            {/* Meta information */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span>Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
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
              <p className="text-lg text-gray-700 leading-relaxed">{blog.excerpt}</p>
            )}
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="mb-8">
              <img
                src={`http://localhost:4000/${blog.featured_image.path.replace(/\\/g, "/")}`}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Back to blogs link */}
          <div className="mt-8 text-center">
            <a 
              href="/blogs" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blogs
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog</h1>
          <p className="text-gray-600 mb-4">Failed to load the blog content.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }
} 