
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Brain, Calendar, MessageSquare, Clock, Headphones, Book } from "lucide-react";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const UseCaseCard = ({ icon, title, description, delay }: UseCaseCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`glass p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const UseCaseCards = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const useCases = [
    {
      icon: <Headphones size={24} />,
      title: "Voice Notes to Memory",
      description: "Speak your thoughts and BrainAi organizes them into searchable notes."
    },
    {
      icon: <Calendar size={24} />,
      title: "AI Calendar Organizer",
      description: "Let BrainAi manage your schedule with smart time organization."
    },
    {
      icon: <Brain size={24} />,
      title: "Contextual Recall",
      description: "Ask questions and get answers based on your past conversations."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Conversation Capture",
      description: "Automatically summarize and store important meeting details."
    },
    {
      icon: <Book size={24} />,
      title: "AI Life Dashboard",
      description: "View your life insights and productivity patterns at a glance."
    },
    {
      icon: <Clock size={24} />,
      title: "Routine Automation",
      description: "Schedule recurring tasks and let BrainAi handle the reminders."
    }
  ];

  return (
    <section id="use-cases" className="section-padding">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">Unlock Your <span className="font-bold bg-gradient-to-r from-brainai-electric-blue to-brainai-magenta bg-clip-text text-transparent">Full Potential</span></h2>
          <p className="text-white/70 max-w-2xl mx-auto">Discover how BrainAi transforms the way you work, think, and remember.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={index}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              delay={100 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseCards;
