
import { supabase } from "../supabase/client";

export const createAvatarBucket = async () => {
  const { data, error } = await supabase.storage.createBucket("avatars", {
    public: true,
    fileSizeLimit: 1024 * 1024 * 2, // 2MB
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  });

  if (error) {
    console.error("Error creating avatars bucket:", error);
    return false;
  }

  return true;
};
