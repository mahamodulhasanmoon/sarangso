import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "sarangsho.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database tables
export function initializeDatabase() {
  // Blog posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      thumbnail TEXT,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      seo_title TEXT,
      seo_description TEXT,
      tags TEXT,
      author TEXT DEFAULT 'Admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    )
  `);

  // Custom pages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS custom_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      seo_title TEXT,
      seo_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Screenshots table
  db.exec(`
    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Site settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // App features table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      gradient TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Seed initial data
  seedInitialData();
}

function seedInitialData() {
  // Insert default admin user
  const adminExists = db
    .prepare("SELECT COUNT(*) as count FROM admin_users WHERE username = ?")
    .get("admin") as {
    count: number;
  };
  if (adminExists.count === 0) {
    const passwordHash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)"
    ).run("admin", passwordHash, "admin@sarangsho.com");
  }

  // Insert default site settings
  const settings = [
    ["site_name", "Sarangsho"],
    ["site_description", "Swipe through the latest trusted news"],
    ["seo_title", "Sarangsho - Latest Trusted News"],
    [
      "seo_description",
      "Stay informed with Sarangsho. Swipe through the latest trusted news from verified sources worldwide.",
    ],
    ["contact_email", "hello@sarangsho.com"],
    ["contact_phone", "+1 (555) 123-4567"],
    ["contact_address", "123 News Street, Digital City, DC 12345"],
    ["social_facebook", ""],
    ["social_twitter", ""],
    ["social_instagram", ""],
    ["social_linkedin", ""],
    ["google_analytics", ""],
    ["meta_keywords", "news, journalism, mobile news, trusted sources"],
  ];

  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)"
  );
  settings.forEach(([key, value]) => {
    insertSetting.run(key, value);
  });

  // Insert default app features
  const featuresExist = db
    .prepare("SELECT COUNT(*) as count FROM app_features")
    .get() as { count: number };
  if (featuresExist.count === 0) {
    const insertFeature = db.prepare(
      "INSERT INTO app_features (title, description, icon, gradient, sort_order) VALUES (?, ?, ?, ?, ?)"
    );

    insertFeature.run(
      "Swipe to Explore",
      "Navigate through news stories with intuitive TikTok-style swiping. Discover content effortlessly with vertical scrolling.",
      "Smartphone",
      "from-blue-500 to-cyan-500",
      1
    );

    insertFeature.run(
      "Discover by Category",
      "Find news that matters to you. Browse by politics, technology, sports, entertainment, and more specialized categories.",
      "Search",
      "from-purple-500 to-pink-500",
      2
    );

    insertFeature.run(
      "Global News Search",
      "Search for any news topic from around the world. Get instant access to breaking news and trending stories.",
      "Zap",
      "from-green-500 to-teal-500",
      3
    );

    insertFeature.run(
      "Trusted Sources Only",
      "All news comes from verified, credible sources. We fact-check and curate content to ensure reliability and accuracy.",
      "Shield",
      "from-orange-500 to-red-500",
      4
    );
  }

  // Insert sample screenshots
  const screenshotsExist = db
    .prepare("SELECT COUNT(*) as count FROM screenshots")
    .get() as { count: number };
  if (screenshotsExist.count === 0) {
    const insertScreenshot = db.prepare(
      "INSERT INTO screenshots (title, description, image_url, sort_order) VALUES (?, ?, ?, ?)"
    );

    insertScreenshot.run(
      "Home Feed",
      "Swipe through curated news stories",
      "/placeholder.svg?height=600&width=300",
      1
    );
    insertScreenshot.run(
      "Categories",
      "Browse news by topic",
      "/placeholder.svg?height=600&width=300",
      2
    );
    insertScreenshot.run(
      "Search",
      "Find specific news and topics",
      "/placeholder.svg?height=600&width=300",
      3
    );
    insertScreenshot.run(
      "Article View",
      "Read full articles with rich media",
      "/placeholder.svg?height=600&width=300",
      4
    );
    insertScreenshot.run(
      "Bookmarks",
      "Save articles for later reading",
      "/placeholder.svg?height=600&width=300",
      5
    );
  }
}

export default db;
