import { NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    // Get blog posts stats
    const totalPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number }
    const publishedPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'").get() as {
      count: number
    }
    const draftPosts = db.prepare("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'").get() as {
      count: number
    }

    // Get other stats
    const totalScreenshots = db.prepare("SELECT COUNT(*) as count FROM screenshots").get() as { count: number }
    const totalPages = db.prepare("SELECT COUNT(*) as count FROM custom_pages").get() as { count: number }
    const totalFeatures = db.prepare("SELECT COUNT(*) as count FROM app_features").get() as { count: number }

    const stats = {
      totalPosts: totalPosts.count,
      publishedPosts: publishedPosts.count,
      draftPosts: draftPosts.count,
      totalScreenshots: totalScreenshots.count,
      totalPages: totalPages.count,
      totalFeatures: totalFeatures.count,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
