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
