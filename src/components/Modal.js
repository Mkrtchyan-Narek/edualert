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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{option}</DialogTitle>
      <DialogContent>
        {image != "" && (
          <Box mb={2}>
            <img
              src={image}
              alt="Preloaded"
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
          </Box>
        )}
        <TextField
          multiline
          rows={4}
          placeholder="Գրեք..."
          fullWidth
          value={input}
          onChange={permission == "write" ? (e) => setInput(e.target.value) : ()=>{}}
          sx={{ mb: 2 }}
        />
        {permission == "write" ? (<>
          <Button variant="contained" component="label" sx={{ mr: 2 }}>
            Ներբեռնել լուսանկար
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {imageName && (
            <Typography variant="body2" color="textSecondary">
              Ընտրված ֆայլը՝ {imageName}
            </Typography>
          )}
        </>) : null}
      </DialogContent>
      <DialogActions>
        <Button disabled={permission=="read"} onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#26b8b8', '&:hover': { backgroundColor: '#1ea0a0' } }}>
          Պահպանել
        </Button>
        <Button onClick={onClose} sx={{ backgroundColor: '#ffffff' }}>
          Փակել
        </Button>
      </DialogActions>
    </Dialog>
  );
}
