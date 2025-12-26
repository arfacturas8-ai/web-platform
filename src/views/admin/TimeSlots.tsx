import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { TimeSlotDialog } from '@/components/dialogs/TimeSlotDialog';
import { useToast } from '@/components/ui/toast';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { useTimeSlots, useCreateTimeSlot, useUpdateTimeSlot, useDeleteTimeSlot } from '@/hooks/useTimeSlots';
import type { TimeSlot, CreateTimeSlotDto } from '@/types/reservation';

export const TimeSlots = () => {
  const { toast } = useToast();
  const { data: timeSlots, isLoading, error, refetch } = useTimeSlots();
  const createTimeSlot = useCreateTimeSlot();
  const updateTimeSlot = useUpdateTimeSlot();
  const deleteTimeSlot = useDeleteTimeSlot();

  const [timeSlotDialog, setTimeSlotDialog] = useState<{
    open: boolean;
    timeSlot?: TimeSlot;
  }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const handleSave = async (data: CreateTimeSlotDto) => {
    try {
      if (timeSlotDialog.timeSlot) {
        await updateTimeSlot.mutateAsync({
          id: timeSlotDialog.timeSlot.id,
          data,
        });
        toast({
          title: 'Success',
          description: 'Time slot updated successfully',
        });
      } else {
        await createTimeSlot.mutateAsync(data);
        toast({
          title: 'Success',
          description: 'Time slot created successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save time slot',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await deleteTimeSlot.mutateAsync(deleteDialog.id);
      toast({
        title: 'Success',
        description: 'Time slot deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete time slot',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading time slots..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load time slots"
        onRetry={() => refetch()}
      />
    );
  }

  const columns: Column<TimeSlot>[] = [
    {
      key: 'start_time',
      header: 'Start Time',
      sortable: true,
    },
    {
      key: 'end_time',
      header: 'End Time',
      sortable: true,
    },
    {
      key: 'max_reservations',
      header: 'Max Reservations',
      sortable: true,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (slot) => (
        <Badge variant={slot.is_active ? 'success' : 'outline'}>
          {slot.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (slot) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setTimeSlotDialog({ open: true, timeSlot: slot });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, id: slot.id });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Slots</h1>
          <p className="text-muted-foreground">
            Manage available reservation time slots
          </p>
        </div>
        <Button onClick={() => setTimeSlotDialog({ open: true })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSlots?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeSlots?.filter(s => s.is_active).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots && timeSlots.length > 0 ? (
            <DataTable
              data={timeSlots}
              columns={columns}
              searchable
              searchPlaceholder="Search time slots..."
            />
          ) : (
            <EmptyState
              icon={Clock}
              title="No time slots"
              description="Create your first time slot to get started"
              action={{
                label: 'Add Time Slot',
                onClick: () => setTimeSlotDialog({ open: true }),
              }}
            />
          )}
        </CardContent>
      </Card>

      <TimeSlotDialog
        open={timeSlotDialog.open}
        onOpenChange={(open) => setTimeSlotDialog({ open })}
        timeSlot={timeSlotDialog.timeSlot}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete time slot"
        description="Are you sure? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TimeSlots;
