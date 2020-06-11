import axios from 'axios';
import React from 'react';
import { Typography, Button } from '@material-ui/core';
import styles from './index.scss';
import { withRouter } from 'react-router';
import GroupListItem from '@components/organisms/GroupListItem';
import { Link } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IndexPage(props: {history: any}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [groups, setGroups] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios.get('/api/group/list').then((resp) => {
      setGroups(resp.data);
    });
  }, []);

  const emptyMessageEl = <div className={styles.emptyMsg}>
    오늘은 모임이 아직 없습니다.&nbsp;
    <Link to="/groups/create">직접 모임을 시작해보세요!</Link>
  </div>;

  return (
    <>
      <div className={styles.header}>
        <Typography variant="h4">오늘의 모임</Typography>
        <Button color="primary" onClick={() => props.history.push('/groups/create')}>직접 모임 만들기</Button>
      </div>
      {groups.length === 0 && emptyMessageEl}
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
