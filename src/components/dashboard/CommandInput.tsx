
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTriggerWords } from "@/hooks/useTriggerWords";

const commandSuggestions = [
  "Remind me to call Rohan at 4 PM tomorrow",
  "Create a note about my startup idea",
  "Schedule a meeting with the team for next Monday",
  "Add a reminder to check emails at 9 AM",
  "Create a new conversation with Alex about the project",
  "Set a task to review the quarterly report",
  "Remind me to buy groceries on Saturday morning",
  "Create a note for my vacation plans next month"
];

const CommandInput = () => {
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(commandSuggestions[0]);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle trigger word activation
  const handleTriggerActivation = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      handleMicClick();
    }
  };

  // Initialize trigger word detection
  useTriggerWords(handleTriggerActivation);

  // Rotate through command suggestions every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => {
        const currentIndex = commandSuggestions.indexOf(prev);
        const nextIndex = (currentIndex + 1) % commandSuggestions.length;
        return commandSuggestions[nextIndex];
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMicClick = () => {
    setIsListening(prev => !prev);
    
    if (!isListening) {
      toast({
        title: "Listening...",
        description: "Speak your command now",
      });
      
      // Simulate speech recognition after 2 seconds
      setTimeout(() => {
        setCommand(currentSuggestion);
        setIsListening(false);
        toast({
          title: "Command captured",
          description: "Your voice command has been recorded",
        });
      }, 2000);
    } else {
      setIsListening(false);
      toast({
        title: "Listening stopped",
        description: "Voice command canceled",
      });
    }
  };

  const handleSave = () => {
    if (!command.trim()) {
      toast({
        title: "Empty command",
        description: "Please enter a command first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Command saved",
      description: "Your command has been processed",
    });
    
    setCommand("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">What's on your mind?</h2>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="pr-24 pl-4 py-6 text-base bg-gray-900 text-white border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Type or speak a command..."
        />
        <div className="absolute right-2 flex space-x-2">
          <Button 
            size="icon"
            onClick={handleMicClick}
            className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full w-10 h-10 flex items-center justify-center`}
          >
            <Mic size={20} />
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">Try saying: "{currentSuggestion}"</p>
    </div>
  );
};

export default CommandInput;
