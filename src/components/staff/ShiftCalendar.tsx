import React, { useMemo } from 'react';
import { Shift, EmployeePosition } from '@/services/staffService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface ShiftCalendarProps {
  shifts: Shift[];
  weekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  onShiftClick?: (shift: Shift) => void;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const POSITION_COLORS: Record<EmployeePosition, string> = {
  [EmployeePosition.BAKER]: 'bg-orange-500',
  [EmployeePosition.CASHIER]: 'bg-blue-500',
  [EmployeePosition.MANAGER]: 'bg-purple-500',
  [EmployeePosition.ASSISTANT_MANAGER]: 'bg-indigo-500',
  [EmployeePosition.DELIVERY_DRIVER]: 'bg-green-500',
  [EmployeePosition.BARISTA]: 'bg-yellow-500',
  [EmployeePosition.KITCHEN_STAFF]: 'bg-red-500',
  [EmployeePosition.CLEANER]: 'bg-gray-500',
};

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  weekStart,
  onWeekChange,
  onShiftClick,
}) => {
  // Calculate week end
  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }, [weekStart]);

  // Group shifts by day
  const shiftsByDay = useMemo(() => {
    const grouped: Record<string, Shift[]> = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayKey = day.toISOString().split('T')[0];
      grouped[dayKey] = [];
    }

    shifts.forEach((shift) => {
      const shiftDate = new Date(shift.start_time);
      const dayKey = shiftDate.toISOString().split('T')[0];
      if (grouped[dayKey]) {
        grouped[dayKey].push(shift);
      }
    });

    // Sort shifts within each day by start time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });

    return grouped;
  }, [shifts, weekStart]);

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    onWeekChange(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    onWeekChange(newWeekStart);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatWeekRange = () => {
    const start = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = weekEnd.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} - ${end}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <h2 className="text-xl font-semibold">{formatWeekRange()}</h2>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, index) => {
          const day = new Date(weekStart);
          day.setDate(day.getDate() + index);
          const dayKey = day.toISOString().split('T')[0];
          const dayShifts = shiftsByDay[dayKey] || [];
          const today = isToday(day);

          return (
            <Card
              key={dayKey}
              className={`p-3 min-h-[200px] ${today ? 'ring-2 ring-blue-500' : ''}`}
            >
              {/* Day Header */}
              <div className="mb-3 pb-2 border-b">
                <div className="text-xs text-gray-500 font-medium">
                  {DAYS_OF_WEEK[index]}
                </div>
                <div className={`text-lg font-semibold ${today ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Shifts for the day */}
              <div className="space-y-2">
                {dayShifts.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-4">
                    No shifts
                  </div>
                ) : (
                  dayShifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => onShiftClick?.(shift)}
                      className={`w-full text-left p-2 rounded-md text-xs ${
                        POSITION_COLORS[shift.position]
                      } text-white hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">
                          {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                        </span>
                      </div>
                      <div className="truncate">
                        {shift.position.replace(/_/g, ' ')}
                      </div>
                      {shift.notes && (
                        <div className="text-xs opacity-90 truncate mt-1">
                          {shift.notes}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <div className="text-sm font-medium text-gray-700">Positions:</div>
        {Object.entries(POSITION_COLORS).map(([position, color]) => (
          <div key={position} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`} />
            <span className="text-sm text-gray-600">
              {position.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
