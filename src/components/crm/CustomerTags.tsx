import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useCustomerTags, useTagCustomer, useUntagCustomer } from '../../hooks/useCRM';

interface CustomerTagsProps {
  customerId: string;
  currentTags: Array<{ id: string; name: string; color: string | null }>;
}

const CustomerTags: React.FC<CustomerTagsProps> = ({ customerId, currentTags }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: allTags, isLoading } = useCustomerTags();
  const tagCustomerMutation = useTagCustomer();
  const untagCustomerMutation = useUntagCustomer();

  const currentTagIds = currentTags.map((tag) => tag.id);
  const availableTags = allTags?.filter((tag) => !currentTagIds.includes(tag.id)) || [];

  const handleAddTag = async (tagId: string) => {
    try {
      await tagCustomerMutation.mutateAsync({ customerId, tagId });
      setDialogOpen(false);
    } catch (err) {
      logger.error('Failed to add tag:', err);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await untagCustomerMutation.mutateAsync({ customerId, tagId });
    } catch (err) {
      logger.error('Failed to remove tag:', err);
    }
  };

  return (
    <Box>
      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
        {currentTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onDelete={() => handleRemoveTag(tag.id)}
            sx={{
              bgcolor: tag.color || undefined,
              color: tag.color ? '#fff' : undefined
            }}
          />
        ))}
        <IconButton
          size="small"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Tag
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : availableTags.length > 0 ? (
            <List>
              {availableTags.map((tag) => (
                <ListItem key={tag.id} disablePadding>
                  <ListItemButton onClick={() => handleAddTag(tag.id)}>
                    <Chip
                      label={tag.name}
                      size="small"
                      sx={{
                        mr: 2,
                        bgcolor: tag.color || undefined,
                        color: tag.color ? '#fff' : undefined
                      }}
                    />
                    <ListItemText primary={tag.category || 'Uncategorized'} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              All available tags have been added to this customer
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerTags;
