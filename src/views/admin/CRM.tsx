import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { API_URL, STORAGE_KEYS } from '@/utils/constants';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  LocalOffer as TagIcon,
  FileDownload as ExportIcon
} from '@mui/icons-material';
import CustomerCard from '../../components/crm/CustomerCard';
import CustomerSegments from '../../components/crm/CustomerSegments';
import TagManager from '../../components/crm/TagManager';
import { useCustomers } from '../../hooks/useCRM';

const CRM: React.FC = () => {
  const [segment, setSegment] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const { data, isLoading, error } = useCustomers(segment, undefined, search, skip, pageSize);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async () => {
    handleMenuClose();

    try {
      // Fetch all customers for export (high limit)
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const params = new URLSearchParams();
      if (segment) params.append('segment', segment);
      if (search) params.append('search', search);
      params.append('skip', '0');
      params.append('limit', '10000'); // Export up to 10k customers

      const response = await fetch(
        `${API_URL}/crm/customers?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch customers');

      const result = await response.json();
      const customers = result.customers || [];

      if (customers.length === 0) {
        alert('No customers to export');
        return;
      }

      // Convert to CSV
      const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Total Visits', 'Lifetime Value', 'Last Visit', 'Created At'];
      const csvRows = [
        headers.join(','),
        ...customers.map((c: any) => [
          c.id,
          `"${(c.first_name || '').replace(/"/g, '""')}"`,
          `"${(c.last_name || '').replace(/"/g, '""')}"`,
          `"${(c.email || '').replace(/"/g, '""')}"`,
          `"${(c.phone || '').replace(/"/g, '""')}"`,
          c.total_visits || 0,
          c.lifetime_value || 0,
          c.last_visit_at ? new Date(c.last_visit_at).toLocaleDateString() : '',
          c.created_at ? new Date(c.created_at).toLocaleDateString() : ''
        ].join(','))
      ];

      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (error) {
      logger.error('Export failed:', error);
      alert('Failed to export customers. Please try again.');
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Customer Relationship Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<TagIcon />}
            onClick={() => setTagManagerOpen(true)}
          >
            Manage Tags
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleExport}>
          <ExportIcon sx={{ mr: 1 }} />
          Export to CSV
        </MenuItem>
      </Menu>

      <Paper sx={{ p: 3, mb: 3 }}>
        <CustomerSegments value={segment} onChange={(newSegment) => {
          setSegment(newSegment);
          setPage(1);
        }} />

        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load customers</Alert>
        ) : data && data.customers.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {data.customers.map((customer: any) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={customer.id}>
                  <CustomerCard customer={customer} />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="text.secondary">
              No customers found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {segment
                ? `No customers in the "${segment}" segment`
                : search
                ? 'Try adjusting your search terms'
                : 'No customers have been added yet'}
            </Typography>
          </Box>
        )}
      </Paper>

      <TagManager open={tagManagerOpen} onClose={() => setTagManagerOpen(false)} />
    </Container>
  );
};

export default CRM;
