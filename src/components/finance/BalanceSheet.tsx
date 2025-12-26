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
  Alert
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

interface BalanceSheetData {
  assets: {
    current_assets: {
      cash: number;
      accounts_receivable: number;
      inventory: number;
      total: number;
    };
    fixed_assets: {
      equipment: number;
      furniture: number;
      total: number;
    };
    total: number;
  };
  liabilities: {
    current_liabilities: {
      accounts_payable: number;
      payroll_payable: number;
      total: number;
    };
    long_term_liabilities: {
      loans: number;
      total: number;
    };
    total: number;
  };
  equity: {
    retained_earnings: number;
    total: number;
  };
  balance_check: {
    assets: number;
    liabilities_plus_equity: number;
    balanced: boolean;
  };
}

interface Props {
  data: BalanceSheetData;
  asOfDate: Date;
}

const BalanceSheet: React.FC<Props> = ({ data, asOfDate }) => {
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Balance Sheet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          As of {formatDate(asOfDate)}
        </Typography>
      </Box>

      {/* Balance Check Alert */}
      {data.balance_check && (
        <Alert
          severity={data.balance_check.balanced ? 'success' : 'error'}
          icon={data.balance_check.balanced ? <CheckCircle /> : <Error />}
          sx={{ mb: 3 }}
        >
          {data.balance_check.balanced
            ? 'Balance Sheet is balanced: Assets = Liabilities + Equity'
            : 'Warning: Balance Sheet is not balanced. There may be data inconsistencies.'}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Assets */}
        <Grid xs={12} md={6}>
          <Paper variant="outlined">
            <Box p={2} bgcolor="primary.main" color="primary.contrastText">
              <Typography variant="h6">Assets</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {/* Current Assets */}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Current Assets
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Cash</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.assets.current_assets.cash)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Accounts Receivable</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.assets.current_assets.accounts_receivable)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Inventory</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.assets.current_assets.inventory)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>
                      <strong>Total Current Assets</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(data.assets.current_assets.total)}</strong>
                    </TableCell>
                  </TableRow>

                  {/* Fixed Assets */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Fixed Assets
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Equipment</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.assets.fixed_assets.equipment)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Furniture</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.assets.fixed_assets.furniture)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>
                      <strong>Total Fixed Assets</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(data.assets.fixed_assets.total)}</strong>
                    </TableCell>
                  </TableRow>

                  {/* Total Assets */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'primary.50' }}>
                    <TableCell>
                      <Typography variant="h6">Total Assets</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">
                        {formatCurrency(data.assets.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Liabilities & Equity */}
        <Grid xs={12} md={6}>
          <Paper variant="outlined">
            <Box p={2} bgcolor="secondary.main" color="secondary.contrastText">
              <Typography variant="h6">Liabilities & Equity</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {/* Current Liabilities */}
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Current Liabilities
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Accounts Payable</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.liabilities.current_liabilities.accounts_payable)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Payroll Payable</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.liabilities.current_liabilities.payroll_payable)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>
                      <strong>Total Current Liabilities</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {formatCurrency(data.liabilities.current_liabilities.total)}
                      </strong>
                    </TableCell>
                  </TableRow>

                  {/* Long-term Liabilities */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Long-term Liabilities
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Loans</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.liabilities.long_term_liabilities.loans)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>
                      <strong>Total Long-term Liabilities</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {formatCurrency(data.liabilities.long_term_liabilities.total)}
                      </strong>
                    </TableCell>
                  </TableRow>

                  {/* Total Liabilities */}
                  <TableRow sx={{ bgcolor: 'warning.50' }}>
                    <TableCell>
                      <strong>Total Liabilities</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(data.liabilities.total)}</strong>
                    </TableCell>
                  </TableRow>

                  {/* Equity */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Equity
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Retained Earnings</TableCell>
                    <TableCell align="right">
                      {formatCurrency(data.equity.retained_earnings)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'success.50' }}>
                    <TableCell>
                      <strong>Total Equity</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(data.equity.total)}</strong>
                    </TableCell>
                  </TableRow>

                  {/* Total Liabilities + Equity */}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider sx={{ my: 1 }} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: 'secondary.50' }}>
                    <TableCell>
                      <Typography variant="h6">Total Liabilities & Equity</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">
                        {formatCurrency(data.liabilities.total + data.equity.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Key Ratios */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Key Financial Ratios
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Current Ratio
              </Typography>
              <Typography variant="h5">
                {data.liabilities.current_liabilities.total > 0
                  ? (data.assets.current_assets.total / data.liabilities.current_liabilities.total).toFixed(2)
                  : 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Current Assets / Current Liabilities
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Debt-to-Equity Ratio
              </Typography>
              <Typography variant="h5">
                {data.equity.total > 0
                  ? (data.liabilities.total / data.equity.total).toFixed(2)
                  : 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Liabilities / Total Equity
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Equity Ratio
              </Typography>
              <Typography variant="h5">
                {data.assets.total > 0
                  ? ((data.equity.total / data.assets.total) * 100).toFixed(2) + '%'
                  : 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Equity / Total Assets
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BalanceSheet;
