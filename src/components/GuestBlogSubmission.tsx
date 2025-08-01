import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PenTool, 
  Send, 
  FileText, 
  User, 
  Mail, 
  Globe, 
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface GuestBlogSubmission {
  id: string;
  authorName: string;
  authorEmail: string;
  authorBio: string;
  authorWebsite?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'submitted' | 'under-review' | 'approved' | 'published' | 'rejected';
  submittedAt: string;
  notes?: string;
}

const GuestBlogSubmission = () => {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorBio: '',
    authorWebsite: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState<GuestBlogSubmission[]>([]);

  const categories = [
    'Frontend Development',
    'Backend Development', 
    'DevOps & Cloud',
    'Mobile Development',
    'UI/UX Design',
    'Web Performance',
    'Best Practices',
    'Career & Growth',
    'Tools & Technologies'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validation
    if (!formData.authorName || !formData.authorEmail || !formData.title || !formData.content) {
      setMessage('❌ Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (formData.content.length < 500) {
      setMessage('❌ Content must be at least 500 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const submission: GuestBlogSubmission = {
        id: `guest-${Date.now()}`,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        authorBio: formData.authorBio,
        authorWebsite: formData.authorWebsite,
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, this would be sent to backend)
      const existingSubmissions = localStorage.getItem('guestBlogSubmissions');
      const allSubmissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
      allSubmissions.push(submission);
      localStorage.setItem('guestBlogSubmissions', JSON.stringify(allSubmissions));

      setSubmissions([submission, ...submissions]);
      
      // Reset form
      setFormData({
        authorName: '',
        authorEmail: '',
        authorBio: '',
        authorWebsite: '',
        title: '',
        excerpt: '',
        content: '',
        category: '',
        tags: ''
      });

      setMessage('🎉 Thank you! Your guest blog post has been submitted successfully. We\'ll review it and get back to you soon.');
    } catch (error) {
      setMessage('❌ Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: GuestBlogSubmission['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'under-review': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'published': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Submit a Guest Blog Post</CardTitle>
              <CardDescription>
                Share your knowledge and expertise with our community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Guidelines */}
          <div className="mb-6 p-4 bg-background/50 rounded-lg border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Guest Post Guidelines
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Original content only (no plagiarism)</li>
              <li>• Minimum 500 words, well-structured</li>
              <li>• Technical depth with practical examples</li>
              <li>• Include author bio and optional website link</li>
              <li>• We review all submissions within 3-5 business days</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="w-5 h-5" />
                Author Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authorName">Full Name *</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => handleInputChange('authorName', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="authorEmail">Email Address *</Label>
                  <Input
                    id="authorEmail"
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  value={formData.authorBio}
                  onChange={(e) => handleInputChange('authorBio', e.target.value)}
                  placeholder="Brief bio about yourself (2-3 sentences)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="authorWebsite">Website/Portfolio (Optional)</Label>
                <Input
                  id="authorWebsite"
                  type="url"
                  value={formData.authorWebsite}
                  onChange={(e) => handleInputChange('authorWebsite', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Blog Post Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Blog Post Content
              </h3>

              <div>
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="An engaging, descriptive title for your post"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="React, JavaScript, Tutorial"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary of your post (if empty, we'll auto-generate from content)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content * (minimum 500 characters)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your blog post content here. Use markdown formatting if desired..."
                  rows={12}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current length: {formData.content.length} characters
                  {formData.content.length < 500 && ` (need ${500 - formData.content.length} more)`}
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || formData.content.length < 500}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Guest Post
                </>
              )}
            </Button>
          </form>

          {/* Submission Process */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">What happens next?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Your submission is received and queued for review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-500" />
                <span>Our editorial team reviews content quality and relevance (3-5 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Approved posts are edited, formatted, and published</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>You'll receive credit as the author with bio and website link</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestBlogSubmission;
