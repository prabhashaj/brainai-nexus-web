
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
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const textColor = variant === 'dark' 
    ? "text-white" 
    : "text-gray-900";

  return (
    <Link to="/" className="flex items-center space-x-2">
      {withText && (
        <span className={`font-serif tracking-tight ${textSizeClasses[size]} ${textColor} font-bold`}>
          Brain<span className="font-normal">Ai</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
