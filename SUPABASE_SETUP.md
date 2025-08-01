# Supabase Database Setup Instructions

## Overview
Since Supabase doesn't allow DDL operations from client-side code, you need to create the database tables manually through the Supabase dashboard.

## Setup Steps

### 1. Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in and select your project: `mrhdiilrbvrwwwhdocnr`
3. Navigate to SQL Editor

### 2. Create Database Tables
Copy and paste this SQL into the SQL Editor and run it:

```sql
-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time_minutes INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_class TEXT DEFAULT 'bg-blue-100 text-blue-800',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_statistics table
CREATE TABLE blog_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read blog categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read blog statistics" ON blog_statistics
  FOR SELECT USING (true);

CREATE POLICY "Public can read blog tags" ON blog_tags
  FOR SELECT USING (true);

-- Insert initial data
INSERT INTO blog_categories (name, description, color_class) VALUES
('Angular', 'Angular framework tutorials and best practices', 'bg-red-100 text-red-800'),
('TypeScript', 'TypeScript language features and advanced patterns', 'bg-blue-100 text-blue-800'),
('Career', 'Career development and professional growth', 'bg-green-100 text-green-800'),
('Python', 'Python programming and development', 'bg-yellow-100 text-yellow-800'),
('Enterprise', 'Enterprise development and architecture', 'bg-purple-100 text-purple-800'),
('Open Source', 'Open source projects and contributions', 'bg-indigo-100 text-indigo-800'),
('Freelancing', 'Freelancing tips and business advice', 'bg-pink-100 text-pink-800'),
('Accessibility', 'Web accessibility and inclusive design', 'bg-teal-100 text-teal-800'),
('E-commerce', 'E-commerce development and solutions', 'bg-orange-100 text-orange-800'),
('State Management', 'State management patterns and libraries', 'bg-cyan-100 text-cyan-800');

INSERT INTO blog_statistics (label, value, icon_name, sort_order) VALUES
('Technical Articles', '0+', 'BookOpen', 1),
('Monthly Readers', '0+', 'Users', 2),
('Developer Engagement', '0%', 'Heart', 3),
('Community Reach', '0+', 'TrendingUp', 4);

INSERT INTO blog_tags (name) VALUES
('Angular'), ('TypeScript'), ('React'), ('Next.js'), ('Python'), ('JavaScript'),
('HTML'), ('CSS'), ('SCSS'), ('RxJS'), ('Akita'), ('Redux'), ('State Management'),
('Enterprise'), ('Architecture'), ('Performance'), ('Accessibility'), ('WCAG'),
('SEO'), ('Open Source'), ('Career'), ('Freelancing'), ('E-commerce'), ('OpenCart'),
('Shopify'), ('WordPress'), ('PHP'), ('C#'), ('ASP.NET'), ('Entity Framework');
```

### 3. Verify Setup
After running the SQL:
1. Go to Table Editor in Supabase dashboard
2. Verify these tables exist:
   - `blog_posts`
   - `blog_categories`
   - `blog_statistics`
   - `blog_tags`

### 4. Test in Application
1. Return to your blog application
2. Click "Test Connection" to verify database connectivity
3. The connection status should show "Connected"
4. You can now generate AI content successfully

## Troubleshooting

### If tables still don't exist:
1. Check the SQL Editor for any error messages
2. Try running each CREATE TABLE statement individually
3. Ensure you're in the correct project in Supabase

### If you get permission errors:
1. Make sure you're the owner of the Supabase project
2. Check that Row Level Security policies are correctly set
3. Verify the anon key has the right permissions

### If the app still shows connection errors:
1. Refresh the browser page
2. Check the environment variables are correctly set
3. Verify the Supabase URL and key are valid

## Alternative: Table Creation via Dashboard UI

If the SQL approach doesn't work, you can create tables manually:

1. Go to Table Editor > New Table
2. Create each table with the columns specified above
3. Set up the RLS policies through the Authentication > Policies section

The blog system will work once these tables are properly created in your Supabase database.
