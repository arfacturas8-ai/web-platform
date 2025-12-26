import React, { useState } from 'react';
import {
  Box, Tabs, Tab, TextField, Button, Typography, Chip,
  Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Code as CodeIcon, Preview as PreviewIcon } from '@mui/icons-material';

interface EmailEditorProps {
  subject: string;
  htmlContent: string;
  textContent?: string;
  onSubjectChange: (value: string) => void;
  onHtmlChange: (value: string) => void;
  onTextChange?: (value: string) => void;
  variables?: string[];
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  subject,
  htmlContent,
  textContent = '',
  onSubjectChange,
  onHtmlChange,
  onTextChange,
  variables = ['first_name', 'last_name', 'email', 'phone']
}) => {
  const [tab, setTab] = useState(0);
  const [selectedVariable, setSelectedVariable] = useState('');

  const insertVariable = () => {
    if (!selectedVariable) return;
    const variable = `{{ ${selectedVariable} }}`;
    onHtmlChange(htmlContent + variable);
    setSelectedVariable('');
  };

  const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #45a049;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Our Restaurant!</h1>
    </div>
    <div class="content">
      <p>Hello {{ first_name }},</p>
      <p>Thank you for joining us! We're excited to have you as part of our community.</p>
      <p>Your personalized content goes here...</p>
      <div style="text-align: center;">
        <a href="#" class="button">View Our Menu</a>
      </div>
      <p>Best regards,<br>The Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Restaurant. All rights reserved.</p>
      <p>
        <a href="#">View in browser</a> |
        <a href="#">Unsubscribe</a> |
        <a href="#">Update preferences</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  return (
    <Box>
      <TextField
        label="Email Subject"
        fullWidth
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        helperText="Use {{ variable_name }} for personalization"
        sx={{ mb: 2 }}
      />

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab icon={<CodeIcon />} label="HTML Code" />
        <Tab icon={<PreviewIcon />} label="Preview" />
        {onTextChange && <Tab label="Plain Text" />}
      </Tabs>

      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Insert Variable</InputLabel>
              <Select
                value={selectedVariable}
                label="Insert Variable"
                onChange={(e) => setSelectedVariable(e.target.value)}
              >
                {variables.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={insertVariable}
              disabled={!selectedVariable}
            >
              Insert
            </Button>
            <Button
              variant="outlined"
              onClick={() => onHtmlChange(defaultTemplate)}
            >
              Load Template
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Available variables: {variables.map(v => `{{ ${v} }}`).join(', ')}
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={20}
            value={htmlContent}
            onChange={(e) => onHtmlChange(e.target.value)}
            placeholder="Enter HTML content..."
            sx={{ fontFamily: 'monospace', fontSize: '13px' }}
          />
        </Box>
      )}

      {tab === 1 && (
        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 1,
            p: 2,
            backgroundColor: '#f4f4f4',
            minHeight: 400,
            overflow: 'auto'
          }}
        >
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <Typography color="text.secondary" align="center">
              No content to preview
            </Typography>
          )}
        </Box>
      )}

      {tab === 2 && onTextChange && (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Plain text version is used as a fallback for email clients that don't support HTML.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={textContent}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter plain text content..."
          />
        </Box>
      )}
    </Box>
  );
};

export default EmailEditor;
