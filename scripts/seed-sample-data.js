const Database = require("better-sqlite3")
const path = require("path")

// Create data directory if it doesn't exist
const fs = require("fs")
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "sarangsho.db")
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Create tables (same as in database.ts)
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
`)

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
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

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
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )
`)

// Insert sample data
console.log("Seeding sample data...")

// Insert admin user
const adminExists = db.prepare("SELECT COUNT(*) as count FROM admin_users WHERE username = ?").get("admin")
if (adminExists.count === 0) {
  db.prepare("INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)").run(
    "admin",
    "$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQ",
    "admin@sarangsho.com",
  )
  console.log("✓ Admin user created")
}

// Insert site settings
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
]

const insertSetting = db.prepare("INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
settings.forEach(([key, value]) => {
  insertSetting.run(key, value)
})
console.log("✓ Site settings created")

// Insert app features
const featuresExist = db.prepare("SELECT COUNT(*) as count FROM app_features").get()
if (featuresExist.count === 0) {
  const insertFeature = db.prepare(
    "INSERT INTO app_features (title, description, icon, gradient, sort_order) VALUES (?, ?, ?, ?, ?)",
  )

  insertFeature.run(
    "Swipe to Explore",
    "Navigate through news stories with intuitive TikTok-style swiping. Discover content effortlessly with vertical scrolling.",
    "Smartphone",
    "from-blue-500 to-cyan-500",
    1,
  )

  insertFeature.run(
    "Discover by Category",
    "Find news that matters to you. Browse by politics, technology, sports, entertainment, and more specialized categories.",
    "Search",
    "from-purple-500 to-pink-500",
    2,
  )

  insertFeature.run(
    "Global News Search",
    "Search for any news topic from around the world. Get instant access to breaking news and trending stories.",
    "Zap",
    "from-green-500 to-teal-500",
    3,
  )

  insertFeature.run(
    "Trusted Sources Only",
    "All news comes from verified, credible sources. We fact-check and curate content to ensure reliability and accuracy.",
    "Shield",
    "from-orange-500 to-red-500",
    4,
  )
  console.log("✓ App features created")
}

// Insert sample blog posts
const postsExist = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get()
if (postsExist.count === 0) {
  const insertPost = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, thumbnail, status, seo_title, seo_description, tags, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertPost.run(
    "The Future of News Consumption: Why Short-Form Content Matters",
    "future-of-news-consumption",
    "Explore how mobile-first news consumption is changing the way we stay informed in the digital age.",
    "<p>In today's fast-paced digital world, the way we consume news is rapidly evolving. The rise of short-form content platforms like TikTok has fundamentally changed user expectations for content consumption, and the news industry is adapting to meet these new demands.</p><h2>The Shift to Mobile-First</h2><p>With over 6.8 billion smartphone users worldwide, mobile devices have become the primary gateway to information. Traditional long-form articles are being supplemented—and sometimes replaced—by bite-sized, easily digestible content that can be consumed on the go.</p><h2>Why Short-Form Works</h2><p>Short-form news content succeeds because it:</p><ul><li>Respects users' limited attention spans</li><li>Provides quick updates throughout the day</li><li>Uses visual storytelling to enhance comprehension</li><li>Enables easy sharing across social platforms</li></ul><h2>The Sarangsho Approach</h2><p>At Sarangsho, we've embraced this shift by creating a TikTok-style interface for news consumption. Our users can swipe through curated stories, getting the essential information they need without the overwhelm of traditional news websites.</p><p>This doesn't mean we're dumbing down the news—quite the opposite. We're making quality journalism more accessible and engaging for the modern reader.</p>",
    "/placeholder.svg?height=200&width=300",
    "published",
    "The Future of News Consumption - Sarangsho Blog",
    "Discover how short-form content is revolutionizing news consumption in the mobile era.",
    "news, mobile, short-form, digital journalism",
    "2024-01-15 10:00:00",
  )

  insertPost.run(
    "Building Trust in Digital Journalism: Our Source Verification Process",
    "building-trust-digital-journalism",
    "Learn about our rigorous fact-checking process and how we ensure only credible news reaches our users.",
    "<p>Trust is the cornerstone of quality journalism. In an era of information overload and misinformation, establishing and maintaining credibility is more important than ever. At Sarangsho, we take this responsibility seriously.</p><h2>Our Verification Standards</h2><p>Every news source on our platform undergoes a rigorous verification process:</p><ul><li>Editorial independence assessment</li><li>Fact-checking track record review</li><li>Source transparency evaluation</li><li>Bias detection and mitigation</li></ul><h2>Real-Time Monitoring</h2><p>Our team continuously monitors content quality and source reliability. We use both automated systems and human oversight to ensure that only verified, trustworthy news reaches our users.</p><h2>Community Feedback</h2><p>We believe in transparency and community involvement. Users can report questionable content, and we take all feedback seriously in our ongoing effort to maintain the highest standards of journalism.</p>",
    "/placeholder.svg?height=200&width=300",
    "published",
    "Building Trust in Digital Journalism - Sarangsho",
    "Learn about Sarangsho's commitment to verified, trustworthy news sources.",
    "journalism, trust, fact-checking, verification",
    "2024-01-10 14:30:00",
  )

  insertPost.run(
    "Global News at Your Fingertips: Breaking Down Information Barriers",
    "global-news-fingertips",
    "Discover how Sarangsho connects you with news from around the world, breaking down geographical barriers.",
    "<p>In an interconnected world, local events can have global implications. Understanding international perspectives and staying informed about worldwide developments is crucial for making informed decisions in our daily lives.</p><h2>Breaking Down Barriers</h2><p>Traditional news consumption often suffers from geographical and linguistic barriers. Sarangsho addresses these challenges by:</p><ul><li>Aggregating content from diverse global sources</li><li>Providing multilingual support</li><li>Offering cultural context for international stories</li><li>Highlighting underrepresented voices and perspectives</li></ul><h2>Personalized Global Feed</h2><p>Our algorithm learns your interests while ensuring you're exposed to important global developments. Whether you're interested in technology trends from Asia, political developments in Europe, or environmental initiatives from Africa, Sarangsho brings the world to your fingertips.</p><h2>The Future of Global News</h2><p>As the world becomes increasingly connected, access to diverse, reliable global news sources becomes not just valuable, but essential. Sarangsho is committed to making this access seamless and engaging for users everywhere.</p>",
    "/placeholder.svg?height=200&width=300",
    "published",
    "Global News Access - Sarangsho",
    "Access worldwide news coverage with Sarangsho's global news platform.",
    "global news, international, accessibility, mobile news",
    "2024-01-05 09:15:00",
  )
  console.log("✓ Sample blog posts created")
}

// Insert sample custom pages
const pagesExist = db.prepare("SELECT COUNT(*) as count FROM custom_pages").get()
if (pagesExist.count === 0) {
  const insertPage = db.prepare(`
    INSERT INTO custom_pages (title, slug, content, status, seo_title, seo_description)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertPage.run(
    "Privacy Policy",
    "privacy",
    "<h1>Privacy Policy</h1><p>Last updated: January 15, 2024</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p><h2>Information Sharing</h2><p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p><h2>Data Security</h2><p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p><h2>Contact Us</h2><p>If you have any questions about this Privacy Policy, please contact us at privacy@sarangsho.com.</p>",
    "published",
    "Privacy Policy - Sarangsho",
    "Learn about how Sarangsho collects, uses, and protects your personal information.",
  )

  insertPage.run(
    "Terms of Service",
    "terms",
    "<h1>Terms of Service</h1><p>Last updated: January 15, 2024</p><h2>Acceptance of Terms</h2><p>By accessing and using Sarangsho, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Use License</h2><p>Permission is granted to temporarily download one copy of Sarangsho for personal, non-commercial transitory viewing only.</p><h2>Disclaimer</h2><p>The materials on Sarangsho are provided on an 'as is' basis. Sarangsho makes no warranties, expressed or implied.</p><h2>Limitations</h2><p>In no event shall Sarangsho or its suppliers be liable for any damages arising out of the use or inability to use the materials on Sarangsho.</p><h2>Contact Information</h2><p>If you have any questions about these Terms of Service, please contact us at legal@sarangsho.com.</p>",
    "published",
    "Terms of Service - Sarangsho",
    "Read the terms and conditions for using Sarangsho news app.",
  )

  insertPage.run(
    "About Us",
    "about",
    "<h1>About Sarangsho</h1><p>Sarangsho is revolutionizing how people consume news in the digital age. Our mission is to make trusted journalism accessible, engaging, and relevant for modern readers.</p><h2>Our Story</h2><p>Founded in 2024, Sarangsho emerged from the recognition that traditional news consumption methods weren't meeting the needs of today's mobile-first audience. We set out to create a platform that combines the reliability of established journalism with the engaging format that modern users expect.</p><h2>Our Mission</h2><p>We believe that staying informed shouldn't be overwhelming or time-consuming. Our goal is to deliver the most important news in a format that respects your time while maintaining the highest standards of journalistic integrity.</p><h2>Our Values</h2><ul><li><strong>Trust:</strong> We only work with verified, credible news sources</li><li><strong>Accessibility:</strong> News should be available to everyone, everywhere</li><li><strong>Innovation:</strong> We continuously improve how news is discovered and consumed</li><li><strong>Transparency:</strong> We're open about our sources and processes</li></ul><h2>Contact Us</h2><p>Have questions or feedback? We'd love to hear from you at hello@sarangsho.com</p>",
    "published",
    "About Sarangsho - Our Story",
    "Learn about Sarangsho's mission to make trusted news accessible to everyone.",
  )
  console.log("✓ Sample custom pages created")
}

// Insert sample screenshots
const screenshotsExist = db.prepare("SELECT COUNT(*) as count FROM screenshots").get()
if (screenshotsExist.count === 0) {
  const insertScreenshot = db.prepare(
    "INSERT INTO screenshots (title, description, image_url, sort_order) VALUES (?, ?, ?, ?)",
  )

  insertScreenshot.run("Home Feed", "Swipe through curated news stories", "/placeholder.svg?height=600&width=300", 1)
  insertScreenshot.run("Categories", "Browse news by topic", "/placeholder.svg?height=600&width=300", 2)
  insertScreenshot.run("Search", "Find specific news and topics", "/placeholder.svg?height=600&width=300", 3)
  insertScreenshot.run("Article View", "Read full articles with rich media", "/placeholder.svg?height=600&width=300", 4)
  insertScreenshot.run("Bookmarks", "Save articles for later reading", "/placeholder.svg?height=600&width=300", 5)
  console.log("✓ Sample screenshots created")
}

db.close()
console.log("\n🎉 Database seeded successfully!")
console.log("You can now run your application with: npm run dev")
