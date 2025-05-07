
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const FAQs = () => {
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
            <div 
              key={index} 
              className="bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-colors"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-white/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
