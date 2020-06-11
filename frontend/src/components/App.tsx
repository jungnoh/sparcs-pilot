import React from 'react';
import {Switch, Route} from 'react-router-dom';

import JoinPage from '@pages/auth/join';
import LoginPage from '@pages/auth/login';
import LogoutPage from '@pages/auth/logout';
import IndexPage from '@pages/index';
import GroupCreatePage from '@pages/groups/create';
import GroupViewPage from '@pages/groups/view';
import MePage from '@pages/me';
import MeEditPage from '@pages/me/edit';
import PageTemplate from '@components/templates/Page';

export default function App() {
  return (
    <PageTemplate>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/auth/join" component={JoinPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/logout" component={LogoutPage} />
        <Route path="/groups/create" component={GroupCreatePage} />
        <Route path="/groups/:groupID" component={GroupViewPage} />
        <Route path="/me/edit" component={MeEditPage} />
        <Route path="/me" exact component={MePage} />
      </Switch>
    </PageTemplate>
  );
}