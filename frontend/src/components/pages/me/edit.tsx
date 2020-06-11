import axios from 'axios';
import React from 'react';
import styles from './edit.scss';
import { withRouter } from 'react-router';
import { ensureLogin } from '@src/util';
import { Card, Typography } from '@material-ui/core';
import UserProfile, { UserProfileFields } from '@components/organisms/UserProfile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditPage(props: {history: any}) {
  ensureLogin(props.history);
  const [user, setUser] = React.useState<UserProfileFields | null>(null);

  React.useEffect(() => {
    axios.get('/api/my/profile').then((resp) => {
      resp.data.password = undefined;
      setUser(resp.data);
    });
  }, []);

  const handleSubmit = (data: UserProfileFields) => {
    if (!confirm('이대로 수정하시겠어요?')) {
      return;
    }
    axios.put('/api/my/profile', data, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 200) {
          alert('수정이 완료되었습니다.');
          props.history.reload();
        }
      });
  };

  if (user === null) {
    return (
      <div className={styles.root}>

      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <Typography variant="h4" component="h4">
          정보 수정
        </Typography>
        <UserProfile allowEmptyPassword allowUserFieldEdit={false} onSubmit={handleSubmit} {...user} />
      </Card>
    </div>
  );
}

export default withRouter(EditPage);
