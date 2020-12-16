import SignIn from "./Authentication/sign-in";
import React from "react";
import SignUp from "./Authentication/sign-up";
import Home from "./Home/home";
import { Switch, Route } from 'react-router-dom';
import Game from "./Game/game";
import {SocketProvider} from "./socket-provider";

function App() {
  return (
      <SocketProvider>
          <Switch>
                <Route path='/game' component={Game}/>
                <Route path='/home' component={Home}/>
                <Route path='/sign-up' component={SignUp}/>
                <Route path='/sign-in' component={SignIn}/>
                <Route path='/' component={SignIn}/>
          </Switch>
      </SocketProvider>
  );
}

export default App;
