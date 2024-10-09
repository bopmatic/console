import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FBA919', // Custom primary color BOPMATIC ORANGE
      light: '#FBA919', // Custom light shade TODO: Use this later if we decide to do light and dark mode
      dark: '#A06603', // Custom dark shade TODO: Use this later if we decide to do light and dark mode
      contrastText: '#131523', // Custom text color on primary buttons
    },
    secondary: {
      main: '#FFEED1', // Custom secondary color BOPMATIC LIGHT ORANGE
      light: '#FFEED1', // Custom light shade TODO: Use this later if we decide to do light and dark mode
      dark: '#FFEED1', // Custom dark shade TODO: Use this later if we decide to do light and dark mode
      contrastText: '#231A13', // Custom text color on secondary buttons
    },
    error: {
      main: '#E03400', // Custom error color
    },
    warning: {
      main: '#ffa726', // Custom warning color
    },
    info: {
      main: '#29b6f6', // Custom info color
    },
    success: {
      main: '#1E8103', // Custom success color
    },
    background: {
      default: '#F5F6FA', // Background color of the app
      paper: '#ffffff', // Background color for paper components
    },
    text: {
      primary: '#131523', // BopmaticText "black"
      secondary: '#5A607F', // BopmaticGreyText
      disabled: '#A1A7C4', // Mostly for key-value pair KEY piece
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;
