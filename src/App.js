import SignIn from "./Authentication/sign-in";
import React from "react";
import SignUp from "./Authentication/sign-up";
import Home from "./Home/home";
import { Switch, Route } from 'react-router-dom';
import Game from "./Game/game";

function App() {
  return (
      <Switch>
        <Route path='/game' component={Game}/>
        <Route path='/sign-up' component={SignUp}/>
        <Route path='/sign-in' component={SignIn}/>
        <Route path='/' component={Home}/>
      </Switch>
  );
}

export default App;
