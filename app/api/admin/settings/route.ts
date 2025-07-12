import { type NextRequest, NextResponse } from "next/server";
import db, { initializeDatabase } from "@/lib/database";
import { Copyright } from "lucide-react";
import { copyFile } from "fs";

// Initialize database on first import
initializeDatabase();

export async function GET() {
  try {
    const settingsRows = db
      .prepare("SELECT setting_key, setting_value FROM site_settings")
      .all() as Array<{
      setting_key: string;
      setting_value: string;
    }>;

    // Convert array to object
    const settings = {
      siteName: "",
      appStoreLink: "",
      playStoreLink: "",
      siteDescription: "",
      seoTitle: "",
      seoDescription: "",
      logo: "",
      favicon: "",
      heroImage: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      socialFacebook: "",
      socialTwitter: "",
      socialInstagram: "",
      socialLinkedin: "",
      googleAnalytics: "",
      metaKeywords: "",
      footerDescription: "",
      Copyright: "",
      tagLine: "",
    };

    // Map database keys to frontend keys
    const keyMapping: Record<string, keyof typeof settings> = {
      site_name: "siteName",
      app_store_link: "appStoreLink",
      play_store_link: "playStoreLink",
      site_description: "siteDescription",
      seo_title: "seoTitle",
      seo_description: "seoDescription",
      logo: "logo",
      favicon: "favicon",
      hero_image: "heroImage",
      contact_email: "contactEmail",
      contact_phone: "contactPhone",
      contact_address: "contactAddress",
      social_facebook: "socialFacebook",
      social_twitter: "socialTwitter",
      social_instagram: "socialInstagram",
      social_linkedin: "socialLinkedin",
      google_analytics: "googleAnalytics",
      meta_keywords: "metaKeywords",
      footer_description: "footerDescription",
      copyright: "Copyright",
      tag_line: "tagLine",
    };

    settingsRows.forEach((row) => {
      const frontendKey = keyMapping[row.setting_key];
      if (frontendKey) {
        settings[frontendKey] = row.setting_value || "";
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Map frontend keys to database keys
    const settingsMap = [
      ["site_name", body.siteName],
      ["app_store_link", body.appStoreLink],
      ["play_store_link", body.playStoreLink],
      ["site_description", body.siteDescription],
      ["seo_title", body.seoTitle],
      ["seo_description", body.seoDescription],
      ["logo", body.logo],
      ["favicon", body.favicon],
      ["hero_image", body.heroImage],
      ["contact_email", body.contactEmail],
      ["contact_phone", body.contactPhone],
      ["contact_address", body.contactAddress],
      ["social_facebook", body.socialFacebook],
      ["social_twitter", body.socialTwitter],
      ["social_instagram", body.socialInstagram],
      ["social_linkedin", body.socialLinkedin],
      ["google_analytics", body.googleAnalytics],
      ["meta_keywords", body.metaKeywords],
      ["footer_description", body.footerDescription],
      [
        "copyright",
        body.Copyright || `© ${new Date().getFullYear()} Sarangsho`,
      ],
      ["tag_line", body.tagLine || "Swipe through the latest trusted news"],
    ];

    // Use INSERT OR REPLACE to update existing settings or create new ones
    const upsertSetting = db.prepare(`
      INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);

    // Use a transaction for better performance and consistency
    const transaction = db.transaction(() => {
      settingsMap.forEach(([key, value]) => {
        upsertSetting.run(key, value || "");
      });
    });

    transaction();

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
