
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mic, Brain, MessageSquare, Bell, Calendar, Clock, Zap, User, Check, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, bgColor, delay }: FeatureCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <Card 
      ref={ref}
      className={`opacity-0 border-0 shadow-lg overflow-hidden ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className={`p-0 h-full`}>
        <div className="flex md:flex-col lg:flex-row h-full">
          <div className={`${bgColor} p-8 md:p-6 flex items-center justify-center md:w-full lg:w-1/3`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className="p-8 bg-card md:w-full lg:w-2/3">
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-foreground/70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturesGrid = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const features = [
    {
      icon: <Mic size={42} />,
      title: "Voice Memory Capture",
      description: "Speak and let BrainAi remember for you. Just say what you need to remember, and BrainAi stores it.",
      bgColor: "bg-pink-600"
    },
    {
      icon: <Brain size={42} />,
      title: "Vector Memory Storage",
      description: "Every conversation, reminder, and thought is stored intelligently in a vector database for easy retrieval.",
      bgColor: "bg-amber-500"
    },
    {
      icon: <MessageSquare size={42} />,
      title: "Conversation Summarizer",
      description: "Turn long discussions or voice notes into bite-sized summaries with key points and decisions.",
      bgColor: "bg-indigo-600"
    },
    {
      icon: <Bell size={42} />,
      title: "Smart Reminders",
      description: "BrainAi doesn't just remind you—it reminds you when it matters, with emotion-aware timing.",
      bgColor: "bg-green-600"
    },
    {
      icon: <Calendar size={42} />,
      title: "Routine Builder",
      description: "Automate repetitive tasks and mental checklists. BrainAi guides you through your daily routines.",
      bgColor: "bg-blue-600"
    },
    {
      icon: <Zap size={42} />,
      title: "Natural Language Commands",
      description: "No buttons, just conversations. Simply tell BrainAi what you need in natural language.",
      bgColor: "bg-purple-600"
    },
    {
      icon: <User size={42} />,
      title: "Mood-aware Feedback",
      description: "BrainAi adapts to your tone and responses, offering personalized support when you need it most.",
      bgColor: "bg-rose-600"
    },
    {
      icon: <Lock size={42} />,
      title: "Privacy-first Design",
      description: "Your memory stays yours – secure and encrypted. Voice logs can be auto-deleted after 7 days.",
      bgColor: "bg-teal-600"
    }
  ];

  return (
    <section id="features" className="section-padding bg-brainai-charcoal/30">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Intelligence that adapts to your unique needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bgColor={feature.bgColor}
              delay={150 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
