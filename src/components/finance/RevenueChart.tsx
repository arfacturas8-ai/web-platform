import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from '@mui/material';
import { PieChart, TrendingUp } from '@mui/icons-material';

interface RevenueData {
  total: number;
  breakdown: Record<string, { gross: number; tax: number; net: number }>;
}

interface Props {
  revenueData: RevenueData;
  startDate: Date;
  endDate: Date;
}

const RevenueChart: React.FC<Props> = ({ revenueData, startDate, endDate }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPercentage = (amount: number) => {
    return revenueData.total > 0 ? (amount / revenueData.total) * 100 : 0;
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      dine_in: '#2196f3',
      takeout: '#4caf50',
      delivery: '#ff9800',
      pickup: '#9c27b0',
      catering: '#f44336'
    };
    return colors[source] || '#757575';
  };

  const sortedBreakdown = Object.entries(revenueData.breakdown).sort(
    ([, a], [, b]) => b.gross - a.gross
  );

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Revenue Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(startDate)} - {formatDate(endDate)}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h3" color="primary">
              {formatCurrency(revenueData.total)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Revenue Streams
            </Typography>
            <Typography variant="h3" color="secondary">
              {Object.keys(revenueData.breakdown).length}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Top Revenue Source
            </Typography>
            <Typography variant="h4">
              {sortedBreakdown[0]?.[0]?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {sortedBreakdown[0] && formatCurrency(sortedBreakdown[0][1].gross)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Breakdown Table */}
      <Paper variant="outlined" sx={{ mb: 4 }}>
        <Box p={2} bgcolor="primary.main" color="primary.contrastText">
          <Typography variant="h6">Revenue by Source</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell align="right">Gross Revenue</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Net Revenue</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBreakdown.map(([source, amounts]) => (
                <TableRow key={source} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: getSourceColor(source)
                        }}
                      />
                      <Typography fontWeight="medium">
                        {source.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{formatCurrency(amounts.gross)}</strong>
                  </TableCell>
                  <TableCell align="right">{formatCurrency(amounts.tax)}</TableCell>
                  <TableCell align="right">{formatCurrency(amounts.net)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${getPercentage(amounts.gross).toFixed(1)}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(revenueData.total)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {formatCurrency(
                      Object.values(revenueData.breakdown).reduce((sum, item) => sum + item.tax, 0)
                    )}
                  </strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {formatCurrency(
                      Object.values(revenueData.breakdown).reduce((sum, item) => sum + item.net, 0)
                    )}
                  </strong>
                </TableCell>
                <TableCell align="right">
                  <strong>100%</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Visual Breakdown */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Revenue Distribution
        </Typography>
        {sortedBreakdown.map(([source, amounts]) => (
          <Box key={source} mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: getSourceColor(source)
                  }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {source.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(amounts.gross)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {getPercentage(amounts.gross).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getPercentage(amounts.gross)}
              sx={{
                height: 10,
                borderRadius: 1,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getSourceColor(source)
                }
              }}
            />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default RevenueChart;
