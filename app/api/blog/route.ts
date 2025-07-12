import { type NextRequest, NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"
import { createSlug, ensureUniqueSlug } from "@/lib/utils/slug"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const posts = db
      .prepare(`
      SELECT * FROM blog_posts 
      ORDER BY created_at DESC
    `)
      .all()

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug: providedSlug, excerpt, content, thumbnail, status, seoTitle, seoDescription, tags } = body

    // Generate or validate slug
    let slug = providedSlug || createSlug(title)

    // Check if slug already exists
    const existingSlugs = db
      .prepare("SELECT slug FROM blog_posts WHERE slug LIKE ?")
      .all(`${slug}%`)
      .map((row: any) => row.slug)
    slug = ensureUniqueSlug(slug, existingSlugs)

    const insertPost = db.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, thumbnail, status, seo_title, seo_description, tags, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const publishedAt = status === "published" ? new Date().toISOString() : null

    const result = insertPost.run(
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      status,
      seoTitle,
      seoDescription,
      tags,
      publishedAt,
    )

    const newPost = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(result.lastInsertRowid)

    return NextResponse.json({ success: true, post: newPost })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
