import React from 'react';
import { Card, CardContent, Typography, Box, Grid, LinearProgress } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

interface CampaignStatsProps {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRevenue: number;
  previousPeriod?: {
    totalSent: number;
    avgOpenRate: number;
    avgClickRate: number;
  };
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  totalCampaigns,
  activeCampaigns,
  totalSent,
  avgOpenRate,
  avgClickRate,
  totalRevenue,
  previousPeriod
}) => {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string | null;
    progress?: number;
    color?: string;
  }> = ({ title, value, change, progress, color = 'primary.main' }) => (
    <Card>
      <CardContent>
        <Typography color="text.secondary" variant="caption" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ color }}>
            {value}
          </Typography>
          {change !== null && change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {parseFloat(change) >= 0 ? (
                <TrendingUpIcon color="success" fontSize="small" />
              ) : (
                <TrendingDownIcon color="error" fontSize="small" />
              )}
              <Typography
                variant="caption"
                color={parseFloat(change) >= 0 ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {Math.abs(parseFloat(change))}%
              </Typography>
            </Box>
          )}
        </Box>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, height: 6, borderRadius: 3 }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Total Campaigns"
          value={totalCampaigns}
        />
      </Grid>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          color="success.main"
        />
      </Grid>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Total Sent"
          value={totalSent.toLocaleString()}
          change={calculateChange(totalSent, previousPeriod?.totalSent)}
        />
      </Grid>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Avg Open Rate"
          value={`${avgOpenRate.toFixed(1)}%`}
          progress={avgOpenRate}
          change={calculateChange(avgOpenRate, previousPeriod?.avgOpenRate)}
        />
      </Grid>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Avg Click Rate"
          value={`${avgClickRate.toFixed(1)}%`}
          progress={avgClickRate}
          change={calculateChange(avgClickRate, previousPeriod?.avgClickRate)}
          color="secondary.main"
        />
      </Grid>
      <Grid xs={12} sm={6} md={2}>
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          color="warning.main"
        />
      </Grid>
    </Grid>
  );
};

export default CampaignStats;
