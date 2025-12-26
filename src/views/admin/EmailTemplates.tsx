import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Alert, Tabs, Tab, Switch, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Preview as PreviewIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import axios from 'axios';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  preview_text: string;
  category: string;
  is_active: boolean;
  times_used: number;
  avg_open_rate: number;
  avg_click_rate: number;
  created_at: string;
}

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [openPreview, setOpenPreview] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    html_content: '',
    text_content: '',
    variables: ['first_name', 'last_name', 'email'],
    preview_text: '',
    category: 'promotional',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/v1/marketing/templates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch templates');
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const endpoint = selectedTemplate
        ? `/api/v1/marketing/templates/${selectedTemplate.id}`
        : '/api/v1/marketing/templates';

      const method = selectedTemplate ? 'put' : 'post';

      await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(selectedTemplate ? 'Template updated successfully' : 'Template created successfully');
      setOpenDialog(false);
      setSelectedTemplate(null);
      fetchTemplates();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save template');
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content || '',
      variables: template.variables || ['first_name', 'last_name', 'email'],
      preview_text: template.preview_text || '',
      category: template.category || 'promotional',
      is_active: template.is_active
    });
    setOpenDialog(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await axios.delete(`/api/v1/marketing/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Template deleted');
      fetchTemplates();
    } catch (err: any) {
      setError('Failed to delete template');
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewHtml(template.html_content);
    setOpenPreview(true);
  };

  const handleSendTest = async (templateId: string) => {
    setSelectedTemplate(templates.find(t => t.id === templateId) || null);
    setOpenTestDialog(true);
  };

  const handleSendTestEmail = async () => {
    if (!selectedTemplate) return;

    try {
      await axios.post('/api/v1/marketing/templates/test', {
        template_id: selectedTemplate.id,
        recipient_email: testEmail,
        test_variables: {
          first_name: 'Test',
          last_name: 'User',
          email: testEmail
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess('Test email sent successfully');
      setOpenTestDialog(false);
      setTestEmail('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send test email');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subject: '',
      html_content: '',
      text_content: '',
      variables: ['first_name', 'last_name', 'email'],
      preview_text: '',
      category: 'promotional',
      is_active: true
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      promotional: 'success',
      transactional: 'info',
      welcome: 'primary',
      notification: 'warning'
    };
    return colors[category] || 'default';
  };

  const defaultHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{ subject }}</h1>
    </div>
    <div class="content">
      <p>Hello {{ first_name }},</p>
      <p>Your email content goes here...</p>
      <p style="text-align: center;">
        <a href="#" class="button">Call to Action</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Restaurant. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading templates...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Email Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTemplate(null);
            setFormData({
              ...formData,
              html_content: defaultHtmlTemplate
            });
            setOpenDialog(true);
          }}
        >
          Create Template
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Templates</Typography>
              <Typography variant="h4">{templates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Templates</Typography>
              <Typography variant="h4">
                {templates.filter(t => t.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Avg Open Rate</Typography>
              <Typography variant="h4">
                {templates.length > 0
                  ? (templates.reduce((sum, t) => sum + (t.avg_open_rate || 0), 0) / templates.length).toFixed(1)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Usage</Typography>
              <Typography variant="h4">
                {templates.reduce((sum, t) => sum + t.times_used, 0)}
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
                  <TableCell>Template Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Times Used</TableCell>
                  <TableCell align="right">Open Rate</TableCell>
                  <TableCell align="right">Click Rate</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{template.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {template.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.category}
                        color={getCategoryColor(template.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {template.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.is_active ? 'Active' : 'Inactive'}
                        color={template.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{template.times_used}</TableCell>
                    <TableCell align="right">
                      {template.avg_open_rate ? `${template.avg_open_rate}%` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {template.avg_click_rate ? `${template.avg_click_rate}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handlePreviewTemplate(template)}
                          title="Preview"
                        >
                          <PreviewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditTemplate(template)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleSendTest(template.id)}
                          title="Send Test"
                        >
                          <SendIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteTemplate(template.id)}
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

      {/* Create/Edit Template Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="HTML Content" />
            <Tab label="Settings" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Template Name"
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
              <TextField
                label="Email Subject"
                fullWidth
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                helperText="Use {{ first_name }} for personalization"
              />
              <TextField
                label="Preview Text"
                fullWidth
                value={formData.preview_text}
                onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                helperText="Text shown in inbox preview"
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="promotional">Promotional</MenuItem>
                  <MenuItem value="transactional">Transactional</MenuItem>
                  <MenuItem value="welcome">Welcome</MenuItem>
                  <MenuItem value="notification">Notification</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="HTML Content"
                fullWidth
                multiline
                rows={15}
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                helperText="Use {{ variable_name }} for dynamic content"
                sx={{ fontFamily: 'monospace' }}
              />
              <TextField
                label="Plain Text Content (Optional)"
                fullWidth
                multiline
                rows={5}
                value={formData.text_content}
                onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                helperText="Fallback for email clients that don't support HTML"
              />
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Active"
              />
              <Typography variant="subtitle2" gutterBottom>
                Available Variables
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.variables.map((variable) => (
                  <Chip key={variable} label={`{{ ${variable} }}`} size="small" />
                ))}
              </Box>
              <Alert severity="info">
                Variables are automatically replaced with customer data when sending emails.
                Common variables: first_name, last_name, email, phone, lifetime_value, total_visits
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTemplate} variant="contained">
            {selectedTemplate ? 'Update' : 'Create'} Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 2,
              backgroundColor: '#fff'
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={openTestDialog} onClose={() => setOpenTestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Test Email</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Test Email Address"
              type="email"
              fullWidth
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              helperText="Enter the email address to receive the test"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTestDialog(false)}>Cancel</Button>
          <Button onClick={handleSendTestEmail} variant="contained" disabled={!testEmail}>
            Send Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailTemplates;
