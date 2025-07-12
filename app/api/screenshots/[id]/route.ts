import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, image_url } = body
    const id = Number.parseInt(params.id)

    const updateScreenshot = db.prepare(`
      UPDATE screenshots 
      SET title = ?, description = ?, image_url = ?
      WHERE id = ?
    `)

    updateScreenshot.run(title, description, image_url, id)

    const updatedScreenshot = db.prepare("SELECT * FROM screenshots WHERE id = ?").get(id)

    return NextResponse.json({ success: true, screenshot: updatedScreenshot })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update screenshot" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const deleteScreenshot = db.prepare("DELETE FROM screenshots WHERE id = ?")
    deleteScreenshot.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete screenshot" }, { status: 500 })
  }
}
