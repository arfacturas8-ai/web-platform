import React, { useState, useEffect } from 'react';
import staffService, { AttendanceStatus } from '@/services/staffService';
import type { Attendance as AttendanceType, Shift } from '@/services/staffService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-800',
  [AttendanceStatus.LATE]: 'bg-yellow-100 text-yellow-800',
  [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
  [AttendanceStatus.EARLY_LEAVE]: 'bg-orange-100 text-orange-800',
};

const STATUS_ICONS: Record<AttendanceStatus, React.ReactNode> = {
  [AttendanceStatus.PRESENT]: <CheckCircle className="h-4 w-4 text-green-600" />,
  [AttendanceStatus.LATE]: <AlertCircle className="h-4 w-4 text-yellow-600" />,
  [AttendanceStatus.ABSENT]: <XCircle className="h-4 w-4 text-red-600" />,
  [AttendanceStatus.EARLY_LEAVE]: <Clock className="h-4 w-4 text-orange-600" />,
};

export const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceType[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [records, shifts] = await Promise.all([
        staffService.getAttendanceRecords({
          start_date: startDate,
          end_date: endDate,
        }),
        staffService.getShifts({
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        }),
      ]);

      setAttendanceRecords(records);
      setUpcomingShifts(shifts);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load attendance data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async (shiftId: string) => {
    try {
      await staffService.clockIn(shiftId);
      toast({
        title: 'Success',
        description: 'Clocked in successfully.',
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to clock in',
        variant: 'destructive',
      });
    }
  };

  const handleClockOut = async (shiftId: string) => {
    try {
      await staffService.clockOut(shiftId);
      toast({
        title: 'Success',
        description: 'Clocked out successfully.',
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to clock out',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateHoursWorked = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return 'N/A';
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  const columns = [
    {
      key: 'employee_id',
      header: 'Employee ID',
      accessorKey: 'employee_id',
      cell: (row: AttendanceType) => row.employee_id.slice(0, 8),
    },
    {
      key: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: (row: AttendanceType) => (
        <div className="flex items-center gap-2">
          {STATUS_ICONS[row.status]}
          <Badge className={STATUS_COLORS[row.status]}>
            {row.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      ),
    },
    {
      key: 'clock_in',
      header: 'Clock In',
      accessorKey: 'clock_in',
      cell: (row: AttendanceType) => formatTime(row.clock_in),
    },
    {
      key: 'clock_out',
      header: 'Clock Out',
      accessorKey: 'clock_out',
      cell: (row: AttendanceType) => formatTime(row.clock_out),
    },
    {
      key: 'hours',
      header: 'Hours Worked',
      accessorKey: 'hours',
      cell: (row: AttendanceType) => calculateHoursWorked(row.clock_in, row.clock_out),
    },
    {
      key: 'notes',
      header: 'Notes',
      accessorKey: 'notes',
      cell: (row: AttendanceType) => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {row.notes || '-'}
        </span>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === AttendanceStatus.PRESENT).length,
    late: attendanceRecords.filter((r) => r.status === AttendanceStatus.LATE).length,
    absent: attendanceRecords.filter((r) => r.status === AttendanceStatus.ABSENT).length,
    earlyLeave: attendanceRecords.filter((r) => r.status === AttendanceStatus.EARLY_LEAVE).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
        <p className="text-muted-foreground">
          Track employee clock-ins, clock-outs, and attendance records
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Early Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.earlyLeave}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingShifts.slice(0, 5).map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <div className="font-medium">
                      Employee: {shift.employee_id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(shift.start_time)} - {formatTime(shift.end_time)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleClockIn(shift.id)}
                      disabled={shift.status !== 'SCHEDULED'}
                    >
                      Clock In
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClockOut(shift.id)}
                      disabled={shift.status !== 'IN_PROGRESS'}
                    >
                      Clock Out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
                <p className="mt-4 text-gray-600">Loading attendance records...</p>
              </div>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No attendance records found for this date range</p>
            </div>
          ) : (
            <DataTable columns={columns} data={attendanceRecords} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
