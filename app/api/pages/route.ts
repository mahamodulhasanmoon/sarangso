import { type NextRequest, NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"
import { createSlug, ensureUniqueSlug } from "@/lib/utils/slug"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const pages = db
      .prepare(`
      SELECT * FROM custom_pages 
      ORDER BY created_at DESC
    `)
      .all()

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug: providedSlug, content, status, seoTitle, seoDescription } = body

    // Generate or validate slug
    let slug = providedSlug || createSlug(title)

    // Check if slug already exists
    const existingSlugs = db
      .prepare("SELECT slug FROM custom_pages WHERE slug LIKE ?")
      .all(`${slug}%`)
      .map((row: any) => row.slug)
    slug = ensureUniqueSlug(slug, existingSlugs)

    const insertPage = db.prepare(`
      INSERT INTO custom_pages (title, slug, content, status, seo_title, seo_description)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insertPage.run(title, slug, content, status, seoTitle, seoDescription)

    const newPage = db.prepare("SELECT * FROM custom_pages WHERE id = ?").get(result.lastInsertRowid)

    return NextResponse.json({ success: true, page: newPage })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
