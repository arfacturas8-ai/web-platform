import React from 'react';
import { Box, Tabs, Tab, Badge, CircularProgress } from '@mui/material';
import { useSegments } from '../../hooks/useCRM';

interface CustomerSegmentsProps {
  value: string;
  onChange: (segment: string) => void;
}

const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ value, onChange }) => {
  const { data: segments, isLoading } = useSegments();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const totalCustomers = segments
    ? Object.values(segments).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        <Tab
          label={
            <Badge badgeContent={totalCustomers} color="primary">
              All Customers
            </Badge>
          }
          value=""
        />
        <Tab
          label={
            <Badge badgeContent={segments?.high_value || 0} color="success">
              High Value
            </Badge>
          }
          value="high_value"
        />
        <Tab
          label={
            <Badge badgeContent={segments?.loyal || 0} color="primary">
              Loyal
            </Badge>
          }
          value="loyal"
        />
        <Tab
          label={
            <Badge badgeContent={segments?.new || 0} color="info">
              New
            </Badge>
          }
          value="new"
        />
        <Tab
          label={
            <Badge badgeContent={segments?.active || 0} color="default">
              Active
            </Badge>
          }
          value="active"
        />
        <Tab
          label={
            <Badge badgeContent={segments?.at_risk || 0} color="error">
              At Risk
            </Badge>
          }
          value="at_risk"
        />
        <Tab
          label={
            <Badge badgeContent={segments?.inactive || 0} color="default">
              Inactive
            </Badge>
          }
          value="inactive"
        />
      </Tabs>
    </Box>
  );
};

export default CustomerSegments;
