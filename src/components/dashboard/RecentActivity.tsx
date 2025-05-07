
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-5">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarFallback className={`
                      ${item.type === 'note' ? 'bg-blue-100 text-blue-600' : 
                        item.type === 'event' ? 'bg-amber-100 text-amber-600' : 
                        'bg-green-100 text-green-600'
                      }
                    `}>
                      {item.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
