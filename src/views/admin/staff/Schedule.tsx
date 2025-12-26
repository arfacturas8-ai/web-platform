import React, { useState, useEffect } from 'react';
import staffService from '@/services/staffService';
import type { Shift, ShiftCreate, Employee } from '@/services/staffService';
import { ShiftCalendar } from '@/components/staff/ShiftCalendar';
import { ShiftDialog } from '@/components/dialogs/ShiftDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useBranch } from '@/contexts/BranchContext';

export const Schedule: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });
  const { selectedBranch } = useBranch();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedBranch) {
      loadData();
    }
  }, [selectedBranch, weekStart]);

  const loadData = async () => {
    if (!selectedBranch) return;

    try {
      setIsLoading(true);

      // Calculate week end
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Load shifts for the week
      const shiftsData = await staffService.getShifts({
        branch_id: selectedBranch.id,
        start_date: weekStart.toISOString().split('T')[0],
        end_date: weekEnd.toISOString().split('T')[0],
      });
      setShifts(shiftsData);

      // Load employees for this branch
      const employeesData = await staffService.getEmployees({
        branch_id: selectedBranch.id,
        is_active: true,
      });
      setEmployees(employeesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load schedule data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShift = () => {
    setSelectedShift(null);
    setIsShiftDialogOpen(true);
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsShiftDialogOpen(true);
  };

  const handleSaveShift = async (data: ShiftCreate) => {
    try {
      if (selectedShift) {
        await staffService.updateShift(selectedShift.id, data);
        toast({
          title: 'Success',
          description: 'Shift updated successfully.',
        });
      } else {
        await staffService.createShift(data);
        toast({
          title: 'Success',
          description: 'Shift created successfully.',
        });
      }
      setIsShiftDialogOpen(false);
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save shift',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleGenerateSchedule = async () => {
    if (!selectedBranch) return;

    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      await staffService.generateSchedule({
        branch_id: selectedBranch.id,
        start_date: weekStart.toISOString().split('T')[0],
        end_date: weekEnd.toISOString().split('T')[0],
        use_templates: true,
      });

      toast({
        title: 'Success',
        description: 'Schedule generated successfully from templates.',
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to generate schedule',
        variant: 'destructive',
      });
    }
  };

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please select a branch to view the schedule</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Schedule</h1>
          <p className="text-muted-foreground">
            Manage employee shifts and schedules for {selectedBranch.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateSchedule}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Generate from Templates
          </Button>
          <Button onClick={handleCreateShift}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-gray-600">Loading schedule...</p>
          </div>
        </div>
      ) : (
        <ShiftCalendar
          shifts={shifts}
          weekStart={weekStart}
          onWeekChange={setWeekStart}
          onShiftClick={handleShiftClick}
        />
      )}

      {/* Shift Dialog */}
      {selectedBranch && (
        <ShiftDialog
          isOpen={isShiftDialogOpen}
          onClose={() => {
            setIsShiftDialogOpen(false);
            setSelectedShift(null);
          }}
          onSave={handleSaveShift}
          shift={selectedShift}
          employees={employees}
          branchId={selectedBranch.id}
        />
      )}
    </div>
  );
};
