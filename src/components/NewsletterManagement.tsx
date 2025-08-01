import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Users, 
  Send, 
  Download, 
  Search,
  Calendar,
  BarChart3,
  Eye,
  Trash2,
  Plus,
  FileText,
  TrendingUp
} from "lucide-react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  interests: string[];
  subscribeDate: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  recipients: number;
  sentDate?: string;
  status: 'draft' | 'scheduled' | 'sent';
  openRate?: number;
  clickRate?: number;
}

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [message, setMessage] = useState('');

  // New campaign form
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    content: '',
    scheduledDate: ''
  });

  useEffect(() => {
    loadSubscribers();
    loadCampaigns();
  }, []);

  const loadSubscribers = () => {
    const stored = localStorage.getItem('newsletterSubscribers');
    if (stored) {
      setSubscribers(JSON.parse(stored));
    }
  };

  const loadCampaigns = () => {
    const stored = localStorage.getItem('newsletterCampaigns');
    if (stored) {
      setCampaigns(JSON.parse(stored));
    } else {
      // Add some sample campaigns
      const sampleCampaigns: NewsletterCampaign[] = [
        {
          id: 'campaign-1',
          subject: 'Weekly Development Insights #1',
          content: 'Welcome to our first newsletter! This week we cover React performance optimization...',
          recipients: 1200,
          sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          openRate: 68.5,
          clickRate: 12.3
        },
        {
          id: 'campaign-2',
          subject: 'Frontend Trends for 2024',
          content: 'Exploring the latest frontend development trends and what to expect...',
          recipients: 1180,
          sentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          openRate: 72.1,
          clickRate: 15.7
        }
      ];
      setCampaigns(sampleCampaigns);
      localStorage.setItem('newsletterCampaigns', JSON.stringify(sampleCampaigns));
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || subscriber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    thisWeek: subscribers.filter(s => {
      const subscribeDate = new Date(s.subscribeDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return subscribeDate > weekAgo;
    }).length
  };

  const handleExportSubscribers = () => {
    const csvContent = [
      ['Email', 'Name', 'Subscribe Date', 'Status', 'Interests', 'Source'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        new Date(sub.subscribeDate).toLocaleDateString(),
        sub.status,
        sub.interests.join('; '),
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.subject || !newCampaign.content) {
      setMessage('❌ Please fill in subject and content');
      return;
    }

    const campaign: NewsletterCampaign = {
      id: `campaign-${Date.now()}`,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipients: stats.activeSubscribers,
      status: newCampaign.scheduledDate ? 'scheduled' : 'draft'
    };

    const updatedCampaigns = [campaign, ...campaigns];
    setCampaigns(updatedCampaigns);
    localStorage.setItem('newsletterCampaigns', JSON.stringify(updatedCampaigns));

    setNewCampaign({ subject: '', content: '', scheduledDate: '' });
    setMessage('✅ Campaign created successfully!');
  };

  const handleSendCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: 'sent' as const, 
            sentDate: new Date().toISOString(),
            openRate: Math.random() * 30 + 50, // Mock open rate 50-80%
            clickRate: Math.random() * 10 + 8   // Mock click rate 8-18%
          }
        : campaign
    );
    setCampaigns(updatedCampaigns);
    localStorage.setItem('newsletterCampaigns', JSON.stringify(updatedCampaigns));
    setMessage('✅ Campaign sent successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'unsubscribed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      case 'sent': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter Management</h2>
          <p className="text-muted-foreground">Manage subscribers and create email campaigns</p>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
              </div>
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unsubscribed</p>
                <p className="text-2xl font-bold">{stats.unsubscribed}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
                  <CardDescription>Manage your newsletter subscriber list</CardDescription>
                </div>
                <Button onClick={handleExportSubscribers}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subscribers List */}
              <div className="space-y-3">
                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No subscribers found</p>
                  </div>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{subscriber.email}</h4>
                          {subscriber.name && (
                            <span className="text-sm text-muted-foreground">({subscriber.name})</span>
                          )}
                          <Badge className={getStatusColor(subscriber.status)}>
                            {subscriber.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(subscriber.subscribeDate).toLocaleDateString()}</span>
                          <span>📍 {subscriber.source}</span>
                          {subscriber.interests.length > 0 && (
                            <div className="flex gap-1">
                              {subscriber.interests.slice(0, 2).map((interest, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {subscriber.interests.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{subscriber.interests.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns ({campaigns.length})</CardTitle>
              <CardDescription>View and manage your newsletter campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{campaign.subject}</h4>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {campaign.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>👥 {campaign.recipients} recipients</span>
                          {campaign.sentDate && (
                            <span>📅 {new Date(campaign.sentDate).toLocaleDateString()}</span>
                          )}
                          {campaign.openRate && (
                            <span>📖 {campaign.openRate.toFixed(1)}% opened</span>
                          )}
                          {campaign.clickRate && (
                            <span>🔗 {campaign.clickRate.toFixed(1)}% clicked</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {campaign.status === 'draft' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleSendCampaign(campaign.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Campaign Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Compose and send a newsletter to your subscribers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your newsletter content..."
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="scheduledDate">Schedule for Later (Optional)</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={newCampaign.scheduledDate}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Recipients: {stats.activeSubscribers} active subscribers</p>
                  <p className="text-sm text-muted-foreground">
                    This campaign will be sent to all active subscribers
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign}>
                  <Plus className="w-4 h-4 mr-2" />
                  {newCampaign.scheduledDate ? 'Schedule Campaign' : 'Save as Draft'}
                </Button>
                <Button variant="outline" onClick={() => setNewCampaign({ subject: '', content: '', scheduledDate: '' })}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManagement;
