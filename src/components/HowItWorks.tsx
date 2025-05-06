
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mic, Brain, MessageSquare } from "lucide-react";

interface StepCardProps {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ icon, step, title, description, delay }: StepCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`neumorph p-6 relative opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple flex items-center justify-center text-sm font-bold">
        {step}
      </div>
      <div className="mb-6 text-brainai-electric-blue">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
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
      description: "Speak naturally or type your thoughts, tasks, and reminders. BrainAi is always listening."
    },
    {
      icon: <Brain size={32} />,
      step: 2,
      title: "AI Processes & Stores",
      description: "Your information is analyzed, categorized, and stored in BrainAi's secure vector database."
    },
    {
      icon: <MessageSquare size={32} />,
      step: 3,
      title: "Ask & Retrieve",
      description: "When you need information, simply ask BrainAi and get contextually relevant answers instantly."
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-brainai-charcoal/30">
      <div className="container mx-auto px-4">
        <div 
          ref={ref} 
          className={`text-center mb-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">How It <span className="font-bold bg-gradient-to-r from-brainai-electric-blue to-brainai-magenta bg-clip-text text-transparent">Works</span></h2>
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
              delay={200 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
