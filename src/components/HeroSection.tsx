
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brainai-neon-purple/5 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brainai-electric-blue/5 blur-[100px] rounded-full -z-10"></div>

      <div className="container mx-auto px-4 lg:flex lg:items-center lg:gap-12">
        <div className="lg:w-1/2 space-y-8">
          <div 
            ref={titleRef} 
            className={`opacity-0 ${titleVisible ? 'animate-fade-in-up' : ''}`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight mb-4">
              Your Second Brain.<br />
              <span className="font-bold bg-gradient-to-r from-brainai-electric-blue via-brainai-neon-purple to-brainai-magenta bg-clip-text text-transparent">On Command.</span>
            </h1>
          </div>
          
          <div 
            ref={subtitleRef} 
            className={`opacity-0 ${subtitleVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '0.2s' }}
          >
            <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed">
              Speak. BrainAi listens, remembers, and reminds you when you need it most.
            </p>
          </div>
          
          <div 
            ref={ctaRef} 
            className={`opacity-0 ${ctaVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '0.4s' }}
          >
            <Button 
              className="bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-brainai-electric-blue/20 transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
            </Button>
          </div>
        </div>
        
        <div 
          ref={imageRef} 
          className={`lg:w-1/2 mt-12 lg:mt-0 opacity-0 ${imageVisible ? 'animate-fade-in-up' : ''}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="glass p-4 border border-white/20 rounded-2xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
              alt="BrainAi Interface" 
              className="w-full h-auto rounded-lg" 
            />
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
