import { styled } from '@mui/material/styles';

export const StyledFileInput = styled('input')({
  display: 'inline-block',
  padding: '10px 15px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#333',
  backgroundColor: '#ffffff',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: '16px',
  width: 'calc(100% - 30px)',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: '#f5f5f5',
  },
  '&:focus': {
    outline: 'none',
    borderColor: '#1976d2',
    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
  },
  '&::file-selector-button': {
    display: 'none',
  },
  '&::before': {
    content: '"Choose File"',
    display: 'inline-block',
    background: '#1976d2',
    color: '#ffffff',
    padding: '8px 12px',
    borderRadius: '4px',
    marginRight: '10px',
  },
});