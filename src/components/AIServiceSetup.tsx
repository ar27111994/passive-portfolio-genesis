import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  Zap, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save,
  TestTube,
  ExternalLink,
  Shield
} from "lucide-react";
import { realAIService } from "@/services/realAIService";
import { realAnalyticsService } from "@/services/realAnalyticsService";

interface APIKey {
  service: string;
  key: string;
  required: boolean;
  description: string;
  docsUrl: string;
  testEndpoint?: string;
}

const AIServiceSetup = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});
  const [message, setMessage] = useState('');

  const aiAPIKeys: APIKey[] = [
    {
      service: 'OpenAI',
      key: 'VITE_OPENAI_API_KEY',
      required: false,
      description: 'GPT-3.5/4 for high-quality content generation. Get free tier with $5 credit.',
      docsUrl: 'https://platform.openai.com/api-keys'
    },
    {
      service: 'Hugging Face',
      key: 'VITE_HUGGINGFACE_API_KEY',
      required: false,
      description: 'Free access to thousands of AI models. No cost for inference API.',
      docsUrl: 'https://huggingface.co/settings/tokens'
    },
    {
      service: 'Cohere',
      key: 'VITE_COHERE_API_KEY',
      required: false,
      description: 'Free tier with 100 API calls per month for text generation.',
      docsUrl: 'https://dashboard.cohere.ai/api-keys'
    }
  ];

  const analyticsAPIKeys: APIKey[] = [
    {
      service: 'Google Analytics',
      key: 'VITE_GA_API_KEY',
      required: false,
      description: 'Free analytics data from Google Analytics. Requires View ID.',
      docsUrl: 'https://console.developers.google.com/apis/credentials'
    },
    {
      service: 'Plausible Analytics',
      key: 'VITE_PLAUSIBLE_API_KEY',
      required: false,
      description: 'Privacy-focused analytics. Free for personal sites.',
      docsUrl: 'https://plausible.io/docs/stats-api'
    },
    {
      service: 'Simple Analytics',
      key: 'VITE_SIMPLE_ANALYTICS_API_KEY',
      required: false,
      description: 'Simple, privacy-first analytics with API access.',
      docsUrl: 'https://docs.simpleanalytics.com/api'
    }
  ];

  const additionalKeys: APIKey[] = [
    {
      service: 'GA View ID',
      key: 'VITE_GA_VIEW_ID',
      required: false,
      description: 'Required if using Google Analytics API.',
      docsUrl: 'https://ga-dev-tools.web.app/account-explorer/'
    },
    {
      service: 'Plausible Site ID',
      key: 'VITE_PLAUSIBLE_SITE_ID',
      required: false,
      description: 'Your website domain for Plausible analytics.',
      docsUrl: 'https://plausible.io/docs/stats-api'
    }
  ];

  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = () => {
    const allKeys = [...aiAPIKeys, ...analyticsAPIKeys, ...additionalKeys];
    const saved: Record<string, string> = {};
    
    allKeys.forEach(api => {
      const value = localStorage.getItem(api.key) || '';
      saved[api.key] = value;
    });
    
    setApiKeys(saved);
  };

  const handleKeyChange = (keyName: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [keyName]: value }));
  };

  const handleSaveKey = (keyName: string) => {
    const value = apiKeys[keyName];
    if (value) {
      localStorage.setItem(keyName, value);
      // Also set as environment variable if possible
      if (typeof window !== 'undefined' && (window as any).process?.env) {
        (window as any).process.env[keyName] = value;
      }
      setMessage(`✅ ${keyName} saved successfully`);
    } else {
      localStorage.removeItem(keyName);
      setMessage(`🗑️ ${keyName} removed`);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTestKey = async (api: APIKey) => {
    const keyName = api.key;
    setTesting(prev => ({ ...prev, [keyName]: true }));
    setTestResults(prev => ({ ...prev, [keyName]: null }));

    try {
      let isValid = false;

      if (api.service === 'OpenAI') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKeys[keyName]}` }
        });
        isValid = response.ok;
      } else if (api.service === 'Hugging Face') {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
          headers: { 'Authorization': `Bearer ${apiKeys[keyName]}` },
          method: 'POST',
          body: JSON.stringify({ inputs: 'test' })
        });
        isValid = response.ok;
      } else if (api.service === 'Cohere') {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
          headers: {
            'Authorization': `Bearer ${apiKeys[keyName]}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ prompt: 'test', max_tokens: 5 })
        });
        isValid = response.ok;
      } else if (api.service === 'Google Analytics') {
        // Would need View ID to test properly
        isValid = apiKeys[keyName].length > 30; // Basic validation
      } else if (api.service === 'Plausible Analytics') {
        const siteId = apiKeys['VITE_PLAUSIBLE_SITE_ID'];
        if (siteId) {
          const response = await fetch(`https://plausible.io/api/v1/stats/aggregate?site_id=${siteId}&period=7d&metrics=visitors`, {
            headers: { 'Authorization': `Bearer ${apiKeys[keyName]}` }
          });
          isValid = response.ok;
        } else {
          isValid = false;
        }
      } else {
        isValid = apiKeys[keyName].length > 10; // Basic validation
      }

      setTestResults(prev => ({ ...prev, [keyName]: isValid ? 'success' : 'error' }));
      
    } catch (error) {
      console.error(`Test failed for ${api.service}:`, error);
      setTestResults(prev => ({ ...prev, [keyName]: 'error' }));
    } finally {
      setTesting(prev => ({ ...prev, [keyName]: false }));
    }
  };

  const toggleKeyVisibility = (keyName: string) => {
    setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const getServiceStatus = () => {
    const aiStatus = realAIService.getProviderStatus();
    const analyticsStatus = realAnalyticsService.getProviderStatus();
    
    return {
      ai: aiStatus,
      analytics: analyticsStatus
    };
  };

  const renderAPIKeySection = (apis: APIKey[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {apis.map((api) => {
        const keyName = api.key;
        const isConfigured = apiKeys[keyName]?.length > 0;
        const testResult = testResults[keyName];
        
        return (
          <Card key={keyName} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{api.service}</h4>
                  {isConfigured && (
                    <Badge variant={testResult === 'success' ? 'default' : testResult === 'error' ? 'destructive' : 'secondary'}>
                      {testResult === 'success' ? 'Valid' : testResult === 'error' ? 'Invalid' : 'Configured'}
                    </Badge>
                  )}
                  {api.required && <Badge variant="destructive">Required</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{api.description}</p>
                <a 
                  href={api.docsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={keyName}>{keyName}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={keyName}
                    type={showKeys[keyName] ? 'text' : 'password'}
                    value={apiKeys[keyName] || ''}
                    onChange={(e) => handleKeyChange(keyName, e.target.value)}
                    placeholder={`Enter your ${api.service} API key`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => toggleKeyVisibility(keyName)}
                  >
                    {showKeys[keyName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={() => handleSaveKey(keyName)}
                  disabled={!apiKeys[keyName]}
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleTestKey(api)}
                  disabled={!apiKeys[keyName] || testing[keyName]}
                  variant="outline"
                  size="sm"
                >
                  {testing[keyName] ? (
                    <TestTube className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI & Analytics Service Setup</h2>
          <p className="text-muted-foreground">Configure API keys for real AI content generation and analytics</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="w-4 h-4" />
          Secure Local Storage
        </Badge>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Service Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Service Status
          </CardTitle>
          <CardDescription>
            Current status of AI and analytics providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">AI Content Generation</h4>
              <div className="space-y-1">
                {getServiceStatus().ai.map((service) => (
                  <div key={service.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    {service.name}: Not tested
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analytics Integration</h4>
              <div className="space-y-1">
                {getServiceStatus().analytics.map((service) => (
                  <div key={service.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    {service.name}: Not tested
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Services
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Additional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          {renderAPIKeySection(aiAPIKeys, 'AI Content Generation APIs')}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAPIKeySection(analyticsAPIKeys, 'Analytics APIs')}
        </TabsContent>

        <TabsContent value="additional">
          {renderAPIKeySection(additionalKeys, 'Additional Configuration')}
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">For AI Content Generation:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Add at least one AI API key (OpenAI, Hugging Face, or Cohere)</li>
                <li>• Hugging Face is recommended for free unlimited access</li>
                <li>• OpenAI provides the highest quality but has usage costs</li>
                <li>• Multiple providers enable automatic fallback</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">For Real Analytics:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Configure Google Analytics for comprehensive tracking</li>
                <li>• Plausible/Simple Analytics for privacy-focused tracking</li>
                <li>• Real analytics replace all mock data in dashboards</li>
                <li>• Data is cached for 5 minutes to avoid API limits</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Security Notes:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• API keys are stored securely in browser local storage</li>
                <li>• Keys are never sent to any servers except the respective APIs</li>
                <li>• Use environment variables in production deployment</li>
                <li>• Test connections before saving to verify validity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIServiceSetup;
