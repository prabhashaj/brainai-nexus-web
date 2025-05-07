
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check } from "lucide-react";

export const Pricing = () => {
  const { ref, isVisible } = useScrollAnimation();
  
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
    <section 
      id="pricing" 
      ref={ref}
      className={`section-padding text-center opacity-0 ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`${plan.bgColor} p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
              style={{ animationDelay: `${index * 200}ms` }}
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
