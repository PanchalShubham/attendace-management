import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


import {readClassroom, collectAttendance, 
          stopCollectingAttendance} from '../../DAO/DataAccessObject';

// styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  classroomPage :{
    padding: "10px", 
    width: "80%", 
    margin: "10px auto"
  }
}));


// functional component for classroomPage
export default function StudentClassroomPage(props){
  const {userId, classroomName, loader, setLoader, setSnack} = props;
  const classes = useStyles();
  const [classroom, setClassroom] = useState(null);
  const [tempMessage, setTempMessage] = useState('Loading details of the classroom!');


  // invokes whenever classroomName changes!
  useEffect(()=>{
    setLoader({loading: true, text: `Please wait! I'm fetching details for this classroom`});
    readClassroom(userId, classroomName).then(response=>{
      let data = response.data;
      if (data.error) {
        setTempMessage('Failed to load details of this classroom!');
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
      }
    }).catch(err => {
      setSnack({visible: true, snackType: 'error', snackMessage: err});
    }).finally(()=>{
      setLoader({loading: false, text: ``});
    });
  }, classroomName);



  // starts collecting attendance
  const onCollectAttendance = function(event) {
    event.preventDefault();
    if (loader.loading) return;
    let attendanceId = String(document.getElementById('attendanceId').value).trim();
    if (attendanceId === '') {
      setSnack({visible: true, snackType: 'error', snackMessage: 'Please provide a valid attendanceId'});
      return;
    }

    // make server request here
    setLoader({loading: true, text: `Please wait! I'm processing your request`});
    collectAttendance(classroom._id, attendanceId).then(response => {
      let data = response.data;
      if (data.error) {
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
      }
    }).catch(err => {
      setSnack({visible: true, snackType: 'error', snackMessage: err});
    }).finally(()=>{
      setLoader({loading: false, text: ''})
    });
  };

  // stops collecting attendance
  const onStopCollectingAttendance = function(event) {
    if (loader.loading) return;
    let classroomId = classroom._id;
    let attendanceId = classroom.collectingFor;
    // make server request here
    setLoader({loading: true, text: `Please wait! I'm processing your request`});
    stopCollectingAttendance(classroomId, attendanceId).then(response => {
      let data = response.data;
      if (data.error) {
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
      }
    }).catch(err => {
      setSnack({visible: true, snackType: 'error', snackMessage: err});
    }).finally(()=>{
      setLoader({loading: false, text: ''})
    });
  };


  // if classroom is not loaded then show error message
  if (classroom === null) {
    return (
      <div id="classroomPage" className={classes.classroomPage}>
        {tempMessage}
      </div>
    );
  }

  return (
    <div id="classroomPage" className={classes.classroomPage}>
        <div style={{textAlign: "center"}}><strong>Classroom Name: </strong>{classroom.className}</div>
        <div style={{textAlign: "center"}}><strong>Classroom Code: </strong>{classroom.code}</div>

        {/* display form or stop button */}
        {classroom.collectingFor ?
        <Button type="submit" fullWidth
          variant="contained" color="secondary"
          className={classes.submit} onClick={onStopCollectingAttendance}>
          Stop collecting attedance for {classroom.collectingFor}
        </Button>
        :
        <form className={classes.form} noValidate onSubmit={onCollectAttendance}>
            {/* input fields */}
            <TextField variant="outlined" margin="normal" fullWidth
                id="attendanceId" label="Attendance ID" 
                name="attendanceId" autoComplete="text"
                autoFocus />
            <Button id="submitButton" type="submit" fullWidth
                variant="contained" color="primary"
                className={classes.submit}>
                Collect attendance
            </Button>
        </form>    
      }


      {/* displays the records */}

    </div>
  );
}
