import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#00ff00',
      secondary: '#00ff00',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    allVariants: {
      color: '#00ff00',
    },
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          '&.Mui-checked': {
            color: '#00ff00',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#00ff00',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          '&.Mui-focused': {
            color: '#00ff00',
          },
        },
      },
    },
  },
});