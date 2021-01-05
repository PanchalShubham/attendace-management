import React from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import AuthForm from './Components/AuthForm/AuthForm';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import Dashboard from './Components/Dashboard/Dashboard';
import NotFound from './Components/NotFound/NotFound';
import './App.css';

// checks if user has a token
function hasToken() {
  // check if local-storage contains token
  return (localStorage.getItem('data') != null);
}

// public route - only available to non-authenticated users
const PublicRoute = ({component : Component, ...rest}) => {
  return (
  <Route {...rest} render={
    function(props){
      let merged = {...props, ...rest};
      return ( !hasToken() ? 
        <Component {...merged} /> : 
        <Redirect to={{pathname: '/dashboard', state: {from: props.location}}} />
      );
    }
  }/>);
};

// private route - only available to non-authenticated users
const PrivateRoute = ({component : Component, ...rest}) => {
  return (
  <Route {...rest} render={
    function(props){
      let merged = {...props, ...rest};
      return ( hasToken() ? 
        <Component {...merged} /> : 
        <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      );
    }
  }/>);
};

// functional component
function App() {
  return (
    <div id="baseDiv">
      <HashRouter basename="/">
        <Switch>
          <PublicRoute exact path="/" component={Homepage} />
          <PublicRoute exact path="/login" component={AuthForm} register={false}/>
          <PublicRoute exact path="/register" component={AuthForm} register={true}/>
          <PublicRoute exact path="/forgot-password" component={ForgotPassword} reset={false}/>
          <PublicRoute exact path="/reset-password/:tokenId" component={ForgotPassword} reset={true}/>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <Route path="/" component={NotFound} />
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
