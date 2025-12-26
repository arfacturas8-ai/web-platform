import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import {
  Check,
  Close,
  Receipt,
  CalendarToday,
  Business
} from '@mui/icons-material';

interface Expense {
  id: string;
  category: string;
  amount: number;
  vendor: string;
  description: string;
  expense_date: string;
  approval_status: string;
  is_paid: boolean;
  created_at: string;
}

interface Props {
  expense: Expense;
  onApprove?: () => void;
  onReject?: () => void;
}

const ExpenseCard: React.FC<Props> = ({ expense, onApprove, onReject }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cost_of_goods: '#f44336',
      labor: '#2196f3',
      rent: '#9c27b0',
      utilities: '#ff9800',
      marketing: '#4caf50',
      supplies: '#00bcd4',
      maintenance: '#795548',
      insurance: '#607d8b',
      taxes: '#e91e63',
      fees: '#3f51b5'
    };
    return colors[category] || '#757575';
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Chip
              label={expense.category.replace('_', ' ').toUpperCase()}
              size="small"
              sx={{
                bgcolor: getCategoryColor(expense.category),
                color: 'white',
                fontWeight: 'bold',
                mb: 1
              }}
            />
            <Typography variant="h5" component="div" gutterBottom>
              {formatCurrency(expense.amount)}
            </Typography>
          </Box>
          {expense.approval_status === 'pending' && (
            <Chip
              label="Pending"
              color="warning"
              size="small"
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Business fontSize="small" color="action" />
          <Typography variant="body1" fontWeight="bold">
            {expense.vendor}
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" paragraph>
          {expense.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={1}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="caption" color="textSecondary">
            {formatDate(expense.expense_date)}
          </Typography>
        </Box>
      </CardContent>

      {expense.approval_status === 'pending' && (onApprove || onReject) && (
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          {onReject && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Close />}
              onClick={onReject}
            >
              Reject
            </Button>
          )}
          {onApprove && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Check />}
              onClick={onApprove}
            >
              Approve
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default ExpenseCard;
