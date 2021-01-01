import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import AuthForm from './Components/AuthForm/AuthForm';
import InstructorDashboard from './Components/InstructorDashboard/InstructorDashboard';
import './App.css';

// maintains auth-state
const authCentralState = {
  isAuthenticated : false,
  signin(callback){
    this.isAuthenticated = true;
    setTimeout(callback, 3000);
  },
  signout(callback) {
    this.isAuthenticated = false;
    setTimeout(callback, 3000);
  }
};

// public route - only available to non-authenticated users
const PublicRoute = ({component : Component, ...rest}) => {
  return (
  <Route {...rest} render={
    function(props){
      let merged = {...props, ...rest};
      return ( !authCentralState.isAuthenticated ? 
        <Component {...merged} /> : 
        <Redirect to={{pathname: '/dashboard', state: {from: props.location}}} />
      );
    }
  }/>);
};

// private route - only available to authenticated users
const PrivateRoute = ({component : Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    authCentralState.isAuthenticated ? 
      <Component {...props} /> : 
      <Redirect to={{pathname: '/login', state: {from: props.location}}} />
  )}/>
);

function App() {
  return (
    <div id="baseDiv">
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/" component={Homepage} />
          <PublicRoute exact path="/login" component={AuthForm} register={false}/>
          <PublicRoute exact path="/register" component={AuthForm} register={true}/>
          <PublicRoute exact path="/dashboard" component={InstructorDashboard} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
