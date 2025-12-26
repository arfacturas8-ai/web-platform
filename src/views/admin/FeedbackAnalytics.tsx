import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import SentimentChart from '../../components/feedback/SentimentChart';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FeedbackAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState(30);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['feedback-analytics', timeRange],
    queryFn: async () => {
      const response = await api.get('/feedback/analytics/overview', {
        params: { days: timeRange },
      });
      return response.data;
    },
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['feedback-trends', timeRange],
    queryFn: async () => {
      const response = await api.get('/feedback/analytics/trends', {
        params: { days: timeRange },
      });
      return response.data;
    },
  });

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ['feedback-report', timeRange],
    queryFn: async () => {
      const response = await api.get('/feedback/analytics/report', {
        params: { days: timeRange },
      });
      return response.data;
    },
  });

  const isLoading = analyticsLoading || trendsLoading || reportLoading;

  // Prepare chart data
  const ratingTrendData = trends?.rating_trends
    ? {
        labels: trends.rating_trends.map((t: any) => t.week),
        datasets: [
          {
            label: 'Average Rating',
            data: trends.rating_trends.map((t: any) => t.average_rating),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      }
    : null;

  const ratingDistributionData = analytics?.rating_distribution
    ? {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
          {
            label: 'Number of Reviews',
            data: [
              analytics.rating_distribution[1] || 0,
              analytics.rating_distribution[2] || 0,
              analytics.rating_distribution[3] || 0,
              analytics.rating_distribution[4] || 0,
              analytics.rating_distribution[5] || 0,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(54, 162, 235, 0.8)',
            ],
          },
        ],
      }
    : null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Feedback Analytics & Insights
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={365}>Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Rating
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h3" fontWeight="bold">
                      {analytics?.average_rating.toFixed(1)}
                    </Typography>
                    <StarIcon color="warning" sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Based on {analytics?.total_reviews} reviews
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    NPS Score
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h3" fontWeight="bold">
                      {analytics?.satisfaction_score.toFixed(0)}
                    </Typography>
                    <TrendingUpIcon color="success" />
                  </Box>
                  <Chip label="Good" color="success" size="small" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Complaints
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.total_complaints}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics?.open_complaints} open
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Avg Resolution Time
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.average_resolution_time_hours?.toFixed(1) || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Sentiment Analysis */}
            <Grid xs={12} md={6}>
              {analytics && (
                <SentimentChart
                  data={analytics.sentiment_breakdown}
                  total={analytics.total_reviews}
                  trend="stable"
                  showDetails
                />
              )}
            </Grid>

            {/* Rating Distribution */}
            <Grid xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Rating Distribution
                </Typography>
                {ratingDistributionData && (
                  <Bar
                    data={ratingDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                    height={250}
                  />
                )}
              </Paper>
            </Grid>

            {/* Rating Trends */}
            <Grid xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Rating Trends
                </Typography>
                {ratingTrendData && (
                  <Line
                    data={ratingTrendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          min: 0,
                          max: 5,
                        },
                      },
                    }}
                    height={100}
                  />
                )}
              </Paper>
            </Grid>

            {/* Top Keywords */}
            {trends?.top_keywords && trends.top_keywords.length > 0 && (
              <Grid xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Trending Keywords
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                    {trends.top_keywords.map((keyword: any) => (
                      <Chip
                        key={keyword.keyword}
                        label={`${keyword.keyword} (${keyword.count})`}
                        icon={<TagIcon />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Top Praises */}
            {report?.top_praises && report.top_praises.length > 0 && (
              <Grid xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Top Praises
                  </Typography>
                  <List>
                    {report.top_praises.slice(0, 5).map((praise: any, index: number) => (
                      <ListItem key={index} divider={index < 4}>
                        <ListItemText
                          primary={praise.comment}
                          secondary={
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="caption">{praise.rating}/5</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

            {/* Top Issues */}
            {report?.top_issues && report.top_issues.length > 0 && (
              <Grid xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Top Issues
                  </Typography>
                  <List>
                    {report.top_issues.slice(0, 5).map((issue: any, index: number) => (
                      <ListItem key={index} divider={index < 4}>
                        <ListItemText
                          primary={issue.comment}
                          secondary={
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <StarIcon sx={{ fontSize: 16, color: 'error.main' }} />
                              <Typography variant="caption">{issue.rating}/5</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default FeedbackAnalytics;
