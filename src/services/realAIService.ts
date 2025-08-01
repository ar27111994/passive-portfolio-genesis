interface AIProvider {
  name: string;
  generate: (prompt: string, options?: any) => Promise<string>;
  isAvailable: () => Promise<boolean>;
}

interface BlogPostSeed {
  title: string;
  category: string;
  tags: string[];
  targetLength: 'short' | 'medium' | 'long';
  style: 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive';
}

interface GeneratedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  imageUrl: string;
  seoKeywords: string[];
  metaDescription: string;
}

class HuggingFaceProvider implements AIProvider {
  name = 'Hugging Face';
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-medium`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        method: 'POST',
        body: JSON.stringify({ inputs: 'test' })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: any = {}): Promise<string> {
    const model = options.model || 'microsoft/DialoGPT-large';
    const maxTokens = options.maxTokens || 2000;

    const response = await fetch(`${this.baseUrl}/${model}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || result.generated_text || '';
  }
}

class CohereProvider implements AIProvider {
  name = 'Cohere';
  private apiKey: string;
  private baseUrl = 'https://api.cohere.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          prompt: 'test',
          max_tokens: 5
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: any = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: options.maxTokens || 2000,
        temperature: 0.7,
        k: 0,
        p: 0.9,
        stop_sequences: ['---', '###'],
        return_likelihoods: 'NONE'
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const result = await response.json();
    return result.generations[0]?.text || '';
  }
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, options: any = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens || 2000,
        temperature: 0.7,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || '';
  }
}

class RealAIService {
  private providers: AIProvider[] = [];
  private fallbackContent: any;

  constructor() {
    this.initializeProviders();
    this.fallbackContent = this.createFallbackContent();
  }

  private initializeProviders() {
    // Initialize providers based on available API keys
    const huggingFaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY;
    const cohereKey = import.meta.env.VITE_COHERE_API_KEY || process.env.VITE_COHERE_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

    if (huggingFaceKey) {
      this.providers.push(new HuggingFaceProvider(huggingFaceKey));
    }
    if (cohereKey) {
      this.providers.push(new CohereProvider(cohereKey));
    }
    if (openaiKey) {
      this.providers.push(new OpenAIProvider(openaiKey));
    }

    console.log(`Initialized ${this.providers.length} AI providers`);
  }

  private async getAvailableProvider(): Promise<AIProvider | null> {
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          console.log(`Using AI provider: ${provider.name}`);
          return provider;
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} unavailable:`, error);
      }
    }
    return null;
  }

  private createBlogPrompt(seed: BlogPostSeed): string {
    const lengthGuidance = {
      'short': '500-800 words',
      'medium': '800-1200 words', 
      'long': '1200-2000 words'
    }[seed.targetLength];

    const styleGuidance = {
      'tutorial': 'step-by-step tutorial with practical examples',
      'opinion': 'personal opinion piece with insights and experiences',
      'case-study': 'detailed case study with real-world examples and outcomes',
      'technical-deep-dive': 'technical deep-dive with detailed explanations and code examples'
    }[seed.style];

    return `Write a comprehensive ${styleGuidance} blog post about "${seed.title}".

Context: This is written by Ahmed Rehan, a Frontend Angular Developer with 11+ years of experience. He has worked at EAGLE6 (cybersecurity platform) for 4 years, built accessibility apps like BlindSight, and created distributed systems like PYDI in Python. He specializes in Angular, TypeScript, enterprise applications, and has extensive freelancing experience.

Requirements:
- Target length: ${lengthGuidance}
- Category: ${seed.category}
- Tags to incorporate: ${seed.tags.join(', ')}
- Style: ${styleGuidance}
- Include practical insights from real development experience
- Add relevant code examples if it's a technical topic
- Make it engaging and valuable for developers

Structure:
1. Engaging introduction that hooks the reader
2. 3-4 main sections with practical content
3. Code examples (if technical)
4. Key takeaways or best practices
5. Conclusion with personal insights

Write in a professional but accessible tone. Include specific examples from enterprise development when relevant.

Blog Post:`;
  }

  async generateBlogPost(seed: BlogPostSeed): Promise<GeneratedBlogPost> {
    console.log(`Generating blog post: ${seed.title}`);
    
    try {
      const provider = await this.getAvailableProvider();
      let content: string;

      if (provider) {
        const prompt = this.createBlogPrompt(seed);
        content = await provider.generate(prompt, {
          maxTokens: seed.targetLength === 'long' ? 3000 : seed.targetLength === 'medium' ? 2000 : 1500
        });
        
        // Clean up the content
        content = this.cleanContent(content);
        console.log(`Generated ${content.length} characters using ${provider.name}`);
      } else {
        console.warn('No AI providers available, using fallback content');
        content = this.generateFallbackContent(seed);
      }

      return this.formatBlogPost(seed, content);
    } catch (error) {
      console.error('AI generation failed:', error);
      const content = this.generateFallbackContent(seed);
      return this.formatBlogPost(seed, content);
    }
  }

  private cleanContent(content: string): string {
    // Remove prompt repetition and clean up formatting
    let cleaned = content.replace(/^Blog Post:\s*/i, '');
    cleaned = cleaned.replace(/^Write a comprehensive.*?Blog Post:\s*/is, '');
    cleaned = cleaned.trim();
    
    // Ensure proper markdown formatting
    if (!cleaned.includes('#')) {
      // Add structure if AI didn't provide it
      const sections = cleaned.split('\n\n');
      if (sections.length > 1) {
        cleaned = sections.map((section, index) => {
          if (index === 0) return section; // Keep intro as is
          if (section.length > 100) {
            return `## Section ${index}\n\n${section}`;
          }
          return section;
        }).join('\n\n');
      }
    }

    return cleaned;
  }

  private generateFallbackContent(seed: BlogPostSeed): string {
    const template = this.fallbackContent[seed.category] || this.fallbackContent.default;
    return this.buildContentFromTemplate(template, seed);
  }

  private buildContentFromTemplate(template: any, seed: BlogPostSeed): string {
    const intro = Array.isArray(template.intro) ? template.intro[0] : template.intro;
    const sections = template.sections.slice(0, seed.targetLength === 'long' ? 4 : seed.targetLength === 'medium' ? 3 : 2);
    const conclusion = Array.isArray(template.conclusion) ? template.conclusion[0] : template.conclusion;

    let content = `${intro}\n\n`;
    
    sections.forEach((section: any, index: number) => {
      content += `## ${section.title}\n\n${section.content}\n\n`;
      if (section.code && seed.style === 'tutorial') {
        content += `\`\`\`typescript\n${section.code}\n\`\`\`\n\n`;
      }
    });

    content += `## Conclusion\n\n${conclusion}`;
    return content;
  }

  private formatBlogPost(seed: BlogPostSeed, content: string): GeneratedBlogPost {
    const slug = seed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const excerpt = this.generateExcerpt(content);
    const readTime = this.calculateReadTime(content);
    const imageUrl = this.getImageUrl(seed.category);
    const seoKeywords = this.generateSEOKeywords(seed.title, seed.tags, seed.category);
    const metaDescription = this.generateMetaDescription(excerpt);

    return {
      title: seed.title,
      slug,
      excerpt,
      content,
      category: seed.category,
      tags: seed.tags,
      readTimeMinutes: readTime,
      imageUrl,
      seoKeywords,
      metaDescription
    };
  }

  private generateExcerpt(content: string): string {
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph.length <= 160) return firstParagraph;
    return firstParagraph.substring(0, 157) + '...';
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private getImageUrl(category: string): string {
    const imageMap: Record<string, string[]> = {
      'Angular': [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop'
      ],
      'Career': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop'
      ],
      'Python': [
        'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=400&fit=crop'
      ],
      'Accessibility': [
        'https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&h=400&fit=crop'
      ]
    };

    const categoryImages = imageMap[category] || imageMap['Angular'];
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  }

  private generateSEOKeywords(title: string, tags: string[], category: string): string[] {
    return [...tags, category, 'web development', 'programming', 'tutorial'].slice(0, 10);
  }

  private generateMetaDescription(excerpt: string): string {
    return excerpt.length > 155 ? excerpt.substring(0, 152) + '...' : excerpt;
  }

  private createFallbackContent() {
    return {
      'Angular': {
        intro: "Angular development has transformed significantly in my 11+ years of experience, particularly during my 4-year tenure at EAGLE6 where we built enterprise cybersecurity platforms.",
        sections: [
          {
            title: "Enterprise Architecture Patterns",
            content: "At EAGLE6, we implemented a modular architecture that served as the foundation for our cybersecurity platform. This approach allowed different teams to work independently while maintaining consistency.",
            code: "@NgModule({\n  declarations: [FeatureComponent],\n  imports: [CommonModule, SharedModule],\n  providers: [FeatureService]\n})\nexport class FeatureModule {}"
          },
          {
            title: "State Management with Akita",
            content: "Our transition from Redux to Akita was transformative. Akita's entity-centric approach aligned perfectly with our complex data models and reduced boilerplate significantly.",
            code: "@Injectable({ providedIn: 'root' })\nexport class PostsStore extends EntityStore<PostsState> {\n  constructor() {\n    super();\n  }\n}"
          }
        ],
        conclusion: "These patterns and practices from real enterprise development have proven invaluable in building scalable, maintainable Angular applications."
      },
      'Career': {
        intro: "My programming journey started at age 13 with GW-BASIC, writing programs to calculate the day of the week for any date. This early passion shaped my entire 11+ year career.",
        sections: [
          {
            title: "Early Programming Foundation",
            content: "Starting with GW-BASIC taught me programming fundamentals in their purest form. Writing algorithms from scratch built strong computational thinking skills."
          },
          {
            title: "Professional Growth at EAGLE6",
            content: "My 4-year tenure at EAGLE6 exposed me to enterprise-scale challenges. Working on cybersecurity platforms taught me about scalability, security, and performance."
          }
        ],
        conclusion: "Every phase of my career contributed to my current expertise. The journey from GW-BASIC to enterprise Angular development shows the importance of continuous learning."
      },
      default: {
        intro: "In my 11+ years of development experience, I've learned that every technology has its place in solving real-world problems.",
        sections: [
          {
            title: "Understanding the Problem",
            content: "Before choosing any technology, it's crucial to understand the problem you're solving. This understanding guides all subsequent decisions."
          },
          {
            title: "Practical Implementation",
            content: "Theory is important, but practical implementation reveals real challenges. My experience across various projects taught me to anticipate these challenges."
          }
        ],
        conclusion: "These principles have guided my development approach across all technologies and projects."
      }
    };
  }

  async generateMultiplePosts(seeds: BlogPostSeed[]): Promise<GeneratedBlogPost[]> {
    const posts: GeneratedBlogPost[] = [];
    
    for (const seed of seeds) {
      try {
        const post = await this.generateBlogPost(seed);
        posts.push(post);
        console.log(`✅ Generated: ${post.title}`);
        
        // Add delay between requests to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to generate: ${seed.title}`, error);
      }
    }
    
    return posts;
  }

  getProviderStatus(): { name: string; available: boolean }[] {
    return this.providers.map(provider => ({
      name: provider.name,
      available: false // Will be checked when used
    }));
  }
}

export const realAIService = new RealAIService();
export { RealAIService, BlogPostSeed, GeneratedBlogPost };
