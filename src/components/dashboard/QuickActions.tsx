
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Calendar, MessageSquare, Brain, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-brainai-electric-blue hover:text-white border-2 border-dashed transition-all"
            onClick={() => navigate('/notes')}
          >
            <Brain className="mb-2 h-6 w-6" />
            <span>Create Note</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-brainai-neon-purple hover:text-white border-2 border-dashed transition-all"
            onClick={() => navigate('/events')}
          >
            <Calendar className="mb-2 h-6 w-6" />
            <span>Add Event</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-brainai-magenta hover:text-white border-2 border-dashed transition-all"
            onClick={() => navigate('/conversations')}
          >
            <MessageSquare className="mb-2 h-6 w-6" />
            <span>New Conversation</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-brainai-soft-blue hover:text-white border-2 border-dashed transition-all"
          >
            <Mic className="mb-2 h-6 w-6" />
            <span>Voice Memory</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
