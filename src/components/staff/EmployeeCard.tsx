import React from 'react';
import { Employee, EmployeePosition } from '@/services/staffService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onViewSchedule?: (employee: Employee) => void;
}

const POSITION_COLORS: Record<EmployeePosition, string> = {
  [EmployeePosition.BAKER]: 'bg-orange-100 text-orange-800',
  [EmployeePosition.CASHIER]: 'bg-blue-100 text-blue-800',
  [EmployeePosition.MANAGER]: 'bg-purple-100 text-purple-800',
  [EmployeePosition.ASSISTANT_MANAGER]: 'bg-indigo-100 text-indigo-800',
  [EmployeePosition.DELIVERY_DRIVER]: 'bg-green-100 text-green-800',
  [EmployeePosition.BARISTA]: 'bg-yellow-100 text-yellow-800',
  [EmployeePosition.KITCHEN_STAFF]: 'bg-red-100 text-red-800',
  [EmployeePosition.CLEANER]: 'bg-gray-100 text-gray-800',
};

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

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onViewSchedule,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${!employee.is_active ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {employee.employee_number}
              {!employee.is_active && (
                <Badge variant="outline" className="ml-2">
                  Inactive
                </Badge>
              )}
            </CardTitle>
            <Badge className={`mt-2 ${POSITION_COLORS[employee.position]}`}>
              {POSITION_LABELS[employee.position]}
            </Badge>
          </div>
          <div className="flex gap-2">
            {onViewSchedule && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewSchedule(employee)}
                title="View Schedule"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee)}
                title="Edit Employee"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(employee)}
                title="Delete Employee"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="font-medium">${employee.hourly_rate}/hr</span>
          </div>
          <div className="text-gray-600">
            Hired: {formatDate(employee.hire_date)}
          </div>
          {employee.termination_date && (
            <div className="text-red-600">
              Terminated: {formatDate(employee.termination_date)}
            </div>
          )}
          {employee.emergency_contact_name && (
            <div className="pt-2 border-t mt-2">
              <div className="text-xs text-gray-500">Emergency Contact</div>
              <div className="font-medium">{employee.emergency_contact_name}</div>
              {employee.emergency_contact_phone && (
                <div className="text-gray-600">{employee.emergency_contact_phone}</div>
              )}
            </div>
          )}
          {employee.notes && (
            <div className="pt-2 border-t mt-2">
              <div className="text-xs text-gray-500">Notes</div>
              <div className="text-gray-700 line-clamp-2">{employee.notes}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
