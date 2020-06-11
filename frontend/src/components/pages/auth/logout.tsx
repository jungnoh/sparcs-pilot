import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogoutPage(props: {history: any}) {
  axios.delete('/api/auth/logout').then(() => {
    sessionStorage.removeItem('username');
    props.history.push('/');
  });
  return (
    <div>로그아웃 중입니다..</div>
  );
}

export default withRouter(LogoutPage);
