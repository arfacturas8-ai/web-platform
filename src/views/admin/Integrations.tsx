import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  Api,
  Webhook,
  CloudDownload,
  Description,
  Code,
  Settings,
} from '@mui/icons-material';
import APIKeys from './integrations/APIKeys';
import Webhooks from './integrations/Webhooks';
import DataExport from './integrations/DataExport';
import APIDocumentation from './integrations/APIDocumentation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Integrations: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Third-Party Integrations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage API keys, webhooks, and data exports for third-party integrations
        </Typography>
      </Box>

      {/* Integration Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Api sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">API Keys</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Manage access
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                onClick={() => setCurrentTab(0)}
                variant={currentTab === 0 ? 'contained' : 'outlined'}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Webhook sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Webhooks</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time events
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                onClick={() => setCurrentTab(1)}
                variant={currentTab === 1 ? 'contained' : 'outlined'}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudDownload sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Data Export</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Export your data
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                onClick={() => setCurrentTab(2)}
                variant={currentTab === 2 ? 'contained' : 'outlined'}
              >
                Export
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">API Docs</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Documentation
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                onClick={() => setCurrentTab(3)}
                variant={currentTab === 3 ? 'contained' : 'outlined'}
              >
                View Docs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="integration tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Api />} label="API Keys" />
          <Tab icon={<Webhook />} label="Webhooks" />
          <Tab icon={<CloudDownload />} label="Data Export" />
          <Tab icon={<Description />} label="API Documentation" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <APIKeys />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Webhooks />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <DataExport />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <APIDocumentation />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Integrations;
