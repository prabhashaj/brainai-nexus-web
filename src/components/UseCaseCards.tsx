
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Headphones, Calendar, MessageSquare, Clock, Headphones as Audio, Brain, Sparkles } from "lucide-react";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  delay: number;
}

const UseCaseCard = ({ icon, title, description, colorClass, delay }: UseCaseCardProps) => {
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
          <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const UseCaseCards = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [selectedCard, setSelectedCard] = useState(0);
  
  const useCases = [
    {
      icon: <Audio size={20} />,
      title: "Live audio with a tap",
      description: "Speak your thoughts and BrainAi organizes them into searchable notes.",
      colorClass: "bg-blue-500/20"
    },
    {
      icon: <Calendar size={20} />,
      title: "AI Calendar Organizer",
      description: "Let BrainAi manage your schedule with smart time organization.",
      colorClass: "bg-amber-500/20"
    },
    {
      icon: <Brain size={20} />,
      title: "Interactive magnets with friends",
      description: "Ask questions and get answers based on your past conversations.",
      colorClass: "bg-indigo-500/20"
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Conversation Capture",
      description: "Automatically summarize and store important meeting details.",
      colorClass: "bg-green-500/20"
    },
    {
      icon: <Sparkles size={20} />,
      title: "A new way to have fun",
      description: "View your life insights and productivity patterns at a glance.",
      colorClass: "bg-rose-500/20"
    },
    {
      icon: <Clock size={20} />,
      title: "Stay in the loop!",
      description: "Schedule recurring tasks and let BrainAi handle the reminders.",
      colorClass: "bg-purple-500/20"
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
