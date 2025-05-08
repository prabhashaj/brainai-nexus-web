import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Bell, Calendar, Moon, Mic, WifiOff, User } from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);
  const [passiveListening, setPassiveListening] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        setProfile(data as ProfileData);
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates = {
        id: user.id,
        full_name: formData.full_name,
        bio: formData.bio,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh profile data
      fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error",
        description: "Could not update profile",
        variant: "destructive",
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("user-content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("user-content")
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });

      // Refresh profile data
      fetchProfile();
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast({
        title: "Error",
        description: error.message || "Could not upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      // Redirect to login page or perform other actions
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Error",
        description: "Could not sign out",
        variant: "destructive",
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
      <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in-up">
        {/* Header section with welcome message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Main profile card */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col items-center">
            {/* Avatar section */}
            <div className="relative mb-6">
              <Avatar className="h-32 w-32 border-4 border-brainai-electric-blue shadow-[0_0_20px_rgba(30,174,219,0.3)]">
                <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-brainai-electric-blue to-brainai-neon-purple text-white text-3xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Button 
                  className="rounded-full bg-brainai-electric-blue hover:bg-brainai-soft-blue shadow-lg h-10 w-10 p-2"
                  disabled={uploading}
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  {uploading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </Button>
                <input type="file" id="avatar-upload" accept="image/*" onChange={uploadAvatar} className="hidden" />
              </div>
            </div>

            {/* Profile info */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {profile?.full_name || "Your Name"}
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-2">
              {profile?.bio || "No bio yet"}
            </p>
            <p className="text-sm text-gray-500">
              Joined {profile?.created_at && new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Settings sections */}
          <div className="mt-12 space-y-8">
            {/* General Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">General Settings</h3>
              <div className="grid gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-white border-gray-200 focus:border-brainai-electric-blue focus:ring-brainai-electric-blue"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-white border-gray-200 min-h-[100px] focus:border-brainai-electric-blue focus:ring-brainai-electric-blue"
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-brainai-electric-blue" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-500">Receive important updates</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-brainai-electric-blue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-brainai-electric-blue" />
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">Toggle dark theme</p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-brainai-electric-blue"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-brainai-electric-blue" />
                    <div>
                      <p className="font-medium">Calendar Sync</p>
                      <p className="text-sm text-gray-500">Sync with your calendar</p>
                    </div>
                  </div>
                  <Switch 
                    checked={calendarSync} 
                    onCheckedChange={setCalendarSync}
                    className="data-[state=checked]:bg-brainai-electric-blue"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button 
                onClick={updateProfile} 
                className="bg-brainai-electric-blue hover:bg-brainai-soft-blue text-white"
              >
                Save Changes
              </Button>
              <Button 
                variant="destructive"
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
