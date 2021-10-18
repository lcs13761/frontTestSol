import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Theme/login';
import Simulated from './Theme/simulated';


export default () => {
  return (
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/simulated">
        <Simulated />
      </Route>
    </Switch>
  );
}

