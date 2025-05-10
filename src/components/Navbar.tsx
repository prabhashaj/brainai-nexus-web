
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Features', href: '#use-cases' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-black/30 backdrop-blur-lg border-b border-white/10 shadow-lg' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo variant="dark" size="md" withText={true} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors hover:underline underline-offset-4"
            >
              {link.name}
            </a>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="hidden md:block">
          <Link to="/auth">
            <Button 
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-full border border-white/20 shadow-lg transition-all duration-300 hover:shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass p-4 border-t border-white/10 shadow-lg backdrop-blur-md">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors py-2 hover:translate-x-1 transform duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
              <Button 
                variant="luxury"
                className="w-full rounded-full"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
