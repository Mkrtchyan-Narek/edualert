import { useState, useEffect } from 'react';
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
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

export default function LoginPage({ setPermission, onLogin, classCode, setClassCode, school, setSchool }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await setPersistence(auth, browserLocalPersistence);
      const user = auth.currentUser;
      const storedClass = localStorage.getItem('classCode');
      const storedSchool = localStorage.getItem('school');

      if (user && storedClass && storedSchool) {
        setEmail(user.email || '');
        setClassCode(storedClass);
        setSchool(storedSchool);
        setPermission("write");
        onLogin();
      }
    };
    init();
  }, [setClassCode, setPermission, onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!email || !password || !classCode) {
      setSnackbar({ open: true, message: 'Լրացրեք բոլոր դաշտերը', severity: 'error' });
      setLoading(false);
      return;
    }

    const activeClass = classCode;
    const activeSchool = school;

    try {
      const snap = await getDoc(doc(db, activeSchool, activeClass));
      const students = snap.data()?.students || [];

      if (!students.includes(email)) {
        setSnackbar({
          open: true,
          message: 'Ձեր էլ․ հասցեն դասարանում գրանցված չէ',
          severity: 'error',
        });
        setLoading(false);
        return;
      }

      if (mode === 'signin') {
        const res = await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem("classCode", activeClass);
        localStorage.setItem("school", activeSchool);

        setPermission("write");
        onLogin();
        setLoading(false);
      } else {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, password);

          localStorage.setItem("classCode", activeClass);
          localStorage.setItem("school", activeSchool);

          setPermission("write");
          onLogin();
          setLoading(false);
        } catch {
          setSnackbar({
            open: true,
            message: 'Գրանցումը ձախողվեց',
            severity: 'error',
          });
          setLoading(false);
        }
      }
    } catch (err) {
      if (err.code === "auth/invalid-login-credentials") {
        setSnackbar({
          open: true,
          message: 'Սխալ էլ․ հասցե կամ գաղտնաբառ',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Մուտքը ձախողվեց',
          severity: 'error',
        });
      }
      setLoading(false);
    }
  };

  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Paper elevation={4} sx={{ p: 3, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>
          {mode === 'signin' ? 'Մուտք' : 'Գրանցում'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* <FormControl fullWidth margin="normal">
            <InputLabel>Նախընտրած դպրոց</InputLabel>
            <Select
              value={school}
              label="Նախընտրած դպրոց"
              onChange={(e) => setSchool(e.target.value)}
            >
              <MenuItem value="164">164</MenuItem>
            </Select>
          </FormControl> */}
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
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: '#26b8b8',
              '&:hover': { backgroundColor: '#1ea0a0' },
            }}
          >
            {mode === 'signin' ? 'Մուտք' : 'Գրանցում'}
          </Button>
        </Box>

        <Box mt={1}>
          <Button variant="text" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? 'Գրանցվել' : 'Մուտք'}
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
