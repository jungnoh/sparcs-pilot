import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { withRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogoutPage(props: {history: any}) {
  axios.post('/api/auth/logout', { withCredentials: true }).then(() => {
    Cookie.remove('connect.sid');
    props.history.push('/');
  });
  return (
    <div>로그아웃 중입니다..</div>
  );
}

export default withRouter(LogoutPage);
