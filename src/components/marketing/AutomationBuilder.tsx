import React from 'react';
import {
  Box, Paper, Typography, Card, CardContent, Chip,
  Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import {
  PlayArrow as TriggerIcon,
  Schedule as DelayIcon,
  Send as ActionIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

interface AutomationBuilderProps {
  triggerType: string;
  actionType: string;
  delayMinutes: number;
  isActive: boolean;
  triggerConditions?: any;
  actionConfig?: any;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  triggerType,
  actionType,
  delayMinutes,
  isActive,
  triggerConditions,
  actionConfig
}) => {
  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      new_customer: 'New Customer Registration',
      birthday: 'Customer Birthday',
      anniversary: 'Anniversary',
      abandoned_cart: 'Abandoned Cart',
      order_placed: 'Order Placed',
      no_visit_30_days: 'No Visit in 30 Days',
      no_visit_60_days: 'No Visit in 60 Days',
      high_value_customer: 'High Value Customer',
      reservation_reminder: 'Reservation Reminder',
      post_visit: 'Post Visit Follow-up',
      segment_entry: 'Customer Enters Segment'
    };
    return labels[trigger] || trigger;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      send_email: 'Send Email',
      send_sms: 'Send SMS',
      add_tag: 'Add Tag',
      update_segment: 'Update Segment',
      send_push: 'Send Push Notification',
      webhook: 'Trigger Webhook'
    };
    return labels[action] || action;
  };

  const steps = [
    {
      label: 'Trigger Event',
      description: getTriggerLabel(triggerType),
      icon: <TriggerIcon />,
      color: 'primary'
    },
    ...(delayMinutes > 0 ? [{
      label: 'Delay',
      description: `Wait ${delayMinutes} minutes`,
      icon: <DelayIcon />,
      color: 'warning'
    }] : []),
    {
      label: 'Action',
      description: getActionLabel(actionType),
      icon: <ActionIcon />,
      color: 'success'
    },
    {
      label: 'Complete',
      description: 'Automation executed',
      icon: <CheckIcon />,
      color: 'info'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6">Automation Flow</Typography>
        <Chip
          label={isActive ? 'Active' : 'Inactive'}
          color={isActive ? 'success' : 'default'}
          size="small"
        />
      </Box>

      <Stepper orientation="vertical">
        {steps.map((step, index) => (
          <Step key={index} active completed={index < steps.length - 1}>
            <StepLabel
              icon={step.icon}
              StepIconProps={{
                sx: { color: `${step.color}.main` }
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                  {step.label === 'Trigger Event' && triggerConditions && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Additional conditions: {JSON.stringify(triggerConditions)}
                      </Typography>
                    </Box>
                  )}
                  {step.label === 'Action' && actionConfig && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Configuration: {JSON.stringify(actionConfig)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>How it works:</strong> When a {getTriggerLabel(triggerType).toLowerCase()} occurs,
          {delayMinutes > 0 ? ` wait ${delayMinutes} minutes, then` : ''} the system will automatically {getActionLabel(actionType).toLowerCase()}.
        </Typography>
      </Box>
    </Box>
  );
};

export default AutomationBuilder;
