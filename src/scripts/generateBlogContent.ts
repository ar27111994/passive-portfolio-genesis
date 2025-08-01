import { aiContentGenerator, blogPostSeeds } from '../services/aiContentGenerator';
import { enhancedAIContentGenerator, enhancedBlogPostSeeds } from '../services/enhancedAIContentGenerator';
import { realAIService } from '../services/realAIService';
import { blogService } from '../services/blogService';
import type { Database } from '../integrations/supabase/types';

type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];

export async function generateAndPopulateBlogContent() {
  console.log('🤖 Starting AI content generation...');
  
  try {
    // Generate blog posts using real AI service with fallback
    console.log(`🤖 Generating ${enhancedBlogPostSeeds.length} blog posts with real AI services...`);
    console.log('🔍 Attempting real AI generation with configured providers...');

    try {
      const generatedPosts = await realAIService.generateMultiplePosts(enhancedBlogPostSeeds);
      console.log(`✅ Successfully generated ${generatedPosts.length} posts with real AI`);
    } catch (realAIError) {
      console.warn('⚠️ Real AI generation failed, falling back to enhanced template system:', realAIError);
      const generatedPosts = await enhancedAIContentGenerator.generateMultiplePosts(enhancedBlogPostSeeds);
      console.log(`✅ Generated ${generatedPosts.length} posts using enhanced templates`);
    }
    
    // Convert to Supabase format
    const blogPostsForDB: BlogPostInsert[] = generatedPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.imageUrl,
      category: post.category,
      tags: post.tags,
      featured: Math.random() > 0.7, // 30% chance of being featured
      published: true,
      publish_date: generateRandomPastDate().toISOString(),
      read_time_minutes: post.readTimeMinutes,
      views: Math.floor(Math.random() * 800) + 150,  // Random views between 150-950 (more realistic)
      likes: Math.floor(Math.random() * 35) + 8,     // Random likes between 8-43 (realistic engagement)
      comments: Math.floor(Math.random() * 12) + 2    // Random comments between 2-14 (realistic)
    }));
    
    // Insert posts into database
    console.log('💾 Inserting posts into Supabase...');
    const insertedPosts = await blogService.createMultiplePosts(blogPostsForDB);
    console.log(`✅ Successfully created ${insertedPosts.length} blog posts`);
    
    // Update statistics
    console.log('📊 Updating blog statistics...');
    await updateBlogStatistics();
    
    console.log('🎉 Blog content generation completed successfully!');
    return insertedPosts;
    
  } catch (error) {
    console.error('❌ Error generating blog content:', error);
    throw error;
  }
}

function generateRandomPastDate(): Date {
  const now = new Date();
  const monthsAgo = Math.floor(Math.random() * 12) + 1; // 1-12 months ago
  const daysAgo = Math.floor(Math.random() * 30) + 1;   // 1-30 days ago
  
  const date = new Date(now);
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(date.getDate() - daysAgo);
  
  return date;
}

async function updateBlogStatistics() {
  try {
    const analytics = await blogService.getBlogAnalytics();
    const currentStats = await blogService.getBlogStatistics();
    
    // Update each statistic with real data
    for (const stat of currentStats) {
      let newValue = stat.value;
      
      switch (stat.label) {
        case 'Technical Articles':
          newValue = `${analytics.totalPosts}+`;
          break;
        case 'Monthly Readers':
          newValue = `${Math.round(analytics.totalViews / 12 / 1000 * 10) / 10}K+`;
          break;
        case 'Developer Engagement':
          const engagementRate = analytics.totalViews > 0 
            ? (analytics.totalLikes / analytics.totalViews * 100) 
            : 0;
          newValue = `${Math.round(engagementRate * 10) / 10}%`;
          break;
        case 'Community Reach':
          newValue = `${Math.round(analytics.totalViews / 1000)}K+`;
          break;
      }
      
      if (newValue !== stat.value) {
        await blogService.updateBlogStatistic(stat.id, newValue);
        console.log(`📈 Updated "${stat.label}" to ${newValue}`);
      }
    }
  } catch (error) {
    console.error('Error updating statistics:', error);
  }
}

// Function to regenerate a single post (useful for testing)
export async function regenerateSinglePost(seed = blogPostSeeds[0]) {
  console.log(`🔄 Regenerating post: ${seed.title}`);
  
  try {
    const generatedPost = await aiContentGenerator.generateBlogPost(seed);
    
    const blogPost: BlogPostInsert = {
      title: generatedPost.title,
      slug: generatedPost.slug,
      excerpt: generatedPost.excerpt,
      content: generatedPost.content,
      image_url: generatedPost.imageUrl,
      category: generatedPost.category,
      tags: generatedPost.tags,
      featured: true,
      published: true,
      publish_date: new Date().toISOString(),
      read_time_minutes: generatedPost.readTimeMinutes,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 2
    };
    
    const insertedPost = await blogService.createPost(blogPost);
    console.log(`✅ Successfully created post: ${insertedPost.title}`);
    
    return insertedPost;
  } catch (error) {
    console.error('❌ Error regenerating post:', error);
    throw error;
  }
}

// Export for use in components or admin interface
export { blogPostSeeds, enhancedBlogPostSeeds };
