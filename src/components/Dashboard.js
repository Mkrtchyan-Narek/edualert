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
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function Dashboard({ permission, onLogout, classCode, setClassCode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [sign, setSign] = useState("");
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState("subject");

  
  // useEffect(() => {
  //   let f = async () => {
  //     const docSnap = await getDoc(doc(db, "164", classCode));
  //     let newSUbjects = [];
  //     Object.entries(docSnap.data().homeworks).forEach(([key, value]) => {
  //       newSUbjects.push({title: key, text: value.text, url: value.url});
  //     });
  //     setSubjects(newSUbjects);
  //   }
  //   f();
  //   onSnapshot(doc(db, "164", classCode), async (snapshot) => {
  //     let newSUbjects = [];
  //     Object.entries(snapshot.data().homeworks).forEach(([key, value]) => {
  //       newSUbjects.push({title: key, text: value.text, url: value.url});
  //     });
  //     setSubjects(newSUbjects);
  //   });
  // }, []);

  useEffect(() => {
  const fetchData = async () => {
    const docSnap = await getDoc(doc(db, "164", classCode));
    const data = docSnap.data();
    
    // Homeworks
    const newSubjects = Object.entries(data.homeworks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
      url: value.url
    }));
    setSubjects(newSubjects);

    // Tasks
    const newTasks = Object.entries(data.tasks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
      deadline: value.deadline
    }));
    setTasks(newTasks);
  };

  fetchData();

  const unsubscribe = onSnapshot(doc(db, "164", classCode), (snapshot) => {
    const data = snapshot.data();

    const newSubjects = Object.entries(data.homeworks || {}).map(([key, value]) => ({
      title: key,
      text: value.text,
      url: value.url
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
    setUrl(option.url);
    setModalOpen(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
  {(permission == "write") ? (<>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("+"); setMode("task")}} sx={{ backgroundColor: '#f57c00', color: '#fff', '&:hover': { backgroundColor: '#e66a00' } }}>
      <AddIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("-"); setMode("task")}} sx={{ backgroundColor: '#f57c00', color: '#fff', '&:hover': { backgroundColor: '#e66a00' } }}>
      <RemoveIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("-"); setMode("subject")}} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' } }}>
      <RemoveIcon />
    </IconButton>
    <IconButton onClick={() => {setSubjectModalOpen(true); setSign("+"); setMode("subject")}} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' } }}>
      <AddIcon />
    </IconButton>
  </> ) : null}
  <IconButton onClick={() => {onLogout(); setClassCode(""); 
      document.cookie = `classCode=noClass&permission=read; path=/; max-age=3600`;}} sx={{ backgroundColor: '#26b8b8', color: '#fff', '&:hover': { backgroundColor: '#1ea0a0' } }}>
    <LogoutIcon />
  </IconButton>
</Box>
      <Grid container spacing={2}>
        {tasks.length > 0 && (
          <Box m={2} width={"100%"}>
            <Grid container spacing={2}>
              {tasks.map((task, i) => (
                <Grid item key={`task-${i}`}>
                  <Box p={2} border="1px solid #ccc" borderRadius={2} bgcolor="#fefefe" boxShadow={1}>
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
              sx={{ py: 4, textTransform: 'none' }}
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
        url={url}
        classCode={classCode}
        onClose={() => setModalOpen(false)}
        permission={permission}
      />
      <SubjectModalDialog
        open={subjectModalOpen}
        classCode={classCode}
        onClose={() => setSubjectModalOpen(false)}
        sign={sign}
        mode={mode}
      />
    </>
  );
}