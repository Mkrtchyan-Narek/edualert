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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontSize={18}>
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
          sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Ժամկետ"
              placeholder="Օրինակ՝ 2025-06-01"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#26b8b8', '&:hover': { backgroundColor: '#1ea0a0' } }}>
          Պահպանել
        </Button>
        <Button onClick={onClose} sx={{ backgroundColor: '#ffffff' }}>
          Փակել
        </Button>
      </DialogActions>
    </Dialog>
  );
}
