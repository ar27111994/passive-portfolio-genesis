-- Insert blog categories
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

-- Insert blog tags
INSERT INTO blog_tags (name) VALUES
('Angular'), ('TypeScript'), ('React'), ('Next.js'), ('Python'), ('JavaScript'),
('HTML'), ('CSS'), ('SCSS'), ('RxJS'), ('Akita'), ('Redux'), ('State Management'),
('Enterprise'), ('Architecture'), ('Performance'), ('Accessibility'), ('WCAG'),
('SEO'), ('Open Source'), ('Career'), ('Freelancing'), ('E-commerce'), ('OpenCart'),
('Shopify'), ('WordPress'), ('PHP'), ('C#'), ('ASP.NET'), ('Entity Framework'),
('MySQL'), ('PostgreSQL'), ('Node.js'), ('Express'), ('API'), ('REST'), ('GraphQL'),
('Testing'), ('Jest'), ('Cypress'), ('Git'), ('Docker'), ('AWS'), ('Azure'),
('DevOps'), ('CI/CD'), ('Agile'), ('Scrum'), ('Project Management'), ('Leadership'),
('Mentoring'), ('Teaching'), ('Tutorials'), ('Best Practices'), ('Code Review'),
('Security'), ('Authentication'), ('Authorization'), ('Database Design'),
('UI/UX'), ('Design Systems'), ('Component Libraries'), ('Progressive Web Apps'),
('Mobile Development'), ('Ionic'), ('React Native'), ('Cross Platform'),
('Machine Learning'), ('AI'), ('Data Science'), ('Analytics'), ('Monitoring'),
('Debugging'), ('Error Handling'), ('Logging'), ('Documentation'), ('Technical Writing');

-- Insert blog statistics
INSERT INTO blog_statistics (label, value, icon_name, sort_order) VALUES
('Technical Articles', '48+', 'BookOpen', 1),
('Monthly Readers', '3.2K+', 'Users', 2),
('Developer Engagement', '12.8%', 'Heart', 3),
('Community Reach', '16K+', 'TrendingUp', 4);

-- Update tag usage counts
SELECT update_tag_usage_counts();

-- Update category post counts
SELECT update_category_post_counts();
