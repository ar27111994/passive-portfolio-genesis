-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authors to manage their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public read access to categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public read access to tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to manage tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public read access to statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow authenticated users to manage statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public inserts on newsletter_subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users to manage newsletter_subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read access to social_platforms" ON social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_platforms" ON social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_posts" ON social_posts;

-- Function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT r.role INTO role FROM user_roles r WHERE r.user_id = get_user_role.user_id;
  RETURN role;
END;
$$ LANGUAGE plpgsql;

-- Blog Posts
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Users can insert their own blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own blog posts" ON blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admin users can manage all blog posts" ON blog_posts FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Blog Categories
CREATE POLICY "Public can read blog categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog categories" ON blog_categories FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Blog Tags
CREATE POLICY "Public can read blog tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog tags" ON blog_tags FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Blog Statistics
CREATE POLICY "Public can read blog statistics" ON blog_statistics FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog statistics" ON blog_statistics FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Newsletter Subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe to the newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin users can manage newsletter subscribers" ON newsletter_subscribers FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Social Platforms
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read social platforms" ON social_platforms FOR SELECT USING (true);
CREATE POLICY "Admin users can manage social platforms" ON social_platforms FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Social Posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own social posts" ON social_posts FOR ALL USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admin users can manage all social posts" ON social_posts FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Seed a default admin user
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@example.com' ON CONFLICT DO NOTHING;
