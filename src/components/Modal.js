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
import { db, storage } from "../firebase.js";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";

export default function ModalDialog({ permission, classCode, text, url, open, option, onClose }) {
  const [input, setInput] = useState(text);
  const [image, setImage] = useState(url);
  const [imageName, setImageName] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open) {
      setInput(text);
      setImage(url);
      setImageName('');
    }
  }, [open]);

  const handleImageUpload = (e) => {
    const fileNew = e.target.files[0];
    setImageName(fileNew ? fileNew.name : '');
    setFile(fileNew);
  };

  const uploadImg = async (newHomeworks) => {
    const storageRef = ref(storage, `/164/homeworks/${classCode}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      () => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          setImage(url);
          newHomeworks[option] = {url: url, text: input}
          updateDoc(doc(db, "164", classCode), {homeworks: newHomeworks});
          onClose();
        });
      }
    );
  }

  const handleSubmit = async () => {
    const docSnap = await getDoc(doc(db, "164", classCode));
    let newHomeworks = docSnap.data().homeworks;
    let newUrl = image;
    if(file) {
      newUrl = await uploadImg(newHomeworks);
      if(url.includes("firebasestorage.googleapis.com/v0/b/homeworklogger")) {
        const startIndex = 79;
        const endIndex = url.indexOf('?alt=media');
        const encodedPath = url.substring(startIndex, endIndex);
        const decodedPath = decodeURIComponent(encodedPath);
        const fileRef = ref(storage, decodedPath);
        deleteObject(fileRef);
      }
    } else {
      newHomeworks[option] = {url: newUrl, text: input}
      updateDoc(doc(db, "164", classCode), {homeworks: newHomeworks});
      onClose();
    }
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
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{
              maxWidth: '100%',
              borderRadius: 8,
              objectFit: 'contain',
            }}
          />
        )}

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
          sx={{ mb: 2 }}
        />

        {permission === 'write' && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              component="label"
              sx={{ borderRadius: 2 }}
            >
              Ներբեռնել լուսանկար
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>

            {imageName && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {imageName}
              </Typography>
            )}
          </Box>
        )}
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