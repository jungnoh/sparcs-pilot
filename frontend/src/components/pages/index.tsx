import axios from 'axios';
import React from 'react';
import { Typography, Button } from '@material-ui/core';
import styles from './index.scss';
import { withRouter } from 'react-router';
import GroupListItem from '@components/organisms/GroupListItem';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IndexPage(props: {history: any}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [groups, setGroups] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios.get('/api/group/list').then((resp) => {
      setGroups(resp.data);
    });
  }, []);

  return (
    <>
      <div className={styles.header}>
        <Typography variant="h4">오늘의 모임</Typography>
        <Button color="primary" onClick={() => props.history.push('/groups/create')}>직접 모임 만들기</Button>
      </div>
      {groups.map((group, ind) => (
        <GroupListItem
          key={ind}
          title={group.title}
          category={group.category.name}
          meetDate={new Date(group.meetDate)}
          meetTime={group.meetTime}
          peopleCnt={group.memberCount}
          peopleNeeded={group.peopleNeeded}
          id={group.id}
          history={props.history}
        />
      ))}
    </>
  );
}

export default withRouter(IndexPage);
