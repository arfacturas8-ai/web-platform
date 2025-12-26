import React from 'react';
import { Clock, Package, Truck, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface TimelineEvent {
  status: string;
  timestamp: string;
  message?: string;
  location?: string;
}

interface DeliveryTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
  vertical?: boolean;
  showTimestamps?: boolean;
}

const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({
  events,
  currentStatus,
  vertical = true,
  showTimestamps = true,
}) => {
  const getEventIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return Clock;
      case 'assigned':
        return Package;
      case 'picked_up':
        return Truck;
      case 'in_transit':
        return Truck;
      case 'arrived':
        return MapPin;
      case 'delivered':
        return CheckCircle;
      case 'failed':
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  const getEventColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          icon: 'bg-yellow-500',
        };
      case 'assigned':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-300',
          icon: 'bg-blue-500',
        };
      case 'picked_up':
      case 'in_transit':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-300',
          icon: 'bg-purple-500',
        };
      case 'arrived':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-700',
          border: 'border-indigo-300',
          icon: 'bg-indigo-500',
        };
      case 'delivered':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          icon: 'bg-green-500',
        };
      case 'failed':
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: 'bg-red-500',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: 'bg-gray-500',
        };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (vertical) {
    return (
      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = getEventIcon(event.status);
          const colors = getEventColor(event.status);
          const isCurrent = event.status.toLowerCase() === currentStatus.toLowerCase();
          const isPast = events.findIndex(e => e.status.toLowerCase() === currentStatus.toLowerCase()) > index;

          return (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Connector Line */}
              {index < events.length - 1 && (
                <div
                  className={`absolute left-4 top-10 w-0.5 h-full ${
                    isPast ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ height: 'calc(100% + 1rem)' }}
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrent || isPast ? colors.icon : 'bg-gray-300'
                } ${isCurrent ? 'ring-4 ring-opacity-20' : ''}`}
                style={isCurrent ? { ['--tw-ring-color' as string]: colors.icon } : {}}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div
                  className={`rounded-lg border-2 p-4 ${
                    isCurrent
                      ? `${colors.bg} ${colors.border}`
                      : isPast
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4
                        className={`font-semibold ${
                          isCurrent || isPast ? colors.text : 'text-gray-600'
                        }`}
                      >
                        {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      {event.message && (
                        <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                      )}
                      {event.location && (
                        <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {showTimestamps && (
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-700">{formatTime(event.timestamp)}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {events.map((event, index) => {
          const Icon = getEventIcon(event.status);
          const colors = getEventColor(event.status);
          const isCurrent = event.status.toLowerCase() === currentStatus.toLowerCase();
          const isPast = events.findIndex(e => e.status.toLowerCase() === currentStatus.toLowerCase()) > index;

          return (
            <div key={index} className="flex-1 relative">
              {/* Connector Line */}
              {index < events.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    isPast ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ marginLeft: '1rem' }}
                />
              )}

              {/* Event */}
              <div className="relative flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    isCurrent || isPast ? colors.icon : 'bg-gray-300'
                  } ${isCurrent ? 'ring-4 ring-opacity-20' : ''} z-10`}
                  style={isCurrent ? { ['--tw-ring-color' as string]: colors.icon } : {}}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p
                  className={`text-xs font-medium ${
                    isCurrent || isPast ? colors.text : 'text-gray-500'
                  }`}
                >
                  {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                {showTimestamps && (
                  <p className="text-xs text-gray-400 mt-1">{formatTime(event.timestamp)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeline;
