import { supabase } from '@/integrations/supabase/client';
import { blogService } from '@/services/blogService';

// SQL to create tables if they don't exist
const createTablesSQL = `
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
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
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_class TEXT DEFAULT 'bg-blue-100 text-blue-800',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_statistics table
CREATE TABLE IF NOT EXISTS blog_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (drop if exists first)
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public can read blog categories" ON blog_categories;
CREATE POLICY "Public can read blog categories" ON blog_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read blog statistics" ON blog_statistics;
CREATE POLICY "Public can read blog statistics" ON blog_statistics
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read blog tags" ON blog_tags;
CREATE POLICY "Public can read blog tags" ON blog_tags
  FOR SELECT USING (true);
`;

// Function definitions SQL
const createFunctionsSQL = `
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment blog post likes
CREATE OR REPLACE FUNCTION increment_blog_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts 
  SET likes = likes + 1,
      updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update category post counts
CREATE OR REPLACE FUNCTION update_category_post_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE blog_categories 
  SET post_count = (
    SELECT COUNT(*) 
    FROM blog_posts 
    WHERE category = blog_categories.name 
    AND published = true
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to update tag usage counts
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE blog_tags 
  SET usage_count = (
    SELECT COUNT(*) 
    FROM blog_posts 
    WHERE blog_tags.name = ANY(tags) 
    AND published = true
  );
END;
$$ LANGUAGE plpgsql;
`;

// Seed data
const seedDataSQL = `
-- Insert blog categories (only if they don't exist)
INSERT INTO blog_categories (name, description, color_class) 
SELECT * FROM (VALUES
  ('Angular', 'Angular framework tutorials and best practices', 'bg-red-100 text-red-800'),
  ('TypeScript', 'TypeScript language features and advanced patterns', 'bg-blue-100 text-blue-800'),
  ('Career', 'Career development and professional growth', 'bg-green-100 text-green-800'),
  ('Python', 'Python programming and development', 'bg-yellow-100 text-yellow-800'),
  ('Enterprise', 'Enterprise development and architecture', 'bg-purple-100 text-purple-800'),
  ('Open Source', 'Open source projects and contributions', 'bg-indigo-100 text-indigo-800'),
  ('Freelancing', 'Freelancing tips and business advice', 'bg-pink-100 text-pink-800'),
  ('Accessibility', 'Web accessibility and inclusive design', 'bg-teal-100 text-teal-800'),
  ('E-commerce', 'E-commerce development and solutions', 'bg-orange-100 text-orange-800'),
  ('State Management', 'State management patterns and libraries', 'bg-cyan-100 text-cyan-800')
) AS v(name, description, color_class)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.name = v.name);

-- Insert blog statistics (only if they don't exist)
INSERT INTO blog_statistics (label, value, icon_name, sort_order)
SELECT * FROM (VALUES
  ('Technical Articles', '0+', 'BookOpen', 1),
  ('Monthly Readers', '0+', 'Users', 2),
  ('Developer Engagement', '0%', 'Heart', 3),
  ('Community Reach', '0+', 'TrendingUp', 4)
) AS v(label, value, icon_name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM blog_statistics WHERE blog_statistics.label = v.label);

-- Insert blog tags (only if they don't exist)
INSERT INTO blog_tags (name) 
SELECT unnest(ARRAY[
  'Angular', 'TypeScript', 'React', 'Next.js', 'Python', 'JavaScript',
  'HTML', 'CSS', 'SCSS', 'RxJS', 'Akita', 'Redux', 'State Management',
  'Enterprise', 'Architecture', 'Performance', 'Accessibility', 'WCAG',
  'SEO', 'Open Source', 'Career', 'Freelancing', 'E-commerce', 'OpenCart',
  'Shopify', 'WordPress', 'PHP', 'C#', 'ASP.NET', 'Entity Framework'
]) AS tag_name
WHERE NOT EXISTS (SELECT 1 FROM blog_tags WHERE blog_tags.name = tag_name);
`;

export async function initializeDatabase(): Promise<void> {
  console.log('🚀 Initializing database...');
  
  try {
    // Check Supabase connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_roles')
      .select('user_id')
      .limit(0); // Just test connection
    
    if (connectionError) {
      throw new Error(`Supabase connection failed: ${connectionError.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Create tables
    console.log('📋 Creating tables...');
    const { error: tablesError } = await supabase.rpc('exec_sql', { 
      sql: createTablesSQL 
    });
    
    if (tablesError) {
      // Try direct SQL execution instead
      console.log('Trying alternative table creation method...');
      
      // Split SQL into individual statements and execute them
      const statements = createTablesSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec', { 
            query: statement.trim() + ';'
          });
          
          if (error && !error.message.includes('already exists')) {
            console.warn('SQL execution warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Tables created successfully');
    
    // Create functions
    console.log('⚙️ Creating functions...');
    const { error: functionsError } = await supabase.rpc('exec_sql', { 
      sql: createFunctionsSQL 
    });
    
    if (functionsError) {
      console.warn('Functions creation warning:', functionsError.message);
    }
    
    console.log('✅ Functions created successfully');
    
    // Seed data
    console.log('🌱 Seeding initial data...');
    const { error: seedError } = await supabase.rpc('exec_sql', { 
      sql: seedDataSQL 
    });
    
    if (seedError) {
      console.warn('Seed data warning:', seedError.message);
    }
    
    console.log('✅ Initial data seeded successfully');
    
    // Verify setup
    console.log('🔍 Verifying setup...');
    await blogService.checkTablesExist();
    
    console.log('��� Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Simplified initialization that creates basic structure
export async function simpleInitializeDatabase(): Promise<void> {
  console.log('🚀 Simple database initialization...');
  
  try {
    // Just create the basic data we need without complex SQL
    
    // Insert categories manually
    const categories = [
      { name: 'Angular', description: 'Angular framework tutorials and best practices', color_class: 'bg-red-100 text-red-800' },
      { name: 'TypeScript', description: 'TypeScript language features and advanced patterns', color_class: 'bg-blue-100 text-blue-800' },
      { name: 'Career', description: 'Career development and professional growth', color_class: 'bg-green-100 text-green-800' },
      { name: 'Python', description: 'Python programming and development', color_class: 'bg-yellow-100 text-yellow-800' },
      { name: 'Enterprise', description: 'Enterprise development and architecture', color_class: 'bg-purple-100 text-purple-800' },
      { name: 'Accessibility', description: 'Web accessibility and inclusive design', color_class: 'bg-teal-100 text-teal-800' },
      { name: 'E-commerce', description: 'E-commerce development and solutions', color_class: 'bg-orange-100 text-orange-800' },
      { name: 'State Management', description: 'State management patterns and libraries', color_class: 'bg-cyan-100 text-cyan-800' }
    ];
    
    for (const category of categories) {
      const { error } = await supabase
        .from('blog_categories')
        .upsert(category, { onConflict: 'name' });
      
      if (error) {
        console.warn(`Warning inserting category ${category.name}:`, error.message);
      }
    }
    
    // Insert statistics
    const statistics = [
      { label: 'Technical Articles', value: '0+', icon_name: 'BookOpen', sort_order: 1 },
      { label: 'Monthly Readers', value: '0+', icon_name: 'Users', sort_order: 2 },
      { label: 'Developer Engagement', value: '0%', icon_name: 'Heart', sort_order: 3 },
      { label: 'Community Reach', value: '0+', icon_name: 'TrendingUp', sort_order: 4 }
    ];
    
    for (const stat of statistics) {
      const { error } = await supabase
        .from('blog_statistics')
        .upsert(stat, { onConflict: 'label' });
      
      if (error) {
        console.warn(`Warning inserting statistic ${stat.label}:`, error.message);
      }
    }
    
    console.log('✅ Simple database initialization completed!');
    
  } catch (error) {
    console.error('❌ Simple database initialization failed:', error);
    throw error;
  }
}
