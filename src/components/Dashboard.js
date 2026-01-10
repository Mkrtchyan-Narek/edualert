import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import ModalDialog from './Modal';
import SubjectModalDialog from './SubjectModal';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase.js";
import { signOut } from "firebase/auth";

export default function Dashboard({ permission, classCode, school }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [text, setText] = useState("");
  const [sign, setSign] = useState("");
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState("subject");

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('classCode');
      localStorage.removeItem('school');
      window.location.reload();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleChange = async (field) => {
    if (!auth.currentUser || !classCode) return;

    const docRef = doc(db, school, classCode);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const log = docSnap.data().log || [];

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    const newEntry = {
      editor: auth.currentUser.email,
      time: formattedDate,
      field: field,
    };

    const newLog = log.length < 25 ? [...log, newEntry] : [newEntry]; 

    await updateDoc(docRef, { log: newLog });
  }

  useEffect(() => {
  const fetchData = async () => {
    const docSnap = await getDoc(doc(db, school, classCode));
    
    const data = docSnap.data();
    
    const newSubjects = Object.entries(data.homeworks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
    }));
    setSubjects(newSubjects);

    const newTasks = Object.entries(data.tasks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
      deadline: value.deadline
    }));
    setTasks(newTasks);
  };

  fetchData();

  const unsubscribe = onSnapshot(doc(db, school, classCode), (snapshot) => {
    const data = snapshot.data();

    const newSubjects = Object.entries(data.homeworks || {}).map(([key, value]) => ({
      title: key,
      text: value.text
    }));
    setSubjects(newSubjects);

    const newTasks = Object.entries(data.tasks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
      deadline: value.deadline
    }));
    setTasks(newTasks);
  });

  return () => unsubscribe();
}, []);


  const handleButtonClick = (option) => {
    setSelectedOption(option.title);
    setText(option.text);
    setModalOpen(true);
  };

  return (
    <>
      <Box sx={{
          display: 'inline-flex',
          borderRadius: 3,
          boxShadow: 2,
          p: 2,
          bgcolor: '#fefefe',
          mb: 2,
          gap: 1,
          border: "1px solid #ccc",
          width: 'fit-content',
        }}
      >
  {(permission == "write") ? (<>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("+"); setMode("task")}} sx={{ backgroundColor: '#f57c00', color: '#fff', '&:hover': { backgroundColor: '#e66a00' }, boxShadow: 2 }}>
      <AddIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("-"); setMode("task")}} sx={{ backgroundColor: '#f57c00', color: '#fff', '&:hover': { backgroundColor: '#e66a00' }, boxShadow: 2 }}>
      <RemoveIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("-"); setMode("subject")}} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' }, boxShadow: 2 }}>
      <RemoveIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("+"); setMode("subject")}} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' }, boxShadow: 2 }}>
      <AddIcon />
    </IconButton>
  </> ) : null}
  <IconButton onClick={() => handleSignOut()} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' }, boxShadow: 2 }}>
    <LogoutIcon />
  </IconButton>
</Box>
      <Grid container spacing={2}>
        {tasks.length > 0 && (
          <Box m={2} width={"100%"}>
            <Grid container spacing={2}>
              {tasks.map((task, i) => (
                <Grid item key={`task-${i}`}>
                  <Box p={2} border="1px solid #ccc" borderRadius={2} bgcolor="#fefefe" boxShadow={2}>
                    <strong>{task.title}</strong>
                    <p style={{ margin: '8px 0' }}>{task.text}</p>
                    <small style={{ color: '#f57c00' }}>Deadline: {task.deadline}</small>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )} 
        
        {subjects.map((subject, i) => (
          <Grid item xs={6} key={i}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 4, 
                textTransform: 'none', 
                border: "1px solid #ccc", 
                borderRadius: 2, 
                backgroundColor: "#fefefe", 
                boxShadow: 2,
                color: 'black'
              }}
              onClick={() => handleButtonClick(subject)}
            >
              {subject.title}
            </Button>
          </Grid>
        ))}
      </Grid>
      <ModalDialog
        open={modalOpen}
        option={selectedOption}
        text={text}
        classCode={classCode}
        onClose={() => setModalOpen(false)}
        handleChange={handleChange}
        permission={permission}
        school={school}
      />
      <SubjectModalDialog
        open={subjectModalOpen}
        classCode={classCode}
        onClose={() => setSubjectModalOpen(false)}
        sign={sign}
        mode={mode}
        handleChange={handleChange}
        school={school}
      />
    </>
  );
}