import axios from 'axios';
import React from 'react';
import { useParams, withRouter } from 'react-router';
import GroupView from '@components/organisms/GroupView';
import { ensureLogin } from '@src/util';
import { Typography } from '@material-ui/core';
// import styles from './view.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GroupViewPage(props: {history: any}) {
  ensureLogin(props.history);
  const {groupID} = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [group, setGroup] = React.useState<any>(null);
  React.useEffect(() => {
    axios.get(`/api/group/${groupID}`, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status === 200) {
          setGroup(resp.data);
        }
      });
  }, []);
  return (
    <div>
      {!group && <Typography variant="h5">모임이 존재하지 않습니다 :(</Typography>}
      {group && (
        <GroupView
          title={group.title}
          talkLink={group.talkLink}
          category={group.category.name}
          meetDate={new Date(group.meetDate)}
          meetTime={group.meetTime}
          peopleCnt={group.members.length + 1}
          peopleNeeded={group.peopleNeeded}
          isOwner={sessionStorage.getItem('username') === group.owner.username}
          ownerEmail={group.owner.email}
          ownerName={group.owner.name}
          members={group.members}
          allowLeave
        />
      )}
    </div>
  );
}

export default withRouter(GroupViewPage);
