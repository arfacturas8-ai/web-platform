import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Avatar, IconButton } from '@mui/material';
import { Email, Phone, Visibility } from '@mui/icons-material';
import { useNavigate } from '@/lib/router';

interface CustomerCardProps {
  customer: any;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const navigate = useNavigate();

  const getSegmentColor = (segment: string | null) => {
    switch (segment) {
      case 'high_value':
        return 'success';
      case 'at_risk':
        return 'error';
      case 'new':
        return 'info';
      case 'loyal':
        return 'primary';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getInitials = () => {
    return `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/admin/crm/customers/${customer.id}`)}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getInitials()}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6">
              {customer.first_name} {customer.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.email}
            </Typography>
          </Box>
          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/crm/customers/${customer.id}`);
          }}>
            <Visibility />
          </IconButton>
        </Box>

        <Box display="flex" gap={1} mb={2}>
          {customer.segment && (
            <Chip
              label={customer.segment.replace('_', ' ').toUpperCase()}
              color={getSegmentColor(customer.segment) as any}
              size="small"
            />
          )}
          {customer.tags?.slice(0, 2).map((tag: string, index: number) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
          {customer.tags?.length > 2 && (
            <Chip label={`+${customer.tags.length - 2}`} size="small" variant="outlined" />
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Lifetime Value:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="success.main">
            ${customer.lifetime_value || 0}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Total Visits:
          </Typography>
          <Typography variant="body2">
            {customer.total_visits || 0}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Avg Spend:
          </Typography>
          <Typography variant="body2">
            ${customer.average_spend || 0}
          </Typography>
        </Box>

        <Box display="flex" gap={1} mt={2}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${customer.email}`;
            }}
          >
            <Email fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${customer.phone}`;
            }}
          >
            <Phone fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
