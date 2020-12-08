import SignIn from "./sign-in";
import React from "react";
import SignUp from "./sign-up";
import Home from "./home";
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
      <Switch>
        {/*<Route path='/home' component={Home}/>*/}
        <Route path='/sign-up' component={SignUp}/>
        <Route path='/sign-in' component={SignIn}/>
        <Route path='/' component={Home}/>
      </Switch>
  );
}

export default App;
