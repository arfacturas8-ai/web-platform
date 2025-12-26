import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, PriorityHigh } from '@mui/icons-material';
import { useCustomerNotes, useAddCustomerNote } from '../../hooks/useCRM';
import { format } from 'date-fns';

interface CustomerNotesProps {
  customerId: string;
}

const CustomerNotes: React.FC<CustomerNotesProps> = ({ customerId }) => {
  const [noteText, setNoteText] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const { data: notes, isLoading, error } = useCustomerNotes(customerId);
  const addNoteMutation = useAddCustomerNote();

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      await addNoteMutation.mutateAsync({
        customerId,
        noteText,
        isImportant
      });
      setNoteText('');
      setIsImportant(false);
    } catch (err) {
      logger.error('Failed to add note:', err);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load notes</Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Customer Notes
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Add a note about this customer..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          variant="outlined"
          sx={{ mb: 1 }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
            }
            label="Important"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNote}
            disabled={!noteText.trim() || addNoteMutation.isPending}
          >
            Add Note
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <ListItem
              key={note.id}
              sx={{
                bgcolor: note.is_important ? 'warning.light' : 'transparent',
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    {note.is_important && <PriorityHigh color="error" fontSize="small" />}
                    <Typography variant="body1">{note.note_text}</Typography>
                  </Box>
                }
                secondary={format(new Date(note.created_at), 'PPpp')}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No notes yet
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default CustomerNotes;
