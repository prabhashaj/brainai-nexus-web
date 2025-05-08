
import { useState } from "react";

export const useTriggerWords = (callback?: () => void) => {
  // This is now just a dummy hook that does nothing, as requested
  const [isListening] = useState(false);
  
  // The hook is completely emptied of any functionality
  return { isListening: false };
};

export default useTriggerWords;
