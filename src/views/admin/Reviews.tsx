import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Pagination,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Star as StarIcon,
  RateReview as ReviewIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import ReviewCard from '../../components/feedback/ReviewCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

const Reviews: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['reviews', statusFilter, ratingFilter, page],
    queryFn: async () => {
      const params: any = { skip: (page - 1) * 20, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (ratingFilter > 0) params.min_rating = ratingFilter;

      const response = await api.get('/feedback/reviews', { params });
      return response.data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      const response = await api.get('/feedback/analytics/overview', { params: { days: 30 } });
      return response.data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      return api.post(`/feedback/reviews/${reviewId}/respond`, null, {
        params: { response },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: string }) => {
      return api.put(`/feedback/reviews/${reviewId}/moderate`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-analytics'] });
    },
  });

  const handleRespond = (reviewId: string, response: string) => {
    respondMutation.mutate({ reviewId, response });
  };

  const handleModerate = (reviewId: string, status: string) => {
    moderateMutation.mutate({ reviewId, status });
  };

  const totalPages = reviewsData ? Math.ceil(reviewsData.total / 20) : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Customer Reviews
      </Typography>

      {analytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <StarIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.average_rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ReviewIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.total_reviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reviews
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {analytics.satisfaction_score.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      NPS Score
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} mb={3}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="flagged">Flagged</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingFilter}
              label="Rating"
              onChange={(e) => {
                setRatingFilter(Number(e.target.value));
                setPage(1);
              }}
            >
              <MenuItem value={0}>All Ratings</MenuItem>
              <MenuItem value={5}>5 Stars</MenuItem>
              <MenuItem value={4}>4+ Stars</MenuItem>
              <MenuItem value={3}>3+ Stars</MenuItem>
              <MenuItem value={2}>2+ Stars</MenuItem>
              <MenuItem value={1}>1+ Stars</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load reviews</Alert>
        ) : reviewsData?.reviews.length === 0 ? (
          <Alert severity="info">No reviews found</Alert>
        ) : (
          <>
            {reviewsData?.reviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                review={review}
                onRespond={handleRespond}
                onModerate={handleModerate}
                isAdmin
              />
            ))}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Reviews;
