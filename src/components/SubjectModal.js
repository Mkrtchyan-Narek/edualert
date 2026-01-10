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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export default function ModalDialog({ classCode, open, onClose, sign, mode, handleChange, school }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    setTitle("");
    setText("");
    setDeadline("");
  }, [open]);

  const handleSubmit = async () => {
    const docRef = doc(db, school, classCode);
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
      handleChange(`removed from ${mode === "task" ? "tasks" : "subjects"}`);
    } else {
      if (items[title]) {
        setTitle("Արդեն կա");
        return;
      }
      items[title] = mode === "task"
        ? { text, deadline }
        : { text: "" };
      handleChange(`added to ${mode === "task" ? "tasks" : "subjects"}`);
    }

    await updateDoc(docRef, { [field]: items });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3},
      }}
      disableEnforceFocus={false} 
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {(sign === "-")
            ? (mode === "task" ? "Շտապ Առաջադրանքի Հեռացում" : "Առարկայի Հեռացում")
            : (mode === "task" ? "Շտապ Առաջադրանքի Ավելացում" : "Առարկայի Ավելացում")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          label="Վերնագիր"
          placeholder="Օրինակ՝ Քիմիա կամ Առաջադրանք 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        {sign === "+" && mode === "task" && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Տեքստ"
              multiline
              rows={3}
              placeholder="Գրեք առաջադրանքի նկարագրությունը"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <TextField
              fullWidth
              label="Ժամկետ"
              placeholder="Օրինակ՝ 2025-06-01"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
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
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          Փակել
        </Button>
      </DialogActions>
    </Dialog>
  );
}
