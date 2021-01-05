import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
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
import Badge from '@material-ui/core/Badge';
import {readClassroom, markAttendance} from '../../DAO/DataAccessObject';

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


// functional component for classroomPage
export default function StudentClassroomPage(props){
  const {user, classroomId, setLoader, setSnack} = props;
  const classes = useStyles();
  const [classroom, setClassroom] = useState(null);
  const [records, setRecords] = useState([]);
  const [tempMessage, setTempMessage] = useState('Loading details of the classroom!');

  // generate stats for the user
  let rows = [];
  for(let i = 0; i < records.length; ++i) {
    let rec = records[i];
    let key = rec.attendanceId;
    let value = null;
    if (rec.students.indexOf(user.email) === -1) {
      value = <Badge color="secondary" badgeContent={"Absent"}/>
    } else {
      value = <Badge color="primary" badgeContent={"Present"}/>
    }
    rows.push({key, value});
  }
  

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

  // makes a request to mark attendance
  const onMarkAttendance = function() {
    setLoader({loading: true, text: `Please wait! I'm marking your attendance!`});
    markAttendance(user._id, classroom._id).then(response => {
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
      setLoader({loading: false, text: ``});
    });
  };

  let toMark = false;
  for (let i = 0; i < records.length; ++i)
    if (records[i].attendanceId === classroom.collectingFor){
      toMark = (records[i].students.indexOf(user.email) === -1);
      break;
    }


  // if classroom is not loaded then show error message
  if (classroom === null) {
    return (
      <div id="classroomPage" className={classes.classroomPage}>
        {tempMessage}
      </div>
    );
  }

  // render the actual component
  return (
    <div id="classroomPage" className={classes.classroomPage}>
        <div style={{textAlign: "center"}}><strong>Classroom Name: </strong>{classroom.className}</div>
        <div style={{textAlign: "center"}}><strong>Classroom Code: </strong>{classroom.code}</div>

        {/* display form or stop button */}
        {classroom.collectingFor && toMark &&
        <Button type="submit" fullWidth
          variant="contained" color="primary"
          className={classes.submit} onClick={onMarkAttendance}>
          Mark attedance for {classroom.collectingFor}
        </Button>
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
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell align="left">
                {row.value}
              </TableCell>
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
