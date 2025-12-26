import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Alert, Switch, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import axios from 'axios';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  action_type: string;
  is_active: boolean;
  triggered_count: number;
  executed_count: number;
  success_count: number;
  failure_count: number;
  delay_minutes: number;
  created_at: string;
  last_triggered_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
}

const Automation: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'new_customer',
    action_type: 'send_email',
    delay_minutes: 0,
    email_template_id: '',
    sms_message: '',
    action_config: {},
    is_active: true
  });

  useEffect(() => {
    fetchRules();
    fetchTemplates();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get('/api/v1/marketing/automation', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRules(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch automation rules');
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/v1/marketing/templates', {
        params: { is_active: true },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(response.data);
    } catch (err) {
      logger.error('Failed to fetch templates:', err);
    }
  };

  const handleCreateRule = async () => {
    try {
      const payload = {
        ...formData,
        action_config: formData.action_type === 'send_email'
          ? { email_template_id: formData.email_template_id }
          : formData.action_type === 'send_sms'
          ? { message: formData.sms_message }
          : {},
        email_template_id: formData.action_type === 'send_email' ? formData.email_template_id : null
      };

      const endpoint = selectedRule
        ? `/api/v1/marketing/automation/${selectedRule.id}`
        : '/api/v1/marketing/automation';

      const method = selectedRule ? 'put' : 'post';

      await axios[method](endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(selectedRule ? 'Rule updated successfully' : 'Rule created successfully');
      setOpenDialog(false);
      setSelectedRule(null);
      fetchRules();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save rule');
    }
  };

  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      trigger_type: rule.trigger_type,
      action_type: rule.action_type,
      delay_minutes: rule.delay_minutes,
      email_template_id: '',
      sms_message: '',
      action_config: {},
      is_active: rule.is_active
    });
    setOpenDialog(true);
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      await axios.post(`/api/v1/marketing/automation/${ruleId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Rule status updated');
      fetchRules();
    } catch (err: any) {
      setError('Failed to toggle rule');
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) return;

    try {
      await axios.delete(`/api/v1/marketing/automation/${ruleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Rule deleted');
      fetchRules();
    } catch (err: any) {
      setError('Failed to delete rule');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_type: 'new_customer',
      action_type: 'send_email',
      delay_minutes: 0,
      email_template_id: '',
      sms_message: '',
      action_config: {},
      is_active: true
    });
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      new_customer: 'New Customer',
      birthday: 'Customer Birthday',
      anniversary: 'Anniversary',
      abandoned_cart: 'Abandoned Cart',
      order_placed: 'Order Placed',
      no_visit_30_days: 'No Visit 30 Days',
      no_visit_60_days: 'No Visit 60 Days',
      high_value_customer: 'High Value Customer',
      reservation_reminder: 'Reservation Reminder',
      post_visit: 'Post Visit',
      segment_entry: 'Segment Entry'
    };
    return labels[trigger] || trigger;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      send_email: 'Send Email',
      send_sms: 'Send SMS',
      add_tag: 'Add Tag',
      update_segment: 'Update Segment',
      send_push: 'Send Push Notification',
      webhook: 'Webhook'
    };
    return labels[action] || action;
  };

  const calculateSuccessRate = (rule: AutomationRule): string => {
    if (rule.executed_count === 0) return '0';
    return ((rule.success_count / rule.executed_count) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading automation rules...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Marketing Automation</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedRule(null);
            resetForm();
            setOpenDialog(true);
          }}
        >
          Create Rule
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Rules</Typography>
              <Typography variant="h4">{rules.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Rules</Typography>
              <Typography variant="h4">
                {rules.filter(r => r.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Triggered</Typography>
              <Typography variant="h4">
                {rules.reduce((sum, r) => sum + r.triggered_count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Success Rate</Typography>
              <Typography variant="h4">
                {rules.length > 0
                  ? (rules.reduce((sum, r) => sum + parseFloat(calculateSuccessRate(r)), 0) / rules.length).toFixed(1)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Delay</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Triggered</TableCell>
                  <TableCell align="right">Executed</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{rule.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {rule.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTriggerLabel(rule.trigger_type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getActionLabel(rule.action_type)}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {rule.delay_minutes > 0 ? `${rule.delay_minutes} min` : 'Immediate'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.is_active ? 'Active' : 'Inactive'}
                        color={rule.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{rule.triggered_count}</TableCell>
                    <TableCell align="right">{rule.executed_count}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={parseFloat(calculateSuccessRate(rule)) > 80 ? 'success.main' : 'warning.main'}
                      >
                        {calculateSuccessRate(rule)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color={rule.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleRule(rule.id)}
                          title={rule.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {rule.is_active ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditRule(rule)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRule(rule.id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Rule Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Rule Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Trigger Event</InputLabel>
              <Select
                value={formData.trigger_type}
                label="Trigger Event"
                onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
              >
                <MenuItem value="new_customer">New Customer Registration</MenuItem>
                <MenuItem value="birthday">Customer Birthday</MenuItem>
                <MenuItem value="anniversary">Anniversary</MenuItem>
                <MenuItem value="abandoned_cart">Abandoned Cart</MenuItem>
                <MenuItem value="order_placed">Order Placed</MenuItem>
                <MenuItem value="no_visit_30_days">No Visit in 30 Days</MenuItem>
                <MenuItem value="no_visit_60_days">No Visit in 60 Days</MenuItem>
                <MenuItem value="high_value_customer">High Value Customer</MenuItem>
                <MenuItem value="reservation_reminder">Reservation Reminder</MenuItem>
                <MenuItem value="post_visit">Post Visit Follow-up</MenuItem>
                <MenuItem value="segment_entry">Customer Enters Segment</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Delay (minutes)"
              type="number"
              fullWidth
              value={formData.delay_minutes}
              onChange={(e) => setFormData({ ...formData, delay_minutes: parseInt(e.target.value) || 0 })}
              helperText="Delay before executing the action (0 = immediate)"
            />
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={formData.action_type}
                label="Action"
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
              >
                <MenuItem value="send_email">Send Email</MenuItem>
                <MenuItem value="send_sms">Send SMS</MenuItem>
                <MenuItem value="add_tag">Add Tag</MenuItem>
                <MenuItem value="update_segment">Update Segment</MenuItem>
                <MenuItem value="send_push">Send Push Notification</MenuItem>
                <MenuItem value="webhook">Trigger Webhook</MenuItem>
              </Select>
            </FormControl>
            {formData.action_type === 'send_email' && (
              <FormControl fullWidth>
                <InputLabel>Email Template</InputLabel>
                <Select
                  value={formData.email_template_id}
                  label="Email Template"
                  onChange={(e) => setFormData({ ...formData, email_template_id: e.target.value })}
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {formData.action_type === 'send_sms' && (
              <TextField
                label="SMS Message"
                fullWidth
                multiline
                rows={3}
                value={formData.sms_message}
                onChange={(e) => setFormData({ ...formData, sms_message: e.target.value })}
                helperText="Use {{ first_name }} for personalization. Max 160 characters."
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label="Active (rule will execute automatically)"
            />
            <Alert severity="info">
              This automation rule will trigger {formData.delay_minutes > 0 ? `${formData.delay_minutes} minutes after` : 'immediately when'}
              {' '}{getTriggerLabel(formData.trigger_type).toLowerCase()} occurs.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRule} variant="contained">
            {selectedRule ? 'Update' : 'Create'} Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Automation;
