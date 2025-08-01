-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public inserts on blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public updates on blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Public can read blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow public inserts on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public updates on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public inserts on blog_statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public updates on blog_statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Public can read blog statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public inserts on blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow public updates on blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Public can read blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_categories;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_tags;
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON blog_statistics;
DROP POLICY IF EXISTS "Allow authors to manage their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to manage statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Allow public inserts on newsletter_subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users to manage newsletter_subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read access to social_platforms" ON social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_platforms" ON social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_posts" ON social_posts;
DROP POLICY IF EXISTS "Allow admin users to manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can manage all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can manage blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Admin users can manage blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Admin users can manage blog statistics" ON blog_statistics;
DROP POLICY IF EXISTS "Public can subscribe to the newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin users can manage newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can read social platforms" ON social_platforms;
DROP POLICY IF EXISTS "Admin users can manage social platforms" ON social_platforms;
DROP POLICY IF EXISTS "Users can manage their own social posts" ON social_posts;
DROP POLICY IF EXISTS "Admin users can manage all social posts" ON social_posts;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = get_user_role.user_id;
  RETURN role;
END;
$$ LANGUAGE plpgsql;

-- Blog Posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Users can insert their own blog posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own blog posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own blog posts" ON public.blog_posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Admin users can manage all blog posts" ON public.blog_posts FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Blog Categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog categories" ON public.blog_categories FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Blog Tags
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read blog tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog tags" ON public.blog_tags FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Blog Statistics
ALTER TABLE public.blog_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read blog statistics" ON public.blog_statistics FOR SELECT USING (true);
CREATE POLICY "Admin users can manage blog statistics" ON public.blog_statistics FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe to the newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin users can manage newsletter subscribers" ON public.newsletter_subscribers FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Social Platforms
ALTER TABLE public.social_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read social platforms" ON public.social_platforms FOR SELECT USING (true);
CREATE POLICY "Admin users can manage social platforms" ON public.social_platforms FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Social Posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own social posts" ON public.social_posts FOR ALL USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admin users can manage all social posts" ON public.social_posts FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Seed a default admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@example.com' ON CONFLICT DO NOTHING;
