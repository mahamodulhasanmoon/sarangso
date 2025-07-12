import { NextRequest, NextResponse } from "next/server";
import db, { initializeDatabase } from "@/lib/database";
import bcrypt from "bcryptjs";

initializeDatabase();

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get admin user by username
    const admin = db
      .prepare("SELECT * FROM admin_users WHERE username = ?")
      .get(username);

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare password with hash
    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: "demo_token",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
