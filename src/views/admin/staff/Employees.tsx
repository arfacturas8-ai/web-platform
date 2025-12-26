import React, { useState, useEffect } from 'react';
import staffService from '@/services/staffService';
import type { Employee } from '@/services/staffService';
import { EmployeeCard } from '@/components/staff/EmployeeCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployeeList();
  }, [employees, searchTerm, filterPosition, filterStatus]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await staffService.getEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load employees',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEmployeeList = () => {
    let filtered = [...employees];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by position
    if (filterPosition !== 'all') {
      filtered = filtered.filter((emp) => emp.position === filterPosition);
    }

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter((emp) => emp.is_active);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((emp) => !emp.is_active);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await staffService.deleteEmployee(employeeToDelete.id);
      toast({
        title: 'Success',
        description: `Employee "${employeeToDelete.employee_number}" has been deactivated.`,
      });
      await loadEmployees();
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee records and information
          </p>
        </div>
        <Button onClick={() => toast({ title: 'Coming Soon', description: 'Employee creation form' })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by employee number or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterPosition} onValueChange={setFilterPosition}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="BAKER">Café 1973</SelectItem>
            <SelectItem value="CASHIER">Cashier</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="ASSISTANT_MANAGER">Assistant Manager</SelectItem>
            <SelectItem value="DELIVERY_DRIVER">Delivery Driver</SelectItem>
            <SelectItem value="BARISTA">Barista</SelectItem>
            <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
            <SelectItem value="CLEANER">Cleaner</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filterPosition !== 'all' || filterStatus !== 'all'
              ? 'No employees match your filters'
              : 'No employees found. Add your first employee to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={() => toast({ title: 'Coming Soon', description: 'Edit employee form' })}
              onDelete={handleDelete}
              onViewSchedule={() => toast({ title: 'Coming Soon', description: 'View schedule' })}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={() => setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate employee "{employeeToDelete?.employee_number}". This action can be
              reversed by reactivating the employee later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
