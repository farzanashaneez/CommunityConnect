import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Do you want to continue?",
  confirmText = "Yes",
  cancelText = "No"
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '12px',
          padding: '16px',
        },
      }}
    >
      <DialogTitle sx={{ 
        m: 'auto', 
        p: 2, 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        color: 'primary.main'
      }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={onClose} 
            color="secondary" 
            variant="text"
            sx={{ 
              minWidth: '100px',
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            color="primary" 
            variant="text"
            sx={{ 
              minWidth: '100px',
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            {confirmText}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
