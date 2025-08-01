# Row Level Security Policy Fix

## Problem
The blog tables have RLS enabled but only SELECT policies exist. INSERT operations are being blocked.

## Solution
Run this SQL in your Supabase SQL Editor to add INSERT policies:

```sql
-- Add INSERT policies to allow blog post creation
CREATE POLICY "Allow public inserts on blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_categories" ON blog_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_statistics" ON blog_statistics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_tags" ON blog_tags
  FOR INSERT WITH CHECK (true);

-- Add UPDATE policies for statistics and counters
CREATE POLICY "Allow public updates on blog_posts" ON blog_posts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_categories" ON blog_categories
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_statistics" ON blog_statistics
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_tags" ON blog_tags
  FOR UPDATE USING (true) WITH CHECK (true);
```

## Alternative: Disable RLS for Development
If you want to completely disable RLS for easier development:

```sql
-- Disable RLS on all blog tables
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_statistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags DISABLE ROW LEVEL SECURITY;
```

## Recommended: Use the INSERT policies above for proper security.
