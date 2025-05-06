
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mic, Brain, MessageSquare } from "lucide-react";

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
        <span className="text-sm font-medium px-3 py-1 bg-white/20 rounded-full mb-3">Step {step}</span>
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
      title: "Say Your Command",
      description: "Speak naturally or type your thoughts, tasks, and reminders. BrainAi is always listening.",
      colorClass: "bg-amber-600/30"
    },
    {
      icon: <Brain size={32} />,
      step: 2,
      title: "AI Processes & Stores",
      description: "Your information is analyzed, categorized, and stored in BrainAi's secure vector database.",
      colorClass: "bg-blue-600/30"
    },
    {
      icon: <MessageSquare size={32} />,
      step: 3,
      title: "Ask & Retrieve",
      description: "When you need information, simply ask BrainAi and get contextually relevant answers instantly.",
      colorClass: "bg-green-600/30"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding py-24">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A new way to hangout</h2>
          <p className="text-white/70 max-w-2xl mx-auto">A seamless experience designed to extend your cognitive abilities.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
