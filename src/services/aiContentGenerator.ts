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
}

// Simulate AI content generation for now (can be replaced with actual AI API)
class AIContentGenerator {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private estimateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private getImageUrl(category: string): string {
    const imageMap: Record<string, string> = {
      'Angular': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      'TypeScript': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      'Career': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'Python': 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=400&fit=crop',
      'Enterprise': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      'Open Source': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
      'Freelancing': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
      'Accessibility': 'https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&h=400&fit=crop',
      'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      'State Management': 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=400&fit=crop'
    };
    return imageMap[category] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop';
  }

  async generateBlogPost(seed: BlogPostSeed): Promise<GeneratedBlogPost> {
    // In a real implementation, this would call an AI API like OpenAI, Claude, etc.
    // For now, we'll generate realistic content based on Ahmed's experience
    
    const contentTemplates = this.getContentTemplates();
    const template = contentTemplates[seed.category] || contentTemplates.default;
    
    const content = this.generateContentFromTemplate(template, seed);
    const excerpt = this.generateExcerpt(content);
    
    return {
      title: seed.title,
      slug: this.generateSlug(seed.title),
      excerpt,
      content,
      category: seed.category,
      tags: seed.tags,
      readTimeMinutes: this.estimateReadTime(content),
      imageUrl: this.getImageUrl(seed.category)
    };
  }

  private getContentTemplates() {
    return {
      'Angular': {
        intro: "Angular development has evolved significantly over the years. In my 11+ years of experience, particularly during my 4-year tenure at EAGLE6, I've learned valuable lessons about building scalable Angular applications.",
        sections: [
          "## Architecture Principles\n\nWhen building enterprise Angular applications, architecture is crucial. At EAGLE6, we implemented a modular architecture that allowed us to scale our cybersecurity platform efficiently.",
          "## State Management Strategies\n\nWe transitioned from Redux to Akita for state management, which proved to be a game-changer. Akita's entity-centric approach aligned perfectly with our complex data models.",
          "## Performance Optimization\n\nPerformance in enterprise applications is non-negotiable. We implemented lazy loading, OnPush change detection strategy, and optimized our RxJS operators to achieve excellent performance.",
          "## Testing and Quality Assurance\n\nOur testing strategy included unit tests with Jest, integration tests, and end-to-end tests. Code reviews were mandatory, ensuring code quality and knowledge sharing."
        ],
        conclusion: "These practices helped us build robust, maintainable Angular applications that served thousands of users in enterprise environments."
      },
      'Career': {
        intro: "My programming journey started at age 13 with GW-BASIC, writing programs to calculate the day of the week for any date. This early passion for problem-solving shaped my entire career.",
        sections: [
          "## Early Programming Days\n\nStarting with GW-BASIC taught me the fundamentals of programming logic. Those early days of writing algorithms from scratch built a strong foundation in computational thinking.",
          "## Professional Growth\n\nTransitioning from hobby programming to professional development required learning not just new technologies, but also collaboration, project management, and client communication skills.",
          "## Enterprise Experience\n\nMy 4-year tenure at EAGLE6 exposed me to enterprise-scale challenges. Working on cybersecurity platforms with complex requirements taught me about scalability, security, and performance.",
          "## Freelancing Success\n\nBuilding a successful freelancing career required developing business skills alongside technical expertise. Understanding client needs and delivering value became as important as writing code."
        ],
        conclusion: "Every phase of my career has contributed to my current expertise. The journey from GW-BASIC to enterprise Angular development illustrates the importance of continuous learning and adaptation."
      },
      'Python': {
        intro: "Python's versatility makes it an excellent choice for various applications. My experience with the PYDI distributed file system project demonstrated Python's power in building cross-platform solutions.",
        sections: [
          "## Project Architecture\n\nBuilding a distributed file system required careful consideration of architecture patterns. We implemented a microservices approach with clear separation of concerns.",
          "## Cross-Platform Challenges\n\nEnsuring compatibility across different operating systems presented unique challenges. Python's standard library and third-party packages helped us overcome these obstacles.",
          "## Performance Considerations\n\nWhile Python isn't the fastest language, proper optimization techniques and leveraging C extensions where needed allowed us to achieve acceptable performance.",
          "## Development Workflow\n\nUsing Python's excellent tooling ecosystem, including pytest for testing and black for code formatting, we maintained high code quality throughout the project."
        ],
        conclusion: "This project reinforced my appreciation for Python's ecosystem and its suitability for complex, cross-platform applications."
      },
      default: {
        intro: "In my 11+ years of development experience, I've learned that every technology and approach has its place in solving real-world problems.",
        sections: [
          "## Understanding the Problem\n\nBefore choosing any technology or approach, it's crucial to thoroughly understand the problem you're trying to solve. This understanding guides all subsequent decisions.",
          "## Practical Implementation\n\nTheory is important, but practical implementation reveals the real challenges. My experience across various projects has taught me to anticipate and prepare for these challenges.",
          "## Best Practices\n\nFollowing established best practices while remaining flexible enough to adapt to specific project needs is a balance that comes with experience.",
          "## Continuous Learning\n\nTechnology evolves rapidly. Staying current with trends while maintaining deep expertise in core technologies is essential for long-term success."
        ],
        conclusion: "These principles have guided my development approach across all technologies and projects, from enterprise applications to open-source contributions."
      }
    };
  }

  private generateContentFromTemplate(template: any, seed: BlogPostSeed): string {
    const lengthMultiplier = {
      'short': 1,
      'medium': 1.5,
      'long': 2
    }[seed.targetLength];

    let content = `${template.intro}\n\n`;
    
    const sectionsToInclude = Math.ceil(template.sections.length * lengthMultiplier);
    for (let i = 0; i < Math.min(sectionsToInclude, template.sections.length); i++) {
      content += `${template.sections[i]}\n\n`;
    }
    
    content += `## Conclusion\n\n${template.conclusion}`;
    
    return content;
  }

  private generateExcerpt(content: string): string {
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph.length <= 200) return firstParagraph;
    
    const truncated = firstParagraph.substring(0, 197);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  async generateMultiplePosts(seeds: BlogPostSeed[]): Promise<GeneratedBlogPost[]> {
    const posts = [];
    for (const seed of seeds) {
      posts.push(await this.generateBlogPost(seed));
      // Add small delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return posts;
  }
}

// Pre-defined blog post seeds based on Ahmed's expertise
export const blogPostSeeds: BlogPostSeed[] = [
  {
    title: "Building Scalable Angular Applications: My EAGLE6 Experience",
    category: "Angular",
    tags: ["Angular", "Enterprise", "TypeScript", "Akita", "Cybersecurity"],
    targetLength: "long",
    style: "case-study"
  },
  {
    title: "From 13-Year-Old GW-BASIC Programmer to Enterprise Developer",
    category: "Career",
    tags: ["Career", "Programming", "Personal Story", "GW-BASIC", "Web Development"],
    targetLength: "medium",
    style: "opinion"
  },
  {
    title: "BlindSight: Building Accessibility-First Web Applications",
    category: "Accessibility",
    tags: ["Angular", "Accessibility", "WCAG", "Social Impact", "Screen Readers"],
    targetLength: "long",
    style: "case-study"
  },
  {
    title: "Advanced RxJS Patterns in Enterprise Angular Applications",
    category: "Angular",
    tags: ["RxJS", "Angular", "Reactive Programming", "Enterprise", "Memory Management"],
    targetLength: "long",
    style: "technical-deep-dive"
  },
  {
    title: "PYDI: Building a Cross-Platform Distributed File System",
    category: "Python",
    tags: ["Python", "File Systems", "Distributed Systems", "Open Source", "Cross-Platform"],
    targetLength: "long",
    style: "technical-deep-dive"
  },
  {
    title: "State Management Evolution: From Redux to Akita in Angular",
    category: "State Management",
    tags: ["Akita", "Angular", "State Management", "Redux", "Migration"],
    targetLength: "medium",
    style: "tutorial"
  },
  {
    title: "Freelancing Journey: From Local PHP Projects to International Clients",
    category: "Freelancing",
    tags: ["Freelancing", "Upwork", "Client Management", "Business Growth", "Remote Work"],
    targetLength: "medium",
    style: "opinion"
  },
  {
    title: "E-commerce Evolution: OpenCart Extensions to Modern JAMstack",
    category: "E-commerce",
    tags: ["E-commerce", "OpenCart", "Shopify", "JAMstack", "Headless Commerce"],
    targetLength: "long",
    style: "tutorial"
  }
];

export const aiContentGenerator = new AIContentGenerator();
