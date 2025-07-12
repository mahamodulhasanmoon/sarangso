import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database
initializeDatabase()

// Get all published blog posts
const getBlogPosts = async () => {
  try {
    const posts = db
      .prepare(`
      SELECT id, title, slug, excerpt, thumbnail, published_at, author, tags
      FROM blog_posts 
      WHERE status = 'published' AND published_at IS NOT NULL
      ORDER BY published_at DESC
    `)
      .all()

    return posts
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export const metadata = {
  title: "Blog - Sarangsho",
  description: "Read our latest insights on journalism, technology, and the future of news consumption.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our thoughts on journalism, technology, and the future of news consumption.
            </p>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.thumbnail || "/placeholder.svg?height=200&width=300"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No blog posts yet</h2>
            <p className="text-gray-600 mb-8">Check back soon for our latest insights and articles.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
