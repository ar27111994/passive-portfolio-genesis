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
