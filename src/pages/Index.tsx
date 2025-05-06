
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UseCaseCards from '@/components/UseCaseCards';
import HowItWorks from '@/components/HowItWorks';
import FeaturesGrid from '@/components/FeaturesGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-brainai-charcoal">
      <Navbar />
      <HeroSection />
      <UseCaseCards />
      <HowItWorks />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default Index;
