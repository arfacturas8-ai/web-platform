import React from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  PersonAdd,
  Restaurant,
  ShoppingCart,
  Phone,
  TrendingUp
} from '@mui/icons-material';
import { useCustomerJourney } from '../../hooks/useCRM';
import { format } from 'date-fns';

interface CustomerJourneyProps {
  customerId: string;
}

const CustomerJourney: React.FC<CustomerJourneyProps> = ({ customerId }) => {
  const { data: journey, isLoading, error } = useCustomerJourney(customerId);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'customer_created':
        return <PersonAdd />;
      case 'reservation':
        return <Restaurant />;
      case 'order':
        return <ShoppingCart />;
      case 'interaction':
        return <Phone />;
      case 'lifecycle_stage':
        return <TrendingUp />;
      default:
        return <PersonAdd />;
    }
  };

  const getEventColor = (type: string): any => {
    switch (type) {
      case 'customer_created':
        return 'primary';
      case 'reservation':
        return 'secondary';
      case 'order':
        return 'success';
      case 'interaction':
        return 'info';
      case 'lifecycle_stage':
        return 'warning';
      default:
        return 'grey';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load customer journey</Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Customer Journey
      </Typography>

      {journey && journey.length > 0 ? (
        <Timeline position="right">
          {journey.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                <Typography variant="caption">
                  {format(new Date(event.timestamp), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="caption" display="block">
                  {format(new Date(event.timestamp), 'HH:mm')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={getEventColor(event.type)}>
                  {getEventIcon(event.type)}
                </TimelineDot>
                {index < journey.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="body1" fontWeight="medium">
                  {event.description}
                </Typography>
                {event.details && (
                  <Typography variant="body2" color="text.secondary">
                    {typeof event.details === 'string'
                      ? event.details
                      : JSON.stringify(event.details)}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No journey events yet
        </Typography>
      )}
    </Paper>
  );
};

export default CustomerJourney;
