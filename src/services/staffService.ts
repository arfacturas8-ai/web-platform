import api from './api';

// Type constants (using const assertions for TypeScript erasableSyntaxOnly compatibility)
export const EmployeePosition = {
  BAKER: 'BAKER',
  CASHIER: 'CASHIER',
  MANAGER: 'MANAGER',
  ASSISTANT_MANAGER: 'ASSISTANT_MANAGER',
  DELIVERY_DRIVER: 'DELIVERY_DRIVER',
  BARISTA: 'BARISTA',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  CLEANER: 'CLEANER',
} as const;
export type EmployeePosition = typeof EmployeePosition[keyof typeof EmployeePosition];

export const ShiftStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;
export type ShiftStatus = typeof ShiftStatus[keyof typeof ShiftStatus];

export const TimeOffStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;
export type TimeOffStatus = typeof TimeOffStatus[keyof typeof TimeOffStatus];

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT: 'ABSENT',
  EARLY_LEAVE: 'EARLY_LEAVE',
} as const;
export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

// Employee Interfaces
export interface Employee {
  id: string;
  user_id: string;
  branch_id?: string;
  position: EmployeePosition;
  hourly_rate: number;
  hire_date: string;
  termination_date?: string;
  is_active: boolean;
  employee_number: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreate {
  user_id: string;
  branch_id?: string;
  position: EmployeePosition;
  hourly_rate: number;
  hire_date: string;
  employee_number: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

export interface EmployeeUpdate {
  branch_id?: string;
  position?: EmployeePosition;
  hourly_rate?: number;
  termination_date?: string;
  is_active?: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

// Shift Interfaces
export interface Shift {
  id: string;
  employee_id: string;
  branch_id: string;
  start_time: string;
  end_time: string;
  position: EmployeePosition;
  status: ShiftStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftCreate {
  employee_id: string;
  branch_id: string;
  start_time: string;
  end_time: string;
  position: EmployeePosition;
  notes?: string;
}

export interface ShiftUpdate {
  employee_id?: string;
  start_time?: string;
  end_time?: string;
  position?: EmployeePosition;
  status?: ShiftStatus;
  notes?: string;
}

// Shift Template Interfaces
export interface ShiftTemplate {
  id: string;
  branch_id: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  position: EmployeePosition;
  required_staff: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftTemplateCreate {
  branch_id: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  position: EmployeePosition;
  required_staff: number;
  notes?: string;
}

export interface ShiftTemplateUpdate {
  name?: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  position?: EmployeePosition;
  required_staff?: number;
  is_active?: boolean;
  notes?: string;
}

// Time Off Interfaces
export interface TimeOffRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status: TimeOffStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeOffRequestCreate {
  employee_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface TimeOffRequestUpdate {
  start_date?: string;
  end_date?: string;
  reason?: string;
  status?: TimeOffStatus;
}

export interface TimeOffApproval {
  status: TimeOffStatus;
  rejection_reason?: string;
}

// Attendance Interfaces
export interface Attendance {
  id: string;
  employee_id: string;
  shift_id: string;
  clock_in?: string;
  clock_out?: string;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceCreate {
  employee_id: string;
  shift_id: string;
  status: AttendanceStatus;
  clock_in?: string;
  clock_out?: string;
  notes?: string;
}

export interface AttendanceUpdate {
  clock_in?: string;
  clock_out?: string;
  status?: AttendanceStatus;
  notes?: string;
}

// Analytics Interfaces
export interface HoursWorkedRequest {
  employee_id: string;
  start_date: string;
  end_date: string;
}

export interface HoursWorkedResponse {
  employee_id: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  total_hours: number;
  scheduled_hours: number;
  actual_hours: number;
  overtime_hours: number;
}

export interface LaborCostRequest {
  branch_id?: string;
  start_date: string;
  end_date: string;
}

export interface LaborCostResponse {
  start_date: string;
  end_date: string;
  branch_id?: string;
  branch_name?: string;
  employee_costs: Array<{
    employee_id: string;
    employee_name: string;
    position: EmployeePosition;
    hourly_rate: number;
    total_hours: number;
    total_cost: number;
  }>;
  total_hours: number;
  total_cost: number;
  average_hourly_rate: number;
}

const staffService = {
  // Employee endpoints
  getEmployees: async (params?: {
    skip?: number;
    limit?: number;
    branch_id?: string;
    position?: EmployeePosition;
    is_active?: boolean;
  }): Promise<Employee[]> => {
    const response = await api.get('/staff/employees', { params });
    return response.data;
  },

  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/staff/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: EmployeeCreate): Promise<Employee> => {
    const response = await api.post('/staff/employees', data);
    return response.data;
  },

  updateEmployee: async (id: string, data: EmployeeUpdate): Promise<Employee> => {
    const response = await api.put(`/staff/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/staff/employees/${id}`);
  },

  getEmployeeByUserId: async (userId: string): Promise<Employee> => {
    const response = await api.get(`/staff/employees/user/${userId}`);
    return response.data;
  },

  // Shift endpoints
  getShifts: async (params?: {
    skip?: number;
    limit?: number;
    employee_id?: string;
    branch_id?: string;
    start_date?: string;
    end_date?: string;
    status?: ShiftStatus;
  }): Promise<Shift[]> => {
    const response = await api.get('/staff/shifts', { params });
    return response.data;
  },

  getShift: async (id: string): Promise<Shift> => {
    const response = await api.get(`/staff/shifts/${id}`);
    return response.data;
  },

  createShift: async (data: ShiftCreate): Promise<Shift> => {
    const response = await api.post('/staff/shifts', data);
    return response.data;
  },

  updateShift: async (id: string, data: ShiftUpdate): Promise<Shift> => {
    const response = await api.put(`/staff/shifts/${id}`, data);
    return response.data;
  },

  deleteShift: async (id: string): Promise<void> => {
    await api.delete(`/staff/shifts/${id}`);
  },

  assignEmployeeToShift: async (shiftId: string, employeeId: string): Promise<Shift> => {
    const response = await api.post(`/staff/shifts/${shiftId}/assign/${employeeId}`);
    return response.data;
  },

  swapShifts: async (shiftId1: string, shiftId2: string): Promise<any> => {
    const response = await api.post('/staff/shifts/swap', {
      shift_id_1: shiftId1,
      shift_id_2: shiftId2,
    });
    return response.data;
  },

  // Shift Template endpoints
  getShiftTemplates: async (params?: {
    branch_id?: string;
    day_of_week?: number;
    is_active?: boolean;
  }): Promise<ShiftTemplate[]> => {
    const response = await api.get('/staff/shift-templates', { params });
    return response.data;
  },

  getShiftTemplate: async (id: string): Promise<ShiftTemplate> => {
    const response = await api.get(`/staff/shift-templates/${id}`);
    return response.data;
  },

  createShiftTemplate: async (data: ShiftTemplateCreate): Promise<ShiftTemplate> => {
    const response = await api.post('/staff/shift-templates', data);
    return response.data;
  },

  updateShiftTemplate: async (id: string, data: ShiftTemplateUpdate): Promise<ShiftTemplate> => {
    const response = await api.put(`/staff/shift-templates/${id}`, data);
    return response.data;
  },

  deleteShiftTemplate: async (id: string): Promise<void> => {
    await api.delete(`/staff/shift-templates/${id}`);
  },

  // Schedule Generation
  generateSchedule: async (data: {
    branch_id: string;
    start_date: string;
    end_date: string;
    use_templates: boolean;
  }): Promise<Shift[]> => {
    const response = await api.post('/staff/schedule/generate', data);
    return response.data;
  },

  getScheduleConflicts: async (params?: {
    branch_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<any> => {
    const response = await api.get('/staff/schedule/conflicts', { params });
    return response.data;
  },

  // Time Off endpoints
  getTimeOffRequests: async (params?: {
    employee_id?: string;
    status?: TimeOffStatus;
    start_date?: string;
    end_date?: string;
  }): Promise<TimeOffRequest[]> => {
    const response = await api.get('/staff/time-off', { params });
    return response.data;
  },

  getTimeOffRequest: async (id: string): Promise<TimeOffRequest> => {
    const response = await api.get(`/staff/time-off/${id}`);
    return response.data;
  },

  createTimeOffRequest: async (data: TimeOffRequestCreate): Promise<TimeOffRequest> => {
    const response = await api.post('/staff/time-off', data);
    return response.data;
  },

  updateTimeOffRequest: async (id: string, data: TimeOffRequestUpdate): Promise<TimeOffRequest> => {
    const response = await api.put(`/staff/time-off/${id}`, data);
    return response.data;
  },

  approveTimeOff: async (id: string, data: TimeOffApproval): Promise<TimeOffRequest> => {
    const response = await api.post(`/staff/time-off/${id}/approve`, data);
    return response.data;
  },

  deleteTimeOffRequest: async (id: string): Promise<void> => {
    await api.delete(`/staff/time-off/${id}`);
  },

  // Attendance endpoints
  getAttendanceRecords: async (params?: {
    employee_id?: string;
    shift_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Attendance[]> => {
    const response = await api.get('/staff/attendance', { params });
    return response.data;
  },

  getAttendance: async (id: string): Promise<Attendance> => {
    const response = await api.get(`/staff/attendance/${id}`);
    return response.data;
  },

  createAttendance: async (data: AttendanceCreate): Promise<Attendance> => {
    const response = await api.post('/staff/attendance', data);
    return response.data;
  },

  updateAttendance: async (id: string, data: AttendanceUpdate): Promise<Attendance> => {
    const response = await api.put(`/staff/attendance/${id}`, data);
    return response.data;
  },

  clockIn: async (shiftId: string): Promise<Attendance> => {
    const response = await api.post('/staff/attendance/clock-in', { shift_id: shiftId });
    return response.data;
  },

  clockOut: async (shiftId: string): Promise<Attendance> => {
    const response = await api.post('/staff/attendance/clock-out', { shift_id: shiftId });
    return response.data;
  },

  // Analytics endpoints
  calculateHoursWorked: async (data: HoursWorkedRequest): Promise<HoursWorkedResponse> => {
    const response = await api.post('/staff/analytics/hours-worked', data);
    return response.data;
  },

  calculateLaborCost: async (data: LaborCostRequest): Promise<LaborCostResponse> => {
    const response = await api.post('/staff/analytics/labor-cost', data);
    return response.data;
  },
};

export default staffService;
