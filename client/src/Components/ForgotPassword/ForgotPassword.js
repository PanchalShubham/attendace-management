import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import {HashLink as Link} from 'react-router-hash-link';
import Grid from '@material-ui/core/Grid';
import {forgotPassword, resetPassword} from '../../DAO/DataAccessObject';

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
export default function ForgotPassword(props) {
  const {reset} = props;
  const classes = useStyles();
  const [role, setRole] = useState('student');
  const [loader, setLoader] = useState({loading: false, text : ''});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  // returns true if email is valid; false otherwise
  const isValidEmail = function(email){
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(String(email).toLowerCase());
  };

  // handles the form submission
  const onFormSubmit = function(event) {
    event.preventDefault();
    if (loader.loading) return;
    if (reset) {
      let password = String(document.getElementById('password').value).trim();
      if (password === '') {
        setError(`Please provide a valid password`);
        return;
      }
      let {tokenId} = props.match.params;
      // make server request
      setLoader({loading: true, text: `Please wait! I'm processing your request!`});
      resetPassword(tokenId, password).then(response => {
        let {data} = response;
        let {error} = data;
        if (error) {
          setError(error);
        } else {
          setSuccess(`Your password was successfully updated!`);
        }
      }).catch(err => {
        setError(err);
      }).finally(()=>{
        setLoader({loading: false, text: ''});
      });
    } else {
      let email = document.getElementById('email').value;
      if (!isValidEmail(email)) {
          setError('Please provide a valid email!');
          return;
      }
      // make server request
      setLoader({loading: true, text: `Please wait! I'm processing your request!`});
      forgotPassword(email, role).then(response => {
          let {data} = response;
          let {error} = data;
          if (error)  setError(error);
          else        setSuccess(`An email has been sent to your email-address!`);
      }).catch(err => {
          setError(err);
      }).finally(()=>{
          setLoader({loading: false, text: ''});
      });
    }
  };


  // return the content
  return (
    <div id="forgotPasswordForm">
    <LoadingOverlay active={loader.loading} spinner text={loader.text}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar} src={BrandIcon} />
            <Typography component="h1" variant="h5">
              {reset ? 'Reset Password' : 'Forgot Password'}
            </Typography>
            <form className={classes.form} noValidate onSubmit={onFormSubmit}>
                {/* alerts */}
                <Collapse in={Boolean(success || error)}>
                    {success && <Alert severity="success" action={
                        <IconButton aria-label="close" color="inherit" size="small"
                        onClick={() => { setSuccess(null); setError(null);}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }> {String(success)}</Alert>}
                    {error && <Alert severity="error" action={
                        <IconButton aria-label="close" color="inherit" size="small"
                        onClick={() => { setSuccess(null); setError(null);}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }> {String(error)}</Alert>}
                </Collapse>

                {/* input fields */}
                {reset && 
                  <TextField variant="outlined" margin="normal" fullWidth
                      id="password" label="New Password" name="password" type="password"
                      autoComplete="password" autoFocus/>}
                {!reset && 
                  <div>
                    <TextField variant="outlined" margin="normal" fullWidth
                        id="email" label="Email Address" name="email"
                        autoComplete="email" autoFocus/>                
                    <FormControl component="fieldset">
                    <RadioGroup row aria-label="role" name="role" value={role} onChange={event => setRole(event.target.value)}>
                        <FormControlLabel value="student" control={<Radio />} label="Student" />
                        <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                    </RadioGroup>
                    </FormControl>
                  </div>}
                <Button id="submitButton" type="submit" fullWidth
                    variant="contained" color="primary"
                    className={classes.submit}>
                    Submit
                </Button>
                {!reset && 
                  <Grid container>
                    <Grid item xs>
                        <Link to="/login" variant="body2">Go to Sign In</Link>
                    </Grid>
                    <Grid item xs>
                        <Link to="/login" variant="body2">Go to Sign Up</Link>
                    </Grid>
                  </Grid>}
            </form>
        </div>
        </Container>  
    </LoadingOverlay>        
    </div>
  );
}