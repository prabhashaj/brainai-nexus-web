
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="min-h-[90vh] flex items-center justify-center pt-20 pb-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-brainai-electric-blue rounded-full opacity-20 animate-float blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-brainai-neon-purple rounded-full opacity-20 animate-float blur-xl" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-brainai-magenta rounded-full opacity-10 animate-float blur-2xl" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div 
          ref={titleRef} 
          className={`opacity-0 ${titleVisible ? 'animate-fade-in-up' : ''}`}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-4">
            <span className="text-brainai-electric-blue drop-shadow-[0_0_8px_rgba(30,174,219,0.3)]">Your space</span><br />
            <span className="text-brainai-neon-purple drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">Your memory</span>
          </h1>
        </div>
        
        <div 
          ref={subtitleRef} 
          className={`opacity-0 ${subtitleVisible ? 'animate-fade-in-up' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed mt-6 mb-10">
            The best way to keep track of your thoughts
          </p>
        </div>
        
        <div 
          ref={ctaRef} 
          className={`opacity-0 ${ctaVisible ? 'animate-fade-in-up' : ''}`}
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/auth">
            <Button 
              className="bg-black hover:bg-black/90 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(30,174,219,0.3)]"
            >
              Get started for free
            </Button>
          </Link>
        </div>

        {/* Abstract UI Screenshot with luxury styling */}
        <div className={`mt-16 max-w-2xl mx-auto relative transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-brainai-electric-blue rounded-full opacity-70 animate-float blur-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-brainai-neon-purple rounded-full opacity-70 animate-float blur-lg" style={{ animationDelay: "1.5s" }}></div>
          
          <div className="glass shadow-2xl backdrop-blur-md rounded-3xl p-4 border border-white/10">
            <img 
              src={`${import.meta.env.BASE_URL || '/brainai-nexus-web/'}image.jpeg`} 
              alt="BrainAi Interface" 
              className="w-full h-auto rounded-2xl shadow-inner" 
              onError={(e) => {
                console.error("Image failed to load, trying alternate path");
                e.currentTarget.src = "./image.jpeg";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
