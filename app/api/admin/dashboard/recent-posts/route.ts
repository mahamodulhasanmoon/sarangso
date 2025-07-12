import { NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const posts = db
      .prepare(`
      SELECT id, title, slug, status, created_at
      FROM blog_posts 
      ORDER BY created_at DESC
      LIMIT 5
    `)
      .all()

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch recent posts" }, { status: 500 })
  }
}
