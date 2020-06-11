import React from 'react';
import { Typography, Button } from '@material-ui/core';
import styles from './index.scss';
import { withRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IndexPage(props: {history: any}) {
  return (
    <>
      <div className={styles.header}>
        <Typography variant="h4">오늘의 모임</Typography>
        <Button color="primary" onClick={() => props.history.push('/groups/create')}>직접 모임 만들기</Button>
      </div>
    </>
  );
}

export default withRouter(IndexPage);
