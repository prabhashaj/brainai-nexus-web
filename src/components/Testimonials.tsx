
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { User } from "lucide-react";

export const Testimonials = () => {
  const { ref, isVisible } = useScrollAnimation();

  const testimonials = [
    {
      name: "John Doe",
      role: "Product Manager",
      feedback:
        "BrainAi has been a game-changer for our team. It's easy to use and provides valuable insights.",
      color: "bg-brainai-electric-blue",
      textColor: "text-black",
      hoverColor: "hover:bg-brainai-electric-blue/90",
    },
    {
      name: "Jane Smith",
      role: "UX Designer",
      feedback:
        "The voice memory feature is fantastic! I can focus on my work without worrying about forgetting important details.",
      color: "bg-white",
      textColor: "text-black",
      hoverColor: "hover:bg-gray-200",
    },
    {
      name: "Bob Johnson",
      role: "Software Engineer",
      feedback:
        "I'm impressed with BrainAi's ability to understand and respond to my voice commands.",
      color: "bg-brainai-neon-purple",
      textColor: "text-black",
      hoverColor: "hover:bg-brainai-neon-purple/90",
    },
  ];

  return (
    <section
      id="testimonials"
      ref={ref}
      className={`section-padding text-black opacity-0 ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-10" style={{ color: "white" }}>What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.color} p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
            >
              <div className="mb-4 flex justify-center">
                <div className="bg-black/10 rounded-full p-3">
                  <User size={32} className={`${testimonial.textColor}`} />
                </div>
              </div>
              <p className={`italic mb-6 text-lg md:text-xl font-medium ${testimonial.textColor}/80`}>
                "{testimonial.feedback}"
              </p>
              <h4 className={`text-2xl font-bold ${testimonial.textColor}`}>{testimonial.name}</h4>
              <p className={`text-lg ${testimonial.textColor}/60`}>{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
