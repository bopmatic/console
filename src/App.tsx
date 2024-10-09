import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import AppRoutes from './routes/Routes';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const App: React.FC = () => {
  return (
    <JotaiProvider>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </JotaiProvider>
  );
};

export default App;
