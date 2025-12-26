import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface ProfitLossData {
  revenue: {
    total: number;
    breakdown: Record<string, { gross: number; tax: number; net: number }>;
  };
  cost_of_goods_sold: number;
  gross_profit: number;
  gross_margin_percentage: number;
  operating_expenses: {
    total: number;
    breakdown: Record<string, number>;
  };
  operating_profit: number;
  operating_margin_percentage: number;
  taxes: number;
  net_profit: number;
  net_margin_percentage: number;
}

interface Props {
  data: ProfitLossData;
  startDate: Date;
  endDate: Date;
}

const ProfitLossReport: React.FC<Props> = ({ data, startDate, endDate }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Profit & Loss Statement
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(startDate)} - {formatDate(endDate)}
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {/* Revenue Section */}
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell colSpan={2}>
                <Typography variant="h6">Revenue</Typography>
              </TableCell>
            </TableRow>
            {Object.entries(data.revenue.breakdown).map(([source, amounts]) => (
              <TableRow key={source}>
                <TableCell sx={{ pl: 4 }}>
                  {source.replace('_', ' ').toUpperCase()}
                </TableCell>
                <TableCell align="right">{formatCurrency(amounts.gross)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <strong>Total Revenue</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.revenue.total)}</strong>
              </TableCell>
            </TableRow>

            {/* Cost of Goods Sold */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cost of Goods Sold (COGS)</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                ({formatCurrency(data.cost_of_goods_sold)})
              </TableCell>
            </TableRow>

            {/* Gross Profit */}
            <TableRow sx={{ bgcolor: 'success.50' }}>
              <TableCell>
                <strong>Gross Profit</strong>
                <Typography variant="caption" display="block" color="textSecondary">
                  Margin: {formatPercentage(data.gross_margin_percentage)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.gross_profit)}</strong>
              </TableCell>
            </TableRow>

            {/* Operating Expenses */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell colSpan={2}>
                <Typography variant="h6">Operating Expenses</Typography>
              </TableCell>
            </TableRow>
            {Object.entries(data.operating_expenses.breakdown).map(([category, amount]) => (
              <TableRow key={category}>
                <TableCell sx={{ pl: 4 }}>
                  {category.replace('_', ' ').toUpperCase()}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  ({formatCurrency(amount)})
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <strong>Total Operating Expenses</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                <strong>({formatCurrency(data.operating_expenses.total)})</strong>
              </TableCell>
            </TableRow>

            {/* Operating Profit */}
            <TableRow sx={{ bgcolor: 'info.50' }}>
              <TableCell>
                <strong>Operating Profit</strong>
                <Typography variant="caption" display="block" color="textSecondary">
                  Margin: {formatPercentage(data.operating_margin_percentage)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.operating_profit)}</strong>
              </TableCell>
            </TableRow>

            {/* Taxes */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxes</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                ({formatCurrency(data.taxes)})
              </TableCell>
            </TableRow>

            {/* Net Profit */}
            <TableRow sx={{ bgcolor: data.net_profit >= 0 ? 'success.100' : 'error.100' }}>
              <TableCell>
                <Typography variant="h6">Net Profit</Typography>
                <Typography variant="caption" display="block" color="textSecondary">
                  Margin: {formatPercentage(data.net_margin_percentage)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" color={data.net_profit >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(data.net_profit)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Key Metrics Summary */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Gross Margin
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {data.gross_margin_percentage >= 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography variant="h5">
                {formatPercentage(data.gross_margin_percentage)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Operating Margin
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {data.operating_margin_percentage >= 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography variant="h5">
                {formatPercentage(data.operating_margin_percentage)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Net Margin
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {data.net_margin_percentage >= 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography variant="h5" color={data.net_margin_percentage >= 0 ? 'success.main' : 'error.main'}>
                {formatPercentage(data.net_margin_percentage)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfitLossReport;
