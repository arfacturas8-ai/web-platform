import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  precision?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  showLabel = false,
  precision = 1,
}) => {
  const labels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Rating
        value={value}
        onChange={(_, newValue) => {
          if (onChange && newValue !== null) {
            onChange(newValue);
          }
        }}
        readOnly={readOnly}
        size={size}
        precision={precision}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
      />
      {showLabel && !readOnly && value > 0 && (
        <Typography variant="body2" color="text.secondary">
          {labels[Math.round(value)]}
        </Typography>
      )}
      {showLabel && readOnly && (
        <Typography variant="body2" color="text.secondary">
          ({value.toFixed(1)})
        </Typography>
      )}
    </Box>
  );
};

export default StarRating;
