import React, {useState} from 'react';
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
import {secondaryListItems } from './listItems';
import Alert from '@material-ui/lab/Alert';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import LoadingOverlay from 'react-loading-overlay';


import AddClassroom from './AddClassroom';

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
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };
  const [loader, setLoader] = useState({loading: false, text: ''})
  const [currentItem, setCurrentItem] = useState(null);

  // snack-management
  const [snack, setSnack] = useState({visible: false, snackType: 'success', snackMessage: ''});
  const showSnackBar = function(type, message) {
    setSnack({visible: true, snackType: type, snackMessage: message});
  }
  const hideSnackBar = function(event) {
    setSnack({visible: false, snackType: 'success', snackMessage: ''});
  }



  // for add-classroom!
  const addClassroom = function(event) {
    let item = <AddClassroom showSnackBar={showSnackBar} onAddClassroom={onAddClassroom}/>
    setCurrentItem(item);
  }
  const onAddClassroom = function(className) {
    setLoader({loading: true, text: `Adding classroom ${className}`});
  }

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
            Shubham Panchal
          </Typography>
          <IconButton color="inherit">
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
            <ListItem button onClick={addClassroom}>
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary="New Classroom" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete Classroom" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <GetAppIcon />
              </ListItemIcon>
              <ListItemText primary="Export Statistics" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Profile" />
            </ListItem>
          </div>          
        </List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>



      {/* central content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {!currentItem && 
          <p>Welcome username!<br/>We are glad to see here.<br/>
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
          {snack.snackMessage}
        </Alert>
      </Snackbar>

    </div>
    </LoadingOverlay>
  );
}