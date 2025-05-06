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

const Testimonials = () => {
  const { ref, isVisible } = useScrollAnimation();

  const testimonials = [
    {
      name: "John Doe",
      role: "Product Manager",
      feedback:
        "BrainAi has been a game-changer for our team. It's easy to use and provides valuable insights.",
      color: "bg-gradient-to-r from-pink-500 to-yellow-500",
      hoverColor: "hover:bg-gradient-to-r hover:from-pink-600 hover:to-yellow-600",
    },
    {
      name: "Jane Smith",
      role: "UX Designer",
      feedback:
        "The voice memory feature is fantastic! I can focus on my work without worrying about forgetting important details.",
      color: "bg-gradient-to-r from-green-500 to-blue-500",
      hoverColor: "hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600",
    },
    {
      name: "Bob Johnson",
      role: "Software Engineer",
      feedback:
        "I'm impressed with BrainAi's ability to understand and respond to my voice commands.",
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
      hoverColor: "hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600",
    },
  ];

  return (
    <section
      id="testimonials"
      ref={ref}
      className={`section-padding text-white opacity-0 ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.color} p-6 rounded-lg shadow-lg transition-colors ${testimonial.hoverColor}`}
            >
              <p className="text-white/70 italic mb-4">"{testimonial.feedback}"</p>
              <h4 className="text-xl font-bold">{testimonial.name}</h4>
              <p className="text-sm text-white/50">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQs = () => {
  const { ref, isVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Is BrainAi free to use?",
      answer: "Yes, BrainAi offers a free plan with essential features. Premium plans are available for advanced functionality.",
    },
    {
      question: "How secure is my data?",
      answer: "Your data is encrypted and stored securely. You can also enable auto-deletion of voice logs after 7 days.",
    },
    {
      question: "Can I use BrainAi on multiple devices?",
      answer: "Absolutely! BrainAi syncs seamlessly across all your devices.",
    },
  ];

  return (
    <section
      id="faqs"
      ref={ref}
      className={`section-padding bg-brainai-charcoal text-white opacity-0 ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-white/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Free Plan",
      price: "$0",
      features: ["Basic Features", "Limited Storage", "Community Support"],
      bgColor: "bg-brainai-electric-blue",
      textColor: "text-white",
    },
    {
      title: "Pro Plan",
      price: "$9/month",
      features: ["All Free Features", "Unlimited Storage", "Priority Support"],
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      title: "Enterprise Plan",
      price: "Custom Pricing",
      features: ["All Pro Features", "Dedicated Support", "Custom Integrations"],
      bgColor: "bg-brainai-neon-purple",
      textColor: "text-white",
    },
  ];

  return (
    <section className="section-padding text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`${plan.bgColor} p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
            >
              <h3 className={`text-2xl font-bold mb-4 ${plan.textColor}`}>{plan.title}</h3>
              <p className={`text-3xl font-bold mb-6 ${plan.textColor}`}>{plan.price}</p>
              <ul className={`space-y-3 ${plan.textColor}`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <Check className="mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 px-6 py-3 rounded-lg font-bold transition-colors ${
                  plan.bgColor === "bg-white"
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesGrid = () => {
  return (
    <>
      <Testimonials />
      <FAQs />
      <Pricing />
    </>
  );
};

export default FeaturesGrid;
