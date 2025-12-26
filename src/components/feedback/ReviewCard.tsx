import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  VerifiedUser as VerifiedIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string;
  food_rating?: number;
  service_rating?: number;
  ambiance_rating?: number;
  value_rating?: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  response?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
  onRespond?: (reviewId: string, response: string) => void;
  onModerate?: (reviewId: string, status: string) => void;
  isAdmin?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onRespond,
  onModerate,
  isAdmin = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModerate = (status: string) => {
    if (onModerate) {
      onModerate(review.id, status);
    }
    handleMenuClose();
  };

  const handleSubmitResponse = () => {
    if (onRespond && responseText.trim()) {
      onRespond(review.id, responseText);
      setResponseText('');
      setIsResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'flagged':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" gap={2} flex={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getInitials(review.customer_name)}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.customer_name}
                </Typography>
                {review.is_verified_purchase && (
                  <VerifiedIcon color="primary" fontSize="small" />
                )}
                {isAdmin && (
                  <Chip
                    label={review.status}
                    size="small"
                    color={getStatusColor(review.status)}
                  />
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <StarRating value={review.rating} readOnly size="small" showLabel />
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>
          </Box>
          {isAdmin && (
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        {review.comment && (
          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
            {review.comment}
          </Typography>
        )}

        {(review.food_rating || review.service_rating || review.ambiance_rating || review.value_rating) && (
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1 }}>
            {review.food_rating && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Food
                </Typography>
                <StarRating value={review.food_rating} readOnly size="small" />
              </Box>
            )}
            {review.service_rating && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Service
                </Typography>
                <StarRating value={review.service_rating} readOnly size="small" />
              </Box>
            )}
            {review.ambiance_rating && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ambiance
                </Typography>
                <StarRating value={review.ambiance_rating} readOnly size="small" />
              </Box>
            )}
            {review.value_rating && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Value
                </Typography>
                <StarRating value={review.value_rating} readOnly size="small" />
              </Box>
            )}
          </Box>
        )}

        {review.response && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Response from Restaurant
            </Typography>
            <Typography variant="body2">{review.response}</Typography>
          </Box>
        )}

        {isAdmin && !review.response && (
          <>
            {isResponding ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button size="small" onClick={() => setIsResponding(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim()}
                  >
                    Submit Response
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                size="small"
                onClick={() => setIsResponding(true)}
                sx={{ mt: 2 }}
              >
                Respond
              </Button>
            )}
          </>
        )}

        {!isAdmin && (
          <Box display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
            <IconButton size="small">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {review.helpful_count} found this helpful
            </Typography>
          </Box>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {review.status === 'pending' && (
            <MenuItem onClick={() => handleModerate('approved')}>Approve</MenuItem>
          )}
          <MenuItem onClick={() => handleModerate('flagged')}>Flag</MenuItem>
          <MenuItem onClick={() => handleModerate('rejected')}>Reject</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
