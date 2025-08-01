-- Drop policies if they exist
DROP POLICY IF EXISTS "Allow public read access to social_platforms" ON public.social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_platforms" ON public.social_platforms;
DROP POLICY IF EXISTS "Allow authenticated users to manage social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Public can read social platforms" ON public.social_platforms;
DROP POLICY IF EXISTS "Admin users can manage social platforms" ON public.social_platforms;
DROP POLICY IF EXISTS "Users can manage their own social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admin users can manage all social posts" ON public.social_posts;

-- Social Platforms
ALTER TABLE public.social_platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read social platforms" ON public.social_platforms FOR SELECT USING (true);
CREATE POLICY "Admin users can manage social platforms" ON public.social_platforms FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Social Posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own social posts" ON public.social_posts FOR ALL USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admin users can manage all social posts" ON public.social_posts FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
