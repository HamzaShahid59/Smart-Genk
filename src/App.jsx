import React from 'react';
import ChatBot from './ChatInterface';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.5px',
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          background: '#1e293b',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Container 
          maxWidth={false} 
          disableGutters
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChatBot />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;