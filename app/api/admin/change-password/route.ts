import { type NextRequest, NextResponse } from "next/server";
import db, { initializeDatabase } from "@/lib/database";
import bcrypt from "bcryptjs";

// Initialize database on first import
initializeDatabase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Get current user (assuming "admin" user only)
    const user = db
      .prepare("SELECT password_hash FROM admin_users WHERE username = ?")
      .get("admin") as {
      password_hash: string;
    };

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare current password using bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password securely
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    db.prepare(
      `UPDATE admin_users SET password_hash = ? WHERE username = 'admin'`
    ).run(newPasswordHash);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
