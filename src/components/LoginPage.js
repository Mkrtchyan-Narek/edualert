import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

export default function LoginPage({ setPermission, onLogin, classCode, setClassCode }) {
  const [school, setSchool] = useState('164');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const init = async () => {
      await setPersistence(auth, browserLocalPersistence);

      const storedClass = localStorage.getItem('classCode');
      const storedSchool = localStorage.getItem('school');
      const user = auth.currentUser;

      if (storedClass) setClassCode(storedClass);
      if (storedSchool) setSchool(storedSchool);
      if (user && storedClass && storedSchool) {
        const docSnap = await getDoc(doc(db, storedSchool, storedClass));
        const students = docSnap.data()?.students || [];
        if (students.includes(user.email)) {
          setEmail(user.email);
          setPermission("write");
          onLogin();
        }
      }
    };
    init();
  }, [setClassCode, setPermission, onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !classCode) {
      setSnackbar({ open: true, message: 'Խնդրում ենք լրացնել բոլոր դաշտերը', severity: 'error' });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docSnap = await getDoc(doc(db, school, classCode));
      const students = docSnap.data()?.students || [];

      if (students.includes(user.email)) {
        localStorage.setItem('classCode', classCode);
        localStorage.setItem('school', school);

        setPermission("write");
        onLogin();
      } else {
        setSnackbar({ open: true, message: 'Դուք չունեք մուտքի թույլտվություն', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Սխալ էլ․ հասցե կամ գաղտնաբառ', severity: 'error' });
    }
  };

  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>Մուտք</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Նախընտրած դպրոց</InputLabel>
            <Select
              value={school}
              label="Նախընտրած դպրոց"
              onChange={(e) => setSchool(e.target.value)}
            >
              <MenuItem value="164">164</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Դասարան"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Էլ․ հասցե"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
