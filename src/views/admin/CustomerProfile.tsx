import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { useParams, useNavigate } from '@/lib/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  MoreVert as MoreVertIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import CustomerNotes from '../../components/crm/CustomerNotes';
import CustomerTags from '../../components/crm/CustomerTags';
import CustomerJourney from '../../components/crm/CustomerJourney';
import AddNoteDialog from '../../components/crm/AddNoteDialog';
import { useCustomerProfile, useCalculateLifetimeValue } from '../../hooks/useCRM';
import { format } from 'date-fns';

const CustomerProfile: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: profile, isLoading, error } = useCustomerProfile(customerId || '');
  const calculateLtvMutation = useCalculateLifetimeValue();

  if (!customerId) {
    return <Alert severity="error">Customer ID is required</Alert>;
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCalculateLtv = async () => {
    try {
      await calculateLtvMutation.mutateAsync(customerId);
      handleMenuClose();
    } catch (err) {
      logger.error('Failed to calculate LTV:', err);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container>
        <Alert severity="error">Failed to load customer profile</Alert>
      </Container>
    );
  }

  const customer = profile.customer;
  const metrics = profile.metrics;

  const getInitials = () => {
    return `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase();
  };

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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/admin/crm')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold" flex={1}>
          Customer Profile
        </Typography>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleCalculateLtv} disabled={calculateLtvMutation.isPending}>
          <CalculateIcon sx={{ mr: 1 }} />
          Recalculate Lifetime Value
        </MenuItem>
      </Menu>

      <Grid container spacing={3}>
        {/* Customer Header */}
        <Grid xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="flex-start" gap={3}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
                {getInitials()}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                  {customer.first_name} {customer.last_name}
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{customer.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Box>
                  {customer.birthday && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CakeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {format(new Date(customer.birthday), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box display="flex" gap={1} mb={2}>
                  {customer.segment && (
                    <Chip
                      label={customer.segment.replace('_', ' ').toUpperCase()}
                      color={getSegmentColor(customer.segment) as any}
                      size="small"
                    />
                  )}
                  <CustomerTags customerId={customerId} currentTags={profile.tags} />
                </Box>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() => window.location.href = `mailto:${customer.email}`}
                  >
                    Email
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    onClick={() => window.location.href = `tel:${customer.phone}`}
                  >
                    Call
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setAddNoteOpen(true)}
                  >
                    Add Note
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Key Metrics */}
        <Grid xs={12}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lifetime Value
                  </Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    ${metrics.lifetime_value.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Visits
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.total_visits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Spend
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ${metrics.average_spend.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Reservations
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.total_reservations}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metrics.total_no_shows} no-shows
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Customer Notes */}
        <Grid xs={12} md={6}>
          <CustomerNotes customerId={customerId} />
        </Grid>

        {/* Customer Journey */}
        <Grid xs={12} md={6}>
          <CustomerJourney customerId={customerId} />
        </Grid>

        {/* Order History */}
        <Grid xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {profile.orders && profile.orders.length > 0 ? (
              <Box>
                {profile.orders.slice(0, 5).map((order: any) => (
                  <Box key={order.id} mb={2} p={2} bgcolor="grey.50" borderRadius={1}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" fontWeight="medium">
                        Order #{order.order_number || order.id.slice(0, 8)}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        ${order.total_amount}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Chip label={order.order_type} size="small" />
                      <Chip label={order.status} size="small" color={order.status === 'completed' ? 'success' : 'default'} />
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.created_at), 'PPP')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No orders yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <AddNoteDialog
        open={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        customerId={customerId}
      />
    </Container>
  );
};

export default CustomerProfile;
