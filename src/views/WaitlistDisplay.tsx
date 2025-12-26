import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaitTimeBadge } from '@/components/waitlist/WaitTimeBadge';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Clock, Bell, Users } from 'lucide-react';
import { useWaitlistDisplay } from '@/hooks/useWaitlist';
import { format } from 'date-fns';

/**
 * WaitlistDisplay - Public display for TV screens showing current waitlist
 * Automatically refreshes every 15 seconds
 */
export const WaitlistDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: waiting, refetch: refetchWaiting } = useWaitlistDisplay('waiting');
  const { data: notified, refetch: refetchNotified } = useWaitlistDisplay('notified');

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Refresh data every 15 seconds
  useEffect(() => {
    const dataInterval = setInterval(() => {
      refetchWaiting();
      refetchNotified();
    }, 15000);

    return () => clearInterval(dataInterval);
  }, [refetchWaiting, refetchNotified]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">Café 1973</h1>
        <p className="text-2xl text-gray-600">Current Waitlist</p>
        <p className="text-xl text-gray-500 mt-2">
          {format(currentTime, 'EEEE, MMMM d, yyyy • h:mm:ss a')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Now Being Notified */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Now Being Seated</h2>
          </div>

          {notified && notified.length > 0 ? (
            <div className="space-y-4">
              {notified.slice(0, 10).map((entry) => (
                <Card key={entry.id} className="bg-green-50 border-green-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl font-bold text-green-700">
                            {entry.quote_number}
                          </span>
                          <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
                            READY
                          </Badge>
                        </div>
                        <div className="text-xl text-gray-700">
                          Party of {entry.party_size}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Please proceed to</div>
                        <div className="text-2xl font-bold text-green-700">Host Stand</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl text-gray-400">No parties being called</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Currently Waiting */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Currently Waiting</h2>
          </div>

          {waiting && waiting.length > 0 ? (
            <div className="space-y-3">
              {waiting.slice(0, 15).map((entry) => (
                <Card key={entry.id} className="bg-white shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-blue-700 w-24">
                          {entry.quote_number}
                        </span>
                        <div className="flex items-center gap-2 text-lg text-gray-600">
                          <Users className="h-5 w-5" />
                          <span>Party of {entry.party_size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {entry.estimated_wait && (
                          <WaitTimeBadge minutes={entry.estimated_wait} size="lg" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white">
              <CardContent className="p-12 text-center">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl text-gray-400">No parties waiting</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500">
        <p className="text-lg">Thank you for your patience!</p>
        <p className="text-sm mt-2">Please stay nearby. We'll call your number when your table is ready.</p>
      </div>
    </div>
  );
};
