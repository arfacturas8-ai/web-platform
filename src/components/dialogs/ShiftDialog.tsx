import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shift, ShiftCreate, Employee, EmployeePosition, ShiftStatus } from '@/services/staffService';
import { Loader2 } from 'lucide-react';

interface ShiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ShiftCreate) => Promise<void>;
  shift?: Shift | null;
  employees: Employee[];
  branchId: string;
}

const POSITION_LABELS: Record<EmployeePosition, string> = {
  [EmployeePosition.BAKER]: 'Café 1973',
  [EmployeePosition.CASHIER]: 'Cashier',
  [EmployeePosition.MANAGER]: 'Manager',
  [EmployeePosition.ASSISTANT_MANAGER]: 'Assistant Manager',
  [EmployeePosition.DELIVERY_DRIVER]: 'Delivery Driver',
  [EmployeePosition.BARISTA]: 'Barista',
  [EmployeePosition.KITCHEN_STAFF]: 'Kitchen Staff',
  [EmployeePosition.CLEANER]: 'Cleaner',
};

export const ShiftDialog: React.FC<ShiftDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  shift,
  employees,
  branchId,
}) => {
  const [formData, setFormData] = useState<ShiftCreate>({
    employee_id: '',
    branch_id: branchId,
    start_time: '',
    end_time: '',
    position: EmployeePosition.CASHIER,
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shift) {
      setFormData({
        employee_id: shift.employee_id,
        branch_id: shift.branch_id,
        start_time: shift.start_time,
        end_time: shift.end_time,
        position: shift.position,
        notes: shift.notes || '',
      });
    } else {
      setFormData({
        employee_id: '',
        branch_id: branchId,
        start_time: '',
        end_time: '',
        position: EmployeePosition.CASHIER,
        notes: '',
      });
    }
    setErrors({});
  }, [shift, branchId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }
    if (formData.start_time && formData.end_time) {
      const start = new Date(formData.start_time);
      const end = new Date(formData.end_time);
      if (end <= start) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      logger.error('Error saving shift:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ShiftCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{shift ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
            <DialogDescription>
              {shift
                ? 'Update the shift details below.'
                : 'Fill in the details to create a new shift.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Employee Select */}
            <div className="grid gap-2">
              <Label htmlFor="employee_id">
                Employee <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => handleChange('employee_id', value)}
              >
                <SelectTrigger id="employee_id">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employee_number} - {POSITION_LABELS[employee.position]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee_id && (
                <span className="text-sm text-red-500">{errors.employee_id}</span>
              )}
            </div>

            {/* Position Select */}
            <div className="grid gap-2">
              <Label htmlFor="position">
                Position <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleChange('position', value as EmployeePosition)}
              >
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(POSITION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Time */}
            <div className="grid gap-2">
              <Label htmlFor="start_time">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time ? formData.start_time.slice(0, 16) : ''}
                onChange={(e) => handleChange('start_time', e.target.value)}
              />
              {errors.start_time && (
                <span className="text-sm text-red-500">{errors.start_time}</span>
              )}
            </div>

            {/* End Time */}
            <div className="grid gap-2">
              <Label htmlFor="end_time">
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time ? formData.end_time.slice(0, 16) : ''}
                onChange={(e) => handleChange('end_time', e.target.value)}
              />
              {errors.end_time && (
                <span className="text-sm text-red-500">{errors.end_time}</span>
              )}
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add any notes about this shift..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {shift ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
