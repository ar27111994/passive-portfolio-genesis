import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Database,
  User,
  Shield,
  Copy,
  RefreshCw,
  Play,
  Clock
} from "lucide-react";
import { createAdminUser, manualAdminSetupInstructions } from '@/scripts/createAdminUser';
import { DatabaseSetup, getManualSetupSQL, SetupStep } from '@/scripts/quickDatabaseSetup';
import { directFixAdminLogin, getQuickSetupSQL } from '@/scripts/fixAdminLogin';
import { fixRecursiveFunction, getFixSQL } from '@/scripts/fixRecursiveFunction';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const AdminSetupTool = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [manualInstructions, setManualInstructions] = useState('');
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([]);
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [directFixResult, setDirectFixResult] = useState<any>(null);
  const [isDirectFixRunning, setIsDirectFixRunning] = useState(false);
  const [functionFixResult, setFunctionFixResult] = useState<any>(null);
  const [isFunctionFixRunning, setIsFunctionFixRunning] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);
    const results: DiagnosticResult[] = [];

    // Test 1: Supabase Connection
    try {
      // Test connection by querying user_roles table (which we know exists from the second test)
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .limit(0); // Just test connection, don't return data

      if (error) {
        results.push({
          name: 'Supabase Connection',
          status: 'error',
          message: 'Failed to connect to Supabase: ' + error.message,
          details: error
        });
      } else {
        results.push({
          name: 'Supabase Connection',
          status: 'success',
          message: 'Successfully connected to Supabase'
        });
      }
    } catch (err) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Connection failed with exception',
        details: err
      });
    }

    // Test 2: Check if user_roles table exists
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .limit(1);
      
      if (error && error.code === '42P01') {
        results.push({
          name: 'User Roles Table',
          status: 'error',
          message: 'user_roles table does not exist',
          details: error
        });
      } else if (error) {
        results.push({
          name: 'User Roles Table',
          status: 'warning',
          message: 'user_roles table exists but query failed',
          details: error
        });
      } else {
        results.push({
          name: 'User Roles Table',
          status: 'success',
          message: 'user_roles table exists and accessible'
        });
      }
    } catch (err) {
      results.push({
        name: 'User Roles Table',
        status: 'error',
        message: 'Failed to check user_roles table',
        details: err
      });
    }

    // Test 3: Try to authenticate admin user
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });

      if (error) {
        results.push({
          name: 'Admin Authentication',
          status: 'error',
          message: 'Admin login failed: ' + error.message,
          details: error
        });
      } else if (data.user) {
        results.push({
          name: 'Admin Authentication',
          status: 'success',
          message: 'Admin user authenticated successfully',
          details: { userId: data.user.id, email: data.user.email }
        });

        // Test 4: Check admin role
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .single();

          if (roleError) {
            results.push({
              name: 'Admin Role Check',
              status: 'error',
              message: 'Failed to check admin role',
              details: roleError
            });
          } else if (roleData?.role === 'admin') {
            results.push({
              name: 'Admin Role Check',
              status: 'success',
              message: 'Admin role verified successfully'
            });
          } else {
            results.push({
              name: 'Admin Role Check',
              status: 'warning',
              message: `User role is '${roleData?.role}', expected 'admin'`,
              details: roleData
            });
          }
        } catch (err) {
          results.push({
            name: 'Admin Role Check',
            status: 'error',
            message: 'Exception checking admin role',
            details: err
          });
        }

        // Sign out after testing
        await supabase.auth.signOut();
      }
    } catch (err) {
      results.push({
        name: 'Admin Authentication',
        status: 'error',
        message: 'Exception during admin authentication',
        details: err
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const setupAdmin = async () => {
    setIsRunning(true);
    setSetupResult(null);

    try {
      const result = await createAdminUser();
      setSetupResult(result);

      // Re-run diagnostics to see if issues are fixed
      setTimeout(() => {
        runDiagnostics();
      }, 1000);
    } catch (error) {
      setSetupResult({
        success: false,
        message: 'Setup failed with exception',
        details: error
      });
    }

    setIsRunning(false);
  };

  const runQuickSetup = async () => {
    setIsSetupRunning(true);
    setSetupSteps([]);
    setSetupResult(null);

    const setup = new DatabaseSetup();
    const result = await setup.runSetup((steps) => {
      setSetupSteps([...steps]);
    });

    setSetupResult(result);
    setIsSetupRunning(false);

    // Re-run diagnostics after setup
    if (result.success) {
      setTimeout(() => {
        runDiagnostics();
      }, 1000);
    }
  };

  const showManualSetup = async () => {
    const setupSQL = getQuickSetupSQL();
    const fixSQL = getFixSQL();
    const instructions = `${fixSQL}\n\n--- ORIGINAL SETUP SQL ---\n\n${setupSQL}`;
    setManualInstructions(instructions);
    setShowManualInstructions(true);
  };

  const runDirectFix = async () => {
    setIsDirectFixRunning(true);
    setDirectFixResult(null);

    try {
      const result = await directFixAdminLogin();
      setDirectFixResult(result);

      // Re-run diagnostics after fix attempt
      setTimeout(() => {
        runDiagnostics();
      }, 1000);
    } catch (error) {
      setDirectFixResult({
        success: false,
        message: 'Direct fix failed with exception',
        details: error
      });
    }

    setIsDirectFixRunning(false);
  };

  const runFunctionFix = async () => {
    setIsFunctionFixRunning(true);
    setFunctionFixResult(null);

    try {
      const result = await fixRecursiveFunction();
      setFunctionFixResult(result);
    } catch (error) {
      setFunctionFixResult({
        success: false,
        message: 'Function fix failed with exception',
        details: error
      });
    }

    setIsFunctionFixRunning(false);
  };

  const copyToClipboard = async (text: string) => {
    setCopyStatus('Copying...');

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('✅ Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
        return;
      }
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback method:', error);
    }

    // Fallback method for when clipboard API is blocked
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopyStatus('✅ Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      } else {
        setCopyStatus('❌ Copy failed - select text manually');
        setTimeout(() => setCopyStatus(''), 3000);
      }
    } catch (fallbackError) {
      console.error('All copy methods failed:', fallbackError);
      setCopyStatus('❌ Copy not supported - select text manually');
      setTimeout(() => setCopyStatus(''), 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      warning: 'secondary' as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Admin Login Diagnostic Tool
          </CardTitle>
          <CardDescription>
            Diagnose and fix admin login issues with your Supabase setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
            <Button onClick={runDiagnostics} disabled={isRunning || isSetupRunning || isDirectFixRunning || isFunctionFixRunning}>
              <Database className="w-4 h-4 mr-2" />
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
              Run Diagnostics
            </Button>
            <Button onClick={runDirectFix} disabled={isRunning || isSetupRunning || isDirectFixRunning || isFunctionFixRunning} variant="default">
              <Shield className="w-4 h-4 mr-2" />
              {isDirectFixRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
              Fix Now
            </Button>
            <Button onClick={runFunctionFix} disabled={isRunning || isSetupRunning || isDirectFixRunning || isFunctionFixRunning} variant="destructive">
              <Settings className="w-4 h-4 mr-2" />
              {isFunctionFixRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
              Fix Function
            </Button>
            <Button onClick={runQuickSetup} disabled={isRunning || isSetupRunning || isDirectFixRunning || isFunctionFixRunning} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              {isSetupRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
              Quick Setup
            </Button>
            <Button onClick={setupAdmin} disabled={isRunning || isSetupRunning || isDirectFixRunning || isFunctionFixRunning} variant="outline">
              <User className="w-4 h-4 mr-2" />
              Alt Setup Method
            </Button>
            <Button onClick={showManualSetup} variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Manual Setup SQL
            </Button>
          </div>

          {setupSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Setup Progress</h3>
              <div className="space-y-2">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {step.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    {step.status === 'running' && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                    {step.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {step.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{step.name}</span>
                        <Badge variant={step.status === 'success' ? 'default' : step.status === 'error' ? 'destructive' : 'secondary'}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.message}</p>
                      {step.error && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-muted-foreground">
                            Show Error Details
                          </summary>
                          <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                            {JSON.stringify(step.error, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isSetupRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Setup in progress...</span>
                    <span>{setupSteps.filter(s => s.status === 'success').length} / {setupSteps.length}</span>
                  </div>
                  <Progress value={(setupSteps.filter(s => s.status === 'success').length / setupSteps.length) * 100} />
                </div>
              )}
            </div>
          )}

          {diagnostics.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Diagnostic Results</h3>
              {diagnostics.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.name}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-muted-foreground">
                          Show Details
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(setupResult || directFixResult || functionFixResult) && (
            <Alert variant={(setupResult?.success || directFixResult?.success || functionFixResult?.success) ? "default" : "destructive"}>
              <AlertDescription>
                <strong>{(setupResult?.success || directFixResult?.success || functionFixResult?.success) ? 'Success:' : 'Error:'}</strong>
                {' '}{functionFixResult?.message || directFixResult?.message || setupResult?.message}
                {(functionFixResult?.details || directFixResult?.details || setupResult?.details) && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">Show Details</summary>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                      {JSON.stringify(functionFixResult?.details || directFixResult?.details || setupResult?.details, null, 2)}
                    </pre>
                  </details>
                )}
                {(directFixResult?.details?.sqlNeeded || directFixResult?.details?.needsManualCreation) && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">Next Steps:</p>
                    {directFixResult?.details?.needsManualCreation && (
                      <div className="text-sm bg-blue-50 p-3 rounded border">
                        <p className="font-medium mb-2">Manual User Creation Required:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to <strong>Supabase Dashboard → Authentication → Users</strong></li>
                          <li>Click <strong>"Add User"</strong></li>
                          <li>Email: <code>admin@example.com</code></li>
                          <li>Password: <code>password123</code></li>
                          <li>Check <strong>"Email Confirm"</strong> box</li>
                          <li>Click <strong>"Create User"</strong></li>
                          <li>Then click <strong>"Run Diagnostics"</strong> again to verify</li>
                        </ol>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={showManualSetup}
                    >
                      Show Complete SQL Setup
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {functionFixResult && !functionFixResult.success && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Manual Fix Required:</strong> Click "Manual Setup SQL" below to get the SQL that fixes the recursive function issue.
              </AlertDescription>
            </Alert>
          )}

          {showManualInstructions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manual Setup SQL</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(manualInstructions)}
                  disabled={copyStatus === 'Copying...'}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copyStatus || 'Copy SQL'}
                </Button>
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Instructions:</strong> Copy the SQL below and run it in your Supabase Dashboard → SQL Editor.
                  After running it, you may need to manually create the admin user in Authentication → Users with email
                  "admin@example.com" and password "password123".
                </AlertDescription>
              </Alert>
              <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {manualInstructions}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Login</CardTitle>
          <CardDescription>
            Test admin credentials after setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Email:</strong> admin@example.com</div>
            <div><strong>Password:</strong> password123</div>
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            After running the setup or manual instructions, use these credentials to test the admin login.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupTool;
