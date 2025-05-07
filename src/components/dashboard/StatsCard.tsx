
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className,
  iconClassName
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300", 
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1">{value}</h3>
            
            {trend && (
              <div className={cn(
                "flex items-center mt-1 text-xs font-medium",
                trend.positive ? 'text-green-600' : 'text-red-600'
              )}>
                <span>{trend.positive ? '+' : '-'}{trend.value}%</span>
                <svg
                  className={`w-3 h-3 ml-1 ${!trend.positive && 'transform rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="ml-1">since last week</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-4 rounded-full bg-opacity-10",
            iconClassName || "bg-gradient-to-br from-brainai-electric-blue/10 to-brainai-neon-purple/10"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
