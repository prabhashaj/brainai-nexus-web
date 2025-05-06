
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Headphones, Brain, MessageCircle, Bell } from "lucide-react";
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
      icon: <Headphones size={42} />,
      title: "Personalize your space",
      description: "Control BrainAi with voice commands while focusing on what matters most. Perfect for multitasking.",
      bgColor: "bg-pink-600"
    },
    {
      icon: <Brain size={42} />,
      title: "Your home screen, now with friends",
      description: "Store information in a structured vector database that understands context and relationships.",
      bgColor: "bg-amber-500"
    },
    {
      icon: <MessageCircle size={42} />,
      title: "Available magnets",
      description: "Automatically create concise summaries of meetings, calls, and important conversations.",
      bgColor: "bg-indigo-600"
    },
    {
      icon: <Bell size={42} />,
      title: "Frequently asked questions",
      description: "Receive intelligent notifications based on your schedule, location, and historical patterns.",
      bgColor: "bg-green-600"
    }
  ];

  return (
    <section id="features" className="section-padding bg-brainai-charcoal/30">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Have Fun!</h2>
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
