import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database
initializeDatabase()

// Get custom page from database
const getCustomPage = async (slug: string) => {
  try {
    const page = db
      .prepare(`
      SELECT * FROM custom_pages 
      WHERE slug = ? AND status = 'published'
    `)
      .get(slug)

    return page
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getCustomPage(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
  }
}

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getCustomPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">{page.title}</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>

      <Footer />
    </div>
  )
}
