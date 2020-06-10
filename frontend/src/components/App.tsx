import React from 'react';
import {Switch, Route} from 'react-router-dom';

import JoinPage from '@pages/auth/join';
import LoginPage from '@pages/auth/login';
import IndexPage from '@pages/index';

export default function App() {
  return (
    <Switch>
      <Route path="/" exact component={IndexPage} />
      <Route path="/auth/join" component={JoinPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/asdf">asdfasdf</Route>
    </Switch>
  );
}