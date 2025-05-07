
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data as ProfileData);
      setFormData({
        full_name: data.full_name || "",
        bio: data.bio || "",
      });
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-none shadow-md overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                  <AvatarFallback className="bg-brainai-electric-blue text-white text-4xl">
                    {profile?.full_name?.charAt(0).toUpperCase() || <User className="h-16 w-16" />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <Button 
                    className="rounded-full bg-brainai-electric-blue hover:bg-brainai-electric-blue/90 h-10 w-10 p-2"
                    disabled={uploading}
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    {uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </Button>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.full_name || "Your Name"}
              </h2>
              <p className="text-gray-600 mt-1">
                {profile?.bio || "No bio yet"}
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Joined {profile?.created_at && new Date(profile.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-none shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-white text-black"
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
                    className="bg-white text-black min-h-[100px]"
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={updateProfile} 
                    className="bg-brainai-electric-blue hover:bg-brainai-electric-blue/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
