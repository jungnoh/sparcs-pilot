import { Card, Typography, Button, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import styles from './GroupView.scss';
import { MEET_TIMES } from '@src/types/constants';

interface GroupViewProps {
  title: string;
  talkLink: string;
  category: string;
  meetDate: Date;
  meetTime: string;
  peopleCnt: number;
  peopleNeeded: number;
  ownerName: string;
  ownerEmail: string;
  isOwner: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
  allowLeave?: boolean;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any;
  myUsername: string;
}

export default function GroupView(props: GroupViewProps) {
  const meetFilter = MEET_TIMES.filter(x => x.key === props.meetTime);
  const meetTimeText = meetFilter.length > 0 ? meetFilter[0].name : '';

  const filtered = props.members.filter(x => x.user.username === myUsername);
  const joinName = filtered.length === 0 ? '' : filtered[0].nickname;

  const handleChatOpen = () => {
    window.open(props.talkLink, '_blank');
  };

  const handleGroupLeave = () => {
    if (!confirm('정말 그룹을 나가시겠어요?')) {
      return;
    }
    axios.post('/api/group/leave', {group: props.id}, {validateStatus: () => true})
      .then((resp) => {
        if (resp.status !== 200) {
          alert('오류가 발생했습니다.');
          console.log(resp);
          return;
        }
        alert('그룹을 나갔습니다.');
        if (props.history.location.pathname === '/me') {
          props.history.reload();
        } else {
          props.history.push('/me');
        }
      });
  };

  return (
    <Card className={styles.root}>
      <Typography variant="h5">{props.title}</Typography>
      <div className={styles.info}>
        <span>{props.peopleCnt} / {props.peopleNeeded}명 참여중</span>
        <span className={styles.nameRow}>
          <Typography>방장:&nbsp;</Typography>
          {props.isOwner ? (<Typography color="primary">나</Typography>) : (<Typography>{`${props.ownerName} (${props.ownerEmail})`}</Typography>)}
        </span>
        <span>먹을 종류: {props.category}</span>
        <span>
          약속 시간: {moment(props.meetDate).add('h', 9).format('yyyy년 MM월 DD일')}, {meetTimeText}
        </span>
      </div>
      <Typography color="secondary">채팅방의 이름을 {props.isOwner ? '사이트 이름과 똑같이' : `${joinName}(으)로`} 설정해 주세요!</Typography>
      <div className={styles.actions}>
        <Button variant="contained" style={{backgroundColor: 'rgb(255, 224, 52)'}}
          startIcon={<ChatBubbleIcon />} onClick={handleChatOpen} className={styles.talkBtn}>
          오픈채팅 참여하기
        </Button>
        {props.allowLeave && (
          <Button color="primary" onClick={handleGroupLeave} className={styles.leaveBtn}>모임 나가기</Button>
        )}
      </div>
      <ExpansionPanel style={{boxShadow: 'none', margin: '0'}}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography style={{fontWeight: 'bold'}}>모임 참여자 보기</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{flexDirection: 'column'}}>
          <span>방장: {`${props.ownerName} (${props.ownerEmail})`}</span>
          <ul>
            {props.members.map(x => (
              <li key={x.nickname}>{x.nickname}: {x.user.dorm} 거주, 이메일 {x.user.email}</li>
            ))}
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
  );
}
