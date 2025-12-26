import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  SentimentVerySatisfied as PositiveIcon,
  SentimentNeutral as NeutralIcon,
  SentimentVeryDissatisfied as NegativeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentChartProps {
  data: SentimentData;
  total: number;
  trend?: 'up' | 'down' | 'stable';
  showDetails?: boolean;
}

const SentimentChart: React.FC<SentimentChartProps> = ({
  data,
  total,
  trend = 'stable',
  showDetails = true,
}) => {
  const positivePercent = total > 0 ? (data.positive / total) * 100 : 0;
  const neutralPercent = total > 0 ? (data.neutral / total) * 100 : 0;
  const negativePercent = total > 0 ? (data.negative / total) * 100 : 0;

  const sentimentScore = positivePercent - negativePercent;

  const getOverallSentiment = () => {
    if (sentimentScore > 20) return { label: 'Very Positive', color: 'success', icon: <PositiveIcon /> };
    if (sentimentScore > 0) return { label: 'Positive', color: 'success', icon: <PositiveIcon /> };
    if (sentimentScore > -20) return { label: 'Neutral', color: 'warning', icon: <NeutralIcon /> };
    return { label: 'Negative', color: 'error', icon: <NegativeIcon /> };
  };

  const overall = getOverallSentiment();

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Sentiment Analysis
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={overall.label}
            color={overall.color as any}
            icon={overall.icon}
            size="small"
          />
          {trend !== 'stable' && (
            <Chip
              label={trend === 'up' ? 'Improving' : 'Declining'}
              icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
              color={trend === 'up' ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <PositiveIcon color="success" />
          <Typography variant="body2" fontWeight="medium" flex={1}>
            Positive
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {data.positive} ({positivePercent.toFixed(1)}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={positivePercent}
          color="success"
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <NeutralIcon color="warning" />
          <Typography variant="body2" fontWeight="medium" flex={1}>
            Neutral
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {data.neutral} ({neutralPercent.toFixed(1)}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={neutralPercent}
          color="warning"
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <NegativeIcon color="error" />
          <Typography variant="body2" fontWeight="medium" flex={1}>
            Negative
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {data.negative} ({negativePercent.toFixed(1)}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={negativePercent}
          color="error"
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {showDetails && (
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Total Responses
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {total}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Sentiment Score
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={sentimentScore > 0 ? 'success.main' : sentimentScore < 0 ? 'error.main' : 'text.secondary'}
            >
              {sentimentScore > 0 ? '+' : ''}{sentimentScore.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SentimentChart;
