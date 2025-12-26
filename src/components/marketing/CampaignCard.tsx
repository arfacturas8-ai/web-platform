import React from 'react';
import {
  Card, CardContent, CardActions, Typography, Box, Chip, Button,
  LinearProgress, IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  target_segment: string;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onView,
  onEdit,
  onSend
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      draft: 'default',
      scheduled: 'info',
      running: 'success',
      paused: 'warning',
      completed: 'primary',
      cancelled: 'error'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  const calculateOpenRate = (): string => {
    if (campaign.sent_count === 0) return '0';
    return ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1);
  };

  const calculateClickRate = (): string => {
    if (campaign.sent_count === 0) return '0';
    return ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1);
  };

  const getCampaignTypeIcon = () => {
    if (campaign.campaign_type === 'email') return <EmailIcon />;
    if (campaign.campaign_type === 'sms') return <SmsIcon />;
    return <EmailIcon />;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getCampaignTypeIcon()}
            <Typography variant="h6" component="div">
              {campaign.name}
            </Typography>
          </Box>
          <Chip
            label={campaign.status}
            color={getStatusColor(campaign.status)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {campaign.description || 'No description'}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Segment: ${campaign.target_segment}`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Sent: {campaign.sent_count.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Opened: {campaign.opened_count.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Open Rate</Typography>
            <Typography variant="caption" fontWeight="bold">
              {calculateOpenRate()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={parseFloat(calculateOpenRate())}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Click Rate</Typography>
            <Typography variant="caption" fontWeight="bold">
              {calculateClickRate()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={parseFloat(calculateClickRate())}
            color="secondary"
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Created: {new Date(campaign.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          {onView && (
            <IconButton
              size="small"
              color="info"
              onClick={() => onView(campaign)}
              title="View Analytics"
            >
              <VisibilityIcon />
            </IconButton>
          )}
          {onEdit && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(campaign)}
              title="Edit Campaign"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
        {onSend && (campaign.status === 'draft' || campaign.status === 'scheduled') && (
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => onSend(campaign)}
          >
            Send
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CampaignCard;
