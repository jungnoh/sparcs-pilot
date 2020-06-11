import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, Typography, TextField } from '@material-ui/core';
import commonStyles from './common.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LoginPage(props: {history: any}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleLogin = () => {
    if (username === '' || password === '') {
      return;
    }
    axios.post('/api/auth/login', {username, password}, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 200) {
          sessionStorage.setItem('username', resp.data.username);
          props.history.push('/');
          return;
        }
        if(resp.status === 401) {
          alert('아이디나 비밀번호가 틀립니다.');
          setPassword('');
        } else {
          console.log(resp.data);
          alert('오류가 발생했습니다.');
        }
      });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div className={commonStyles.root}>
      <Card className={commonStyles.card}>
        <Typography variant="h4" component="h4">
          로그인
        </Typography>
        <div className={commonStyles.formContainer}>
          <TextField id="username" label="아이디 (사용자명)" value={username} onChange={(v) => setUsername(v.target.value)} onKeyDown={handleKeyDown} />
          <TextField id="password" label="비밀번호" type="password" value={password} onChange={(v) => setPassword(v.target.value)} onKeyDown={handleKeyDown} />
        </div>
        <div className={commonStyles.formActions}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            로그인
          </Button>
          <Button variant="contained" color="secondary" onClick={() => props.history.push('/auth/join')}>
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(LoginPage);
