import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress, Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  OpenInNew as OpenInNewIcon,
  MouseOutlined as ClickIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useParams } from '@/lib/router';

interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  status: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  conversions: number;
  revenue: number;
  budget: number;
  roi: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  click_through_rate: number;
  unsubscribe_rate: number;
  open_timeline: Array<{ date: string; count: number }>;
  goals: {
    opens: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  engagement: {
    total_sent: number;
    opened: number;
    clicked: number;
    unopened: number;
  };
}

const CampaignAnalytics: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (campaignId) {
      fetchAnalytics();
    }
  }, [campaignId]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/v1/marketing/campaigns/${campaignId}/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch campaign analytics');
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (error || !analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Campaign not found'}</Alert>
      </Box>
    );
  }

  const engagementData = [
    { name: 'Opened', value: analytics.engagement.opened },
    { name: 'Clicked', value: analytics.engagement.clicked },
    { name: 'Unopened', value: analytics.engagement.unopened }
  ];

  const performanceData = [
    { name: 'Open Rate', value: analytics.open_rate, goal: (analytics.goals.opens / analytics.sent) * 100 || 0 },
    { name: 'Click Rate', value: analytics.click_rate, goal: (analytics.goals.clicks / analytics.sent) * 100 || 0 },
    { name: 'Conv. Rate', value: analytics.conversion_rate, goal: (analytics.goals.conversions / analytics.sent) * 100 || 0 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Campaign Analytics
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" color="textSecondary">
            {analytics.campaign_name}
          </Typography>
          <Chip label={analytics.status} color="primary" size="small" />
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="white" variant="caption">Total Sent</Typography>
                  <Typography color="white" variant="h4">{analytics.sent.toLocaleString()}</Typography>
                </Box>
                <EmailIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="white" variant="caption">Opened</Typography>
                  <Typography color="white" variant="h4">{analytics.opened.toLocaleString()}</Typography>
                  <Typography color="white" variant="caption">{analytics.open_rate}%</Typography>
                </Box>
                <OpenInNewIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="white" variant="caption">Clicked</Typography>
                  <Typography color="white" variant="h4">{analytics.clicked.toLocaleString()}</Typography>
                  <Typography color="white" variant="caption">{analytics.click_rate}%</Typography>
                </Box>
                <ClickIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="white" variant="caption">Conversions</Typography>
                  <Typography color="white" variant="h4">{analytics.conversions.toLocaleString()}</Typography>
                  <Typography color="white" variant="caption">{analytics.conversion_rate}%</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="white" variant="caption">ROI</Typography>
                  <Typography color="white" variant="h4">{analytics.roi}%</Typography>
                  <Typography color="white" variant="caption">${analytics.revenue.toLocaleString()}</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Opens Over Time</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.open_timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" name="Opens" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance vs Goals */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance vs Goals</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Actual" />
                  <Bar dataKey="goal" fill="#8884d8" name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Open Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{analytics.open_rate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.open_rate}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Click Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{analytics.click_rate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.click_rate}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="secondary"
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Click-Through Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{analytics.click_through_rate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.click_through_rate}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="success"
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Conversion Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{analytics.conversion_rate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.conversion_rate}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="warning"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Unsubscribe Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{analytics.unsubscribe_rate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.unsubscribe_rate}
                    sx={{ height: 10, borderRadius: 5 }}
                    color="error"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Performance */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Financial Performance</Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid xs={12} md={3}>
              <Box>
                <Typography color="textSecondary" variant="caption">Budget</Typography>
                <Typography variant="h5">${analytics.budget.toLocaleString()}</Typography>
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <Box>
                <Typography color="textSecondary" variant="caption">Revenue Generated</Typography>
                <Typography variant="h5" color="success.main">
                  ${analytics.revenue.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <Box>
                <Typography color="textSecondary" variant="caption">ROI</Typography>
                <Typography variant="h5" color={analytics.roi > 0 ? 'success.main' : 'error.main'}>
                  {analytics.roi}%
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <Box>
                <Typography color="textSecondary" variant="caption">Cost Per Conversion</Typography>
                <Typography variant="h5">
                  ${analytics.conversions > 0
                    ? (analytics.budget / analytics.conversions).toFixed(2)
                    : '0.00'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampaignAnalytics;
