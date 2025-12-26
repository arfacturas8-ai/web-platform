import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Switch,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as ChartIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface Survey {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  trigger_type: string;
  sent_count: number;
  response_count: number;
  completion_rate: number;
  created_at: string;
}

const Surveys: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    name: '',
    description: '',
    trigger_type: 'manual',
    questions: [],
  });
  const queryClient = useQueryClient();

  const { data: surveys, isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const response = await api.get('/feedback/surveys');
      return response.data.surveys;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (survey: any) => {
      return api.post('/feedback/surveys', survey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setCreateDialogOpen(false);
      setNewSurvey({ name: '', description: '', trigger_type: 'manual', questions: [] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      return api.put(`/feedback/surveys/${id}`, { is_active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const handleCreate = () => {
    createMutation.mutate(newSurvey);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ id, is_active: !currentStatus });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Survey Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Survey
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load surveys</Alert>
        ) : surveys?.length === 0 ? (
          <Alert severity="info">
            No surveys found. Create your first survey to start collecting customer feedback.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Trigger Type</TableCell>
                  <TableCell align="center">Sent</TableCell>
                  <TableCell align="center">Responses</TableCell>
                  <TableCell align="center">Completion Rate</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys?.map((survey: Survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {survey.name}
                      </Typography>
                      {survey.description && (
                        <Typography variant="caption" color="text.secondary">
                          {survey.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={survey.trigger_type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">{survey.sent_count}</TableCell>
                    <TableCell align="center">{survey.response_count}</TableCell>
                    <TableCell align="center">
                      {survey.completion_rate.toFixed(1)}%
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={survey.is_active}
                        onChange={() => handleToggleActive(survey.id, survey.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <ChartIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Survey</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="Survey Name"
              fullWidth
              value={newSurvey.name}
              onChange={(e) => setNewSurvey({ ...newSurvey, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newSurvey.description}
              onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Trigger Type</InputLabel>
              <Select
                value={newSurvey.trigger_type}
                label="Trigger Type"
                onChange={(e) =>
                  setNewSurvey({ ...newSurvey, trigger_type: e.target.value })
                }
              >
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="order_completion">After Order Completion</MenuItem>
                <MenuItem value="reservation_completion">
                  After Reservation Completion
                </MenuItem>
                <MenuItem value="periodic">Periodic</MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info">
              Note: Add questions after creating the survey using the survey builder.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!newSurvey.name}
          >
            Create Survey
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Surveys;
