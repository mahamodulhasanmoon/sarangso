import { type NextRequest, NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const screenshots = db
      .prepare(`
      SELECT * FROM screenshots 
      ORDER BY sort_order ASC, created_at DESC
    `)
      .all()

    return NextResponse.json({ screenshots })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch screenshots" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url } = body

    // Get the next sort order
    const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM screenshots").get() as {
      max_order: number | null
    }
    const sortOrder = (maxOrder.max_order || 0) + 1

    const insertScreenshot = db.prepare(`
      INSERT INTO screenshots (title, description, image_url, sort_order)
      VALUES (?, ?, ?, ?)
    `)

    const result = insertScreenshot.run(title, description, image_url, sortOrder)

    const newScreenshot = db.prepare("SELECT * FROM screenshots WHERE id = ?").get(result.lastInsertRowid)

    return NextResponse.json({ success: true, screenshot: newScreenshot })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create screenshot" }, { status: 500 })
  }
}
