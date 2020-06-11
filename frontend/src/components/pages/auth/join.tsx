import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Typography } from '@material-ui/core';
import commonStyles from './common.scss';
import UserProfile, { UserProfileFields } from '@components/organisms/UserProfile';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JoinPage(props: {history: any}) {
  if (sessionStorage.getItem('username') !== null) {
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
        }
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
