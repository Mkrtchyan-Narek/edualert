import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [permission, setPermission] = useState("read");

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `repeating-linear-gradient(
          45deg,
          #f7f9fb,
          #f7f9fb 20px,
          #eef2f6 20px,
          #eef2f6 40px
        )`,
      }}>
      <AppBar
        position="static"
        elevation={6}
        sx={{
          background: 'linear-gradient(135deg, #26b8b8, #1ea0a0)',
          borderRadius: 2,
          // cursor: 'pointer',
        }}
      >
        <Toolbar sx={{ minHeight: 72, justifyContent: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              letterSpacing: 1.5,
              opacity: 0.85,
            }}
          >
            Edualert
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {
          loggedIn
              ? <Dashboard classCode={classCode} setClassCode={setClassCode} permission={permission} />
              : <LoginPage onLogin={() => setLoggedIn(true)} classCode={classCode} setClassCode={setClassCode} setPermission={setPermission} />
        }
      </Container>
    </Box>
  );
}
