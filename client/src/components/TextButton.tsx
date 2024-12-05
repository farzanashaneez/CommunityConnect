// TextButton.tsx
import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface TextButtonProps extends ButtonProps {
  label: string; // Label for the button
}

const TextButton: React.FC<TextButtonProps> = ({ label, ...props }) => {
  return (
    <Button
      variant="text"
      sx={{
        fontSize: '0.875rem', // Smaller font size
        padding: '4px 8px', // Smaller padding
        textTransform: 'none', // Prevent uppercase transformation
        '&:hover': {
          backgroundColor: (theme) => theme.palette.action.hover, // Subtle hover effect
        },
      }}
      {...props} // Spread other props to allow customization
    >
      {label}
    </Button>
  );
};

export default TextButton;