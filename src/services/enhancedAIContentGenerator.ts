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

interface ContentTemplate {
  introduction: string[];
  sections: {
    [key: string]: {
      title: string;
      content: string[];
      codeExamples?: string[];
    };
  };
  conclusions: string[];
  tips: string[];
  bestPractices: string[];
}

class EnhancedAIContentGenerator {
  private ahmedExperience = {
    totalYears: 11,
    companies: ['EAGLE6', 'Freelancing', 'Various Startups'],
    technologies: [
      'Angular', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'Node.js',
      'RxJS', 'Akita', 'Redux', 'HTML5', 'CSS3', 'SCSS', 'Bootstrap',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'Azure'
    ],
    projects: [
      'EAGLE6 Cybersecurity Platform',
      'BlindSight Accessibility App',
      'PYDI Distributed File System',
      'Multiple E-commerce Solutions',
      'Enterprise Angular Applications'
    ],
    specializations: [
      'Enterprise Angular Development',
      'Accessibility (WCAG Compliance)',
      'State Management (Akita/Redux)',
      'Performance Optimization',
      'Cross-platform Development'
    ]
  };

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

  private getImageUrl(category: string, title: string): string {
    // Enhanced image selection based on content
    const imageMap: Record<string, string[]> = {
      'Angular': [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
      ],
      'TypeScript': [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop'
      ],
      'Career': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop'
      ],
      'Python': [
        'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop'
      ],
      'Accessibility': [
        'https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
      ]
    };

    const categoryImages = imageMap[category] || imageMap['Angular'];
    const imageIndex = Math.abs(title.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % categoryImages.length;
    return categoryImages[imageIndex];
  }

  private generateSEOKeywords(title: string, tags: string[], category: string): string[] {
    const keywords = [...tags];
    
    // Add related keywords based on category
    const relatedKeywords: Record<string, string[]> = {
      'Angular': ['angular framework', 'typescript', 'single page application', 'component-based'],
      'Career': ['software developer', 'programming career', 'tech industry', 'professional development'],
      'Python': ['python programming', 'backend development', 'data science', 'automation'],
      'Accessibility': ['web accessibility', 'WCAG', 'inclusive design', 'screen readers']
    };

    if (relatedKeywords[category]) {
      keywords.push(...relatedKeywords[category]);
    }

    // Add common tech keywords
    keywords.push('web development', 'software engineering', 'best practices');

    return [...new Set(keywords)]; // Remove duplicates
  }

  private generateMetaDescription(excerpt: string, category: string): string {
    const maxLength = 155;
    let description = excerpt;
    
    if (description.length > maxLength) {
      description = description.substring(0, maxLength - 3) + '...';
    }
    
    return description;
  }

  private getContentTemplates(): Record<string, ContentTemplate> {
    return {
      'Angular': {
        introduction: [
          "Angular development has transformed significantly over the past decade. In my 11+ years of experience, particularly during my 4-year tenure at EAGLE6, I've witnessed and contributed to this evolution firsthand.",
          "When I first started working with Angular at EAGLE6, we were building a comprehensive cybersecurity platform that needed to handle complex data visualizations and real-time updates. This experience taught me invaluable lessons about enterprise-scale Angular development.",
          "Throughout my career, I've worked on various Angular projects, from small business applications to large enterprise systems. Each project brought unique challenges and learning opportunities."
        ],
        sections: {
          architecture: {
            title: "Enterprise Architecture Patterns",
            content: [
              "At EAGLE6, we implemented a modular architecture that served as the foundation for our cybersecurity platform. This approach allowed different teams to work independently while maintaining consistency.",
              "We adopted a feature-based module structure, where each major functionality was encapsulated in its own module. This pattern proved invaluable when scaling the team and codebase.",
              "The architecture included shared modules for common utilities, a core module for singleton services, and lazy-loaded feature modules for optimal performance."
            ],
            codeExamples: [
              "// Feature module structure\n@NgModule({\n  declarations: [FeatureComponent],\n  imports: [CommonModule, SharedModule],\n  providers: [FeatureService]\n})\nexport class FeatureModule {}"
            ]
          },
          stateManagement: {
            title: "State Management Evolution",
            content: [
              "Our journey from Redux to Akita was transformative. While Redux served us well initially, Akita's entity-centric approach aligned better with our complex data models.",
              "Akita's built-in entity management, combined with its excellent TypeScript support, significantly reduced boilerplate code and improved developer experience.",
              "The migration process taught us valuable lessons about gradual adoption and maintaining backwards compatibility during major architectural changes."
            ]
          },
          performance: {
            title: "Performance Optimization Strategies",
            content: [
              "Performance optimization became critical as our user base grew. We implemented OnPush change detection strategy across components, reducing unnecessary re-renders.",
              "Lazy loading wasn't just for routes—we applied it to components, reducing initial bundle size and improving perceived performance.",
              "Memory management with RxJS required careful attention. We implemented consistent subscription management patterns to prevent memory leaks."
            ]
          }
        },
        conclusions: [
          "These experiences at EAGLE6 and subsequent projects have shaped my approach to Angular development. The key is balancing architectural sophistication with practical maintainability.",
          "Every Angular project is unique, but these patterns and practices provide a solid foundation for building scalable, maintainable applications.",
          "The Angular ecosystem continues to evolve, and staying current while maintaining proven practices is essential for long-term success."
        ],
        tips: [
          "Always consider the OnPush change detection strategy for better performance",
          "Implement consistent error handling across your application",
          "Use Akita or NgRx for complex state management scenarios",
          "Adopt a clear module structure from the beginning of your project"
        ],
        bestPractices: [
          "Follow Angular's style guide religiously",
          "Implement comprehensive unit and integration testing",
          "Use TypeScript's strict mode for better type safety",
          "Regular code reviews ensure knowledge sharing and quality"
        ]
      },
      'Career': {
        introduction: [
          "My programming journey began at age 13 with GW-BASIC, writing programs to calculate the day of the week for any given date. This early fascination with computational logic set the foundation for everything that followed.",
          "From those humble beginnings with GW-BASIC to building enterprise-scale applications at EAGLE6, my career has been a continuous journey of learning, adapting, and growing.",
          "Over 11+ years in the industry, I've learned that technical skills are just one part of a successful development career. Communication, problem-solving, and business understanding are equally important."
        ],
        sections: {
          earlyDays: {
            title: "The Foundation Years",
            content: [
              "Starting with GW-BASIC at 13 taught me programming fundamentals in their purest form. Writing algorithms from scratch, understanding memory management, and solving mathematical problems built a strong computational thinking foundation.",
              "Those early days were about pure problem-solving. Without modern frameworks and libraries, every solution required understanding the underlying principles.",
              "The transition from hobby programming to learning web technologies opened up new possibilities. HTML, CSS, and JavaScript became the bridge between computational logic and user interaction."
            ]
          },
          professionalGrowth: {
            title: "Professional Development",
            content: [
              "Entering the professional world required learning beyond code—version control, team collaboration, project management, and client communication became equally important.",
              "My freelancing experience on platforms like Upwork taught me business skills alongside technical development. Understanding client needs and delivering value became as important as writing efficient code.",
              "Each project brought new challenges and learning opportunities. From small business websites to complex enterprise applications, diversity in projects accelerated my growth."
            ]
          },
          enterpriseExperience: {
            title: "Enterprise-Scale Challenges",
            content: [
              "My 4-year tenure at EAGLE6 exposed me to enterprise-scale development challenges. Working on cybersecurity platforms with stringent requirements taught me about scalability, security, and performance.",
              "Leading development teams required developing mentorship and leadership skills. Technical expertise alone wasn't enough—I needed to guide other developers and make architectural decisions.",
              "The BlindSight project, focused on accessibility, taught me about inclusive design and the social impact of technology. This experience shaped my perspective on responsible development."
            ]
          }
        },
        conclusions: [
          "Every phase of my career has contributed to my current expertise. The journey from GW-BASIC to enterprise Angular development illustrates the importance of continuous learning and adaptation.",
          "Success in software development requires a combination of technical skills, business understanding, and the ability to work effectively with others.",
          "The industry continues to evolve rapidly, but the fundamental principles of good software development—clean code, testing, and user focus—remain constant."
        ],
        tips: [
          "Start with fundamentals—they never go out of style",
          "Diversify your project experience early in your career",
          "Learn to communicate technical concepts to non-technical stakeholders",
          "Build a portfolio that demonstrates both technical and problem-solving skills"
        ],
        bestPractices: [
          "Continuous learning is non-negotiable in tech",
          "Contribute to open source projects for real-world experience",
          "Network within the developer community",
          "Document your learning journey—it helps others and reinforces your knowledge"
        ]
      },
      'Python': {
        introduction: [
          "Python's versatility and readability have made it my go-to language for various projects over the years. The PYDI distributed file system project perfectly exemplifies Python's strength in building complex, cross-platform solutions.",
          "Working on PYDI taught me about distributed systems, cross-platform compatibility, and the power of Python's extensive ecosystem.",
          "Python's philosophy of 'batteries included' becomes apparent when building substantial applications. The standard library provides most of what you need, and the community has filled in the gaps."
        ],
        sections: {
          projectArchitecture: {
            title: "Distributed System Design",
            content: [
              "Building PYDI required careful consideration of distributed system principles. We implemented a peer-to-peer architecture where each node could function independently while maintaining synchronization.",
              "The challenge was ensuring data consistency across nodes while maintaining performance. We adopted an eventual consistency model with conflict resolution strategies.",
              "Python's asyncio library proved invaluable for handling concurrent connections and managing network communication efficiently."
            ],
            codeExamples: [
              "# Async network handler\nasync def handle_peer_connection(reader, writer):\n    try:\n        while True:\n            data = await reader.read(1024)\n            if not data:\n                break\n            await process_message(data)\n    finally:\n        writer.close()"
            ]
          },
          crossPlatform: {
            title: "Cross-Platform Compatibility",
            content: [
              "Ensuring PYDI worked seamlessly across Windows, macOS, and Linux required careful attention to platform-specific file system behaviors.",
              "Python's os and pathlib modules provided the abstraction we needed, but edge cases still required platform-specific handling.",
              "Testing across platforms was crucial. We used continuous integration with multiple OS environments to catch platform-specific issues early."
            ]
          },
          performance: {
            title: "Performance Optimization",
            content: [
              "While Python isn't the fastest language, proper optimization techniques allowed us to achieve acceptable performance for file operations.",
              "We leveraged Cython for critical path operations and used memory mapping for large file handling.",
              "Profiling became essential. Python's built-in profiling tools helped identify bottlenecks and guide optimization efforts."
            ]
          }
        },
        conclusions: [
          "The PYDI project reinforced my appreciation for Python's ecosystem and its suitability for complex, cross-platform applications.",
          "Python's readability and extensive libraries make it excellent for rapid prototyping and production applications alike.",
          "While performance considerations are important, Python's development speed and maintainability often outweigh raw execution speed."
        ],
        tips: [
          "Use virtual environments for dependency management",
          "Leverage asyncio for I/O-bound operations",
          "Profile before optimizing—premature optimization is the root of all evil",
          "Take advantage of Python's extensive standard library"
        ],
        bestPractices: [
          "Follow PEP 8 style guidelines consistently",
          "Use type hints for better code documentation and IDE support",
          "Implement comprehensive testing with pytest",
          "Document your code with clear docstrings"
        ]
      }
    };
  }

  private selectRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateContentFromTemplate(template: ContentTemplate, seed: BlogPostSeed): string {
    const lengthMultiplier = {
      'short': 0.7,
      'medium': 1.0,
      'long': 1.4
    }[seed.targetLength];

    // Select introduction
    const intro = this.selectRandomElement(template.introduction);
    
    // Build content sections
    let content = `${intro}\n\n`;
    
    const sectionKeys = Object.keys(template.sections);
    const sectionsToInclude = Math.ceil(sectionKeys.length * lengthMultiplier);
    
    for (let i = 0; i < Math.min(sectionsToInclude, sectionKeys.length); i++) {
      const sectionKey = sectionKeys[i];
      const section = template.sections[sectionKey];
      
      content += `## ${section.title}\n\n`;
      
      // Add section content
      section.content.forEach(paragraph => {
        content += `${paragraph}\n\n`;
      });
      
      // Add code examples if available and appropriate for the style
      if (section.codeExamples && (seed.style === 'tutorial' || seed.style === 'technical-deep-dive')) {
        content += `\`\`\`typescript\n${this.selectRandomElement(section.codeExamples)}\n\`\`\`\n\n`;
      }
    }
    
    // Add tips section for tutorials
    if (seed.style === 'tutorial' && template.tips.length > 0) {
      content += `## Key Tips\n\n`;
      template.tips.slice(0, 3).forEach(tip => {
        content += `- ${tip}\n`;
      });
      content += '\n';
    }
    
    // Add best practices for technical deep-dives
    if (seed.style === 'technical-deep-dive' && template.bestPractices.length > 0) {
      content += `## Best Practices\n\n`;
      template.bestPractices.forEach(practice => {
        content += `- ${practice}\n`;
      });
      content += '\n';
    }
    
    // Add conclusion
    const conclusion = this.selectRandomElement(template.conclusions);
    content += `## Conclusion\n\n${conclusion}\n\n`;
    
    // Add personal touch based on Ahmed's experience
    content += this.addPersonalTouch(seed.category);
    
    return content;
  }

  private addPersonalTouch(category: string): string {
    const personalTouches: Record<string, string> = {
      'Angular': `*This article is based on my ${this.ahmedExperience.totalYears}+ years of experience, including 4 years at EAGLE6 building enterprise cybersecurity platforms. The lessons learned from real-world challenges continue to shape my development approach.*`,
      'Career': `*Reflecting on my journey from writing GW-BASIC programs at age 13 to leading enterprise development teams, I'm grateful for every challenge that contributed to my growth as a developer and mentor.*`,
      'Python': `*Having worked on projects like PYDI and various enterprise applications, I continue to appreciate Python's versatility and the vibrant community that supports it.*`
    };
    
    return personalTouches[category] || 
           `*This perspective comes from ${this.ahmedExperience.totalYears}+ years of hands-on development experience across various technologies and project scales.*`;
  }

  private generateExcerpt(content: string, maxLength: number = 150): string {
    // Extract the first meaningful paragraph, excluding headers
    const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#') && p.trim().length > 0);
    const firstParagraph = paragraphs[0] || '';
    
    if (firstParagraph.length <= maxLength) return firstParagraph;
    
    const truncated = firstParagraph.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  async generateBlogPost(seed: BlogPostSeed): Promise<GeneratedBlogPost> {
    // Get appropriate template
    const templates = this.getContentTemplates();
    const template = templates[seed.category] || templates['Angular']; // Fallback to Angular
    
    // Generate content
    const content = this.generateContentFromTemplate(template, seed);
    const excerpt = this.generateExcerpt(content);
    const seoKeywords = this.generateSEOKeywords(seed.title, seed.tags, seed.category);
    const metaDescription = this.generateMetaDescription(excerpt, seed.category);
    
    // Add delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return {
      title: seed.title,
      slug: this.generateSlug(seed.title),
      excerpt,
      content,
      category: seed.category,
      tags: seed.tags,
      readTimeMinutes: this.estimateReadTime(content),
      imageUrl: this.getImageUrl(seed.category, seed.title),
      seoKeywords,
      metaDescription
    };
  }

  async generateMultiplePosts(seeds: BlogPostSeed[]): Promise<GeneratedBlogPost[]> {
    const posts = [];
    for (const seed of seeds) {
      try {
        const post = await this.generateBlogPost(seed);
        posts.push(post);
        console.log(`Generated: ${post.title}`);
      } catch (error) {
        console.error(`Failed to generate post for seed: ${seed.title}`, error);
      }
    }
    return posts;
  }
}

// Enhanced blog post seeds with more variety
export const enhancedBlogPostSeeds: BlogPostSeed[] = [
  {
    title: "Building Scalable Angular Applications: Lessons from EAGLE6",
    category: "Angular",
    tags: ["Angular", "Enterprise", "TypeScript", "Akita", "Cybersecurity", "Scalability"],
    targetLength: "long",
    style: "case-study"
  },
  {
    title: "From GW-BASIC at 13 to Enterprise Developer: My Programming Journey",
    category: "Career",
    tags: ["Career", "Programming", "Personal Story", "GW-BASIC", "Professional Growth"],
    targetLength: "medium",
    style: "opinion"
  },
  {
    title: "BlindSight: Building Accessibility-First Web Applications",
    category: "Accessibility",
    tags: ["Angular", "Accessibility", "WCAG", "Social Impact", "Inclusive Design"],
    targetLength: "long",
    style: "case-study"
  },
  {
    title: "Advanced RxJS Patterns in Enterprise Angular Applications",
    category: "Angular",
    tags: ["RxJS", "Angular", "Reactive Programming", "Memory Management", "Performance"],
    targetLength: "long",
    style: "technical-deep-dive"
  },
  {
    title: "PYDI: Building a Cross-Platform Distributed File System with Python",
    category: "Python",
    tags: ["Python", "Distributed Systems", "File Systems", "Cross-Platform", "AsyncIO"],
    targetLength: "long",
    style: "technical-deep-dive"
  },
  {
    title: "State Management Evolution: Migrating from Redux to Akita",
    category: "Angular",
    tags: ["Akita", "Redux", "State Management", "Migration", "TypeScript"],
    targetLength: "medium",
    style: "tutorial"
  },
  {
    title: "Freelancing Success: From Local PHP Projects to Global Angular Apps",
    category: "Career",
    tags: ["Freelancing", "Upwork", "Business Growth", "Client Management", "Remote Work"],
    targetLength: "medium",
    style: "opinion"
  },
  {
    title: "Performance Optimization Strategies for Large Angular Applications",
    category: "Angular",
    tags: ["Performance", "Angular", "Optimization", "Lazy Loading", "Change Detection"],
    targetLength: "long",
    style: "tutorial"
  },
  {
    title: "Building Accessible Web Applications: A Developer's Guide",
    category: "Accessibility",
    tags: ["Accessibility", "WCAG", "Screen Readers", "Inclusive Design", "Best Practices"],
    targetLength: "medium",
    style: "tutorial"
  },
  {
    title: "Enterprise Angular Architecture: Patterns and Best Practices",
    category: "Angular",
    tags: ["Architecture", "Enterprise", "Design Patterns", "Modules", "Best Practices"],
    targetLength: "long",
    style: "technical-deep-dive"
  }
];

export const enhancedAIContentGenerator = new EnhancedAIContentGenerator();
