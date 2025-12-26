import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAddCustomerNote } from '../../hooks/useCRM';

interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  customerId: string;
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ open, onClose, customerId }) => {
  const [noteText, setNoteText] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const addNoteMutation = useAddCustomerNote();

  const handleSubmit = async () => {
    if (!noteText.trim()) return;

    try {
      await addNoteMutation.mutateAsync({
        customerId,
        noteText,
        isImportant
      });
      setNoteText('');
      setIsImportant(false);
      onClose();
    } catch (err) {
      logger.error('Failed to add note:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Note
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          placeholder="Enter note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          variant="outlined"
          sx={{ mt: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
          }
          label="Mark as important"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!noteText.trim() || addNoteMutation.isPending}
        >
          Add Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNoteDialog;
