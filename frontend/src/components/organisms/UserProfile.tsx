import React from 'react';
import styles from './UserProfile.scss';
import { TextField, MenuItem, Button } from '@material-ui/core';

const DORMS = ['사랑관', '소망관', '아름관'];

export interface UserProfileFields {
  username: string;
  email: string;
  password?: string;
  dorm: string;
  name: string;
  phone: string;
}

interface UserProfileProps extends Partial<UserProfileFields> {
  allowEmptyPassword?: boolean;
  allowUserFieldEdit?: boolean;
  onSubmit: (data: UserProfileFields) => void;
}

export default function UserProfile(props: UserProfileProps) {
  const [username, setUsername] = React.useState(props.username ?? '');
  const [password, setPassword] = React.useState(props.password ?? '');
  const [password2, setPassword2] = React.useState('');
  const [name, setName] = React.useState(props.name ?? '');
  const [email, setEmail] = React.useState(props.email ?? '');
  const [phone, setPhone] = React.useState(props.phone ?? '');
  const [dorm, setDorm] = React.useState(props.dorm ?? '');

  const usernameError = username !== '' && ((username.length < 8) || !/^[a-zA-Z0-9_]+$/.test(username));
  const pwError = password !== '' && password.length < 8;
  const pw2Error = password2 !== '' && password !== password2;
  // eslint-disable-next-line no-control-regex
  const emailError = email !== '' && !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@kaist.ac.kr/.test(email);

  const hasErrors = usernameError || (!(props.allowEmptyPassword && password === '' && password2 === '') && (pwError || pw2Error)) || emailError;
  
  const handleSubmit = () => {
    if (hasErrors || (!props.allowEmptyPassword && (password === '' || password2 === '')) || [username, name, email, phone, dorm].filter(x => (x === null || x === '')).length > 0) {
      alert('모든 칸을 올바르게 입력해주세요.');
      return;
    }
    if (props.allowEmptyPassword && password === '' && password2 === '') {
      props.onSubmit({username, email, dorm, name, phone}); 
    } else {
      props.onSubmit({username, email, password, dorm, name, phone});
    }
  };

  return (
    <div className={styles.formContainer}>
      <TextField id="username" label="아이디" value={username} onChange={(v) => setUsername(v.target.value)} disabled={!(props.allowUserFieldEdit ?? true)}
        error={usernameError} helperText={usernameError && '아이디는 8자리 이상이어야 하며, 영숫자와 _로만 만들 수 있습니다.'} />
      <TextField id="email" label="이메일" value={email} onChange={(v) => setEmail(v.target.value)} disabled={!(props.allowUserFieldEdit ?? true)}
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
      <div className={styles.formActions}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          완료
        </Button>
      </div>
    </div>
  );
}
