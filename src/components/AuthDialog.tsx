import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  LogIn, 
  Github, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield,
  Star,
  Users,
  BookOpen,
  MessageCircle
} from "lucide-react";

export function AuthDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { signInWithProvider, signInWithEmail, signUpWithEmail } = useAuth();

  const handleProviderSignIn = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
      toast.success(`Signing in with ${provider}...`);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "signin") {
        const { error } = await signInWithEmail(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in successfully!");
          setIsOpen(false);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          return;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        
        const { error } = await signUpWithEmail(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Please check your email to verify.");
          setIsOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: BookOpen,
      title: "Save Articles",
      description: "Bookmark blog posts and tutorials for later reading"
    },
    {
      icon: MessageCircle,
      title: "Join Discussions",
      description: "Comment on articles and engage with the community"
    },
    {
      icon: Star,
      title: "Premium Content",
      description: "Access exclusive tutorials and advanced guides"
    },
    {
      icon: Users,
      title: "Developer Network",
      description: "Connect with other developers and professionals"
    }
  ];

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: ""
    });
    setShowPassword(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Welcome to AR Portfolio</DialogTitle>
          <DialogDescription>
            Join the developer community and unlock exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Member Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Authentication Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Welcome Back!</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in to access your saved content and premium features
                </p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Join the Community</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account to unlock all features and join discussions
                </p>
              </div>
            </TabsContent>

            {/* Social Sign In Options */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => handleProviderSignIn('github')}
                  disabled={isLoading}
                  className="w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Github className="w-5 h-5" />
                  )}
                  Continue with GitHub
                </Button>

                <Button
                  onClick={() => handleProviderSignIn('google')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* LinkedIn OAuth would require additional setup */}
                <Button
                  onClick={() => toast.info("LinkedIn sign-in coming soon!")}
                  disabled={true}
                  variant="outline"
                  className="w-full gap-2 opacity-50"
                  size="lg"
                >
                  <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continue with LinkedIn
                  <Badge variant="secondary" className="text-xs">Soon</Badge>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {activeTab === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {activeTab === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {/* Terms and Privacy */}
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <button className="underline hover:text-primary">Terms of Service</button>
                {" "}and{" "}
                <button className="underline hover:text-primary">Privacy Policy</button>
              </p>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
