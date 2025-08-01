-- Drop old public policies
DROP POLICY IF EXISTS "Allow public inserts on blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public updates on blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public inserts on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public updates on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public inserts on blog_statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public updates on blog_statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public inserts on blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public updates on blog_tags" ON blog_tags;

-- Drop the previously added authenticated user policies
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_categories;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_tags;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_statistics;

-- Policies for blog_posts
CREATE POLICY "Allow public read access to published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow authors to manage their own posts" ON blog_posts FOR ALL USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Policies for blog_categories
CREATE POLICY "Allow public read access to categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for blog_tags
CREATE POLICY "Allow public read access to tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage tags" ON blog_tags FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for blog_statistics
CREATE POLICY "Allow public read access to statistics" ON blog_statistics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage statistics" ON blog_statistics FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

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
