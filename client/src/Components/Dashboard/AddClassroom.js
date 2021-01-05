import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles} from '@material-ui/core/styles';
import BrandIcon from '../../resources/images/brand.png';

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
}));






// functional component
export default function AddClassroom(props) {
  const {showSnackBar, onAddClassroom, isTeacher} = props;
  const classes = useStyles();
  let fieldName = (isTeacher ? 'classname': 'classcode');

  // handler for form-submit-operation
  const onFormSubmit = function(event){
    // read properties
    event.preventDefault();
    let className = String(document.getElementById(fieldName).value).trim();
    if (className.length === 0){
        showSnackBar('error', 'Please provide a valid classname');
        return;
    }
    // make server request
    onAddClassroom(className);
  };

  return (
    <div id="addClassroomForm">
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar} src={BrandIcon} />
            <Typography component="h1" variant="h5">
              {isTeacher ? "Create" : "Join"} Classroom
            </Typography>
            <form className={classes.form} noValidate 
                onSubmit={onFormSubmit} autoComplete="off">
                {/* input fields */}
                <TextField variant="outlined" margin="normal" fullWidth
                    id={fieldName} label={fieldName} name={fieldName} autoComplete="off"
                    autoFocus />
                <Button id="submitButton" type="submit" fullWidth
                    variant="contained" color="primary"
                    className={classes.submit}>
                    {isTeacher ? "Create" : "Join"}
                </Button>
            </form>
        </div>
        </Container>  
    </div>
  );
}