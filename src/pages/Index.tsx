
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UseCaseCards from '@/components/UseCaseCards';
import HowItWorks from '@/components/HowItWorks';
import FeaturesGrid from '@/components/FeaturesGrid';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-brainai-charcoal">
      <Navbar />
      <HeroSection />
      <UseCaseCards />
      <HowItWorks />
      <FeaturesGrid />
      <div className="py-16 bg-gradient-to-b from-brainai-charcoal to-brainai-dark-purple">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Logo variant="dark" size="lg" withText={true} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to enhance your memory?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust BrainAi to help them remember what matters.
          </p>
          <Link to="/auth" className="inline-block">
            <Button 
              className="bg-white text-brainai-charcoal hover:bg-white/90 px-6 py-5 rounded-full shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,255,255,0.4)] font-medium backdrop-blur-sm border border-white/20"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
