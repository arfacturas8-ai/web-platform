import React, { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, LinearProgress, Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  target_segment: string;
  start_date: string;
  end_date: string;
  budget: number;
  recipients_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  conversion_count: number;
  revenue_generated: number;
  created_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_type: 'email',
    target_segment: 'all',
    email_template_id: '',
    sms_message: '',
    start_date: '',
    end_date: '',
    budget: '',
    goal_opens: '',
    goal_clicks: '',
    goal_conversions: '',
    goal_revenue: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/v1/marketing/campaigns', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCampaigns(response.data.campaigns);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch campaigns');
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

  const handleCreateCampaign = async () => {
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        goal_opens: formData.goal_opens ? parseInt(formData.goal_opens) : null,
        goal_clicks: formData.goal_clicks ? parseInt(formData.goal_clicks) : null,
        goal_conversions: formData.goal_conversions ? parseInt(formData.goal_conversions) : null,
        goal_revenue: formData.goal_revenue ? parseFloat(formData.goal_revenue) : null,
        email_template_id: formData.email_template_id || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      await axios.post('/api/v1/marketing/campaigns', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Campaign created successfully');
      setOpenDialog(false);
      fetchCampaigns();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create campaign');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      await axios.post(`/api/v1/marketing/campaigns/${campaignId}/send`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Campaign sent successfully');
      fetchCampaigns();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send campaign');
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await axios.post(`/api/v1/marketing/campaigns/${campaignId}/pause`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Campaign paused');
      fetchCampaigns();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to pause campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await axios.delete(`/api/v1/marketing/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Campaign deleted');
      fetchCampaigns();
    } catch (err: any) {
      setError('Failed to delete campaign');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      campaign_type: 'email',
      target_segment: 'all',
      email_template_id: '',
      sms_message: '',
      start_date: '',
      end_date: '',
      budget: '',
      goal_opens: '',
      goal_clicks: '',
      goal_conversions: '',
      goal_revenue: ''
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      draft: 'default',
      scheduled: 'info',
      running: 'success',
      paused: 'warning',
      completed: 'primary',
      cancelled: 'error'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  const getCampaignTypeIcon = (type: string) => {
    if (type === 'email') return <EmailIcon />;
    if (type === 'sms') return <SmsIcon />;
    return <EmailIcon />;
  };

  const calculateOpenRate = (campaign: Campaign): string => {
    if (campaign.sent_count === 0) return '0';
    return ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: Campaign): string => {
    if (campaign.sent_count === 0) return '0';
    return ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading campaigns...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Marketing Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Campaign
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Campaigns</Typography>
              <Typography variant="h4">{campaigns.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Campaigns</Typography>
              <Typography variant="h4">
                {campaigns.filter(c => c.status === 'running').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Sent</Typography>
              <Typography variant="h4">
                {campaigns.reduce((sum, c) => sum + c.sent_count, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Avg Open Rate</Typography>
              <Typography variant="h4">
                {campaigns.length > 0
                  ? (campaigns.reduce((sum, c) => sum + parseFloat(calculateOpenRate(c)), 0) / campaigns.length).toFixed(1)
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
                  <TableCell>Campaign</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell align="right">Sent</TableCell>
                  <TableCell align="right">Opened</TableCell>
                  <TableCell align="right">Clicked</TableCell>
                  <TableCell align="right">Open Rate</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{campaign.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCampaignTypeIcon(campaign.campaign_type)}
                        {campaign.campaign_type}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.status}
                        color={getStatusColor(campaign.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={campaign.target_segment} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{campaign.sent_count.toLocaleString()}</TableCell>
                    <TableCell align="right">{campaign.opened_count.toLocaleString()}</TableCell>
                    <TableCell align="right">{campaign.clicked_count.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2">{calculateOpenRate(campaign)}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(calculateOpenRate(campaign))}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSendCampaign(campaign.id)}
                            title="Send Campaign"
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        )}
                        {campaign.status === 'running' && (
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handlePauseCampaign(campaign.id)}
                            title="Pause Campaign"
                          >
                            <PauseIcon />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          color="info"
                          href={`/admin/campaigns/${campaign.id}/analytics`}
                          title="View Analytics"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          title="Delete Campaign"
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

      {/* Create Campaign Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Campaign Name"
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
              <InputLabel>Campaign Type</InputLabel>
              <Select
                value={formData.campaign_type}
                label="Campaign Type"
                onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="mixed">Mixed (Email + SMS)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Target Segment</InputLabel>
              <Select
                value={formData.target_segment}
                label="Target Segment"
                onChange={(e) => setFormData({ ...formData, target_segment: e.target.value })}
              >
                <MenuItem value="all">All Customers</MenuItem>
                <MenuItem value="new">New Customers</MenuItem>
                <MenuItem value="loyal">Loyal Customers</MenuItem>
                <MenuItem value="high_value">High Value</MenuItem>
                <MenuItem value="at_risk">At Risk</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            {(formData.campaign_type === 'email' || formData.campaign_type === 'mixed') && (
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
            {(formData.campaign_type === 'sms' || formData.campaign_type === 'mixed') && (
              <TextField
                label="SMS Message"
                fullWidth
                multiline
                rows={3}
                value={formData.sms_message}
                onChange={(e) => setFormData({ ...formData, sms_message: e.target.value })}
                helperText="Use {{ first_name }} for personalization"
              />
            )}
            <Grid container spacing={2}>
              <Grid xs={6}>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </Grid>
              <Grid xs={6}>
                <TextField
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <TextField
                  label="Budget"
                  type="number"
                  fullWidth
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </Grid>
              <Grid xs={6}>
                <TextField
                  label="Goal Revenue"
                  type="number"
                  fullWidth
                  value={formData.goal_revenue}
                  onChange={(e) => setFormData({ ...formData, goal_revenue: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateCampaign} variant="contained">
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Campaigns;
