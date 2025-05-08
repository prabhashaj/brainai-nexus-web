
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface PreferencesType {
  theme: string;
  notifications: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  language: string;
  autoSave: boolean;
}

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<PreferencesType>({
    theme: 'light',
    notifications: true,
    emailNotifications: false,
    twoFactorAuth: false,
    language: 'en',
    autoSave: true
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/auth";
        return;
      }
      setUser(session.user);
      await fetchUserPreferences(session.user.id);
      setLoading(false);
    };

    getUser();
  }, []);

  const fetchUserPreferences = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (data?.preferences) {
        // Parse preferences from JSON if stored as string, or use as object if already in object form
        const parsedPrefs = typeof data.preferences === 'string' 
          ? JSON.parse(data.preferences)
          : data.preferences;
          
        setPreferences({
          theme: parsedPrefs.theme || 'light',
          notifications: !!parsedPrefs.notifications,
          emailNotifications: !!parsedPrefs.emailNotifications,
          twoFactorAuth: !!parsedPrefs.twoFactorAuth,
          language: parsedPrefs.language || 'en',
          autoSave: parsedPrefs.autoSave !== undefined ? !!parsedPrefs.autoSave : true
        });
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      // Initialize with defaults if we couldn't fetch
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: preferences
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message || "There was a problem saving your settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 mb-8">
            <TabsTrigger value="preferences" className="text-center">Preferences</TabsTrigger>
            <TabsTrigger value="account" className="text-center">Account</TabsTrigger>
            <TabsTrigger value="notifications" className="text-center">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Display Settings</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Theme</h4>
                    <p className="text-sm text-gray-500">Select your preferred theme</p>
                  </div>
                  <Select 
                    value={preferences.theme} 
                    onValueChange={(value) => setPreferences({...preferences, theme: value})}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Language</h4>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                  <Select 
                    value={preferences.language} 
                    onValueChange={(value) => setPreferences({...preferences, language: value})}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Auto-save</h4>
                    <p className="text-sm text-gray-500">Save changes automatically</p>
                  </div>
                  <Switch 
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Two-factor authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={preferences.twoFactorAuth}
                    onCheckedChange={(checked) => setPreferences({...preferences, twoFactorAuth: checked})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <p className="mb-4 text-gray-600">Manage your account details and profile information</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email address</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Account created</p>
                  <p className="text-gray-600">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
              <p className="mb-4 text-gray-600">Control how you receive notifications</p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Push notifications</h4>
                    <p className="text-sm text-gray-500">Receive push notifications in app</p>
                  </div>
                  <Switch 
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Email notifications</h4>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
