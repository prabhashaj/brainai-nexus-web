
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceCommandCard = () => {
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleVoiceCommand = () => {
    if (isRecording) {
      // Simulate stopping recording
      setIsRecording(false);
      toast({
        title: "Voice captured",
        description: "Processing your request...",
      });
      
      // Simulate processing delay
      setTimeout(() => {
        setVoiceCommand("");
        toast({
          title: "Command processed",
          description: "Your voice command has been processed successfully.",
        });
      }, 1500);
    } else {
      setIsRecording(true);
      // Simulate starting recording
      setTimeout(() => {
        setVoiceCommand("Remind me to call Rohan at 4 PM tomorrow");
      }, 1000);
    }
  };

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceCommand.trim()) return;
    
    toast({
      title: "Command saved",
      description: "Your command has been saved successfully.",
    });
    setVoiceCommand("");
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmitCommand} className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="What's on your mind?"
            value={voiceCommand}
            onChange={(e) => setVoiceCommand(e.target.value)}
            className="flex-1 h-12"
          />
          <div className="flex space-x-2">
            <Button 
              type="button" 
              onClick={handleVoiceCommand} 
              variant="outline"
              size="icon"
              className={`rounded-full w-12 h-12 flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                  : 'bg-white hover:bg-gray-50 text-brainai-electric-blue border-brainai-electric-blue'
              }`}
            >
              {isRecording ? <Play size={18} /> : <Mic size={18} />}
            </Button>
            <Button 
              type="submit" 
              className="bg-brainai-electric-blue hover:bg-brainai-soft-blue"
              disabled={!voiceCommand.trim()}
            >
              Save
            </Button>
          </div>
        </form>
        
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500">Try saying:</p>
          <div className="space-y-2">
            {[
              "Remind me to call Rohan at 4 PM tomorrow",
              "Create a note about my startup idea",
              "What meetings do I have today?",
              "Tell me what I worked on last week"
            ].map((example, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setVoiceCommand(example)}
              >
                {example}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommandCard;
