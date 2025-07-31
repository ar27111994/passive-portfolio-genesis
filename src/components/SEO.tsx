import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO = ({
  title = "Ahmed Rehan - Full Stack Developer | Angular, TypeScript & Enterprise Solutions",
  description = "Ahmed Rehan is an experienced Full Stack Developer from Rawalpindi, Pakistan with 11+ years of programming expertise. Specializing in Angular, TypeScript, C#, and enterprise-grade applications.",
  image = "https://ar27111994.com/ahmed-rehan-portfolio-preview.jpg",
  url = "https://ar27111994.com",
  type = "website",
  keywords = ["Ahmed Rehan", "Full Stack Developer", "Angular", "TypeScript", "C#", "ASP.NET", "Enterprise Development"],
  author = "Ahmed Rehan",
  publishedTime,
  modifiedTime,
  section,
  tags = []
}: SEOProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Ahmed Rehan - Full Stack Developer Portfolio', true);

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@ar27111994');

    // Article-specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data for current page
    const structuredData = generateStructuredData(title, description, image, url, type);
    updateStructuredData(structuredData);

  }, [title, description, image, url, type, keywords, author, publishedTime, modifiedTime, section, tags]);

  const generateStructuredData = (title: string, description: string, image: string, url: string, type: string) => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebPage",
      "headline": title,
      "description": description,
      "image": image,
      "url": url,
      "author": {
        "@type": "Person",
        "name": "Ahmed Rehan",
        "url": "https://ar27111994.com",
        "sameAs": [
          "https://github.com/ar27111994",
          "https://linkedin.com/in/ar27111994",
          "https://stackoverflow.com/users/3841610/ar27111994"
        ]
      },
      "publisher": {
        "@type": "Person",
        "name": "Ahmed Rehan",
        "url": "https://ar27111994.com"
      }
    };

    if (type === "article") {
      return {
        ...baseStructuredData,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "mainEntityOfPage": url,
        "keywords": keywords.join(', ')
      };
    }

    return baseStructuredData;
  };

  const updateStructuredData = (data: any) => {
    const existingScript = document.querySelector('script[data-seo="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
};

// Hook for easy SEO management
export const useSEO = (props: SEOProps) => {
  useEffect(() => {
    // Create a temporary SEO component
    const seoComponent = SEO(props);
    return () => {
      // Cleanup if needed
    };
  }, [props]);
};

// Predefined SEO configurations for different sections
export const seoConfigs = {
  home: {
    title: "Ahmed Rehan - Full Stack Developer | Angular, TypeScript & Enterprise Solutions",
    description: "Ahmed Rehan is an experienced Full Stack Developer from Rawalpindi, Pakistan with 11+ years of programming expertise. Former EAGLE6 engineer, specializing in Angular, TypeScript, and enterprise applications.",
    keywords: ["Ahmed Rehan", "Full Stack Developer", "Angular Developer", "TypeScript", "Enterprise Development", "Frontend Engineer", "Rawalpindi Pakistan"],
    url: "https://ar27111994.com"
  },
  about: {
    title: "About Ahmed Rehan - Full Stack Developer with 11+ Years Experience",
    description: "Learn about Ahmed Rehan's journey from GW-BASIC at age 13 to enterprise development at EAGLE6. 11+ years of programming experience in Angular, TypeScript, C#, and modern web technologies.",
    keywords: ["Ahmed Rehan", "About", "Programming Journey", "EAGLE6", "Experience", "Skills"],
    url: "https://ar27111994.com#about"
  },
  projects: {
    title: "Projects by Ahmed Rehan - Open Source & Enterprise Applications",
    description: "Explore Ahmed Rehan's portfolio including BlindSight accessibility app, enterprise Angular applications, AI projects, and open source contributions with 39+ GitHub stars.",
    keywords: ["Projects", "Portfolio", "Open Source", "BlindSight", "Angular Applications", "GitHub", "Enterprise Development"],
    url: "https://ar27111994.com#projects"
  },
  experience: {
    title: "Professional Experience - EAGLE6 Frontend Engineer & Consultant",
    description: "Ahmed Rehan's professional journey including 4+ years at EAGLE6 developing cybersecurity platforms, freelance consulting, and technical leadership roles.",
    keywords: ["Experience", "EAGLE6", "Frontend Engineer", "Consulting", "Career", "Professional History"],
    url: "https://ar27111994.com#experience"
  },
  skills: {
    title: "Technical Skills - Angular, TypeScript, C#, Enterprise Development",
    description: "Comprehensive overview of Ahmed Rehan's technical skills including Angular, TypeScript, C#, ASP.NET, Python, and enterprise development expertise with 11+ years experience.",
    keywords: ["Skills", "Angular", "TypeScript", "C#", "ASP.NET", "Python", "Technical Expertise"],
    url: "https://ar27111994.com#skills"
  },
  education: {
    title: "Education & Certifications - Computer Science Master's & Deep Learning",
    description: "Ahmed Rehan's educational background including Master's in Computer Science from University of Arid Agriculture and professional certifications in Deep Learning and Machine Learning.",
    keywords: ["Education", "Master's Degree", "Computer Science", "Certifications", "Deep Learning", "University"],
    url: "https://ar27111994.com#education"
  },
  blog: {
    title: "Technical Blog - Angular, Enterprise Development & Programming Insights",
    description: "Read Ahmed Rehan's technical articles on Angular, TypeScript, enterprise development, and programming insights from 11+ years of professional experience.",
    keywords: ["Blog", "Technical Articles", "Angular", "Programming", "Tutorials", "Enterprise Development"],
    url: "https://ar27111994.com#blog"
  },
  services: {
    title: "Consulting Services - Technical Consulting, Code Review & Training",
    description: "Professional consulting services by Ahmed Rehan including technical consulting ($150/hr), code reviews, team training, and enterprise development guidance.",
    keywords: ["Consulting", "Services", "Technical Consulting", "Code Review", "Training", "Enterprise Consulting"],
    url: "https://ar27111994.com#monetization"
  },
  contact: {
    title: "Contact Ahmed Rehan - Full Stack Developer Available for Projects",
    description: "Get in touch with Ahmed Rehan for freelance projects, technical consulting, or collaboration. Based in Rawalpindi, Pakistan, available worldwide for remote work.",
    keywords: ["Contact", "Hire", "Freelance", "Remote Work", "Collaboration", "Rawalpindi Pakistan"],
    url: "https://ar27111994.com#contact"
  }
};

export default SEO;
