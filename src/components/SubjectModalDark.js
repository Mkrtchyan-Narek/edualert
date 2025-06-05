import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from '@mui/material';
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function ModalDialog({ classCode, open, onClose, sign, mode }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    setTitle("");
    setText("");
    setDeadline("");
  }, [open]);

  const handleSubmit = async () => {
    const docRef = doc(db, "164", classCode);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const field = mode === "task" ? "tasks" : "homeworks";
    const items = { ...data[field] };

    if (sign === "-") {
      if (!items[title]) {
        setTitle("Չկա նման տարր");
        return;
      }
      delete items[title];
    } else {
      if (items[title]) {
        setTitle("Արդեն կա");
        return;
      }
      items[title] = mode === "task"
        ? { text, deadline }
        : { text: "", url: "" };
    }

    await updateDoc(docRef, { [field]: items });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: '#121212', color: '#e0e0e0' } }}
    >
      <DialogTitle>
        <Typography variant="h6" fontSize={18} color="#FF5722">
          {(sign === "-")
            ? (mode === "task" ? "Շտապ Առաջադրանքի Հեռացում" : "Առարկայի Հեռացում")
            : (mode === "task" ? "Շտապ Առաջադրանքի Ավելացում" : "Առարկայի Ավելացում")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Վերնագիր"
          placeholder="Օրինակ՝ Քիմիա կամ Առաջադրանք 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 2,
            input: { color: '#e0e0e0' },
            label: { color: '#e0e0e0' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#FF5722' },
              '&.Mui-focused fieldset': { borderColor: '#FF5722' },
            },
            '& label.Mui-focused': {
  color: '#FF5722',
},
          }}
        />
        {sign === "+" && mode === "task" && (
          <>
            <TextField
              fullWidth
              label="Տեքստ"
              multiline
              rows={3}
              placeholder="Գրեք առաջադրանքի նկարագրությունը"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                mb: 2,
                input: { color: '#e0e0e0' },
                label: { color: '#e0e0e0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#FF5722' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
                '& label.Mui-focused': {
  color: '#FF5722',
},
              }}
            />
            <TextField
              fullWidth
              label="Ժամկետ"
              placeholder="Օրինակ՝ 2025-06-01"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              sx={{
                mb: 2,
                input: { color: '#e0e0e0' },
                label: { color: '#e0e0e0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#FF5722' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
                '& label.Mui-focused': {
  color: '#FF5722',
},
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#FF5722',
            '&:hover': { backgroundColor: '#e64a19' },
            color: '#fff',
          }}
        >
          Պահպանել
        </Button>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: '#333',
            color: '#e0e0e0',
            '&:hover': { backgroundColor: '#555' },
          }}
        >
          Փակել
        </Button>
      </DialogActions>
    </Dialog>
  );
}
