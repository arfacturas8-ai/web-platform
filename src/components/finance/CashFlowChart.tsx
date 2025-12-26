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
  LinearProgress
} from '@mui/material';
import { TrendingUp, TrendingDown, SwapHoriz } from '@mui/icons-material';

interface CashFlowData {
  operating_activities: {
    cash_from_sales: number;
    cash_paid_expenses: number;
    cash_paid_payroll: number;
    net_cash_from_operations: number;
  };
  investing_activities: {
    equipment_purchases: number;
    net_cash_from_investing: number;
  };
  financing_activities: {
    loans_received: number;
    loan_payments: number;
    net_cash_from_financing: number;
  };
  net_cash_flow: number;
}

interface Props {
  data: CashFlowData;
  startDate: Date;
  endDate: Date;
}

const CashFlowChart: React.FC<Props> = ({ data, startDate, endDate }) => {
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

  const getPercentageOfTotal = (value: number) => {
    const total = Math.abs(data.operating_activities.net_cash_from_operations) +
                  Math.abs(data.investing_activities.net_cash_from_investing) +
                  Math.abs(data.financing_activities.net_cash_from_financing);
    return total > 0 ? (Math.abs(value) / total) * 100 : 0;
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Cash Flow Statement
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDate(startDate)} - {formatDate(endDate)}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TrendingUp color="primary" />
              <Typography variant="subtitle2" color="textSecondary">
                Operating Cash Flow
              </Typography>
            </Box>
            <Typography variant="h5" color={data.operating_activities.net_cash_from_operations >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(data.operating_activities.net_cash_from_operations)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'warning.50' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TrendingDown color="warning" />
              <Typography variant="subtitle2" color="textSecondary">
                Investing Cash Flow
              </Typography>
            </Box>
            <Typography variant="h5" color={data.investing_activities.net_cash_from_investing >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(data.investing_activities.net_cash_from_investing)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SwapHoriz color="info" />
              <Typography variant="subtitle2" color="textSecondary">
                Financing Cash Flow
              </Typography>
            </Box>
            <Typography variant="h5" color={data.financing_activities.net_cash_from_financing >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(data.financing_activities.net_cash_from_financing)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: data.net_cash_flow >= 0 ? 'success.50' : 'error.50' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {data.net_cash_flow >= 0 ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
              <Typography variant="subtitle2" color="textSecondary">
                Net Cash Flow
              </Typography>
            </Box>
            <Typography variant="h5" color={data.net_cash_flow >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(data.net_cash_flow)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Cash Flow Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {/* Operating Activities */}
            <TableRow sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <TableCell sx={{ color: 'inherit' }}>
                <Typography variant="h6">Cash Flow from Operating Activities</Typography>
              </TableCell>
              <TableCell align="right" sx={{ color: 'inherit' }} />
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Cash received from sales</TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                {formatCurrency(data.operating_activities.cash_from_sales)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Cash paid for expenses</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                ({formatCurrency(Math.abs(data.operating_activities.cash_paid_expenses))})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Cash paid for payroll</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                ({formatCurrency(Math.abs(data.operating_activities.cash_paid_payroll))})
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>
                <strong>Net Cash from Operating Activities</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.operating_activities.net_cash_from_operations)}</strong>
              </TableCell>
            </TableRow>

            {/* Investing Activities */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
              <TableCell sx={{ color: 'inherit' }}>
                <Typography variant="h6">Cash Flow from Investing Activities</Typography>
              </TableCell>
              <TableCell align="right" sx={{ color: 'inherit' }} />
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Equipment purchases</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {data.investing_activities.equipment_purchases !== 0
                  ? `(${formatCurrency(Math.abs(data.investing_activities.equipment_purchases))})`
                  : formatCurrency(0)}
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>
                <strong>Net Cash from Investing Activities</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.investing_activities.net_cash_from_investing)}</strong>
              </TableCell>
            </TableRow>

            {/* Financing Activities */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
              <TableCell sx={{ color: 'inherit' }}>
                <Typography variant="h6">Cash Flow from Financing Activities</Typography>
              </TableCell>
              <TableCell align="right" sx={{ color: 'inherit' }} />
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Loans received</TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                {formatCurrency(data.financing_activities.loans_received)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Loan payments</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {data.financing_activities.loan_payments !== 0
                  ? `(${formatCurrency(Math.abs(data.financing_activities.loan_payments))})`
                  : formatCurrency(0)}
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>
                <strong>Net Cash from Financing Activities</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{formatCurrency(data.financing_activities.net_cash_from_financing)}</strong>
              </TableCell>
            </TableRow>

            {/* Net Cash Flow */}
            <TableRow>
              <TableCell colSpan={2}>
                <Divider sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: data.net_cash_flow >= 0 ? 'success.100' : 'error.100' }}>
              <TableCell>
                <Typography variant="h6">Net Increase/Decrease in Cash</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" color={data.net_cash_flow >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(data.net_cash_flow)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Visual Breakdown */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Cash Flow Breakdown
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Operating Activities</Typography>
              <Typography variant="body2">
                {formatCurrency(data.operating_activities.net_cash_from_operations)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getPercentageOfTotal(data.operating_activities.net_cash_from_operations)}
              sx={{ height: 10, borderRadius: 1 }}
              color={data.operating_activities.net_cash_from_operations >= 0 ? 'success' : 'error'}
            />
          </Box>
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Investing Activities</Typography>
              <Typography variant="body2">
                {formatCurrency(data.investing_activities.net_cash_from_investing)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getPercentageOfTotal(data.investing_activities.net_cash_from_investing)}
              sx={{ height: 10, borderRadius: 1 }}
              color={data.investing_activities.net_cash_from_investing >= 0 ? 'success' : 'warning'}
            />
          </Box>
          <Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Financing Activities</Typography>
              <Typography variant="body2">
                {formatCurrency(data.financing_activities.net_cash_from_financing)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getPercentageOfTotal(data.financing_activities.net_cash_from_financing)}
              sx={{ height: 10, borderRadius: 1 }}
              color={data.financing_activities.net_cash_from_financing >= 0 ? 'success' : 'error'}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CashFlowChart;
