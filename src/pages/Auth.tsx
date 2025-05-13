
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
