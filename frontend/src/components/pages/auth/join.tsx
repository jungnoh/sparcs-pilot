import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Typography } from '@material-ui/core';
import commonStyles from './common.scss';
import UserProfile, { UserProfileFields } from '@components/organisms/UserProfile';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JoinPage(props: {history: any}) {
  if (Cookie.get('connect.sid') && Cookie.get('connect.sid')?.trim() !== '') {
    props.history.push('/');
  }

  const handleSubmit = (data: UserProfileFields) => {
    if (!confirm('이대로 가입하시겠어요?')) {
      return;
    }
    axios.post('/api/auth/signup', data, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 200) {
          alert('가입이 완료되었습니다.');
          props.history.push('/auth/login');
          return;
        }
        if (resp.status === 400) {
          if (resp.data.reason === 'USERNAME_EXISTS') {
            alert('이미 존재하는 아이디입니다.');
            return;
          }
          if (resp.data.reason === 'EMAIL_EXISTS') {
            alert('이미 존재하는 이메일입니다.');
            return;
          }
        }
        alert('오류가 발생했습니다.');
      });
  };

  return (
    <div className={commonStyles.root}>
      <Card className={commonStyles.card}>
        <Typography variant="h4" component="h4">
          회원가입
        </Typography>
        <UserProfile onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}

export default withRouter(JoinPage);
