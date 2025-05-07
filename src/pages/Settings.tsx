
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Bell, Shield, Key, Monitor, Palette } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
    emailNotifications: true,
    twoFactorAuth: false,
    language: "english",
    autoSave: true
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
        
        // If user has saved preferences in profile, use them
        if (data.preferences) {
          setPreferences({
            ...preferences,
            ...data.preferences
          });
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updatePreferences = async (key: string, value: any) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("profiles")
        .update({ preferences: newPreferences })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating preferences:", error.message);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Appearance */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-brainai-electric-blue" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize how BrainAi looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="text-sm text-gray-500">Choose between light and dark mode</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-gray-500" />
                  <Switch 
                    id="theme"
                    checked={preferences.theme === 'dark'} 
                    onCheckedChange={(checked) => updatePreferences('theme', checked ? 'dark' : 'light')}
                  />
                  <Moon className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="language">Language</Label>
                  <div className="text-sm text-gray-500">Select your preferred language</div>
                </div>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => updatePreferences('language', value)}
                >
                  <SelectTrigger className="w-[180px] bg-white text-black">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brainai-electric-blue" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <div className="text-sm text-gray-500">Receive push notifications</div>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => updatePreferences('notifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <div className="text-sm text-gray-500">Receive email notifications</div>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => updatePreferences('emailNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brainai-electric-blue" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={preferences.twoFactorAuth}
                  onCheckedChange={(checked) => updatePreferences('twoFactorAuth', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label htmlFor="password">Change Password</Label>
                  <div className="text-sm text-gray-500">Update your password</div>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="New password" 
                    className="bg-white text-black"
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-brainai-electric-blue" />
                <CardTitle>Data & Storage</CardTitle>
              </div>
              <CardDescription>Manage your data and storage preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <div className="text-sm text-gray-500">Automatically save changes</div>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => updatePreferences('autoSave', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <Label>Data Export</Label>
                  <div className="text-sm text-gray-500">Download a copy of your data</div>
                </div>
                <Button variant="outline">Export Data</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-none bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
