import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useCustomerTags, useCreateTag } from '../../hooks/useCRM';

interface TagManagerProps {
  open: boolean;
  onClose: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ open, onClose }) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#1976d2');
  const [newTagCategory, setNewTagCategory] = useState('');

  const { data: tags, isLoading } = useCustomerTags();
  const createTagMutation = useCreateTag();

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTagMutation.mutateAsync({
        name: newTagName,
        color: newTagColor,
        category: newTagCategory || undefined
      });
      setNewTagName('');
      setNewTagColor('#1976d2');
      setNewTagCategory('');
    } catch (err) {
      logger.error('Failed to create tag:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Tag Manager
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={3} p={2} bgcolor="grey.100" borderRadius={1}>
          <TextField
            fullWidth
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2} mb={2}>
            <TextField
              type="color"
              label="Color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              sx={{ width: 100 }}
            />
            <TextField
              fullWidth
              placeholder="Category (optional)"
              value={newTagCategory}
              onChange={(e) => setNewTagCategory(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || createTagMutation.isPending}
          >
            Create Tag
          </Button>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {tags?.map((tag) => (
              <ListItem key={tag.id}>
                <Chip
                  label={tag.name}
                  sx={{
                    mr: 2,
                    bgcolor: tag.color || undefined,
                    color: tag.color ? '#fff' : undefined
                  }}
                />
                <ListItemText
                  primary={tag.category || 'Uncategorized'}
                  secondary={`Created: ${new Date(tag.created_at).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagManager;
