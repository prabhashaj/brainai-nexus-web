
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useTriggerWords = (callback?: () => void) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // This hook now does nothing - trigger word functionality removed
  useEffect(() => {
    // Functionality removed as requested
    return () => {
      // Empty cleanup
    };
  }, [callback, toast, isListening]);
  
  return { isListening };
};
