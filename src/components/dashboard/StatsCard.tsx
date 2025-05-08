import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
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
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">{value}</h3>
          </div>
          
          <div className={cn(
            "p-4 rounded-full",
            iconClassName
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
