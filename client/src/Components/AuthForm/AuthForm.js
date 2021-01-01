import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import BrandIcon from '../../resources/images/brand.png';
import LoadingOverlay from 'react-loading-overlay';

import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

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
export default function AuthForm(props) {
  const {register} = props;    
  const classes = useStyles();
  const [role, setRole] = useState('student');
  const [loader, setLoader] = useState({loading: true, text : ''});
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  // returns true if email is valid; false otherwise
  const isValidEmail = function(email){
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(String(email).toLowerCase());
  }


  // handler for form-submit-operation
  const onFormSubmit = function(event){
    // read properties
    event.preventDefault();
    let username = null;
    if (register) username = String(document.getElementById('username').value).toLowerCase().trim();
    let email = String(document.getElementById('email').value).toLowerCase().trim();
    let password = String(document.getElementById('password').value).toLowerCase().trim();

    // validate fields
    if (username && username === '') {
        setError('Please provide a valid username!');
        setOpen(true);
        return;
    }
    if(!isValidEmail(email)) {
        setError('Please provide a valid email!');
        setOpen(true);
        return;
    }
    if (password === '') {
        setError('Please provide a valid password!');
        setOpen(true);
        return;
    }
    if (role !== 'student' && role !== 'teacher') {
        setError('Please select your role!');
        setOpen(true);
        return;
    }

    // make server request
    if (register) setLoader({loading: true, text: `Please wait! I'm setting up your account`});
    else          setLoader({loading: true, text: `Please wait! I'm validating your credentials.`});
  };

  return (
    <div id="authForm">
    <LoadingOverlay active={loader.loading} spinner text={loader.text}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar} src={BrandIcon} />
            <Typography component="h1" variant="h5">
            {register ? "Sign Up" : "Sign In"}
            </Typography>
            <form className={classes.form} noValidate onSubmit={onFormSubmit}>
                {/* alerts */}
                <Collapse in={open}>
                    {success && <Alert severity="success" action={
                        <IconButton aria-label="close" color="inherit" size="small"
                        onClick={() => { setSuccess(null); setOpen(false); }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }> {success}</Alert>}
                    {error && <Alert severity="error" action={
                        <IconButton aria-label="close" color="inherit" size="small"
                        onClick={() => { setError(null); setOpen(false); }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }> {error}</Alert>}
                </Collapse>

                {/* input fields */}
                {register && <TextField variant="outlined" margin="normal" fullWidth
                    id="username" label="Username" name="username" autoComplete="text"
                    autoFocus />}
                <TextField variant="outlined" margin="normal" fullWidth
                    id="email" label="Email Address" name="email"
                    autoComplete="email" autoFocus/>
                <TextField variant="outlined" margin="normal" fullWidth
                    name="password" label="Password" type="password"
                    id="password" autoComplete="current-password"/>                
                <FormControl component="fieldset">
                <RadioGroup row aria-label="role" name="role" value={role} onChange={event => setRole(event.target.value)}>
                    <FormControlLabel value="student" control={<Radio />} label="Student" />
                    <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                </RadioGroup>
                </FormControl>
                <Button id="submitButton" type="submit" fullWidth
                    variant="contained" color="primary"
                    className={classes.submit}>
                    {register ? "Sign Up" : "Sign In"}
                </Button>
                <Grid container>
                    <Grid item xs>
                        {register && <Link href="#" variant="body2">Forgot password?</Link>}
                    </Grid>
                    <Grid item>
                        <Link href={register ? "/login" : "/register"} variant="body2">
                            {register ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
                <div style={{"height": "10px"}} />
            </form>
        </div>
        </Container>  
    </LoadingOverlay>        
    </div>
  );
}