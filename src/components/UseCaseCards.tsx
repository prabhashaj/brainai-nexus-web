
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Mic, Calendar, MessageSquare, Clock, Headphones, Brain, Sparkles } from "lucide-react";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  colorClass: string;
  delay: number;
}

const UseCaseCard = ({ icon, title, description, example, colorClass, delay }: UseCaseCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`${colorClass} p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white mb-4">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-3">{description}</p>
          <div className="mt-4 bg-black/20 p-3 rounded text-white/80 text-xs italic">
            <span className="font-medium text-white block mb-1">Example:</span>
            {example}
          </div>
        </div>
      </div>
    </div>
  );
};

const UseCaseCards = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const useCases = [
    {
      icon: <Mic size={20} />,
      title: "Voice Memory Capture",
      description: "Speak and let BrainAi remember for you.",
      example: 'Say "Remind me to call Rohan at 4 PM tomorrow" → BrainAi stores it with time and context.',
      colorClass: "bg-blue-500/20"
    },
    {
      icon: <Brain size={20} />,
      title: "Contextual Recall",
      description: "Ask anything, and BrainAi recalls it like a human assistant.",
      example: 'You ask, "What did I plan with Rohan?" → BrainAi replies, "You planned a call with Rohan at 4 PM on Wednesday."',
      colorClass: "bg-amber-500/20"
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Automated Conversation Summarizer",
      description: "Turn long discussions into bite-sized summaries.",
      example: 'You say, "Summarize my chat with Ravi from today" → BrainAi gives a clean summary with key points and decisions.',
      colorClass: "bg-green-500/20"
    },
    {
      icon: <Calendar size={20} />,
      title: "Smart Reminders",
      description: "BrainAi doesn't just remind you—it reminds you when it matters.",
      example: 'Say, "Remind me to wish Mom happy birthday when I wake up" → BrainAi sets a morning reminder with emotion-aware timing.',
      colorClass: "bg-rose-500/20"
    },
    {
      icon: <Clock size={20} />,
      title: "Routine Builder",
      description: "Automate repetitive tasks and mental checklists.",
      example: 'You say, "Start my daily morning checklist" → BrainAi lists tasks like: 1) Drink water, 2) Meditate, 3) Review goals.',
      colorClass: "bg-purple-500/20"
    },
    {
      icon: <Sparkles size={20} />,
      title: "Natural Language Commands",
      description: "No buttons, just conversations.",
      example: 'Say, "Book a reminder every Friday to send weekly reports" → Done. No form-filling or typing.',
      colorClass: "bg-indigo-500/20"
    }
  ];

  return (
    <section id="use-cases" className="section-padding">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="font-bold">Brain</span>Ai Features
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">Discover how BrainAi transforms the way you work, think, and remember.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={index}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              example={useCase.example}
              colorClass={useCase.colorClass}
              delay={100 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseCards;
