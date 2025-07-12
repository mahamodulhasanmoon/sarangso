import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)

    // If only updating is_active status
    if (Object.keys(body).length === 1 && "is_active" in body) {
      const updateFeatureStatus = db.prepare(`
        UPDATE app_features 
        SET is_active = ?
        WHERE id = ?
      `)

      updateFeatureStatus.run(body.is_active ? 1 : 0, id)
    } else {
      // Full update
      const { title, description, icon, gradient, is_active } = body

      const updateFeature = db.prepare(`
        UPDATE app_features 
        SET title = ?, description = ?, icon = ?, gradient = ?, is_active = ?
        WHERE id = ?
      `)

      updateFeature.run(title, description, icon, gradient, is_active ? 1 : 0, id)
    }

    const updatedFeature = db.prepare("SELECT * FROM app_features WHERE id = ?").get(id)

    return NextResponse.json({ success: true, feature: updatedFeature })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update feature" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const deleteFeature = db.prepare("DELETE FROM app_features WHERE id = ?")
    deleteFeature.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete feature" }, { status: 500 })
  }
}
