
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Headphones, Brain, MessageCircle, Bell } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`glass p-8 rounded-xl opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-6 text-brainai-electric-blue">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
};

const FeaturesGrid = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const features = [
    {
      icon: <Headphones size={36} />,
      title: "Hands-Free Productivity",
      description: "Control BrainAi with voice commands while focusing on what matters most. Perfect for multitasking and on-the-go productivity."
    },
    {
      icon: <Brain size={36} />,
      title: "Smart Memory",
      description: "Store information in a structured vector database that understands context and relationships between your data points."
    },
    {
      icon: <MessageCircle size={36} />,
      title: "Conversation Summarizer",
      description: "Automatically create concise summaries of meetings, calls, and important conversations for easy reference."
    },
    {
      icon: <Bell size={36} />,
      title: "Reminder & Alert System",
      description: "Receive intelligent notifications based on your schedule, location, and historical patterns of activity."
    }
  ];

  return (
    <section id="features" className="section-padding">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">Powerful <span className="font-bold bg-gradient-to-r from-brainai-electric-blue to-brainai-magenta bg-clip-text text-transparent">Features</span></h2>
          <p className="text-white/70 max-w-2xl mx-auto">Intelligence that adapts to your unique needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={150 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
