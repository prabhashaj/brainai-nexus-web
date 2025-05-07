
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  updated_at?: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    full_name: "",
    avatar_url: "",
    bio: "",
    preferences: {
      notifications: true,
      theme: "light"
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return;
      }

      setUser(session.user);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          id: session.user.id,
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          preferences: {
            ...profile.preferences,
            ...(data.preferences || {})
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });

      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error uploading avatar",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple text-white text-xl">
                      {profile.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-all">
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                    <Camera size={16} className="text-gray-600" />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      placeholder="Full Name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="focus:border-brainai-electric-blue focus:ring-2 focus:ring-brainai-electric-blue/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  className="w-full p-3 border rounded-md focus:border-brainai-electric-blue focus:ring-2 focus:ring-brainai-electric-blue/20 outline-none transition-all resize-none"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  value={user.email} 
                  disabled 
                  className="bg-gray-50" 
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferences</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profile.preferences.notifications}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, notifications: e.target.checked }
                      })}
                      className="rounded text-brainai-electric-blue focus:ring-brainai-electric-blue"
                    />
                    <span>Enable Notifications</span>
                  </label>
                  
                  <div className="flex items-center space-x-4">
                    <span>Theme:</span>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="theme"
                        checked={profile.preferences.theme === "light"}
                        onChange={() => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: "light" }
                        })}
                        className="text-brainai-electric-blue focus:ring-brainai-electric-blue"
                      />
                      <span>Light</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="theme"
                        checked={profile.preferences.theme === "dark"}
                        onChange={() => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: "dark" }
                        })}
                        className="text-brainai-electric-blue focus:ring-brainai-electric-blue"
                      />
                      <span>Dark</span>
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all"
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
