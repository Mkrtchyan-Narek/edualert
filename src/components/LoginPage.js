import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function LoginPage({ setPermission, onLogin, classCode, setClassCode }) {
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    if(document.cookie == "" || !document.cookie.includes("permission=")) {
      document.cookie = `classCode=noClass&permission=read; path=/; max-age=3600`;
      return;
    }
    const cookieValue = `; ${document.cookie}`;
    const parts = cookieValue.split(`; classCode=`);
    let code, permission;
    const combined = parts.pop().split(';').shift();
    const [classCodePart, permissionPart] = combined.split('&');
    code = classCodePart.split('=')[1] || classCodePart;
    permission = permissionPart.split('=')[1];

    if (code != "noClass") {
      setClassCode(code);
      setPermission(permission);
      onLogin();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password == "" || classCode == "") {
      setSnackbar({ open: true, message: 'Սխալ դասարան կամ գաղտնաբառ', severity: 'error' });
    }
    const docSnap = await getDoc(doc(db, "164", classCode));
    if (docSnap.data()?.password == password) {
      setClassCode(classCode);
      document.cookie = `classCode=${classCode}&permission=read; path=/; max-age=3600`;
      setPermission("read");
      onLogin();
    } else if (docSnap.data()?.adminPassword == password) {
      setClassCode(classCode);
      document.cookie = `classCode=${classCode}&permission=write; path=/; max-age=3600`;
      setPermission("write");
      onLogin();
    } else {
      setSnackbar({ open: true, message: 'Սխալ դասարան կամ գաղտնաբառ', severity: 'error' });
    }
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" mb={2}>Մուտք</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Դասարան"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Գաղտնաբառ"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: '#26b8b8',
              '&:hover': { backgroundColor: '#1ea0a0' },
            }}
          >
            Մուտք
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
