
import React from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Conversations = () => {
  const navigate = useNavigate();
  
  // Example conversation data
  const conversations = [
    {
      id: '1',
      name: 'BrainAI Assistant',
      lastMessage: 'How can I help you today?',
      time: '3:45 PM',
      isAI: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      lastMessage: 'Did you get my notes from yesterday?',
      time: 'Yesterday',
      isAI: false
    },
    {
      id: '3',
      name: 'Memory Keeper',
      lastMessage: 'I've saved your meeting highlights',
      time: '2 days ago',
      isAI: true
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-display font-semibold text-gray-800">Conversations</h1>
            </div>
            
            <Button className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            {conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <Card 
                    key={conversation.id}
                    className="p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-all border-0 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      conversation.isAI ? 'bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple' : 'bg-gray-200'
                    }`}>
                      {conversation.isAI ? (
                        <MessageSquare className="h-6 w-6 text-white" />
                      ) : (
                        <User className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{conversation.name}</h3>
                        <span className="text-sm text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border-0">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="h-10 w-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-display font-medium text-gray-600 mb-2">No conversations yet</h2>
                <p className="text-gray-500 mb-6">Start your first conversation</p>
                <Button className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  New Conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
