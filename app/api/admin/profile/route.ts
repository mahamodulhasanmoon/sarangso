import { type NextRequest, NextResponse } from "next/server"
import db, { initializeDatabase } from "@/lib/database"

// Initialize database on first import
initializeDatabase()

export async function GET() {
  try {
    // For demo purposes, we'll return the admin user
    // In a real app, you'd get the user ID from the JWT token
    const user = db.prepare("SELECT username, email, last_login FROM admin_users WHERE username = ?").get("admin") as {
      username: string
      email: string
      last_login: string
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        username: user.username,
        email: user.email,
        lastLogin: user.last_login,
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email } = body

    // Validate input
    if (!username || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 })
    }

    // Update user profile
    const updateUser = db.prepare(`
      UPDATE admin_users 
      SET username = ?, email = ?
      WHERE username = 'admin'
    `)

    updateUser.run(username, email)

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
