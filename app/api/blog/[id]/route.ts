import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"
import { createSlug, ensureUniqueSlug } from "@/lib/utils/slug"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const post = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, slug: providedSlug, excerpt, content, thumbnail, status, seoTitle, seoDescription, tags } = body
    const id = Number.parseInt(params.id)

    // Check if post exists
    const existingPost = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id)
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Generate or validate slug
    let slug = providedSlug || createSlug(title)

    // Check if slug already exists (excluding current post)
    const existingSlugs = db
      .prepare("SELECT slug FROM blog_posts WHERE slug LIKE ? AND id != ?")
      .all(`${slug}%`, id)
      .map((row: any) => row.slug)
    slug = ensureUniqueSlug(slug, existingSlugs)

    const publishedAt =
      status === "published" && existingPost.status !== "published"
        ? new Date().toISOString()
        : existingPost.published_at

    const updatePost = db.prepare(`
      UPDATE blog_posts 
      SET title = ?, slug = ?, excerpt = ?, content = ?, thumbnail = ?, status = ?, 
          seo_title = ?, seo_description = ?, tags = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updatePost.run(title, slug, excerpt, content, thumbnail, status, seoTitle, seoDescription, tags, publishedAt, id)

    const updatedPost = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id)

    return NextResponse.json({ success: true, post: updatedPost })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Check if post exists
    const existingPost = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id)
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const deletePost = db.prepare("DELETE FROM blog_posts WHERE id = ?")
    deletePost.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
