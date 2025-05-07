
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const TRIGGER_WORDS = ["hey brain", "ok brain", "brain"];

export const useTriggerWords = (callback?: () => void) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Create a speech recognition instance if supported by the browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Check if speech recognition is supported
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsListening(true);
    };
    
    recognition.onend = () => {
      console.log("Voice recognition ended");
      setIsListening(false);
      // Restart recognition
      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Failed to restart recognition:", error);
        }
      }
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript.trim().toLowerCase())
        .join(' ');
      
      console.log("Heard:", transcript);
      
      // Check if any trigger word is present
      const hasTriggerWord = TRIGGER_WORDS.some(trigger => 
        transcript.includes(trigger.toLowerCase())
      );
      
      if (hasTriggerWord) {
        toast({
          title: "Trigger word detected!",
          description: "I'm listening. How can I help?",
        });
        
        if (callback) {
          callback();
        }
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    // Start listening
    try {
      recognition.start();
      toast({
        title: "Voice activation enabled",
        description: "Try saying 'Hey Brain' to activate",
      });
    } catch (error) {
      console.error("Failed to start recognition:", error);
    }
    
    // Cleanup
    return () => {
      recognition.stop();
      setIsListening(false);
    };
  }, [callback, toast, isListening]);
  
  return { isListening };
};
