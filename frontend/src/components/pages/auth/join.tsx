import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, Typography, TextField, MenuItem } from '@material-ui/core';
import commonStyles from './common.scss';

const DORMS = ['사랑관', '소망관', '아름관'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JoinPage(props: {history: any}) {
  if (sessionStorage.getItem('username') !== null) {
    props.history.push('/');
  }

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [dorm, setDorm] = React.useState<string | null>(null);

  const usernameError = username !== '' && !/^[a-zA-Z0-9_]+$/.test(username);
  const pwError = password !== '' && password.length < 8;
  const pw2Error = password2 !== '' && password !== password2;
  // eslint-disable-next-line no-control-regex
  const emailError = email !== '' && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@kaist.ac.kr/.test(email);

  const handleJoin = () => {
    if (([username, password, password2, name, email, phone, dorm].filter(x => (x === null || x === '')).length > 0) || usernameError || pwError || pw2Error || emailError) {
      alert('모든 칸을 올바르게 입력해주세요.');
    }
    if (!confirm('이대로 가입하시겠어요?')) {
      return;
    }
    axios.post('/api/auth/signup', { name, phone, email, dorm, username, password }, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 200) {
          alert('가입이 완료되었습니다.');
          props.history.push('/');
        }
      });
  };

  return (
    <div className={commonStyles.root}>
      <Card className={commonStyles.card}>
        <Typography variant="h4" component="h4">
          회원가입
        </Typography>
        <div className={commonStyles.formContainer}>
          <TextField id="username" label="아이디" value={username} onChange={(v) => setUsername(v.target.value)}
            error={usernameError} helperText={usernameError && '아이디는 영숫자와 _로만 만들 수 있습니다.'} />
          <TextField id="email" label="이메일" value={email} onChange={(v) => setEmail(v.target.value)}
            error={emailError} helperText={emailError && '올바르지 않은 이메일입니다 (카이스트 이메일만 사용해주세요)'} />
          <TextField id="password" label="비밀번호" type="password" value={password} onChange={(v) => setPassword(v.target.value)}
            error={pwError} helperText={pwError && '최소 8자리를 입력해주세요.'}/>
          <TextField id="password2" label="비밀번호 재입력" type="password" value={password2} onChange={(v) => setPassword2(v.target.value)}
            error={pw2Error} helperText={pw2Error && '비밀번호가 일치하지 않습니다.'} />
          <TextField id="name" label="이름" value={name} onChange={(v) => setName(v.target.value)} />
          <TextField id="phone" label="전화번호" value={phone} onChange={(v) => setPhone(v.target.value)} />
          <TextField id="dorm" value={dorm} onChange={(v) => setDorm(v.target.value)} select label="거주 기숙사">
            {DORMS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className={commonStyles.formActions}>
          <Button variant="contained" color="primary" onClick={handleJoin}>
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(JoinPage);
