import { type NextRequest, NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    const features = db
      .prepare(`
      SELECT * FROM app_features 
      ORDER BY sort_order ASC, created_at DESC
    `)
      .all()

    return NextResponse.json({ features })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, icon, gradient, is_active } = body

    // Get the next sort order
    const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM app_features").get() as {
      max_order: number | null
    }
    const sortOrder = (maxOrder.max_order || 0) + 1

    const insertFeature = db.prepare(`
      INSERT INTO app_features (title, description, icon, gradient, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insertFeature.run(title, description, icon, gradient, sortOrder, is_active ? 1 : 0)

    const newFeature = db.prepare("SELECT * FROM app_features WHERE id = ?").get(result.lastInsertRowid)

    return NextResponse.json({ success: true, feature: newFeature })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create feature" }, { status: 500 })
  }
}
