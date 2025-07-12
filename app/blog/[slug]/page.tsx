import { notFound } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database
initializeDatabase()

// Get blog post from database
const getBlogPost = async (slug: string) => {
  try {
    const post = db
      .prepare(`
      SELECT * FROM blog_posts 
      WHERE slug = ? AND status = 'published'
    `)
      .get(slug)

    return post
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    keywords: post.tags,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <span>By {post.author}</span>
              {post.tags && <span>Tags: {post.tags}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.thumbnail && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={post.thumbnail || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <Footer />
    </div>
  )
}
