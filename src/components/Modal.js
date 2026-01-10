import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography
} from '@mui/material';
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function ModalDialog({ permission, classCode, text, open, option, onClose }) {
  const [input, setInput] = useState(text);

  useEffect(() => {
    if (open) {
      setInput(text);
    }
  }, [open]);

  const handleSubmit = async () => {
    const docSnap = await getDoc(doc(db, "164", classCode));
    let newHomeworks = docSnap.data().homeworks;
    newHomeworks[option] = {text: input}
    updateDoc(doc(db, "164", classCode), {homeworks: newHomeworks});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3
        },
      }}
      disableEnforceFocus={false} 
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {option}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>

        <TextField
          multiline
          rows={4}
          placeholder="Գրեք..."
          fullWidth
          value={input}
          onChange={
            permission === 'write'
              ? (e) => setInput(e.target.value)
              : undefined
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          disabled={permission === 'read'}
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            bgcolor: '#26b8b8',
            '&:hover': { bgcolor: '#1ea0a0' },
          }}
        >
          Պահպանել
        </Button>

        <Button
          onClick={onClose}
          sx={{ borderRadius: 2 }}
        >
          Փակել
        </Button>
      </DialogActions>
    </Dialog>

  );
}