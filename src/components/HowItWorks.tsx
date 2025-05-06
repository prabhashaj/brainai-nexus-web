
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mic, Brain, MessageSquare, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepCardProps {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
  colorClass: string;
  delay: number;
}

const StepCard = ({ icon, step, title, description, colorClass, delay }: StepCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`${colorClass} p-8 rounded-3xl relative opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-start">
        <div className="mb-6 text-white">
          {icon}
        </div>
        <Badge variant="outline" className="bg-white/20 text-white mb-3 border-0">Step {step}</Badge>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const steps = [
    {
      icon: <Mic size={32} />,
      step: 1,
      title: "Voice Memory Capture",
      description: "Speak and let BrainAi remember for you. Just say what you need to remember, and BrainAi stores it.",
      colorClass: "bg-gradient-to-br from-amber-500/30 to-amber-600/50"
    },
    {
      icon: <Brain size={32} />,
      step: 2,
      title: "Vector Memory Storage",
      description: "Every conversation, reminder, and thought is stored intelligently in a vector database for easy retrieval.",
      colorClass: "bg-gradient-to-br from-blue-500/30 to-blue-600/50"
    },
    {
      icon: <MessageSquare size={32} />,
      step: 3,
      title: "Contextual Recall",
      description: "Ask anything, and BrainAi recalls it like a human assistant, with all the necessary context.",
      colorClass: "bg-gradient-to-br from-green-500/30 to-green-600/50"
    },
    {
      icon: <Calendar size={32} />,
      step: 4,
      title: "Smart Reminders",
      description: "BrainAi doesn't just remind you—it reminds you when it matters, with emotion-aware timing.",
      colorClass: "bg-gradient-to-br from-purple-500/30 to-purple-600/50"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding py-24">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How BrainAi Works</h2>
          <p className="text-white/70 max-w-2xl mx-auto">A seamless experience designed to extend your cognitive abilities.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              step={step.step}
              title={step.title}
              description={step.description}
              colorClass={step.colorClass}
              delay={200 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
