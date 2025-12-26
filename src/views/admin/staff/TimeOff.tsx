import React, { useState, useEffect } from 'react';
import staffService, { TimeOffStatus } from '@/services/staffService';
import type {
  TimeOffRequest,
  TimeOffRequestCreate,
  TimeOffApproval,
  Employee,
} from '@/services/staffService';
import { TimeOffDialog } from '@/components/dialogs/TimeOffDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Check, X, Calendar, Filter } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const STATUS_COLORS: Record<TimeOffStatus, string> = {
  [TimeOffStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TimeOffStatus.APPROVED]: 'bg-green-100 text-green-800',
  [TimeOffStatus.REJECTED]: 'bg-red-100 text-red-800',
  [TimeOffStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

export const TimeOff: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [requestToApprove, setRequestToApprove] = useState<TimeOffRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const params: any = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const [requestsData, employeesData] = await Promise.all([
        staffService.getTimeOffRequests(params),
        staffService.getEmployees({ is_active: true }),
      ]);

      setTimeOffRequests(requestsData);
      setEmployees(employeesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load time off requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = () => {
    setSelectedRequest(null);
    setIsDialogOpen(true);
  };

  const handleSaveRequest = async (data: TimeOffRequestCreate) => {
    try {
      if (selectedRequest) {
        await staffService.updateTimeOffRequest(selectedRequest.id, data);
        toast({
          title: 'Success',
          description: 'Time off request updated successfully.',
        });
      } else {
        await staffService.createTimeOffRequest(data);
        toast({
          title: 'Success',
          description: 'Time off request created successfully.',
        });
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save time off request',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleApproveClick = (request: TimeOffRequest, action: 'approve' | 'reject') => {
    setRequestToApprove(request);
    setApprovalAction(action);
    setRejectionReason('');
  };

  const confirmApproval = async () => {
    if (!requestToApprove) return;

    try {
      const approvalData: TimeOffApproval = {
        status: approvalAction === 'approve' ? TimeOffStatus.APPROVED : TimeOffStatus.REJECTED,
        rejection_reason: approvalAction === 'reject' ? rejectionReason : undefined,
      };

      await staffService.approveTimeOff(requestToApprove.id, approvalData);

      toast({
        title: 'Success',
        description: `Time off request ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      setRequestToApprove(null);
      setRejectionReason('');
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to process request',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Off Requests</h1>
          <p className="text-muted-foreground">
            Manage employee time off requests and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateRequest}>
            <Plus className="mr-2 h-4 w-4" />
            Request Time Off
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value={TimeOffStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={TimeOffStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={TimeOffStatus.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-gray-600">Loading time off requests...</p>
          </div>
        </div>
      ) : timeOffRequests.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filterStatus !== 'all'
              ? 'No time off requests match your filter'
              : 'No time off requests found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {timeOffRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      Employee ID: {request.employee_id.slice(0, 8)}
                    </CardTitle>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className={STATUS_COLORS[request.status]}>
                        {request.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ({calculateDays(request.start_date, request.end_date)} days)
                      </span>
                    </div>
                  </div>
                  {request.status === TimeOffStatus.PENDING && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveClick(request, 'approve')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveClick(request, 'reject')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              {request.reason && (
                <CardContent>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Reason: </span>
                    <span className="text-gray-600">{request.reason}</span>
                  </div>
                  {request.rejection_reason && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-red-700">Rejection Reason: </span>
                      <span className="text-red-600">{request.rejection_reason}</span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Time Off Dialog */}
      <TimeOffDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRequest(null);
        }}
        onSave={handleSaveRequest}
        timeOffRequest={selectedRequest}
        employees={employees}
      />

      {/* Approval Dialog */}
      <AlertDialog
        open={!!requestToApprove}
        onOpenChange={() => {
          setRequestToApprove(null);
          setRejectionReason('');
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {approvalAction === 'approve' ? 'Approve' : 'Reject'} Time Off Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              {approvalAction === 'approve'
                ? 'Are you sure you want to approve this time off request?'
                : 'Please provide a reason for rejecting this request.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {approvalAction === 'reject' && (
            <div className="grid gap-2 py-4">
              <Label htmlFor="rejection_reason">Rejection Reason *</Label>
              <Textarea
                id="rejection_reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={3}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApproval}
              disabled={approvalAction === 'reject' && !rejectionReason}
              className={approvalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
