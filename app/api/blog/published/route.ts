import { NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const posts = db
      .prepare(`
      SELECT id, title, slug, excerpt, thumbnail, published_at
      FROM blog_posts 
      WHERE status = 'published' AND published_at IS NOT NULL
      ORDER BY published_at DESC
      LIMIT 10
    `)
      .all()

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch published posts" }, { status: 500 })
  }
}
