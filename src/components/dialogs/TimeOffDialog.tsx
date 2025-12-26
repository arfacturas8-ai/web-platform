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
import { TimeOffRequest, TimeOffRequestCreate, Employee } from '@/services/staffService';
import { Loader2 } from 'lucide-react';

interface TimeOffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TimeOffRequestCreate) => Promise<void>;
  timeOffRequest?: TimeOffRequest | null;
  employees: Employee[];
  currentEmployeeId?: string; // If logged in as employee, pre-select
}

export const TimeOffDialog: React.FC<TimeOffDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  timeOffRequest,
  employees,
  currentEmployeeId,
}) => {
  const [formData, setFormData] = useState<TimeOffRequestCreate>({
    employee_id: currentEmployeeId || '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timeOffRequest) {
      setFormData({
        employee_id: timeOffRequest.employee_id,
        start_date: timeOffRequest.start_date,
        end_date: timeOffRequest.end_date,
        reason: timeOffRequest.reason || '',
      });
    } else {
      setFormData({
        employee_id: currentEmployeeId || '',
        start_date: '',
        end_date: '',
        reason: '',
      });
    }
    setErrors({});
  }, [timeOffRequest, currentEmployeeId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = 'End date must be on or after start date';
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
      logger.error('Error saving time off request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof TimeOffRequestCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const calculateDays = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {timeOffRequest ? 'Edit Time Off Request' : 'Request Time Off'}
            </DialogTitle>
            <DialogDescription>
              {timeOffRequest
                ? 'Update your time off request details.'
                : 'Fill in the details to request time off.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Employee Select (if multiple employees) */}
            {!currentEmployeeId && employees.length > 0 && (
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
                        {employee.employee_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee_id && (
                  <span className="text-sm text-red-500">{errors.employee_id}</span>
                )}
              </div>
            )}

            {/* Start Date */}
            <div className="grid gap-2">
              <Label htmlFor="start_date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
              />
              {errors.start_date && (
                <span className="text-sm text-red-500">{errors.start_date}</span>
              )}
            </div>

            {/* End Date */}
            <div className="grid gap-2">
              <Label htmlFor="end_date">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
              />
              {errors.end_date && (
                <span className="text-sm text-red-500">{errors.end_date}</span>
              )}
            </div>

            {/* Duration Display */}
            {formData.start_date && formData.end_date && (
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
                Duration: <span className="font-semibold">{calculateDays()} day(s)</span>
              </div>
            )}

            {/* Reason */}
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Reason for time off (optional)..."
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
              {timeOffRequest ? 'Update' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
