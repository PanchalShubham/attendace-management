import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Alert from '@material-ui/lab/Alert';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import LoadingOverlay from 'react-loading-overlay';
import {Redirect} from 'react-router-dom';
import AddClassroom from './AddClassroom';
import StudentClassroomPage from './StudentClassroomPage';
import InstructorClassroomPage from './InstructorClassroomPage';
import {readUser, logoutUser, decrypt, 
          createClassroom, deleteClassroom, 
          joinClassroom, leaveClassroom} from '../../DAO/DataAccessObject';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));














// functional component
export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };
  const [loader, setLoader] = useState({loading: false, text: ''})
  const [currentItem, setCurrentItem] = useState(null);
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [snack, setSnack] = useState({visible: false, snackType: 'success', snackMessage: ''});


  // snack-management
  const showSnackBar = function(type, message) {
    setSnack({visible: true, snackType: type, snackMessage: message});
  }
  const hideSnackBar = function(event) {
    setSnack({visible: false, snackType: 'success', snackMessage: ''});
  }

  // componentDidMount
  useEffect(function(){
    let item = localStorage.getItem('data');
    let data = decrypt(item);
    let {userId} = data;
    readUser(userId).then(response => {
      let data = response.data;
      if (data.error) {        
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
        localStorage.removeItem('data');
        setRedirect(<Redirect to="/login" />)
      } else {
        setUser(data.user);        
      }
    }).catch(err => {
      console.log(err);
      localStorage.removeItem('data');
      setRedirect(<Redirect to="/login" />)
    });
  }, []);

  // for logout
  const onLogout = function(event){
    if (user == null) return;
    let userId = user._id;
    logoutUser(userId).then((response)=>{
      let data = response.data;
      if (data.error) {
        setSnack({visible: true, snackType: 'error', snackMessage: data.error});
      } else {
        localStorage.removeItem('data');
        setRedirect(<Redirect to="/login" />)
      }
    }).catch(err => {
      setSnack({visible: true, snackType: 'error', snackMessage: err});
    });
  };



  // for add-classroom!
  const addClassroom = function(event) {
    if (user === null)  return;
    if (loader.loading) return;
    let isTeacher = (user.role === 'teacher');
    let item = <AddClassroom showSnackBar={showSnackBar} 
                  isTeacher={isTeacher} onAddClassroom={onAddClassroom}/>
    setCurrentItem(item);
  }
  const onAddClassroom = function(value) {
    if (user == null)   return;
    if (loader.loading) return;
    let role = user.role;
    let isTeacher = (role === 'teacher');
    setLoader({loading: true, 
      text: `${isTeacher ? 'Creating' : 'Joininig'} classroom`});
    if (isTeacher) {
      createClassroom(user._id, value).then(response => {
        let data = response.data;
        if (data.error) {
          setSnack({visible: true, snackType: 'error', snackMessage: data.error});
        } else {
          setSnack({visible: true, snackType: 'success', snackMessage: 'Your classroom was successfully created!'});
          setUser(data.user);
        }
      }).catch(err => {
        setSnack({visible: true, snackType: 'error', snackMessage: err});
      }).finally(()=>{
        setLoader({loading: false, text: ''});
      });
    } else {
      joinClassroom(user._id, value).then(response => {
        let data = response.data;
        console.log(data);
        if (data.error) {
          setSnack({visible: true, snackType: 'error', snackMessage: data.error});
        } else {
          setSnack({visible: true, snackType: 'success', snackMessage: 'Your were successfully added to the classroom!'});
          setUser(data.user);
        }
      }).catch(err => {
        setSnack({visible: true, snackType: 'error', snackMessage: err});
      }).finally(()=>{
        setLoader({loading: false, text: ''});
      });
    }
  }



  // for delete-classroom
  const onDeleteClassroom = function() {
    if (user === null)  return;
    if (loader.loading) return;
    setLoader({loading: true, text: `Please wait! I'm processing your request`});
    let {classroomId} = currentItem.props;
    if (user.role === 'teacher') {
      deleteClassroom(user._id, classroomId).then(response => {
        let data = response.data;
        if (data.error) {
          setSnack({visible: true, snackType: 'error', snackMessage: data.error});
        } else {
          setSnack({visible: true, snackType: 'success', snackMessage: `Your classroom with all records was successfully deleted!`});
          setUser(data.user);
          setCurrentItem(null);
        }
      }).catch(err => {
        setSnack({visible: true, snackType: 'error', snackMessage: err});
      }).finally(()=>{
        setLoader({loading: false, text: ''})
      });  
    } else {
      leaveClassroom(user._id, classroomId).then(response => {
        let data = response.data;
        if (data.error) {
          setSnack({visible: true, snackType: 'error', snackMessage: data.error});
        } else {
          setSnack({visible: true, snackType: 'success', snackMessage: `You were successfully removed from the classroom!`});
          setUser(data.user);
          setCurrentItem(null);
        }
      }).catch(err => {
        setSnack({visible: true, snackType: 'error', snackMessage: err});
      }).finally(()=>{
        setLoader({loading: false, text: ''})
      });  
    }
  };

  // for classroom-page
  const onViewClassroom = function(classroom) {
    if (user === null)  return;
    if (loader.loading) return;
    let isTeacher = (user.role === 'teacher');
    let item = null;
    if (isTeacher) {
      item = <InstructorClassroomPage classroomId={classroom._id} loader={loader} 
              setLoader={setLoader} setSnack={setSnack} user={user}
              className={classroom.className}/>
    } else {
      item = <StudentClassroomPage classroomId={classroom._id} loader={loader} 
              setLoader={setLoader} setSnack={setSnack} user={user} 
              className={classroom.className}/>
    }
    setCurrentItem(item);
  }


  // on export stats
  const onExportStats = function() {
    let csvText = "";
    let rows = document.querySelectorAll('#attendanceRecordTable tr');
    for (let i = 0; i < rows.length; ++i) {
      let row = rows[i];
      let cols = row.children;
      if (cols.length === 0)  continue;
      if (cols[0].innerText === '') continue;
      let text = cols[0].innerText;
      for (let j = 1; j < cols.length; ++j) {
        let col = cols[j];
        text += ", " + col.innerText;
      }
      csvText += text + "\n";
    }
    // download the file as csvText
    let {className} = currentItem.props;
    let filename = `${user.email}-${user.role}-${className}.csv`;
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvText));
    element.setAttribute('download', filename);  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // check if course-page is visible(decides export and delete  button visibility)
  let isClassPageVisible = (currentItem != null && 
    (currentItem.type === InstructorClassroomPage || 
      currentItem.type === StudentClassroomPage));

  if (redirect)       return redirect;
  if (user === null)  return   <div>Loading your details...</div>
  let isTeacher = (user.role === 'teacher');


  return (
    <LoadingOverlay active={loader.loading} spinner text={loader.text}>
    <div className={classes.root}>
      <CssBaseline />

      {/* topbar */}
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" color="inherit" 
            aria-label="open drawer" onClick={handleDrawerOpen} 
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {user.username + "(" + user.role + ")"}
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>


      {/* sidebar */}
      <Drawer variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open 
                    && classes.drawerPaperClose),}} open={open}>
        <div className={classes.toolbarIcon}>
            Attendance Management
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <ListItem button onClick={addClassroom} disabled={loader.loading}>
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary={(isTeacher ? "New classroom" : "Join classroom")}/>
            </ListItem>
            <ListItem button onClick={onDeleteClassroom} disabled={loader.loading || !isClassPageVisible}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary={isTeacher ? "Delete Classroom" : "Leave Classroom"} />
            </ListItem>
            <ListItem button onClick={onExportStats} disabled={loader.loading || !isClassPageVisible}>
              <ListItemIcon>
                <GetAppIcon />
              </ListItemIcon>
              <ListItemText primary="Export Statistics" />
            </ListItem>
            {/* <ListItem button disabled={loader.loading}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Profile" />
            </ListItem> */}
          </div>          
        </List>
        <Divider />
        <List>
          <div>
            <ListSubheader inset>Your classrooms</ListSubheader>
            {user.classrooms && user.classrooms.map(item => 
              <ListItem button disabled={loader.loading} 
                key={item._id} onClick={event => onViewClassroom(item)}>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary={item.className}/>
              </ListItem>            
            )}
          </div>
        </List>
      </Drawer>



      {/* central content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {!currentItem && 
          <p>Welcome {user.username}!<br/>We are glad to see here.<br/>
           Click on the left menu to get started!</p>}
        </Container>
        {currentItem}
      </main>



      {/* snackbar */}
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        open={snack.visible} autoHideDuration={6000} onClose={hideSnackBar}>
          <Alert severity={snack.snackType}
          action={
            <IconButton aria-label="close" color="inherit"
              size="small" onClick={hideSnackBar} >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          {String(snack.snackMessage)}
        </Alert>
      </Snackbar>

    </div>
    </LoadingOverlay>
  );
}