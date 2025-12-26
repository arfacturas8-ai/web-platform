import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  TextField,
  Button,
  Alert,
  Collapse,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as ResolvedIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';

interface Complaint {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to_name?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  updates_count: number;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onAssign?: (complaintId: string) => void;
  onResolve?: (complaintId: string, resolution: string) => void;
  onUpdateStatus?: (complaintId: string, status: string) => void;
  onViewUpdates?: (complaintId: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onAssign,
  onResolve,
  onUpdateStatus,
  onViewUpdates,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolution, setResolution] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleResolve = () => {
    if (onResolve && resolution.trim()) {
      onResolve(complaint.id, resolution);
      setResolution('');
      setIsResolving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'open':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <WarningIcon fontSize="small" />;
    }
    return undefined;
  };

  return (
    <Card sx={{ mb: 2, borderLeft: 4, borderColor: getPriorityColor(complaint.priority) + '.main' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="h6" fontWeight="bold">
                {complaint.subject}
              </Typography>
              <Chip
                label={complaint.priority}
                size="small"
                color={getPriorityColor(complaint.priority)}
                icon={getPriorityIcon(complaint.priority)}
              />
              <Chip
                label={complaint.status.replace('_', ' ')}
                size="small"
                color={getStatusColor(complaint.status)}
                variant="outlined"
              />
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>{complaint.customer_name}</strong> • {complaint.customer_email}
              </Typography>
              {complaint.category && (
                <Chip label={complaint.category} size="small" variant="outlined" />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
              Created {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
              {complaint.assigned_to_name && (
                <> • Assigned to <strong>{complaint.assigned_to_name}</strong></>
              )}
            </Typography>
          </Box>

          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" paragraph>
            {complaint.description}
          </Typography>
        </Collapse>

        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>

        {complaint.resolution && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Resolution
            </Typography>
            <Typography variant="body2">{complaint.resolution}</Typography>
          </Alert>
        )}

        {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
          <>
            {isResolving ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe how this complaint was resolved..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => setIsResolving(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={handleResolve}
                    disabled={!resolution.trim()}
                    startIcon={<ResolvedIcon />}
                  >
                    Mark Resolved
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box display="flex" gap={1} sx={{ mt: 2 }}>
                {complaint.status === 'open' && onAssign && (
                  <Button
                    size="small"
                    startIcon={<AssignmentIcon />}
                    onClick={() => onAssign(complaint.id)}
                  >
                    Assign to me
                  </Button>
                )}
                {onResolve && (
                  <Button
                    size="small"
                    color="success"
                    startIcon={<ResolvedIcon />}
                    onClick={() => setIsResolving(true)}
                  >
                    Resolve
                  </Button>
                )}
                {onViewUpdates && complaint.updates_count > 0 && (
                  <Button
                    size="small"
                    startIcon={<CommentIcon />}
                    onClick={() => onViewUpdates(complaint.id)}
                  >
                    View Updates ({complaint.updates_count})
                  </Button>
                )}
              </Box>
            )}
          </>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {complaint.status !== 'resolved' && onAssign && (
            <MenuItem
              onClick={() => {
                onAssign(complaint.id);
                handleMenuClose();
              }}
            >
              Assign to me
            </MenuItem>
          )}
          {onUpdateStatus && complaint.status !== 'closed' && (
            <MenuItem
              onClick={() => {
                onUpdateStatus(complaint.id, 'closed');
                handleMenuClose();
              }}
            >
              Close Complaint
            </MenuItem>
          )}
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
