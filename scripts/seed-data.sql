-- Seed initial data for Sarangsho

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ9QmjQ', 'admin@sarangsho.com');

-- Insert default site settings
INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('site_name', 'Sarangsho'),
('site_description', 'Swipe through the latest trusted news'),
('seo_title', 'Sarangsho - Latest Trusted News'),
('seo_description', 'Stay informed with Sarangsho. Swipe through the latest trusted news from verified sources worldwide.'),
('contact_email', 'hello@sarangsho.com'),
('contact_phone', '+1 (555) 123-4567'),
('contact_address', '123 News Street, Digital City, DC 12345'),
('social_facebook', ''),
('social_twitter', ''),
('social_instagram', ''),
('social_linkedin', ''),
('google_analytics', ''),
('meta_keywords', 'news, journalism, mobile news, trusted sources');

-- Insert default app features
INSERT OR IGNORE INTO app_features (title, description, icon, sort_order) VALUES 
('Swipe to Explore', 'Navigate through news stories with intuitive TikTok-style swiping. Discover content effortlessly with vertical scrolling.', 'smartphone', 1),
('Discover by Category', 'Find news that matters to you. Browse by politics, technology, sports, entertainment, and more specialized categories.', 'search', 2),
('Global News Search', 'Search for any news topic from around the world. Get instant access to breaking news and trending stories.', 'zap', 3),
('Trusted Sources Only', 'All news comes from verified, credible sources. We fact-check and curate content to ensure reliability and accuracy.', 'shield', 4);

-- Insert sample blog posts
INSERT OR IGNORE INTO blog_posts (title, slug, excerpt, content, thumbnail, status, seo_title, seo_description, tags, published_at) VALUES 
(
    'The Future of News Consumption: Why Short-Form Content Matters',
    'future-of-news-consumption',
    'Explore how mobile-first news consumption is changing the way we stay informed in the digital age.',
    '<p>In today''s fast-paced digital world, the way we consume news is rapidly evolving...</p>',
    '/placeholder.svg?height=200&width=300',
    'published',
    'The Future of News Consumption - Sarangsho Blog',
    'Discover how short-form content is revolutionizing news consumption in the mobile era.',
    'news, mobile, short-form, digital journalism',
    '2024-01-15 10:00:00'
),
(
    'Building Trust in Digital Journalism: Our Source Verification Process',
    'building-trust-digital-journalism',
    'Learn about our rigorous fact-checking process and how we ensure only credible news reaches our users.',
    '<p>Trust is the cornerstone of quality journalism...</p>',
    '/placeholder.svg?height=200&width=300',
    'published',
    'Building Trust in Digital Journalism - Sarangsho',
    'Learn about Sarangsho''s commitment to verified, trustworthy news sources.',
    'journalism, trust, fact-checking, verification',
    '2024-01-10 14:30:00'
),
(
    'Global News at Your Fingertips: Breaking Down Information Barriers',
    'global-news-fingertips',
    'Discover how Sarangsho connects you with news from around the world, breaking down geographical barriers.',
    '<p>In an interconnected world, local events can have global implications...</p>',
    '/placeholder.svg?height=200&width=300',
    'published',
    'Global News Access - Sarangsho',
    'Access worldwide news coverage with Sarangsho''s global news platform.',
    'global news, international, accessibility, mobile news',
    '2024-01-05 09:15:00'
);

-- Insert sample custom pages
INSERT OR IGNORE INTO custom_pages (title, slug, content, status, seo_title, seo_description) VALUES 
(
    'Privacy Policy',
    'privacy',
    '<h1>Privacy Policy</h1><p>Last updated: January 15, 2024</p><h2>Information We Collect</h2><p>We collect information you provide directly to us...</p>',
    'published',
    'Privacy Policy - Sarangsho',
    'Learn about how Sarangsho collects, uses, and protects your personal information.'
),
(
    'Terms of Service',
    'terms',
    '<h1>Terms of Service</h1><p>Last updated: January 15, 2024</p><h2>Acceptance of Terms</h2><p>By accessing and using Sarangsho...</p>',
    'published',
    'Terms of Service - Sarangsho',
    'Read the terms and conditions for using Sarangsho news app.'
),
(
    'About Us',
    'about',
    '<h1>About Sarangsho</h1><p>Sarangsho is revolutionizing how people consume news...</p>',
    'draft',
    'About Sarangsho - Our Story',
    'Learn about Sarangsho''s mission to make trusted news accessible to everyone.'
);

-- Insert sample screenshots
INSERT OR IGNORE INTO screenshots (title, description, image_url, sort_order) VALUES 
('Home Feed', 'Swipe through curated news stories', '/placeholder.svg?height=600&width=300', 1),
('Categories', 'Browse news by topic', '/placeholder.svg?height=600&width=300', 2),
('Search', 'Find specific news and topics', '/placeholder.svg?height=600&width=300', 3),
('Article View', 'Read full articles with rich media', '/placeholder.svg?height=600&width=300', 4),
('Bookmarks', 'Save articles for later reading', '/placeholder.svg?height=600&width=300', 5);
