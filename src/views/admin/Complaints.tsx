import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Pagination,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as ResolvedIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import ComplaintCard from '../../components/feedback/ComplaintCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

const Complaints: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: complaintsData, isLoading, error } = useQuery({
    queryKey: ['complaints', statusFilter, priorityFilter, assignedToMe, page],
    queryFn: async () => {
      const params: any = { skip: (page - 1) * 20, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (assignedToMe) params.assigned_to_me = true;

      const response = await api.get('/feedback/complaints', { params });
      return response.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (complaintId: string) => {
      return api.post(`/feedback/complaints/${complaintId}/assign`, null, {
        params: { user_id: 'current' }, // Replace with actual current user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ complaintId, resolution }: { complaintId: string; resolution: string }) => {
      return api.post(`/feedback/complaints/${complaintId}/resolve`, null, {
        params: { resolution },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ complaintId, status }: { complaintId: string; status: string }) => {
      return api.put(`/feedback/complaints/${complaintId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  const handleAssign = (complaintId: string) => {
    assignMutation.mutate(complaintId);
  };

  const handleResolve = (complaintId: string, resolution: string) => {
    resolveMutation.mutate({ complaintId, resolution });
  };

  const handleUpdateStatus = (complaintId: string, status: string) => {
    updateStatusMutation.mutate({ complaintId, status });
  };

  // Calculate stats
  const stats = complaintsData
    ? {
        total: complaintsData.total,
        open: complaintsData.complaints.filter((c: any) => c.status === 'open').length,
        inProgress: complaintsData.complaints.filter((c: any) => c.status === 'in_progress')
          .length,
        resolved: complaintsData.complaints.filter((c: any) => c.status === 'resolved').length,
      }
    : { total: 0, open: 0, inProgress: 0, resolved: 0 };

  const totalPages = complaintsData ? Math.ceil(complaintsData.total / 20) : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Complaint Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <WarningIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Complaints
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.open}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'info.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" color="info.main">
                    ...
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ResolvedIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={assignedToMe}
                onChange={(e) => {
                  setAssignedToMe(e.target.checked);
                  setPage(1);
                }}
              />
            }
            label="Assigned to me"
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load complaints</Alert>
        ) : complaintsData?.complaints.length === 0 ? (
          <Alert severity="info">No complaints found</Alert>
        ) : (
          <>
            {complaintsData?.complaints.map((complaint: any) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onAssign={handleAssign}
                onResolve={handleResolve}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Complaints;
