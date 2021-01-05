import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {readClassroom, collectAttendance, 
          stopCollectingAttendance} from '../../DAO/DataAccessObject';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
          

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
  },
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  table: {
    minWidth: 500,
  },
}));



// parses the records for the table
function parseRecords(classroom, records) {
  let presentStyle = {
    backgroundColor: "#cff4fc", 
    color: '#055160', 
    padding: '5px',
    borderRadius: '5px'
  };
  let absentStyle = {
    backgroundColor: "#f8d7da", 
    color: '#842029', 
    padding: '5px',
    borderRadius: '5px'
  };
  let rows = [];
  let columns = ['studentId'];
  for (let i = 0; i < records.length; ++i)
    columns.push(records[i].attendanceId);
  let headerRow = [];
  for (let i = 0; i < columns.length; ++i)
    headerRow.push(<TableCell align="left" key={`head${i}`}><strong>{columns[i].toUpperCase()}</strong></TableCell>);
  rows.push({key: `row_0`, value: headerRow});
  if (classroom === null) return rows;
  let students = classroom.studentOnce;
  for (let i = 0; i < students.length; ++i) {
    let studEmail = students[i];
    let row = [];
    row.push(<TableCell align="left" key={`cel_${i}_0`}>{studEmail}</TableCell>)
    for (let j = 0; j< records.length; ++j) {
      let rec = records[j];
      let attendees = rec.students;
      let attended = attendees.indexOf(studEmail) !== -1;
      let item = null;
      if (attended) {
        item = <span style={presentStyle}>Present</span>
      } else {
        // item = <Badge color="secondary" badgeContent={"Absent"} />;
        item = <span style={absentStyle}>Absent</span>
      }
      row.push(<TableCell align="left" key={`cell_${i}_${j + 1}`}>{item}</TableCell>);
    }
    rows.push({key: `row_${i+1}`, value: row});
  }
  return rows;
}


// functional component for classroomPage
export default function InstructorClassroomPage(props){
  const {classroomId, loader, setLoader, setSnack, user} = props;
  const classes = useStyles();
  const [classroom, setClassroom] = useState(null);
  const [records, setRecords] = useState([]);
  const [tempMessage, setTempMessage] = useState('Loading details of the classroom!');

  let rows = parseRecords(classroom, records);
  // for table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

  // invokes whenever classroomName changes!
  useEffect(()=>{
    setLoader({loading: true, text: `Please wait! I'm fetching details for this classroom`});
    readClassroom(user._id, classroomId).then(response=>{
      let data = response.data;
      if (data.error) {
        setTempMessage('Failed to load details of this classroom!');
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
        setRecords(data.records);
      }
    }).catch(err => {
      setSnack({visible: true, snackType: 'error', snackMessage: err});
    }).finally(()=>{
      setLoader({loading: false, text: ``});
    });
  }, [classroomId, setLoader, setSnack, user._id]);



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
    collectAttendance(user._id, classroom._id, attendanceId).then(response => {
      let data = response.data;
      if (data.error) {
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
        setRecords(data.records);
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
    stopCollectingAttendance(user._id, classroomId, attendanceId).then(response => {
      let data = response.data;
      if (data.error) {
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        setClassroom(data.classroom);
        setRecords(data.records);
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
      <div style={{textAlign: 'center'}}><br/>Your attendance record for this classroom!</div>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table" id="attendanceRecordTable">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.key}>
              {row.value}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TableContainer>
      <Table>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </div>
  );
}
