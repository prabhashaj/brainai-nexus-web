
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  size = 'md',
  withText = true
}) => {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const logoGradient = variant === 'dark' 
    ? "from-brainai-electric-blue to-brainai-neon-purple" 
    : "from-white to-gray-200";

  const textColor = variant === 'dark' 
    ? "text-white" 
    : "text-gray-900";

  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${logoGradient} opacity-20`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              className={variant === 'dark' ? "fill-brainai-electric-blue" : "fill-gray-800"}
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2 9.17l-2-2V9h1v3.17l1.59 1.59L12 13.17z"
              className={variant === 'dark' ? "fill-brainai-neon-purple" : "fill-gray-600"}
            />
          </svg>
        </div>
        <div className={`absolute inset-0 rounded-full border border-${variant === 'dark' ? 'white/10' : 'black/5'}`}></div>
      </div>
      
      {withText && (
        <span className={`font-medium tracking-tight ${textSizeClasses[size]} ${textColor}`}>
          Brain<span className="font-bold">Ai</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
