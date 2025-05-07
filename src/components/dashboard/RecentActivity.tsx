
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'note' | 'event' | 'conversation';
  title: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ items }) => {
  // Function to generate activity type colors
  const getActivityTypeStyles = (type: string) => {
    switch(type) {
      case 'note':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          fallback: 'N'
        };
      case 'event':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-600',
          fallback: 'E'
        };
      case 'conversation':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          fallback: 'C'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          fallback: '?'
        };
    }
  };

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-5">
          {items.length > 0 ? (
            items.map((item) => {
              const typeStyles = getActivityTypeStyles(item.type);
              
              return (
                <div key={item.id} className="flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mr-4">
                    <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                      <AvatarFallback className={cn(typeStyles.bg, typeStyles.text, "font-medium")}>
                        {typeStyles.fallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        typeStyles.bg, typeStyles.text
                      )}>
                        {item.type}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">Your recent activities will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
