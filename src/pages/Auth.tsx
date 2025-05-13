
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, LogIn } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;
      
      // Create a profile entry for the new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            { id: data.user.id, full_name: fullName }
          ]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      toast({
        title: "Success!",
        description: "Account created. Please check your email for verification.",
      });
      
      // For demo purposes, auto-login after signup
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          redirectTo: window.location.origin + import.meta.env.BASE_URL + "dashboard"
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Error signing in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 text-gray-300 hover:text-white" 
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Home
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple animate-pulse"></div>
            <span className="font-bold text-xl text-white tracking-tight">BrainAi</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to BrainAi</h1>
          <p className="text-gray-400">Your personal AI memory assistant</p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-700 text-white">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-700">
              <TabsTrigger value="signin" className="data-[state=active]:bg-brainai-electric-blue">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-brainai-electric-blue">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-brainai-electric-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <a href="#" className="text-sm text-brainai-electric-blue hover:text-brainai-soft-blue">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-brainai-electric-blue"
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive" className="animate-fade-in-up bg-red-900 border-red-800 text-white">
                    {error}
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-gray-600 hover:bg-gray-700 transition-all text-white"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-brainai-electric-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-brainai-electric-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-brainai-electric-blue"
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive" className="animate-fade-in-up bg-red-900 border-red-800 text-white">
                    {error}
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-gray-600 hover:bg-gray-700 transition-all text-white"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            By continuing, you agree to BrainAi's{" "}
            <a href="#" className="text-brainai-electric-blue hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-brainai-electric-blue hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
