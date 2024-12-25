import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B3A0E', // Your primary color
    },
    secondary: {
      main: '#ff4081', // Optional: Your secondary color
    },
    text: {
      primary: '#333', // Default text color
      secondary: '#555', // Optional: Secondary text color
    },
  },
  typography: {
    h4: {
      color: '#8B3A0E', // Heading color for h4
      fontWeight: 'bold', // Bold heading
    },
    button: {
      textTransform: 'none', 
    },
    body2: {
      color: '#8B3A0E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Rounded corners for all buttons
          padding: '10px 20px', // Padding for buttons
          '&:hover': {
            backgroundColor: 'transparent', // Keep the background transparent
            color: '#1976d2', // Change text color on hover
          },
        },
      },
    },
  },
});
