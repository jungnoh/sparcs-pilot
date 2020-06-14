import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { Button, Typography } from '@material-ui/core';
import styles from './index.scss';
import GroupView from '@components/organisms/GroupView';
import { ensureLogin } from '@src/util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MyPage(props: {history: any}) {
  ensureLogin(props.history);
  const [type, setType] = React.useState<string>((queryString.parse(props.history.location.search).type as string) ?? 'all');
  const [loading, setLoading] = React.useState(true);
  const updateType = (v: string) => {
    setType(v);
    props.history.push(`/me?type=${v}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = React.useState<any[]>([]);
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    let url = '/api/my/groups';
    if (type !== 'all') {
      url += `?owner=${type === 'owner'}`;
    }
    axios.get(url).then((resp) => {
      setData(resp.data.groups);
      setUsername(resp.data.username);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [type]);

  const listEmptyEl = (
    <div className={styles.emptyMessage}>모임이 없습니다 :(</div>
  );

  if (loading) {
    return (<>
      <div className={styles.header}>
        <Typography variant="h4">내 모임</Typography>
        <Button color={type === 'all' ? 'primary' : 'default'} onClick={() => updateType('all')}>전체 모임</Button>
        <Button color={type === 'owner' ? 'primary' : 'default'} onClick={() => updateType('owner')}>내가 만든 모임</Button>
        <Button color={type === 'member' ? 'primary' : 'default'} onClick={() => updateType('member')}>내가 참여한 모임</Button>
      </div>
      <div className={styles.emptyMessage}>목록을 가져오는 중입니다..</div>
    </>);
  }

  return (
    <>
      <div className={styles.header}>
        <Typography variant="h4">내 모임</Typography>
        <Button color={type === 'all' ? 'primary' : 'default'} onClick={() => updateType('all')}>전체 모임</Button>
        <Button color={type === 'owner' ? 'primary' : 'default'} onClick={() => updateType('owner')}>내가 만든 모임</Button>
        <Button color={type === 'member' ? 'primary' : 'default'} onClick={() => updateType('member')}>내가 참여한 모임</Button>
      </div>
      {data.length === 0 && listEmptyEl}
      {data.map(group => (
        <GroupView
          key={group._id}
          id={group._id}
          history={props.history}
          title={group.title}
          talkLink={group.talkLink}
          category={group.category.name}
          meetDate={new Date(group.meetDate)}
          meetTime={group.meetTime}
          peopleCnt={group.members.length + 1}
          peopleNeeded={group.peopleNeeded}
          isOwner={username === group.owner.username}
          ownerEmail={group.owner.email}
          ownerName={group.owner.name}
          members={group.members}
          allowLeave={username !== group.owner.username && !group.locked}
          myUsername={username}
        />
      ))}
    </>
  );
}

export default withRouter(MyPage);
