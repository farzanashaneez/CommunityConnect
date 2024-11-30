import React from 'react';
import { Modal, Box, Typography, Button, ThemeProvider, createTheme } from '@mui/material';

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  handleClose,
  title,
  content,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showConfirm = true,
  showCancel = true
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography sx={{ mb: 3 }}>{content}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {showCancel && (
              <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mr: showConfirm ? 1 : 0 }}>
                {cancelText}
              </Button>
            )}
            {showConfirm && (
              <Button variant="contained" color="primary" onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default CustomModal;