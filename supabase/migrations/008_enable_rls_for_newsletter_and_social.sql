-- Enable RLS for newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts on newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS for social_platforms
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to social_platforms" ON social_platforms FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage social_platforms" ON social_platforms FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS for social_posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to manage social_posts" ON social_posts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
