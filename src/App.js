import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import LoginPageDark from './components/LoginPageDark';
import DashboardDark from './components/DashboardDark';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [permission, setPermission] = useState("read");
  const [mode, setMode] = useState(false);
  document.body.style.backgroundColor = mode ? 'white' : "#121212";
  document.body.style.color = mode ? "black" : "#e0e0e0";
  return (
    <>
      <AppBar onClick={() => {setMode(!mode)}} position="static" sx={mode ? {backgroundColor: '#26b8b8', '&:hover': { backgroundColor: '#1ea0a0' }} : {backgroundColor: '#FF5722', '&:hover': { backgroundColor: "#e64a19" }}} elevation={4}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            EDUALERT
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {mode
          ? (loggedIn
              ? <Dashboard onLogout={() => setLoggedIn(false)} classCode={classCode} setClassCode={setClassCode} permission={permission} />
              : <LoginPage onLogin={() => setLoggedIn(true)} classCode={classCode} setClassCode={setClassCode} setPermission={setPermission} />
            )
          : (loggedIn
              ? <DashboardDark onLogout={() => setLoggedIn(false)} classCode={classCode} setClassCode={setClassCode} permission={permission} />
              : <LoginPageDark onLogin={() => setLoggedIn(true)} classCode={classCode} setClassCode={setClassCode} setPermission={setPermission} />
            )
        }
      </Container>
    </>
  );
}
